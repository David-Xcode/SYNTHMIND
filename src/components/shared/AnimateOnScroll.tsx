'use client';

// ─── 滚动入场动画组件 ───
// 提取自 About / Services / Products 中重复的 IntersectionObserver 模式
// 封装为声明式组件，减少各页面的样板代码

import React, { useEffect, useRef, useState } from 'react';

interface AnimateOnScrollProps {
  children: React.ReactNode;
  className?: string;
  /** 延迟时间（ms），用于卡片列表的交错入场 */
  delay?: number;
  /** IntersectionObserver 触发阈值，默认 0.1 */
  threshold?: number;
}

export default function AnimateOnScroll({
  children,
  className = '',
  delay = 0,
  threshold = 0.1,
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

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
      style={{ transitionDelay: isVisible ? `${delay}ms` : '0ms' }}
    >
      {children}
    </div>
  );
}
