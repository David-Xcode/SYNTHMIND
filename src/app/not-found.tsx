// ─── 全局 404 · Blueprint ───
// 隐喻沿用图纸集：404 = 这套图里没有这张图纸（SHEET NOT FOUND），
// 而不是通用的「页面不存在」。
//
// ⚠️ 为什么在根级而不是 (public)/ 内：Next App Router 里 route group 的
// not-found.tsx 只捕获该 group 内**显式调用** notFound() 的情况；未匹配的
// URL（真正的 404 主体）只会落到**根级** app/not-found.tsx。放在 (public)/
// 里等于把绝大多数 404 让给 Next 内置页——那页自带浅色内联样式，压在深空
// 深色主题上观感割裂，且没有任何转化出口。
//
// 代价是拿不到 (public)/layout.tsx 的壳层，故此处自行组装 SiteHeader /
// SiteFooter / VoidField。VoidField「全站单实例」纪律不受影响：
// 本文件不在 (public) 树内，两者永不同时挂载。

import type { Metadata } from 'next';
import SiteFooter from '@/components/layout/SiteFooter';
import SiteHeader from '@/components/layout/SiteHeader';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import ModuleButton from '@/components/shared/ModuleButton';
import SheetLabel from '@/components/shared/SheetLabel';
import VoidField from '@/components/shared/VoidField';

export const metadata: Metadata = {
  title: 'Page Not Found | Synthmind',
  // 404 必须 noindex，否则 Google 会把大量软 404 收进索引
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="relative">
      <VoidField />
      <ErrorBoundary fallback={null}>
        <SiteHeader />
      </ErrorBoundary>

      <main
        id="main-content"
        className="min-h-screen flex items-center justify-center px-4 py-32"
      >
        <div className="max-w-xl text-center">
          <SheetLabel no="404">Sheet Not Found</SheetLabel>

          {/* h1 是本页 LCP 元素 — 不加入场动画（CLAUDE.md 性能纪律） */}
          <h1 className="mt-6 text-headline leading-tight">
            <span className="font-sans font-light text-txt-primary">This </span>
            <span className="font-display font-semibold stretch-wide text-accent">
              Drawing
            </span>
            <span className="font-sans font-light text-txt-primary">
              {' '}
              Isn&apos;t In The Set
            </span>
          </h1>

          <p className="mt-6 text-subtitle text-txt-secondary leading-relaxed">
            The page you&apos;re looking for has been moved, retired, or never
            existed. Everything we&apos;ve built is one click away.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <ModuleButton href="/products" arrow>
              View Our Work
            </ModuleButton>
            <ModuleButton href="/" variant="secondary">
              Back to Home
            </ModuleButton>
          </div>
        </div>
      </main>

      <ErrorBoundary fallback={null}>
        <SiteFooter />
      </ErrorBoundary>
    </div>
  );
}
