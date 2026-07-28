'use client';

// ─── 滚动入场动画 · Blueprint ───
// 双路径实现（对外 API 不变）：
// 1. 支持 animation-timeline 的浏览器：.sheet-reveal 走 CSS scroll-driven
//    图纸沉降（rotateX 5° + translateY 随滚动 scrub；opacity/transform 被
//    动画级联覆盖，filter 自 v7 起只由本组件内联控制——Backdrop 采样纪律）
//    ⚠️ 玻璃卡 wrapper 例外：`.sheet-reveal:has(.card-glass)` 在 CSS 侧
//    退出 scrub，本组件的 IO 内联路径即其唯一视觉路径（v7 保守定案）
// 2. 旧浏览器：IntersectionObserver + 内联过渡（原 Neural reveal 路径）
// SSR 基态可见（useDeferredReveal）：iOS/WKWebView 无 animation-timeline
// 且 hydration 失败（微信 WebView 真机实测）时，整页 section 仍完整可读

import React from 'react';
import { useDeferredReveal } from '@/hooks/useDeferredReveal';

interface AnimateOnScrollProps {
  children: React.ReactNode;
  className?: string;
  /** 延迟时间（ms）：IO 路径为 transitionDelay；scrub 路径映射为 animation-range 偏移 */
  delay?: number;
}

const DURATION_MS = 700;
const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';
// delay 折进 shorthand（每属性第二个时间值 = delay）：
// shorthand 与 transitionDelay longhand 混写会触发 React 冲突告警
const transitionWithDelay = (delayMs: number) =>
  ['opacity', 'transform', 'filter']
    .map((p) => `${p} ${DURATION_MS}ms ${EASE} ${delayMs}ms`)
    .join(', ');

export default function AnimateOnScroll({
  children,
  className = '',
  delay = 0,
}: AnimateOnScrollProps) {
  const { ref, isVisible } = useDeferredReveal<HTMLDivElement>(0.1);

  // scrub 交错：delay(ms) → range 偏移（100ms ≈ 2%），封顶 12% 防止排尾卡片入场过晚
  // toFixed 消除浮点噪声（3.6000000000000005 之类会原样进 SSR HTML）
  const settleOffset = Number(Math.min(delay * 0.02, 12).toFixed(2));

  // 降级路径隐藏态：从底部浮现 + 去模糊
  // 不写 will-change：整页十几个未入场 wrapper 同时持有合成层提示得不偿失，
  // scrub 路径下浏览器对 CSS 动画自会处理
  // transition none：武装隐藏（可见基态 → 隐藏）必须瞬时——带过渡会让全页
  // 未入场 wrapper 在 hydration 时同时跑一轮 700ms blur 渐隐（性能 + 观感双输）
  const hiddenStyle: React.CSSProperties = {
    opacity: 0,
    transform: 'translateY(12px)',
    filter: 'blur(4px)',
    transition: 'none',
  };

  // filter 终态必须是 'none' 而非 identity 值 blur(0)：非 none 的 filter
  // 构成 Backdrop Root，玻璃卡只能采样到 wrapper 内（透明）而非背景面，
  // 毛玻璃静默失效（v7 审查逐级挂载实验定位）。transform 终态同写 none
  // 属卫生习惯——实测祖先 transform 不截断采样（tilt 无碍），真凶只有
  // filter。scrub 路径由 CSS 侧 `.sheet-reveal:has(.card-glass)` 退出
  // 关键帧动画（保守定案，见 globals.css 注释）
  const visibleStyle: React.CSSProperties = {
    opacity: 1,
    transform: 'none',
    filter: 'none',
    transition: transitionWithDelay(delay),
  };

  return (
    <div
      ref={ref}
      className={`sheet-reveal ${className}`}
      style={
        {
          ...(isVisible ? visibleStyle : hiddenStyle),
          '--settle-offset': `${settleOffset}%`,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
