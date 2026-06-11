// ─── 眉标组件 · Neural ───
// JetBrains Mono 小标签 — 此前同一串 class 在 4 处内联重复，统一收拢

import type { ReactNode } from 'react';

interface EyebrowProps {
  children: ReactNode;
  className?: string;
}

export default function Eyebrow({ children, className = '' }: EyebrowProps) {
  return (
    <span
      className={`font-mono text-xs font-medium uppercase tracking-eyebrow text-accent ${className}`}
    >
      {children}
    </span>
  );
}
