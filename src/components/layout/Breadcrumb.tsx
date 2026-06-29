// ─── 面包屑导航 ───
// 用于内页（行业页、案例页、关于页等），帮助用户理解层级位置

import Link from 'next/link';
import JsonLd from '@/components/shared/JsonLd';
import { SITE_URL } from '@/lib/constants';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  // 自动在最前面加上 Home
  const allItems: BreadcrumbItem[] = [{ label: 'Home', href: '/' }, ...items];

  // BreadcrumbList 结构化数据 — 与视觉面包屑同源，绝对 www URL；
  // 当前页（末项，无 href）按 schema.org 约定省略 item URL
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: allItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href
        ? { item: item.href === '/' ? SITE_URL : `${SITE_URL}${item.href}` }
        : {}),
    })),
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <nav
        aria-label="Breadcrumb"
        className="pt-24 pb-4 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto"
      >
        <ol className="flex items-center gap-1.5 text-sm flex-wrap">
          {allItems.map((item, index) => {
            const isLast = index === allItems.length - 1;
            return (
              <li key={index} className="flex items-center gap-1.5">
                {index > 0 && (
                  <span
                    className="text-txt-quaternary text-xs select-none"
                    aria-hidden="true"
                  >
                    /
                  </span>
                )}
                {isLast || !item.href ? (
                  <span
                    className="text-txt-tertiary"
                    aria-current={isLast ? 'page' : undefined}
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="text-txt-quaternary hover:text-txt-secondary transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
