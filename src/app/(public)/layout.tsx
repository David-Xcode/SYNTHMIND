// ─── 公开页面共享布局 ───
// SiteHeader + SiteFooter 在此声明一次，所有公开页面自动继承
// VoidField：全站唯一背景（单实例，z-index -1），fixed 属场景——内容从
// 背景前滚过、背景不动（零滚动耦合）。背景 = 一片静止的深空，指针 =
// 压在空间上的引力井；星云不漂移不呼吸，指针不动时空闲成本为零。
// 所有页面的 section 不再持有整幅不透明底色（L0 背景 / L2 卡片二级层次）

import type { ReactNode } from 'react';
import SiteFooter from '@/components/layout/SiteFooter';
import SiteHeader from '@/components/layout/SiteHeader';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import VoidField from '@/components/shared/VoidField';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      {/* 跳到主内容链接 — WCAG 2.4.1，首个可聚焦元素，仅键盘聚焦时可见（Tailwind 内置 sr-only / not-sr-only） */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:border focus:border-accent/30 focus:bg-bg-elevated focus:px-4 focus:py-2 focus:text-sm focus:text-txt-primary"
      >
        Skip to content
      </a>
      {/* 背景的错误边界收在 VoidField 内部的 client 岛上——岛抛错
          只丢引力井增强，静态帧（唯一保底）原地复位 */}
      <VoidField />
      <ErrorBoundary fallback={null}>
        <SiteHeader />
      </ErrorBoundary>
      <main id="main-content" className="min-h-screen">
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>
      <ErrorBoundary fallback={null}>
        <SiteFooter />
      </ErrorBoundary>
    </div>
  );
}
