'use client';

// ─── 蓝图砖墙层 · Living Blueprint v3 ───
// 设计定案：docs/superpowers/specs/2026-07-26-living-blueprint-v3-design.md（WF2）
// BlueprintGrid 的隐藏 3D 系统：静止时与静态网格逐像素一致（隐藏感硬要求），
// 指针滑过时邻域砖块像被气流掠过一样翘起/倾斜并跟随，离开后弹簧缓落归位。
//
// 纪律与门控：
// - 懒构建：挂载只判能力，首次 pointermove 才建砖 DOM——SSR HTML 零增量、
//   hydration 零工作、LCP 零影响；触屏 / RM / 无 JS 三条路径 = 静态网格原样
// - 每砖独立 perspective（transform 内自带），不建 preserve-3d 链——
//   父容器的径向 mask 会做分组扁平化，per-brick 透视天然免疫，
//   也整体绕开 WebKit 透视链断层压扁的坑类
// - 只写 transform / opacity；rAF 半隐式欧拉弹簧（同 HeroObjectPhysics 范式），
//   全部收敛即停帧；rect 缓存 TTL 150ms（depth-drift ±16px 的慢移由弹簧平滑）
// - 瓦片预算：>220 时砖宽按 96 步进增至 768 封顶，仍超（8K 级）则彻底放弃
//   增强（错缝恒 96px = 主格倍数，格线永不错位）
// - 砖 DOM 用命令式创建（非 React state）：~200 个短命装饰节点走 reconciler
//   纯属浪费，容器 ref 内自管、卸载时整体移除

import { useEffect, useRef } from 'react';
import { listenMql } from '@/lib/listen-mql';

const ROW_H = 96; // 主格高
const BRICK_W = 192; // 两格一砖（预算超限按 96 步进增宽，格线恒落 96 栅格）
const BOND_OFFSET = 96; // 错缝位移 — 必须是主格倍数，否则静止态格线错位
const MAX_BRICKS = 220; // 瓦片预算上限
const RADIUS = 240; // 指针影响半径
const MAX_TILT = 10; // deg — 白名单口径 ≤10°
const MAX_LIFT = 14; // px — 白名单口径 ≤14px
const STIFFNESS = 40;
const DAMPING = 7; // ζ≈0.55 — 轻微过冲（气流掠过的回弹感）
const REST_EPS = 0.01;
const MAX_DT = 0.033; // 秒 — tab 切回防积分爆炸
const RECT_TTL = 150; // 毫秒

interface Spring {
  x: number;
  v: number;
  t: number; // target
}

interface Brick {
  el: HTMLDivElement;
  glow: HTMLDivElement;
  cx: number; // 砖心（容器坐标）
  cy: number;
  rx: Spring;
  ry: Spring;
  z: Spring;
  settled: boolean;
}

const spring = (): Spring => ({ x: 0, v: 0, t: 0 });

// 半隐式欧拉一步积分（HeroObjectPhysics 同款：刚性系统下比显式欧拉稳定）
function step(s: Spring, dt: number) {
  s.v += (-STIFFNESS * (s.x - s.t) - DAMPING * s.v) * dt;
  s.x += s.v * dt;
}

function isSettled(s: Spring) {
  return Math.abs(s.x - s.t) < REST_EPS && Math.abs(s.v) < REST_EPS;
}

