'use client';

// ─── 滚动入场动画 · Neural ───
// opacity + translateY + blur 数字显现效果（统一 reveal 动效）

import React, { useEffect, useRef, useState } from 'react';

interface AnimateOnScrollProps {
  children: React.ReactNode;
  className?: string;
  /** 延迟时间（ms），用于卡片列表的交错入场 */
  delay?: number;
  /** IntersectionObserver 触发阈值，默认 0.1 */
  threshold?: number;
  /** 动画持续时间 (ms)，默认 700 */
  duration?: number;
}

export default function AnimateOnScroll({
  children,
  className = '',
  delay = 0,
  threshold = 0.1,
  duration = 700,
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  // Neural reveal: 从下方浮现 + 去模糊
  // willChange 提示浏览器提前准备 GPU 合成层
  const hiddenStyle: React.CSSProperties = {
    opacity: 0,
    transform: 'translateY(12px)',
    filter: 'blur(4px)',
    willChange: 'opacity, transform, filter',
    transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), filter ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
    transitionDelay: '0ms',
  };

  // 动画完成后释放 GPU 内存
  const visibleStyle: React.CSSProperties = {
    opacity: 1,
    transform: 'translateY(0)',
    filter: 'blur(0)',
    willChange: 'auto',
    transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), filter ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
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
