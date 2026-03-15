'use client';

// ─── SVG 线条绘制分割线 · Neural ───
// 滚动进入视口时从中心向两端"画出"
// stroke-dashoffset 动画 + IntersectionObserver 触发

import { useEffect, useRef, useState } from 'react';

interface LineDrawDividerProps {
  className?: string;
  /** 线条宽度（px），默认 64 */
  width?: number;
  /** 动画持续时间（ms），默认 800 */
  duration?: number;
  /** 基础延迟（ms），默认 0 */
  delay?: number;
}

export default function LineDrawDivider({
  className = '',
  width = 64,
  duration = 800,
  delay = 0,
}: LineDrawDividerProps) {
  const ref = useRef<SVGSVGElement>(null);
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
      { threshold: 0.5 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // 半宽 — 两条线从中心向外画出
  const half = width / 2;

  return (
    <svg
      ref={ref}
      width={width}
      height="1"
      viewBox={`0 0 ${width} 1`}
      className={className}
      aria-hidden="true"
    >
      {/* 左半线 — 从中心向左画 */}
      <line
        x1={half}
        y1="0.5"
        x2="0"
        y2="0.5"
        stroke="var(--accent)"
        strokeOpacity="0.4"
        strokeWidth="1"
        strokeDasharray={half}
        strokeDashoffset={isVisible ? 0 : half}
        style={{
          transition: `stroke-dashoffset ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
          transitionDelay: `${delay}ms`,
        }}
      />
      {/* 右半线 — 从中心向右画 */}
      <line
        x1={half}
        y1="0.5"
        x2={width}
        y2="0.5"
        stroke="var(--accent)"
        strokeOpacity="0.4"
        strokeWidth="1"
        strokeDasharray={half}
        strokeDashoffset={isVisible ? 0 : half}
        style={{
          transition: `stroke-dashoffset ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
          transitionDelay: `${delay}ms`,
        }}
      />
    </svg>
  );
}
