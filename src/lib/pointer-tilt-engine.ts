// ─── 指针倾斜共享弹簧引擎 · Card System v7 ───
// 设计定案：docs/superpowers/specs/2026-07-26-card-system-v7-glass-design.md（§2）
// 自 ButtonTilt（v4.2）整体抽出：全站一个引擎、一套 window 监听，
// per-entry 参数——ButtonTilt（4°/k30/ζ0.6）与 CardTilt（2.5°/k22/ζ0.65）
// 同引擎不同参数。**全站禁止存在第二份引擎代码。**
//
// 纪律与门控（全部继承自 ButtonTilt 原实现）：
// - transform 写入者分层：本引擎 JS 弹簧逐帧写 wrapper / 本体 transition
//   永不同元素（消费者结构负责）
// - 模块级单例：一个 pointermove 遍历全部 entries（按钮 ≤7 + 可视卡片），
//   弹簧数学每帧几次乘加，成本大头在监听份数——集中即便宜
// - 门控 hover+fine 且非 RM；不满足 registerTilt 返回 undefined，元素纯静态；
//   RM 中途开启 → 引擎整体 teardown 清零（单向，导航 remount 自愈）
// - rect 缓存，scroll/resize 失效重取（滚动中松开归零，下次 pointermove 重瞄）
// - 盒内满权重、盒外即零（进出盒缘的目标跳变由弹簧平滑）
// - per-element perspective 内嵌 transform 值，不建 preserve-3d 链
// - 只写 transform；收敛吸附停帧，归零时清空内联 transform 回纯 CSS 姿态

import { listenMql } from '@/lib/listen-mql';

export interface TiltParams {
  maxTilt: number; // deg
  stiffness: number;
  damping: number;
  perspective: number; // px
  xDiv: number; // rx 归一分母系数（占 rect.height 比例）
  yDiv: number; // ry 归一分母系数（占 rect.width 比例）
}

const REST_EPS = 0.01;
const MAX_DT = 0.033;

interface Spring {
  x: number;
  v: number;
  t: number;
}

interface Entry {
  el: HTMLElement;
  params: TiltParams;
  rx: Spring;
  ry: Spring;
  rect: DOMRect | null;
  disabled: boolean;
  settled: boolean;
}

const spring = (): Spring => ({ x: 0, v: 0, t: 0 });

function step(s: Spring, p: TiltParams, dt: number) {
  s.v += (-p.stiffness * (s.x - s.t) - p.damping * s.v) * dt;
  s.x += s.v * dt;
}

function isSettled(s: Spring) {
  return Math.abs(s.x - s.t) < REST_EPS && Math.abs(s.v) < REST_EPS;
}

const clampUnit = (n: number) => Math.max(-1, Math.min(1, n));

// ── 模块级单例引擎（client bundle 内共享，全部消费者一套监听）──
const entries: Entry[] = [];
let engineOn = false;
let rafId = 0;
let lastTime = 0;
let stopEngine: (() => void) | null = null;

function applyStyle(e: Entry) {
  if (e.settled && !e.rx.x && !e.ry.x) {
    e.el.style.transform = '';
  } else {
    // per-element perspective：本层扁平化不影响本体的 translateZ 顶出
    // （本体 transform 自带 perspective()，两层投影互相独立）
    e.el.style.transform = `perspective(${e.params.perspective}px) rotateX(${e.rx.x.toFixed(3)}deg) rotateY(${e.ry.x.toFixed(3)}deg)`;
  }
}

function frame(time: number) {
  const dt = Math.max(0, Math.min((time - lastTime) / 1000, MAX_DT));
  lastTime = time;
  let anyActive = false;
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i];
    if (e.settled) continue;
    step(e.rx, e.params, dt);
    step(e.ry, e.params, dt);
    if (isSettled(e.rx) && isSettled(e.ry)) {
      // 收敛吸附 — 归零时清空内联 transform，回到纯 CSS 姿态
      e.rx.x = e.rx.t;
      e.ry.x = e.ry.t;
      e.rx.v = e.ry.v = 0;
      e.settled = true;
    } else {
      anyActive = true;
    }
    applyStyle(e);
  }
  rafId = anyActive ? requestAnimationFrame(frame) : 0;
}

