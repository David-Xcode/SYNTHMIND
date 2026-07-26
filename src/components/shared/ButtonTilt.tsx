'use client';

// ─── 按钮 pointer tilt 弹簧层 · Living Blueprint v4.1 ───
// 设计定案：docs/superpowers/specs/2026-07-26-living-blueprint-v4.1-design.md（§3.2）
// ModuleButton 的交互中间层：按钮像砖一样跟随鼠标摆动（mouse-tracking
// 豁免第 3 例窄列举——rAF 阻尼弹簧非 1:1 硬跟；前两例 HeroObjectPhysics /
// WallBricks）。
//
// 纪律与门控：
// - transform 写入者三层分工：frame 呼吸 infinite / 本层 JS 弹簧逐帧 /
//   本体按压 transition——同元素同属性冲突纪律天然满足
// - 模块级单例引擎：一个 window pointermove 驱动全站 ≤7 颗按钮（每按钮
//   独立小弹簧 k30 ζ0.6，幅度 ≤5°——按钮是功能件，不到砖的 12°）
// - 门控 hover+fine 且非 RM；触屏/RM/无 JS = 纯透传 span（静态悬空姿态
//   + :active 按入照常）；RM 中途开启 → 引擎 teardown 清零（单向，同
//   WallBricks）；disabled 按钮目标恒零（呼吸停摆由 :has(:disabled) 负责）
// - rect 缓存，scroll/resize 失效重取（滚动中按钮松开归零，下次
//   pointermove 重瞄）；perspective 内嵌 transform，不建 preserve-3d 链
// - 只写 transform；收敛停帧

import { type ReactNode, useEffect, useRef } from 'react';
import { listenMql } from '@/lib/listen-mql';

const STIFFNESS = 30;
const DAMPING = 6.6; // ζ≈0.6 — HeroObjectPhysics ROT 同族
const MAX_TILT = 5; // deg
const RANGE = 130; // px — 按钮盒边缘起算的影响邻域
const REST_EPS = 0.01;
const MAX_DT = 0.033;

interface Spring {
  x: number;
  v: number;
  t: number;
}

interface Entry {
  el: HTMLSpanElement;
  rx: Spring;
  ry: Spring;
  rect: DOMRect | null;
  disabled: boolean;
  settled: boolean;
}

const spring = (): Spring => ({ x: 0, v: 0, t: 0 });

function step(s: Spring, dt: number) {
  s.v += (-STIFFNESS * (s.x - s.t) - DAMPING * s.v) * dt;
  s.x += s.v * dt;
}

function isSettled(s: Spring) {
  return Math.abs(s.x - s.t) < REST_EPS && Math.abs(s.v) < REST_EPS;
}

const clampUnit = (n: number) => Math.max(-1, Math.min(1, n));

// ── 模块级单例引擎（client bundle 内共享，7 个实例一套监听）──
const entries: Entry[] = [];
let engineOn = false;
let rafId = 0;
let lastTime = 0;
let stopEngine: (() => void) | null = null;

function applyStyle(e: Entry) {
  if (e.settled && !e.rx.x && !e.ry.x) {
    e.el.style.transform = '';
  } else {
    e.el.style.transform = `perspective(500px) rotateX(${e.rx.x.toFixed(3)}deg) rotateY(${e.ry.x.toFixed(3)}deg)`;
  }
}

function frame(time: number) {
  const dt = Math.max(0, Math.min((time - lastTime) / 1000, MAX_DT));
  lastTime = time;
  let anyActive = false;
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i];
    if (e.settled) continue;
    step(e.rx, dt);
    step(e.ry, dt);
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
      // 到按钮盒的切比雪夫距离（盒内 = 0 邻域满权重）
      const d = Math.max(
        Math.abs(mx) - r.width / 2,
        Math.abs(my) - r.height / 2,
      );
      if (d < RANGE) {
        // 分母 = 按钮半径的略放大版：指针在盒缘 ≈ 半幅、盒外邻域内趋满幅
        // （×2/×1.2 的首版几乎不动——盒内 my 最大才 h/2，映射后 ≤0.25 幅）
        const wgt = 1 - Math.max(0, d) / RANGE;
        e.rx.t = -MAX_TILT * wgt * clampUnit(my / (r.height * 0.9));
        e.ry.t = MAX_TILT * wgt * clampUnit(mx / (r.width * 0.6));
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

  // 滚动中按钮随页移动而指针不动 — rect 失效即松开归零，下次 pointermove 重瞄
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

function register(el: HTMLSpanElement, disabled: boolean) {
  const capable = window.matchMedia('(hover: hover) and (pointer: fine)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!capable.matches || reducedMotion.matches) return undefined;
  const entry: Entry = {
    el,
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

export default function ButtonTilt({
  children,
  disabled = false,
}: {
  children: ReactNode;
  disabled?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return register(el, disabled);
  }, [disabled]);

  return (
    <span ref={ref} className="btn-tilt">
      {children}
    </span>
  );
}
