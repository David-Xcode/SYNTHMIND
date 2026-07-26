// ─── 圆形状态徽章 · Card System v7 ───
// 此前 ContactForm 成功徽（emerald）与 ErrorBoundary 错误徽（red）同构重复。
// emerald/red 为功能反馈色（成功/错误），不属装饰色相——单色相纪律豁免沿用。

import type { ReactNode } from 'react';

const TONE_CLASS = {
  success: 'bg-emerald-400/10 border-emerald-400/20 text-emerald-400',
  error: 'bg-red-400/10 border-red-400/20 text-red-400',
} as const;

const SIZE_CLASS = {
  md: 'w-12 h-12',
  lg: 'w-14 h-14',
} as const;

interface IconBadgeProps {
  /** 内容 = 图标 SVG（尺寸由调用处控制，如 w-6 h-6） */
  children: ReactNode;
  tone: keyof typeof TONE_CLASS;
  size?: keyof typeof SIZE_CLASS;
  className?: string;
}

export default function IconBadge({
  children,
  tone,
  size = 'md',
  className = '',
}: IconBadgeProps) {
  return (
    <div
      className={`${SIZE_CLASS[size]} rounded-full border flex items-center justify-center ${TONE_CLASS[tone]} ${className}`}
    >
      {children}
    </div>
  );
}
