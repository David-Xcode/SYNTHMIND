// ─── 玻璃态卡片封装 ───
// 提取自 globals.css 的 .glass-card 样式，加入可选的交互变体

import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  /** 禁用 hover 抬升效果（用于静态展示场景） */
  noHover?: boolean;
  as?: 'div' | 'article' | 'section';
}

export default function GlassCard({
  children,
  className = '',
  noHover = false,
  as: Tag = 'div',
}: GlassCardProps) {
  return (
    <Tag
      className={`glass-card rounded-2xl p-8 ${noHover ? 'no-hover' : ''} ${className}`}
    >
      {children}
    </Tag>
  );
}
