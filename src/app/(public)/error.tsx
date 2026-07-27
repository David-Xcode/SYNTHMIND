'use client';

// ─── 公开页面运行期错误边界 · Blueprint ───
// 捕获 (public) 树内 Server / Client 组件的渲染异常。
//
// 与既有 <ErrorBoundary> 的分工：那是个 class 组件，挂在 layout 内部包住
// header/main/footer，只接得住**客户端渲染**抛出的错误；Server Component
// 渲染期的异常它看不到，此前会一路冒泡到 Next 框架通用错误页。
// 本文件补上的正是这一段（App Router 约定：error.tsx 必须是 client 组件，
// 因为它要接收 reset 回调）。
//
// 壳层由 (public)/layout.tsx 提供 —— error.tsx 渲染在 layout 内部，
// 所以这里**不要**再挂 BlueprintWall / SiteHeader（会变成双实例）。

import { useEffect } from 'react';
import ModuleButton from '@/components/shared/ModuleButton';
import SheetLabel from '@/components/shared/SheetLabel';

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 送进浏览器控制台与 Vercel 运行时日志；digest 是 Next 给服务端错误的
    // 关联 ID，用它才能在 Vercel 日志里定位到真正的堆栈（生产环境不会把
    // 堆栈透给客户端）
    console.error('[PUBLIC_ROUTE_ERROR]', error.digest ?? '(no digest)', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-32">
      <div className="max-w-xl text-center">
        <SheetLabel no="500">Render Fault</SheetLabel>

        <h1 className="mt-6 text-headline leading-tight">
          <span className="font-sans font-light text-txt-primary">
            Something{' '}
          </span>
          <span className="font-display font-semibold stretch-wide text-accent">
            Broke
          </span>
        </h1>

        <p className="mt-6 text-subtitle text-txt-secondary leading-relaxed">
          This page failed to render. The issue has been logged. Try again, or
          head somewhere that works.
        </p>

        {/* digest 展示给用户不是为了让他读懂，而是让他能在邮件里把这串
            ID 发给我们——没有它，生产环境的报错无法关联到具体日志 */}
        {error.digest && (
          <p className="mt-4 font-mono text-xs text-txt-quaternary">
            REF {error.digest}
          </p>
        )}

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <ModuleButton onClick={reset}>Try Again</ModuleButton>
          <ModuleButton href="/" variant="secondary">
            Back to Home
          </ModuleButton>
        </div>
      </div>
    </div>
  );
}
