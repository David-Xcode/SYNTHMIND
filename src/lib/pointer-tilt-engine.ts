// ─── 指针倾斜共享弹簧引擎 · Card System v7 ───
// 设计定案：docs/superpowers/specs/2026-07-26-card-system-v7-glass-design.md（§2）
// 自 ButtonTilt（v4.2）整体抽出：全站一个引擎、一套 window 监听，
// per-entry 参数——ButtonTilt（4°/k30/ζ0.6）与 CardTilt（2.5°/k22/ζ0.65）
// 同引擎不同参数。**全站禁止存在第二份引擎代码。**
//
// 纪律与门控（全部继承自 ButtonTilt 原实现）：
// - transform 写入者分层：本引擎 JS 弹簧逐帧写 wrapper / 本体 transition
//   永不同元素（消费者结构负责）
// - 模块级单例：一个 pointermove 遍历全部已挂载消费者（按钮 ≤7 + 当前页
//   全部 interactive 卡，不做视口裁剪——当前规模全量遍历成本可忽略），
//   弹簧数学每帧几次乘加，成本大头在监听份数——集中即便宜
// - 门控 hover+fine 且非 RM；不满足 registerTilt 返回 undefined，元素纯静态；
//   RM 中途开启 → 引擎整体 teardown 清零（单向，导航 remount 自愈）
// - rect 缓存，scroll/resize 失效重取（滚动中松开归零，下次 pointermove 重瞄）
// - 失焦/页面隐藏兜底：blur 平滑归零、visibility hidden 硬吸附并停帧
//   （pointerleave 在 Cmd-Tab / 夺焦对话框下不触发，缺兜底会把倾角冻住）
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

// 返回是否真的唤醒了这条 entry —— 调用方据此决定要不要起 rAF
function wake(e: Entry): boolean {
  if (
    e.settled &&
    (Math.abs(e.rx.t - e.rx.x) > REST_EPS ||
      Math.abs(e.ry.t - e.ry.x) > REST_EPS)
  ) {
    e.settled = false;
    return true;
  }
  return !e.settled;
}

// 全部目标归零；返回是否还有未静止的 entry（全静止 → 调用方不必 kick）
function zeroTargets(): boolean {
  let active = false;
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i];
    e.rx.t = 0;
    e.ry.t = 0;
    if (wake(e)) active = true;
  }
  return active;
}

// 页面隐藏 = 谁也看不见：硬吸附归零并停帧。
// 走 zeroTargets + kick 的话，隐藏期 rAF 本就不发帧，切回来还要先补跑一段
// 回摆动画；直接清干净，切回即静止姿态。
// （blur 不走这条——窗口失焦时页面往往仍可见，硬吸附会是一次可见跳变，
//   那条沿用弹簧平滑归零，与 WallBricks 的 onBlur 同口径）
function snapToRest() {
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i];
    e.rx.x = e.rx.v = e.rx.t = 0;
    e.ry.x = e.ry.v = e.ry.t = 0;
    e.settled = true;
    e.rect = null; // 隐藏期的布局变化没有 scroll/resize 兜底，回来必重取
    e.el.style.transform = '';
  }
  if (rafId) cancelAnimationFrame(rafId);
  rafId = 0;
}

function startEngine() {
  if (engineOn) return;
  engineOn = true;

  const onMove = (ev: PointerEvent) => {
    // 设备级门控（hover+fine）挡不住混合触屏笔记本的手指——事件级再滤
    // （与 WallBricks 同一口径）：手指 pointermove 后无 pointerleave，
    // 倾角会永久粘在触点姿态
    if (ev.pointerType === 'touch') return;
    // 与 onScroll 同一口径：只在真有 entry 需要动时才起帧。指针在所有盒外
    // 划过（页面大部分区域）时，全员目标已是 0 且已静止 → 一帧都不起
    let active = false;
    for (let i = 0; i < entries.length; i++) {
      const e = entries[i];
      if (e.disabled) {
        e.rx.t = 0;
        e.ry.t = 0;
        if (wake(e)) active = true;
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
      if (wake(e)) active = true;
    }
    if (active) kick();
  };

  const onLeave = () => {
    if (zeroTargets()) kick();
  };

  // 滚动中元素随页移动而指针不动 — rect 失效即松开归零，下次 pointermove 重瞄。
  // rect 清除与归零合进同一趟遍历（原实现走两趟），且**只在真有 entry 被
  // 唤醒时**才起 rAF——全部已归零静止时，每个 scroll 事件白起一帧的空转没了
  const onScroll = () => {
    let active = false;
    for (let i = 0; i < entries.length; i++) {
      const e = entries[i];
      e.rect = null;
      e.rx.t = 0;
      e.ry.t = 0;
      if (wake(e)) active = true;
    }
    if (active) kick();
  };

  const onResize = () => {
    for (let i = 0; i < entries.length; i++) entries[i].rect = null;
  };

  // Cmd-Tab / 切 tab / 原生对话框夺焦一般不触发 pointerleave——与 WallBricks
  // 同款兜底：失焦按「指针离场」平滑归零，页面隐藏则硬吸附并停帧
  const onBlur = () => onLeave();
  const onVisibility = () => {
    if (document.visibilityState === 'hidden') snapToRest();
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
  window.addEventListener('blur', onBlur, { passive: true });
  document.addEventListener('visibilitychange', onVisibility, {
    passive: true,
  });

  stopEngine = () => {
    window.removeEventListener('pointermove', onMove);
    document.documentElement.removeEventListener('pointerleave', onLeave);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('blur', onBlur);
    document.removeEventListener('visibilitychange', onVisibility);
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
