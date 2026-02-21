// ─── 面包屑导航 ───
// 用于内页（行业页、案例页、关于页等），帮助用户理解层级位置

import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  // 自动在最前面加上 Home
  const allItems: BreadcrumbItem[] = [{ label: 'Home', href: '/' }, ...items];

  return (
    <nav aria-label="Breadcrumb" className="pt-24 pb-4 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <ol className="flex items-center gap-1.5 text-sm font-light flex-wrap">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;
          return (
            <li key={index} className="flex items-center gap-1.5">
              {index > 0 && (
                <ChevronRightIcon className="w-3 h-3 text-white/30 flex-shrink-0" />
              )}
              {isLast || !item.href ? (
                <span className="text-white/50">{item.label}</span>
              ) : (
                <Link
                  href={item.href}
                  className="text-white/40 hover:text-white/70 transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
