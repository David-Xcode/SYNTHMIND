'use client';

// ─── 砖池翻板层 · Living Blueprint v4.2 ───
// 设计定案：docs/superpowers/specs/2026-07-26-living-blueprint-v4.2-design.md（§2）
// BlueprintWall 的动态层：指针邻域的方砖沿砖边铰链外翻（背指针方向，≤80°），
// 露出槽腔、槽内光随翻开角涌出洗上邻砖；离开后弹簧缓落归位。
//
// 架构（v4.1 全场接管 → v4.2 邻域砖池，纪律与门控继承）：
// - 砖池：只物化指针影响半径内的格子（cell 按文档行列键控），弹簧落定即
//   回收复用——DOM 成本与砖密度解耦（pitch 48 密度下全场 600 格，池峰值
//   实测 ≤~483，上限 512 硬夹）
// - 文档级锚定：砖位直接写文档坐标（.bp-wall 本就是文档级 absolute），
//   滚动由合成器逐像素承担——v4.1 的 mod 回卷 / 状态行转移 / data-bricks
//   全场接管 / 「JS 路径滚动落后一帧」代价全部退役
// - 静态砖面恒在：每格物化时先铺不透明槽腔底衬（sibling，画序在砖下）遮住
//   静态 tile，砖静止时又恰好逐像素盖回底衬 = 接管零跳变
// - 铰链走「平移-旋转-回移」组合变换而非 transform-origin（origin 会把
//   perspective() 灭点拖到铰链边，翻板透视张力尽失——原型实测）；
//   只外翻 + 硬夹 88°：背面永不可见，无需双面砖 DOM
// - 懒启动：挂载只判能力，首次 pointermove 才读 CSS var / 建池；
//   触屏 / RM / 无 JS 三路径 = 静态材质墙原样（CSS 直出随滚）
// - pitch 从 CSS var 读取（--wall-brick-w / --wall-seam）：JS 只读不定；
//   解析失败即放弃增强
// - 只写 transform / opacity（z-index 为活跃态一次性切换，非逐帧动画）；
//   rAF 半隐式欧拉弹簧，全部收敛即停帧
// - 砖 DOM 命令式创建（非 React state）：短命装饰节点自管

import { useEffect, useRef } from 'react';
import { listenMql } from '@/lib/listen-mql';

const POOL_MAX = 512; // 砖池硬上限（风暴实测峰值 483；超限跳过新增物化）
const RADIUS = 200; // 指针影响半径（240 档实测缓落长尾堆积出长帧，收窄）
const MAX_FLIP = 80; // deg — 目标翻开角上限（David 原话「80 度左右」）
const CLAMP_FLIP = 88; // deg — 过冲硬夹：永不过 90° 露 div 背面
const STIFFNESS = 60;
const DAMPING = 11; // ζ≈0.71 — 大角度防过冲穿夹板（k40 档长尾实测掉帧）
const REST_EPS = 0.01;
const MAX_DT = 0.033; // 秒 — tab 切回防积分爆炸

interface Spring {
  x: number;
  v: number;
  t: number; // target
}

// 铰链方位（背指针外翻）：axis/sign 定旋转，hx/hy 定铰链边相对砖心方向
interface Hinge {
  axis: 'x' | 'y';
  sign: number;
  hx: number;
  hy: number;
}

