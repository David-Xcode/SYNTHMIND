// ─── 图签组件 · Blueprint ───
// 制图图签：tick 基准短线 + 可选图纸编号 + mono 标签
// 编号在图纸语境有真实序列语义（01/02 = 图纸页码），不是装饰
// 无编号场景的纯文字小标签请用 Eyebrow（caption 用途）

import type { ReactNode } from 'react';

// 标签文字色调映射（编号恒为 accent）
const TONE_CLASS = {
  accent: 'text-accent',
  tertiary: 'text-txt-tertiary',
  quaternary: 'text-txt-quaternary',
} as const;

interface SheetLabelProps {
  children: ReactNode;
  /** 图纸编号（如 "01"）— 提供时渲染在标签前 */
  no?: string;
  className?: string;
  /** 标签文字色调，默认 accent（与旧 Eyebrow 视觉基调一致） */
  tone?: keyof typeof TONE_CLASS;
}

export default function SheetLabel({
  children,
  no,
  className = '',
  tone = 'accent',
}: SheetLabelProps) {
  return (
    <span
      className={`inline-flex items-center gap-2.5 font-mono text-xs font-medium uppercase tracking-eyebrow ${className}`}
    >
      {/* tick 基准短线 — 制图细节 */}
      <span aria-hidden="true" className="h-px w-4 bg-accent/40" />
      {no && (
        <>
          <span className="text-accent">{no}</span>
          <span aria-hidden="true" className="text-txt-quaternary">
            /
          </span>
        </>
      )}
      <span className={TONE_CLASS[tone]}>{children}</span>
    </span>
  );
}
