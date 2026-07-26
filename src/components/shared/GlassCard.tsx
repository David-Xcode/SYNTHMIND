// ─── Sheet 卡片组件 · Blueprint ───
// 纯 CSS 驱动，三级图纸片材质: surface (半透明实底) / elevated (实色+上浮) / spotlight (蓝色渐变竖线)
// 组件名沿用 GlassCard 避免大面积改引用；玻璃态 (backdrop-blur) 已移除
// 内边距固定 p-6 — 需要自定义 padding 的场景可直接使用 .card-* CSS 类

import type { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  /** 卡片变体 */
  variant?: 'surface' | 'elevated' | 'spotlight';
}

export default function GlassCard({
  children,
  className = '',
  variant = 'elevated',
}: GlassCardProps) {
  // 变体到 CSS class 映射
  const variantClass = {
    surface: 'card-surface',
    elevated: 'card-elevated',
    spotlight: 'card-spotlight',
  }[variant];

  return <div className={`${variantClass} p-6 ${className}`}>{children}</div>;
}
