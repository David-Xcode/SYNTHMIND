'use client';

// ─── 砖场弹簧层 · Living Blueprint v4 ───
// 设计定案：docs/superpowers/specs/2026-07-26-living-blueprint-v4-design.md（WF-C）
// BlueprintWall 的动态层：指针滑过时邻域砖块翘起跟随、露出砖下透光层，
// 离开后弹簧缓落归位。v3 GridBricks 的 fixed 墙改造版。
//
// 纪律与门控（v3 结论继承 + v4 变化）：
// - 懒构建：挂载只判能力，首次 pointermove 才建砖 DOM——SSR 零增量、
//   LCP 零影响；触屏 / RM / 无 JS 三条路径 = 静态材质墙原样（CSS 直出）
// - 监听升 window 级：墙是 fixed 视口层，clientX/Y 即容器坐标——
//   v3 的 section 依赖与 rect 缓存整体退役；滚动天然自洽（墙与指针
//   坐标系都不随滚动变，零滚动处理代码）
// - 砖 pitch 从 CSS var 读取（--wall-brick-w/--wall-row-h 媒体查询阶梯）：
//   JS 只读不定，静态层与 DOM 砖永不产生第二事实源；算出砖数 >220
//   （无缩放 5K 等异形屏）→ 彻底放弃增强，静态墙原样
// - 每砖独立 perspective（transform 内自带），不建 preserve-3d 链
// - 只写 transform / opacity（z-index 为活跃态一次性切换，非逐帧动画）；
//   rAF 半隐式欧拉弹簧，全部收敛即停帧
// - 砖 DOM 命令式创建（非 React state）：~百个短命装饰节点自管

import { useEffect, useRef } from 'react';
import { listenMql } from '@/lib/listen-mql';

const SEAM = 6; // px — 缝宽（与 --wall-seam 一致；改缝宽两处同步）
const MAX_BRICKS = 220; // 瓦片预算硬上限（超限放弃增强）
const RADIUS = 240; // 指针影响半径
const MAX_TILT = 12; // deg — v4 白名单口径 ≤12°
const MAX_LIFT = 18; // px — v4 白名单口径 ≤18px
const STIFFNESS = 40;
const DAMPING = 7; // ζ≈0.55 — 轻微过冲（气流掠过的回弹感）
const REST_EPS = 0.01;
const MAX_DT = 0.033; // 秒 — tab 切回防积分爆炸

interface Spring {
  x: number;
  v: number;
  t: number; // target
}

interface Brick {
  el: HTMLDivElement;
  glow: HTMLDivElement;
  shadow: HTMLDivElement;
  cx: number; // 砖心（视口坐标）
  cy: number;
  rx: Spring;
  ry: Spring;
  z: Spring;
  settled: boolean;
  raised: boolean; // z-index 已提升（状态切换非逐帧写入）
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

export default function WallBricks() {
  const fieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;

    // 能力门控：真 hover + 细指针，且非 reduced-motion（触屏/RM 静态墙原样）
    const capable = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!capable.matches || reducedMotion.matches) return;

    const wall = field.parentElement; // .bp-wall（data-bricks 切换宿主）

    let bricks: Brick[] = [];
    let built = false;
    let rafId = 0;
    let lastTime = 0;
    let px = -1e4; // 指针（视口坐标）— 远置初值 = 无影响
    let py = -1e4;
    let disposed = false;
    let resizeTimer = 0;

    const clearBricks = () => {
      field.textContent = '';
      bricks = [];
      built = false;
      if (wall) delete wall.dataset.bricks;
    };

