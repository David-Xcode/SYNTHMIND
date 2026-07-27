'use client';

// ─── Hero 物件视口门控 ───
// 物件离开视口即让整棵 .bp-object-scene 子树 animation-play-state: paused。
//
// 为什么需要（2026-07-27 代码审查 F1/F2 实测）：
//   物件的无限动画一条都无法合成——modDrift 的关键帧值引用 var(--dx/--dy/--dz)
//   （自定义属性关键帧 Chrome 拒绝下放合成器）；seamPulse / corePulse 虽只动
//   opacity，但元素位于 preserve-3d 的 3D 渲染上下文内（需深度排序的子树同样
//   不做合成动画）。于是成本与「看不看得见」完全无关：
//     · 手机模拟 390×844 DPR3，滚到 hero 完全离屏静置 3s → 仍 6.6% 主线程、
//       物件独占 73 个合成层
//     · 桌面 1920×1080 鼠标不动静置 2.1s → 主线程 transform 动画 × 砖阵 DOM
//       的乘积效应触发每帧全文档 layout（LayoutCount 158）
//
// 设计取舍：
//   · 只暂停不卸载 —— 物件是首页视觉主角，滚回来必须原样在那儿；
//     paused 的动画恢复时从暂停处继续，无跳变
//   · rootMargin 400px 提前唤醒 —— 滚回时动画已在跑，看不出「刚启动」
//   · 选择器锚在 .bp-object-scene 子树内（globals.css），不含 .hero-tilt：
//     那是 scroll-driven 的 scrub 动画，暂停会让倾角停在旧滚动位置
//   · SSR 基态无 data-idle = 动画照跑 —— JS 失效/hydration 失败时行为与
//     门控前完全一致（SSR 可见基态纪律）
//   · children 用组合模式接 Server 子树 —— BlueprintObject 的大块 SVG DOM
//     不进 client bundle（同 HeroObjectPhysics 先例）

import { type ReactNode, useEffect, useRef } from 'react';

// 提前唤醒余量（px）—— 比一次 wheel/触屏惯性滚动的位移大，滚回时不露启动感
const WAKE_MARGIN = 400;

interface HeroObjectViewportGateProps {
  children: ReactNode;
  className?: string;
}

export default function HeroObjectViewportGate({
  children,
  className,
}: HeroObjectViewportGateProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          // 门控只写属性，不触发 React 重渲染（逐次滚动的开销必须 ≈0）
          if (entry.isIntersecting) {
            el.removeAttribute('data-idle');
          } else {
            el.setAttribute('data-idle', '');
          }
        }
      },
      { rootMargin: `${WAKE_MARGIN}px 0px` },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      // 卸载后 DOM 若被复用（路由回退的缓存树），不留暂停态
      el.removeAttribute('data-idle');
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`bp-object-gate${className ? ` ${className}` : ''}`}
    >
      {children}
    </div>
  );
}
