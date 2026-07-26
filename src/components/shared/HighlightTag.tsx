// ─── 能力标签 chip · Card System v7 ───
// 此前同一串 className 在 RealEstateShowcase / InDevelopmentShowcase
// 逐字符重复，统一收拢

import type { ReactNode } from 'react';

export default function HighlightTag({ children }: { children: ReactNode }) {
  return (
    <span className="text-xs text-txt-secondary bg-accent/[0.06] border border-accent/[0.12] rounded-lg px-2 py-0.5">
      {children}
    </span>
  );
}
