// ─── 图签组件 · Blueprint ───
// 制图图签：tick 基准短线 + 可选图纸编号 + mono 标签
// 编号在图纸语境有真实序列语义（01/02 = 图纸页码），不是装饰
// 文字层复用 Eyebrow；容器层为 tick/编号/斜杠另行声明同款 mono 排版

import type { ComponentProps, ReactNode } from 'react';
import Eyebrow from './Eyebrow';

interface SheetLabelProps {
  children: ReactNode;
  /** 图纸编号（如 "01"）— 提供时渲染在标签前 */
  no?: string;
  className?: string;
  /** 标签文字色调，默认 accent（与 Eyebrow 一致） */
  tone?: ComponentProps<typeof Eyebrow>['tone'];
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
      <Eyebrow tone={tone}>{children}</Eyebrow>
    </span>
  );
}
