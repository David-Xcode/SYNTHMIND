'use client';

// ─── 滚动入场动画 · Neural ───
// opacity + translateY + blur 数字显现效果（统一 reveal 动效）
// threshold/duration/direction 此前全站零调用，已收敛为固定值

import React from 'react';
import { useIntersectionVisible } from '@/hooks/useIntersectionVisible';

interface AnimateOnScrollProps {
  children: React.ReactNode;
  className?: string;
  /** 延迟时间（ms），用于卡片列表的交错入场 */
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

  // Neural reveal: 从底部浮现 + 去模糊
  // willChange 提示浏览器提前准备 GPU 合成层
  const hiddenStyle: React.CSSProperties = {
    opacity: 0,
    transform: 'translateY(12px)',
    filter: 'blur(4px)',
    willChange: 'opacity, transform, filter',
    transition: TRANSITION,
    transitionDelay: '0ms',
  };

  // 动画完成后释放 GPU 内存
  const visibleStyle: React.CSSProperties = {
    opacity: 1,
    transform: 'translate(0)',
    filter: 'blur(0)',
    willChange: 'auto',
    transition: TRANSITION,
    transitionDelay: `${delay}ms`,
  };

  return (
    <div
      ref={ref}
      className={className}
      style={isVisible ? visibleStyle : hiddenStyle}
    >
      {children}
    </div>
  );
}