interface Brick {
  el: HTMLDivElement;
  glow: HTMLDivElement;
  under: HTMLDivElement;
  uglow: HTMLDivElement;
  spill: HTMLDivElement;
  key: string; // "row,col" — 文档格坐标
  cx: number; // 砖心（文档坐标）
  cy: number;
  s: Spring; // 翻开角弹簧（单自由度 — tilt 时代的 rx/ry/z 三簧退役）
  hinge: Hinge;
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

// 背指针外翻的铰链解算：铰链取砖的近指针边（按主轴四向量化），
// 自由缘背指针掀开——v4.1「近缘翘起背向指针（气流掠过）」语言的完全体
function hingeFor(dx: number, dy: number): Hinge {
  if (Math.abs(dx) > Math.abs(dy)) {
    // 砖在指针左/右侧 → 竖边铰链（rotateY）
    return dx > 0
      ? { axis: 'y', sign: -1, hx: -1, hy: 0 } // 砖在右：左边铰、右缘出墙
      : { axis: 'y', sign: 1, hx: 1, hy: 0 };
  }
  return dy > 0
    ? { axis: 'x', sign: 1, hx: 0, hy: -1 } // 砖在下：上边铰、下缘出墙
    : { axis: 'x', sign: -1, hx: 0, hy: 1 };
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

    const byKey = new Map<string, Brick>();
    let active: Brick[] = [];
    let free: Brick[] = [];
    let total = 0; // 已创建砖数（active + free）— POOL_MAX 的计量对象
    let pitch = 0;
    let seam = 0;
    let face = 0;
    let half = 0;
    let ready = false; // CSS var 已读取（懒启动 / resize 后重读）
    let abandoned = false; // var 解析失败 → 本尺寸周期放弃增强
    let rafId = 0;
    let lastTime = 0;
    let px = -1e4; // 指针（文档坐标）— 远置初值 = 无影响
    let py = -1e4;
    let lastClientX = -1e4; // 视口坐标缓存 — 滚动时重算文档坐标用
    let lastClientY = -1e4;
    let disposed = false;
    let resizeTimer = 0;

    // 依当前弹簧状态落样式 — 角度→透视翻板 + 槽光随角涌出
    const applyStyle = (b: Brick) => {
      const a = Math.min(Math.max(b.s.x, 0), CLAMP_FLIP);
      if (b.settled && a < 0.05) {
        b.el.style.transform = '';
        b.glow.style.opacity = '0';
        b.uglow.style.opacity = '0';
        b.spill.style.opacity = '0';
        if (b.raised) {
          b.el.style.zIndex = '';
          b.raised = false;
        }
        return;
      }
      if (!b.raised) {
        // 翻起砖压过邻砖面（状态切换非逐帧动画；落定才撤销，活跃期层序稳定）
        b.el.style.zIndex = '2';
        b.raised = true;
      }
      const k = a / MAX_FLIP;
      const h = b.hinge;
      const rot =
        h.axis === 'x'
          ? `rotateX(${(h.sign * a).toFixed(2)}deg)`
          : `rotateY(${(h.sign * a).toFixed(2)}deg)`;
      b.el.style.transform = `perspective(600px) translate3d(${h.hx * half}px, ${h.hy * half}px, 0) ${rot} translate3d(${-h.hx * half}px, ${-h.hy * half}px, 0)`;
      b.glow.style.opacity = (k * 0.9).toFixed(3);
      b.uglow.style.opacity = Math.min(1, k * 1.15).toFixed(3);
      b.spill.style.opacity = Math.min(1, k).toFixed(3);
    };

    const readVars = () => {
      const styles = getComputedStyle(field);
      const w = Number.parseFloat(styles.getPropertyValue('--wall-brick-w'));
      const s = Number.parseFloat(styles.getPropertyValue('--wall-seam'));
      // !x 已覆盖 NaN 与 0（解析失败即放弃增强，静态墙原样）
      if (!w || !s) {
        abandoned = true;
        return;
      }
      pitch = w;
      seam = s;
      face = pitch - seam;
      half = face / 2;
      ready = true;
    };

    const makeBrick = (): Brick => {
      // 槽腔底衬（sibling 先入 DOM = 画序在砖下）：不透明实底遮静态 tile，
      // 槽壁压暗走 ::before（CSS），槽内光/溢光两层由 JS 写 opacity
      const under = document.createElement('div');
      under.className = 'bp-brick-under';
      const spillEl = document.createElement('div');
      spillEl.className = 'bp-brick-spill';
      const uglow = document.createElement('div');
      uglow.className = 'bp-brick-uglow';
      under.appendChild(spillEl);
      under.appendChild(uglow);
      const el = document.createElement('div');
      el.className = 'bp-brick';
      const glow = document.createElement('div');
      glow.className = 'bp-brick-glow';
      el.appendChild(glow);
      field.appendChild(under);
      field.appendChild(el);
      total++;
      return {
        el,
        glow,
        under,
        uglow,
        spill: spillEl,
        key: '',
        cx: 0,
        cy: 0,
        s: spring(),
        hinge: { axis: 'x', sign: 1, hx: 0, hy: -1 },
        settled: true,
        raised: false,
      };
    };

    const acquire = (row: number, col: number): Brick | null => {
      let b = free.pop();
      if (!b) {
        if (total >= POOL_MAX) return null; // 池上限 — 跳过物化，存量自然回收
        b = makeBrick();
      }
      const left = col * pitch + seam;
      const top = row * pitch + seam;
      b.key = `${row},${col}`;
      b.cx = left + half;
      b.cy = top + half;
      b.s.x = 0;
      b.s.v = 0;
      b.s.t = 0;
      b.settled = true;
      b.raised = false;
      b.el.style.left = `${left}px`;
      b.el.style.top = `${top}px`;
      b.el.style.width = `${face}px`;
      b.el.style.height = `${face}px`;
      b.el.style.display = '';
      b.under.style.left = `${left}px`;
      b.under.style.top = `${top}px`;
      b.under.style.width = `${face}px`;
      b.under.style.height = `${face}px`;
      b.under.style.display = '';
      byKey.set(b.key, b);
      active.push(b);
      return b;
    };

    // 落定归零的砖回池（display 切换隐藏，DOM 节点复用）
    const release = (i: number) => {
      const b = active[i];
      byKey.delete(b.key);
      active[i] = active[active.length - 1];
      active.pop();
      b.el.style.display = 'none';
      b.el.style.transform = '';
      b.el.style.zIndex = '';
      b.under.style.display = 'none';
      b.glow.style.opacity = '0';
      b.uglow.style.opacity = '0';
      b.spill.style.opacity = '0';
      b.raised = false;
      free.push(b);
    };

    const clearPool = () => {
      for (let i = active.length - 1; i >= 0; i--) release(i);
    };

    // 指针（文档坐标）→ 物化邻域格 + 全量刷新弹簧目标
    const retarget = () => {
      // 先扫既有活跃砖：半径外目标归零（缓落，落定后 frame 回收）
      for (let i = 0; i < active.length; i++) {
        const b = active[i];
        const dx = b.cx - px;
        const dy = b.cy - py;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < RADIUS) {
          const wgt = (1 - d / RADIUS) ** 2;
          if (b.settled || b.s.x < 0.5) b.hinge = hingeFor(dx, dy); // 近静止才换铰 — 防中途跳边
          b.s.t = MAX_FLIP * wgt;
        } else {
          b.s.t = 0;
        }
        if (b.settled && Math.abs(b.s.t - b.s.x) > REST_EPS) b.settled = false;
      }
      // 再物化半径内尚无砖的格子
      const r0 = Math.max(0, Math.floor((py - RADIUS) / pitch));
      const r1 = Math.floor((py + RADIUS) / pitch);
      const c0 = Math.max(0, Math.floor((px - RADIUS) / pitch));
      const c1 = Math.floor((px + RADIUS) / pitch);
      for (let r = r0; r <= r1; r++) {
        for (let c = c0; c <= c1; c++) {
          if (byKey.has(`${r},${c}`)) continue;
          const bx = c * pitch + seam + half;
          const by = r * pitch + seam + half;
          const dx = bx - px;
          const dy = by - py;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d >= RADIUS) continue;
          const b = acquire(r, c);
          if (!b) return; // 池满 — 本轮放弃新增
          const wgt = (1 - d / RADIUS) ** 2;
          b.hinge = hingeFor(dx, dy);
          b.s.t = MAX_FLIP * wgt;
          if (Math.abs(b.s.t) > REST_EPS) b.settled = false;
        }
      }
    };

    const frame = (time: number) => {
      if (disposed) return;
      const dt = Math.max(0, Math.min((time - lastTime) / 1000, MAX_DT));
      lastTime = time;
      let anyActive = false;
      for (let i = active.length - 1; i >= 0; i--) {
        const b = active[i];
        if (b.settled) {
          // 已落定且目标为零 — 回收（倒序遍历容忍 swap-pop）
          if (b.s.t === 0 && b.s.x < REST_EPS) release(i);
          continue;
        }
        step(b.s, dt);
        if (isSettled(b.s)) {
          b.s.x = b.s.t;
          b.s.v = 0;
          b.settled = true;
        } else {
          anyActive = true;
        }
        applyStyle(b);
        if (b.settled && b.s.t === 0 && b.s.x < REST_EPS) release(i);
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

    const pointerTo = (clientX: number, clientY: number) => {
      lastClientX = clientX;
      lastClientY = clientY;
      px = clientX; // 文档 x = 视口 x（横向无滚动）
      py = clientY + window.scrollY; // 文档 y
      retarget();
      kick();
    };

    const onMove = (e: PointerEvent) => {
      if (disposed || abandoned) return;
      if (!ready) readVars(); // 懒启动 — 首次指针移动才读 var
      if (!ready) return;
      pointerTo(e.clientX, e.clientY);
    };

    const onLeave = () => {
      if (disposed || !ready) return;
      px = -1e4;
      py = -1e4;
      lastClientX = -1e4;
      lastClientY = -1e4;
      retarget();
      kick(); // 缓落归位
    };

    const onScroll = () => {
      if (disposed || !ready || !active.length) return;
      // 墙随文档滚动而指针不动 — 以缓存视口坐标重算文档坐标重瞄
      if (lastClientY > -1e3) pointerTo(lastClientX, lastClientY);
    };

    const onResize = () => {
      if (disposed) return;
      // MQ 阶梯可能换档（pitch 变）：清池 + 防抖后重读 var；
      // 池砖按文档坐标定位，视口尺寸本身不影响存量——只为换档服务
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (disposed) return;
        clearPool();
        ready = false;
        abandoned = false; // 新尺寸重新评估（解析失败态可翻案）
      }, 200);
    };

    const teardown = () => {
      if (disposed) return;
      disposed = true;
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      window.clearTimeout(resizeTimer);
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
      byKey.clear();
      active = [];
      free = [];
      field.textContent = ''; // 静态墙原样（底衬/砖全部移除）
    };

    // 会话中途开启 reduced-motion → 拆除砖池，回到静态材质墙
    // 能力判定单向（同 HeroObjectPhysics）：中途关闭 RM 不重建，导航后自愈
    const unlistenReduced = listenMql(reducedMotion, (e) => {
      if (e.matches) teardown();
    });

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave, {
      passive: true,
    });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    return () => {
      teardown();
      unlistenReduced();
    };
  }, []);

  return <div ref={fieldRef} className="bp-wall-field" />;
}
