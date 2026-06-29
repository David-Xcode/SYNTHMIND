// ─── 公开页面共享布局 ───
// SiteHeader + SiteFooter 在此声明一次，所有公开页面自动继承

import type { ReactNode } from 'react';
import SiteFooter from '@/components/layout/SiteFooter';
import SiteHeader from '@/components/layout/SiteHeader';
import ErrorBoundary from '@/components/shared/ErrorBoundary';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* 跳到主内容链接 — WCAG 2.4.1，首个可聚焦元素，仅键盘聚焦时可见（Tailwind 内置 sr-only / not-sr-only） */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:border focus:border-accent/30 focus:bg-bg-elevated focus:px-4 focus:py-2 focus:text-sm focus:text-txt-primary"
      >
        Skip to content
      </a>
      <ErrorBoundary fallback={null}>
        <SiteHeader />
      </ErrorBoundary>
      <main id="main-content" className="min-h-screen">
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>
      <ErrorBoundary fallback={null}>
        <SiteFooter />
      </ErrorBoundary>
    </>
  );
}