export default function GridBricks() {
  const fieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;

    // 能力门控：真 hover + 细指针，且非 reduced-motion（触屏/RM 静态网格原样）
    const capable = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!capable.matches || reducedMotion.matches) return;

    const wrap = field.parentElement; // .bp-grid-wrap（静态层的兄弟容器）
    // 宿主必须在 <section> 内：wrap 是 pointer-events-none，field 自己永远
    // 收不到指针事件——无 section 祖先时直接放弃增强（静态网格原样）
    const section = field.closest('section');
    if (!section) return;

    let bricks: Brick[] = [];
    let built = false;
    let rafId = 0;
    let lastTime = 0;
    let rect: DOMRect | null = null;
    let rectStamp = 0;
    let px = -1e4; // 指针（容器坐标）— 远置初值 = 无影响
    let py = -1e4;
    let disposed = false;
    let resizeTimer = 0;

    const clearBricks = () => {
      field.textContent = '';
      bricks = [];
      built = false;
      if (wrap) delete wrap.dataset.bricks;
    };

    const build = () => {
      const w = field.clientWidth;
      const h = field.clientHeight;
      if (!w || !h) return;
      // 预算硬上限：按 96 步进增宽直到总数 ≤ MAX_BRICKS；
      // 错缝恒 96、格线画在 96 栅格上，任何砖宽都不破静止态像素等价
      const rows = Math.ceil(h / ROW_H);
      let brickW = BRICK_W;
      while (
        rows * Math.ceil((w + BOND_OFFSET) / brickW) > MAX_BRICKS &&
        brickW < ROW_H * 8
      ) {
        brickW += BOND_OFFSET;
      }
      // 768px 封顶后仍超预算（8K 级全屏）→ 彻底放弃增强，静态网格原样；
      // built 置位阻止后续 pointermove 反复重试
      if (rows * Math.ceil((w + BOND_OFFSET) / brickW) > MAX_BRICKS) {
        built = true;
        return;
      }
      const cols = Math.ceil((w + BOND_OFFSET) / brickW);

      const frag = document.createDocumentFragment();
      const next: Brick[] = [];
      for (let row = 0; row < rows; row++) {
        // 奇数行左移一个主格 = 砌砖错缝；负起点砖被 mask 边缘渐隐吃掉
        const offsetX = row % 2 ? -BOND_OFFSET : 0;
        for (let col = 0; col < cols; col++) {
          const left = col * brickW + offsetX;
          const top = row * ROW_H;
          const el = document.createElement('div');
          el.className = 'bp-brick';
          el.style.left = `${left}px`;
          el.style.top = `${top}px`;
          el.style.width = `${brickW}px`;
          el.style.height = `${ROW_H}px`;
          const glow = document.createElement('div');
          glow.className = 'bp-brick-glow';
          el.appendChild(glow);
          frag.appendChild(el);
          next.push({
            el,
            glow,
            cx: left + brickW / 2,
            cy: top + ROW_H / 2,
            rx: spring(),
            ry: spring(),
            z: spring(),
            settled: true,
          });
        }
      }
      field.appendChild(frag);
      bricks = next;
      built = true;
      // 砖已入 DOM 再隐藏静态层 — 同帧切换，静止态像素等价无跳变
      if (wrap) wrap.dataset.bricks = 'on';
    };

    // 依当前指针位置刷新全部砖的弹簧目标（半径外归零）
    const retarget = () => {
      for (let i = 0; i < bricks.length; i++) {
        const b = bricks[i];
        const dx = b.cx - px;
        const dy = b.cy - py;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < RADIUS) {
          // 权重二次衰减；近缘翘起背向指针（指针在上方 → 砖顶棱抬向观者）
          const wgt = (1 - d / RADIUS) ** 2;
          const inv = d > 1 ? 1 / d : 0;
          b.rx.t = -MAX_TILT * wgt * dy * inv;
          b.ry.t = MAX_TILT * wgt * dx * inv;
          b.z.t = MAX_LIFT * wgt;
        } else {
          b.rx.t = 0;
          b.ry.t = 0;
          b.z.t = 0;
        }
        // 判「目标 ≠ 当前」而非「目标非零」：指针离开时目标归零，
        // 悬在半空的已收敛砖也必须被唤醒缓落
        if (
          b.settled &&
          (Math.abs(b.rx.t - b.rx.x) > REST_EPS ||
            Math.abs(b.ry.t - b.ry.x) > REST_EPS ||
            Math.abs(b.z.t - b.z.x) > REST_EPS)
        ) {
          b.settled = false;
        }
      }
    };

    const frame = (time: number) => {
      if (disposed) return;
      const dt = Math.max(0, Math.min((time - lastTime) / 1000, MAX_DT));
      lastTime = time;
      let anyActive = false;
      for (let i = 0; i < bricks.length; i++) {
        const b = bricks[i];
        if (b.settled) continue;
        step(b.rx, dt);
        step(b.ry, dt);
        step(b.z, dt);
        if (isSettled(b.rx) && isSettled(b.ry) && isSettled(b.z)) {
          // 收敛吸附 — 归零砖清空内联 transform，回到与静态网格等价的姿态
          b.rx.x = b.rx.t;
          b.ry.x = b.ry.t;
          b.z.x = b.z.t;
          b.rx.v = b.ry.v = b.z.v = 0;
          b.settled = true;
        } else {
          anyActive = true;
        }
        const lift = Math.max(b.z.x, 0);
        if (b.settled && !b.rx.x && !b.ry.x && !b.z.x) {
          b.el.style.transform = '';
          b.glow.style.opacity = '0';
        } else {
          b.el.style.transform = `perspective(600px) rotateX(${b.rx.x.toFixed(3)}deg) rotateY(${b.ry.x.toFixed(3)}deg) translateZ(${b.z.x.toFixed(2)}px)`;
          b.glow.style.opacity = (lift / MAX_LIFT).toFixed(3);
        }
      }
      if (anyActive) {
        rafId = requestAnimationFrame(frame);
      } else {
        rafId = 0;
      }
    };

    const kick = () => {
      if (disposed || rafId) return;
      lastTime = performance.now();
      rafId = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      if (disposed) return;
      if (!built) build(); // 懒构建 — 首次指针移动才付 DOM 成本
      if (!bricks.length) return; // 预算放弃路径 — 不做 rect/retarget 无效工作
      const now = performance.now();
      if (!rect || now - rectStamp > RECT_TTL) {
        rect = field.getBoundingClientRect();
        rectStamp = now;
      }
      px = e.clientX - rect.left;
      py = e.clientY - rect.top;
      retarget();
      kick();
    };

    const onLeave = () => {
      if (disposed) return;
      px = -1e4;
      py = -1e4;
      retarget();
      kick(); // 缓落归位
    };

    const onResize = () => {
      if (disposed || !built) return;
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (disposed) return;
        clearBricks();
        build();
      }, 200);
    };

    const teardown = () => {
      if (disposed) return;
      disposed = true;
      section.removeEventListener('pointermove', onMove);
      section.removeEventListener('pointerleave', onLeave);
      ro.disconnect();
      window.clearTimeout(resizeTimer);
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
      clearBricks(); // 静态层随 data 属性移除自动恢复
    };

    // 会话中途开启 reduced-motion → 拆除砖层，回到静态网格
    // 能力判定单向（同 HeroObjectPhysics）：中途关闭 RM 不重建，导航后自愈；
    // change 监听存活到 unmount 由 effect cleanup 统一解除
    const unlistenReduced = listenMql(reducedMotion, (e) => {
      if (e.matches) teardown();
    });

    const ro = new ResizeObserver(onResize);
    ro.observe(field);
    section.addEventListener('pointermove', onMove, { passive: true });
    section.addEventListener('pointerleave', onLeave, { passive: true });

    return () => {
      teardown();
      unlistenReduced();
    };
  }, []);

  return <div ref={fieldRef} className="bp-brick-field" />;
}
