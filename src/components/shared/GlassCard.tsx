// ─── Neural 卡片组件 ───
// 纯 CSS 驱动，三级: surface (玻璃态) / elevated (实色+上浮) / spotlight (蓝色渐变竖线)

import type { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  /** 卡片变体 */
  variant?: 'surface' | 'elevated' | 'spotlight';
  as?: 'div' | 'article' | 'section';
}

export default function GlassCard({
  children,
  className = '',
  variant = 'elevated',
  as: Tag = 'div',
}: GlassCardProps) {
  // 变体到 CSS class 映射
  const variantClass = {
    surface: 'card-surface',
    elevated: 'card-elevated',
    spotlight: 'card-spotlight',
  }[variant];

  return <Tag className={`${variantClass} p-6 ${className}`}>{children}</Tag>;
}