    const build = () => {
      const w = field.clientWidth;
      const h = field.clientHeight;
      if (!w || !h) return;
      // pitch 单一事实源 = CSS 阶梯变量（静态层同读）；解析失败即放弃增强
      const styles = getComputedStyle(field);
      const brickW = Number.parseFloat(
        styles.getPropertyValue('--wall-brick-w'),
      );
      const rowH = Number.parseFloat(styles.getPropertyValue('--wall-row-h'));
      if (!brickW || !rowH || Number.isNaN(brickW) || Number.isNaN(rowH)) {
        built = true;
        return;
      }
      const bond = brickW / 2; // 错缝 = 半砖（24 倍数，细分格连续）
      const rows = Math.ceil(h / rowH);
      const cols = Math.ceil((w + bond) / brickW);
      // 预算硬上限：MQ 阶梯已把主流屏压进预算，仍超（异形屏）→ 彻底放弃；
      // built 置位阻止后续 pointermove 反复重试
      if (rows * cols > MAX_BRICKS) {
        built = true;
        return;
      }

      const frag = document.createDocumentFragment();
      const next: Brick[] = [];
      for (let row = 0; row < rows; row++) {
        // 奇数行左移半砖 = 砌砖错缝（与 .bp-wall-face--b 的 mask 偏移一致）
        const offsetX = row % 2 ? -bond : 0;
        for (let col = 0; col < cols; col++) {
          // 缝归属每砖 cell 的上/左缘：面从 (+6,+6) 起（与静态 mask 一致）
          const left = col * brickW + offsetX + SEAM;
          const top = row * rowH + SEAM;
          const faceW = brickW - SEAM;
          const faceH = rowH - SEAM;
          // 投影是砖的 sibling（不随砖 transform 移动——影子留在墙上）；
          // 先入 DOM，静止态画序在砖面之下
          const shadow = document.createElement('div');
          shadow.className = 'bp-brick-shadow';
          shadow.style.left = `${left + faceW * 0.06}px`;
          shadow.style.top = `${top + faceH - 6}px`;
          shadow.style.width = `${faceW * 0.88}px`;
          shadow.style.height = '16px';
          const el = document.createElement('div');
          el.className = 'bp-brick';
          el.style.left = `${left}px`;
          el.style.top = `${top}px`;
          el.style.width = `${faceW}px`;
          el.style.height = `${faceH}px`;
          const glow = document.createElement('div');
          glow.className = 'bp-brick-glow';
          el.appendChild(glow);
          frag.appendChild(shadow);
          frag.appendChild(el);
          next.push({
            el,
            glow,
            shadow,
            cx: left + faceW / 2,
            cy: top + faceH / 2,
            rx: spring(),
            ry: spring(),
            z: spring(),
            settled: true,
            raised: false,
          });
        }
      }
      field.appendChild(frag);
      bricks = next;
      built = true;
      // 砖已入 DOM 再隐藏静态砖面 — 同帧切换，静止态像素等价无跳变
      // （透光层不隐藏：砖下遮挡关系由 DOM 砖接管）
      if (wall) wall.dataset.bricks = 'on';
    };

    // 依当前指针位置刷新全部砖的弹簧目标（半径外归零）
    const retarget = () => {
      for (let i = 0; i < bricks.length; i++) {
        const b = bricks[i];
        const dx = b.cx - px;
        const dy = b.cy - py;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < RADIUS) {
          // 权重二次衰减；近缘翘起背向指针（气流掠过）
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
          // 收敛吸附 — 归零砖清空内联样式，回到与静态砖面等价的姿态
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
          b.shadow.style.opacity = '0';
          if (b.raised) {
            // 完全归位才撤层序提升 — 活跃期间保持稳定，避免翘起中被邻砖切割
            b.el.style.zIndex = '';
            b.shadow.style.zIndex = '';
            b.raised = false;
          }
        } else {
          if (!b.raised) {
            // 状态切换非逐帧动画：投影要压在邻砖面上、多砖同时翘起层序稳定
            b.el.style.zIndex = '2';
            b.shadow.style.zIndex = '1';
            b.raised = true;
          }
          b.el.style.transform = `perspective(600px) rotateX(${b.rx.x.toFixed(3)}deg) rotateY(${b.ry.x.toFixed(3)}deg) translateZ(${b.z.x.toFixed(2)}px)`;
          b.glow.style.opacity = (lift / MAX_LIFT).toFixed(3);
          b.shadow.style.opacity = ((lift / MAX_LIFT) * 0.8).toFixed(3);
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
      if (!bricks.length) return; // 预算放弃路径 — 不做无效工作
      px = e.clientX; // fixed 视口层：client 坐标即容器坐标，无 rect 换算
      py = e.clientY;
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
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('resize', onResize);
      window.clearTimeout(resizeTimer);
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
      clearBricks(); // 静态砖面随 data 属性移除自动恢复
    };

    // 会话中途开启 reduced-motion → 拆除砖层，回到静态材质墙
    // 能力判定单向（同 HeroObjectPhysics）：中途关闭 RM 不重建，导航后自愈
    const unlistenReduced = listenMql(reducedMotion, (e) => {
      if (e.matches) teardown();
    });

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave, {
      passive: true,
    });
    window.addEventListener('resize', onResize);

    return () => {
      teardown();
      unlistenReduced();
    };
  }, []);

  return <div ref={fieldRef} className="bp-wall-field" />;
}
