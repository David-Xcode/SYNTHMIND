'use client';

// ─── SVG 线条绘制分割线 · Neural ───
// 滚动进入视口时从中心向两端"画出"
// stroke-dashoffset 动画 + useIntersectionVisible 触发

import { useIntersectionVisible } from '@/hooks/useIntersectionVisible';

// 线条尺寸与动画时长固定 — 唯一消费方是 HomeHero
const WIDTH = 64;
const HALF = WIDTH / 2;
const DURATION_MS = 800;

interface LineDrawDividerProps {
  /** 基础延迟（ms），默认 0 */
  delay?: number;
}

export default function LineDrawDivider({ delay = 0 }: LineDrawDividerProps) {
  const { ref, isVisible } = useIntersectionVisible<SVGSVGElement>(0.5);

  const lineStyle = {
    transition: `stroke-dashoffset ${DURATION_MS}ms cubic-bezier(0.16, 1, 0.3, 1)`,
    transitionDelay: `${delay}ms`,
  };

  return (
    <svg
      ref={ref}
      width={WIDTH}
      height="1"
      viewBox={`0 0 ${WIDTH} 1`}
      aria-hidden="true"
    >
      {/* 左半线 — 从中心向左画 */}
      <line
        x1={HALF}
        y1="0.5"
        x2="0"
        y2="0.5"
        stroke="var(--accent)"
        strokeOpacity="0.4"
        strokeWidth="1"
        strokeDasharray={HALF}
        strokeDashoffset={isVisible ? 0 : HALF}
        style={lineStyle}
      />
      {/* 右半线 — 从中心向右画 */}
      <line
        x1={HALF}
        y1="0.5"
        x2={WIDTH}
        y2="0.5"
        stroke="var(--accent)"
        strokeOpacity="0.4"
        strokeWidth="1"
        strokeDasharray={HALF}
        strokeDashoffset={isVisible ? 0 : HALF}
        style={lineStyle}
      />
    </svg>
  );
}
