'use client';

// ─── Hero 物件弹簧物理层 ───
// 欠阻尼弹簧（半隐式欧拉积分）驱动指针跟随：
// 移动中 = 阻尼跟随（非 1:1 硬跟）；离开 = 目标归零 → 一次过冲回摆
// hover 进度共用一根弹簧驱动 scale（≈1.03）与 --edge-boost（描边增亮）
// 状态全走 ref 不触发 re-render；rAF 按需运行，收敛即停帧
// 桌面（≥lg）细指针专属：触屏 / reduced-motion / 窄视口不挂监听（CSS 静态路径照常呈现）；
// 能力判定为单向——会话中途获得能力（关 RM / 接鼠标 / 放大窗口）不重新挂载，导航后自愈
// 背光与地面投影渲染在弹簧层外 — 光源固定，不随指针旋转
// children 用组合模式接收 Server Component 子树 — SVG 大块 DOM 不进 client bundle

import { type ReactNode, useEffect, useRef } from 'react';
import { listenMql } from '@/lib/listen-mql';

// 旋转弹簧 ζ≈0.6 — 欠阻尼一次过冲（"有质量的物体被拨动"）
const ROT_STIFFNESS = 30;
const ROT_DAMPING = 6.6;
// hover 弹簧 ζ≈0.85 — 过冲收敛更快，scale 峰值 ≈1.03
const HOVER_STIFFNESS = 40;
const HOVER_DAMPING = 10.8;
const YAW_MAX = 7; // deg — 与 obj-sway ±3° 同轴叠加峰值 10°，不破倾角纪律
const PITCH_MAX = 5; // deg
const REST_EPS = 0.005; // 收敛阈值（位移与速度都低于此值即停帧）
const MAX_DT = 0.033; // 秒 — tab 切回时防积分爆炸
const RECT_TTL = 150; // 毫秒 — section rect 缓存时长（滚动中的短暂偏差由弹簧平滑掉）

interface SpringState {
  x: number;
  v: number;
}

// 半隐式欧拉一步积分：先更新速度再更新位置，刚性系统下比显式欧拉稳定
function stepSpring(
  s: SpringState,
  target: number,
  k: number,
  c: number,
  dt: number,
) {
  s.v += (-k * (s.x - target) - c * s.v) * dt;
  s.x += s.v * dt;
}

function isSettled(s: SpringState, target: number) {
  return Math.abs(s.x - target) < REST_EPS && Math.abs(s.v) < REST_EPS;
}

interface HeroObjectPhysicsProps {
  children: ReactNode;
}

