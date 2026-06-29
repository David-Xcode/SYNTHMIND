// ─── 眉标组件 · Neural ───
// JetBrains Mono 小标签 — 此前同一串 class 在 4 处内联重复，统一收拢

import type { ReactNode } from 'react';

// 色调到文字色类的映射 — accent / tertiary / quaternary 三档静音灰阶共用同一眉标排版
const TONE_CLASS = {
  accent: 'text-accent',
  tertiary: 'text-txt-tertiary',
  quaternary: 'text-txt-quaternary',
} as const;

interface EyebrowProps {
  children: ReactNode;
  className?: string;
  /** 文字色调：accent（默认蓝）/ tertiary / quaternary（静音灰阶 caption） */
  tone?: keyof typeof TONE_CLASS;
}

export default function Eyebrow({
  children,
  className = '',
  tone = 'accent',
}: EyebrowProps) {
  return (
    <span
      className={`font-mono text-xs font-medium uppercase tracking-eyebrow ${TONE_CLASS[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