function kick() {
  if (rafId) return;
  lastTime = performance.now();
  rafId = requestAnimationFrame(frame);
}

function wake(e: Entry) {
  if (
    e.settled &&
    (Math.abs(e.rx.t - e.rx.x) > REST_EPS ||
      Math.abs(e.ry.t - e.ry.x) > REST_EPS)
  ) {
    e.settled = false;
  }
}

function zeroTargets() {
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i];
    e.rx.t = 0;
    e.ry.t = 0;
    wake(e);
  }
}

function startEngine() {
  if (engineOn) return;
  engineOn = true;

  const onMove = (ev: PointerEvent) => {
    for (let i = 0; i < entries.length; i++) {
      const e = entries[i];
      if (e.disabled) {
        e.rx.t = 0;
        e.ry.t = 0;
        wake(e);
        continue;
      }
      if (!e.rect) e.rect = e.el.getBoundingClientRect();
      const r = e.rect;
      const mx = ev.clientX - (r.left + r.width / 2);
      const my = ev.clientY - (r.top + r.height / 2);
      // 悬停期门控：指针在盒内才跟随（盒外即零）；
      // 进出盒缘的目标跳变由弹簧平滑，与本体 hover 过渡同步展开
      const inside =
        Math.abs(mx) <= r.width / 2 && Math.abs(my) <= r.height / 2;
      if (inside) {
        const p = e.params;
        e.rx.t = -p.maxTilt * clampUnit(my / (r.height * p.xDiv));
        e.ry.t = p.maxTilt * clampUnit(mx / (r.width * p.yDiv));
      } else {
        e.rx.t = 0;
        e.ry.t = 0;
      }
      wake(e);
    }
    kick();
  };

  const onLeave = () => {
    zeroTargets();
    kick();
  };

  // 滚动中元素随页移动而指针不动 — rect 失效即松开归零，下次 pointermove 重瞄
  const onScroll = () => {
    for (let i = 0; i < entries.length; i++) entries[i].rect = null;
    zeroTargets();
    kick();
  };

  const onResize = () => {
    for (let i = 0; i < entries.length; i++) entries[i].rect = null;
  };

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  // 会话中途开启 RM → 引擎整体拆除清零（单向，导航后自愈）
  const unlistenReduced = listenMql(reducedMotion, (ev) => {
    if (ev.matches && stopEngine) stopEngine();
  });

  window.addEventListener('pointermove', onMove, { passive: true });
  document.documentElement.addEventListener('pointerleave', onLeave, {
    passive: true,
  });
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);

  stopEngine = () => {
    window.removeEventListener('pointermove', onMove);
    document.documentElement.removeEventListener('pointerleave', onLeave);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
    unlistenReduced();
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
    for (let i = 0; i < entries.length; i++) {
      const e = entries[i];
      // 弹簧状态一并清零：只清 transform 不清状态的话，引擎日后重启
      // （RM 关闭后导航 remount）会从旧倾角瞬跳再弹回
      e.rx.x = e.rx.v = e.rx.t = 0;
      e.ry.x = e.ry.v = e.ry.t = 0;
      e.settled = true;
      e.rect = null; // 停摆期间的布局变化不会有 scroll/resize 兜底，重启必重取
      e.el.style.transform = '';
    }
    engineOn = false;
    stopEngine = null;
  };
}

/**
 * 注册一个倾斜元素。门控不满足（触屏/粗指针/RM）返回 undefined，
 * 元素保持纯静态；满足则返回注销函数（useEffect cleanup 直接用）。
 */
export function registerTilt(
  el: HTMLElement,
  params: TiltParams,
  disabled = false,
): (() => void) | undefined {
  const capable = window.matchMedia('(hover: hover) and (pointer: fine)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!capable.matches || reducedMotion.matches) return undefined;
  const entry: Entry = {
    el,
    params,
    rx: spring(),
    ry: spring(),
    rect: null,
    disabled,
    settled: true,
  };
  entries.push(entry);
  startEngine();
  return () => {
    const i = entries.indexOf(entry);
    if (i >= 0) entries.splice(i, 1);
    el.style.transform = '';
    if (!entries.length && stopEngine) stopEngine();
  };
}
