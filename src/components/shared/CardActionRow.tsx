// ─── 卡片收尾行 · Card System v7 ───
// 「文字 + 箭头 + group-hover 间距扩张」此前在 4 处逐字符重复
// （products 案例卡 / products teaser / FeaturedWork / RealEstateShowcase）。
// 依赖外层可点卡片（Link/a 或卡片本体）持有 group 类触发 hover 反馈。

import type { ReactNode } from 'react';
import ArrowRightIcon from './ArrowRightIcon';

interface CardActionRowProps {
  children: ReactNode;
  /** 覆盖默认站内右箭头（外链传 <ExternalArrowIcon/>，锚点传 rotate-90 箭头） */
  icon?: ReactNode;
  className?: string;
}

export default function CardActionRow({
  children,
  icon,
  className = '',
}: CardActionRowProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-accent text-sm font-medium transition-all duration-300 group-hover:gap-1.5 ${className}`}
    >
      {children}
      {icon ?? <ArrowRightIcon className="w-3.5 h-3.5" />}
    </span>
  );
}
