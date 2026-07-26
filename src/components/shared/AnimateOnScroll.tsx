'use client';

// ─── 滚动入场动画 · Blueprint ───
// 双路径实现（对外 API 不变）：
// 1. 支持 animation-timeline 的浏览器：.sheet-reveal 走 CSS scroll-driven
//    图纸沉降（rotateX 5° + translateY 随滚动 scrub），本组件内联样式被
//    CSS 动画级联覆盖，IO 状态切换无视觉影响
// 2. 旧浏览器：IntersectionObserver + 内联过渡（原 Neural reveal 路径）

import React from 'react';
import { useIntersectionVisible } from '@/hooks/useIntersectionVisible';

interface AnimateOnScrollProps {
  children: React.ReactNode;
  className?: string;
  /** 延迟时间（ms）：IO 路径为 transitionDelay；scrub 路径映射为 animation-range 偏移 */
  delay?: number;
}

const DURATION_MS = 700;
const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';
const TRANSITION = `opacity ${DURATION_MS}ms ${EASE}, transform ${DURATION_MS}ms ${EASE}, filter ${DURATION_MS}ms ${EASE}`;

export default function AnimateOnScroll({
  children,
  className = '',
  delay = 0,
}: AnimateOnScrollProps) {
  const { ref, isVisible } = useIntersectionVisible<HTMLDivElement>(0.1);

  // scrub 交错：delay(ms) → range 偏移（100ms ≈ 2%），封顶 12% 防止排尾卡片入场过晚
  // toFixed 消除浮点噪声（3.6000000000000005 之类会原样进 SSR HTML）
  const settleOffset = Number(Math.min(delay * 0.02, 12).toFixed(2));

  // 降级路径隐藏态：从底部浮现 + 去模糊
  // 不写 will-change：整页十几个未入场 wrapper 同时持有合成层提示得不偿失，
  // scrub 路径下浏览器对 CSS 动画自会处理
  const hiddenStyle: React.CSSProperties = {
    opacity: 0,
    transform: 'translateY(12px)',
    filter: 'blur(4px)',
    transition: TRANSITION,
    transitionDelay: '0ms',
  };

  const visibleStyle: React.CSSProperties = {
    opacity: 1,
    transform: 'translate(0)',
    filter: 'blur(0)',
    transition: TRANSITION,
    transitionDelay: `${delay}ms`,
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