export default function HeroObjectPhysics({
  children,
}: HeroObjectPhysicsProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const springRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    const springEl = springRef.current;
    if (!scene || !springEl) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const coarsePointer = window.matchMedia('(hover: none), (pointer: coarse)');
    // v2：<lg 物件缩放静态显示（循环照常），指针物理仍桌面专属 — 窄视口不挂监听
    const desktopViewport = window.matchMedia('(min-width: 1024px)');
    if (
      reducedMotion.matches ||
      coarsePointer.matches ||
      !desktopViewport.matches
    ) {
      return;
    }

    // 监听区域 = 整个 hero section（物件对指针的感知范围）
    const section = scene.closest('section') ?? scene;
    // hover 命中区 = 物件本体（280px 根容器），不是整个右栏空白
    const hoverArea = scene.querySelector('.bp-object-root') ?? scene;

    const yaw: SpringState = { x: 0, v: 0 };
    const pitch: SpringState = { x: 0, v: 0 };
    const hover: SpringState = { x: 0, v: 0 };
    const target = { yaw: 0, pitch: 0, hover: 0 };
    let rafId = 0;
    let lastTime = 0;
    let lastBoost = -1;
    let rect: DOMRect | null = null;
    let rectStamp = 0;
    // 终止位：teardown 后任何路径（含 viewport handler 的 kick）都不得复活 rAF
    let disposed = false;

    const applyStyles = () => {
      const scale = 1 + hover.x * 0.03;
      springEl.style.transform = `rotateX(${pitch.x}deg) rotateY(${yaw.x}deg) scale(${scale})`;
      const boost = Math.min(Math.max(hover.x, 0), 1);
      // 同值不重写 — 避免每帧无谓的自定义属性失效（hover 静止是最常见状态）
      if (boost !== lastBoost) {
        lastBoost = boost;
        scene.style.setProperty('--edge-boost', String(boost));
      }
    };

    const frame = (time: number) => {
      if (disposed) return;
      // dt 下限 0：rAF 时间戳是帧起始时刻，可能早于 kick() 的事件派发时刻
      const dt = Math.max(0, Math.min((time - lastTime) / 1000, MAX_DT));
      lastTime = time;
      stepSpring(yaw, target.yaw, ROT_STIFFNESS, ROT_DAMPING, dt);
      stepSpring(pitch, target.pitch, ROT_STIFFNESS, ROT_DAMPING, dt);
      stepSpring(hover, target.hover, HOVER_STIFFNESS, HOVER_DAMPING, dt);
      applyStyles();
      if (
        isSettled(yaw, target.yaw) &&
        isSettled(pitch, target.pitch) &&
        isSettled(hover, target.hover)
      ) {
        // 收敛：吸附到精确目标值后停帧
        yaw.x = target.yaw;
        pitch.x = target.pitch;
        hover.x = target.hover;
        yaw.v = pitch.v = hover.v = 0;
        applyStyles();
        rafId = 0;
        return;
      }
      rafId = requestAnimationFrame(frame);
    };

    // 唤醒积分循环（已在跑或已终止则不动）
    const kick = () => {
      if (disposed || rafId) return;
      lastTime = performance.now();
      rafId = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      // 缩窗跨过 lg 后物理停用（v2 物件缩放静态显示）— 不再响应移动（否则会撤销边界归零）
      if (!desktopViewport.matches) return;
      // rect 短缓存 — 不必每个 move（120Hz 鼠标）都强制一次 style flush
      const now = performance.now();
      if (!rect || now - rectStamp > RECT_TTL) {
        rect = section.getBoundingClientRect();
        rectStamp = now;
      }
      const nx = Math.min(
        Math.max(((e.clientX - rect.left) / rect.width) * 2 - 1, -1),
        1,
      );
      const ny = Math.min(
        Math.max(((e.clientY - rect.top) / rect.height) * 2 - 1, -1),
        1,
      );
      target.yaw = nx * YAW_MAX;
      target.pitch = ny * PITCH_MAX;
      kick();
    };
    const onSectionLeave = () => {
      if (!desktopViewport.matches) return;
      target.yaw = 0;
      target.pitch = 0;
      kick();
    };
    const onHoverEnter = () => {
      if (!desktopViewport.matches) return;
      target.hover = 1;
      kick();
    };
    const onHoverLeave = () => {
      if (!desktopViewport.matches) return;
      target.hover = 0;
      kick();
    };

    const teardown = () => {
      if (disposed) return;
      disposed = true;
      section.removeEventListener('pointermove', onMove);
      section.removeEventListener('pointerleave', onSectionLeave);
      hoverArea.removeEventListener('pointerenter', onHoverEnter);
      hoverArea.removeEventListener('pointerleave', onHoverLeave);
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
      // 弹簧状态一并归零 — 不留任何可被复活路径消费的残值
      yaw.x = yaw.v = pitch.x = pitch.v = hover.x = hover.v = 0;
      target.yaw = target.pitch = target.hover = 0;
      lastBoost = -1;
      springEl.style.transform = '';
      scene.style.removeProperty('--edge-boost');
    };

    // 会话中途开启 reduced-motion → 立即撤下交互，回到静态完成态
    const unlistenReduced = listenMql(reducedMotion, (e) => {
      if (e.matches) teardown();
    });
    // 缩窗跨过 lg 边界（v2 物件仍显示但物理停用，pointerleave 未必派发）
    // → 目标归零，避免恢复视口时残留 hover 增亮/偏转
    const unlistenViewport = listenMql(desktopViewport, (e) => {
      if (!e.matches) {
        target.yaw = 0;
        target.pitch = 0;
        target.hover = 0;
        rect = null;
        kick();
      }
    });

    section.addEventListener('pointermove', onMove);
    section.addEventListener('pointerleave', onSectionLeave);
    hoverArea.addEventListener('pointerenter', onHoverEnter);
    hoverArea.addEventListener('pointerleave', onHoverLeave);

    return () => {
      teardown();
      unlistenReduced();
      unlistenViewport();
    };
  }, []);

  return (
    <div ref={sceneRef} className="bp-object-scene" aria-hidden="true">
      {/* 背光/投影 — 弹簧层外不随指针旋转（光源固定）；
          且都画在 spring 之前，被物件正面正常遮挡 */}
      <div className="bp-object-backglow" />
      <div className="bp-object-shadow" />
      <div ref={springRef} className="bp-object-spring">
        {children}
      </div>
    </div>
  );
}
