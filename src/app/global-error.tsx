'use client';

// ─── 根级兜底错误页 · Blueprint ───
// 只在**根 layout 自身**抛错时触发（(public)/error.tsx 接不住的那一层）。
// App Router 约定：global-error 会整体替换 root layout，所以必须自带
// <html>/<body>，也拿不到 layout 里注入的字体 CSS 变量——font-display /
// font-mono 会落到 Tailwind 配置的 fallback 栈，这是预期行为不是缺陷。
//
// 这是全站最后一道兜底，触发概率极低；刻意不引入任何组件依赖
// （ModuleButton / SheetLabel 都可能正是抛错的来源），只用原生标签 +
// globals.css 的 token 类，把「还能显示」放在「显示得漂亮」之前。

import './globals.css';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-bg-base">
        <main className="min-h-screen flex items-center justify-center px-4 py-32 text-center">
          <div className="max-w-lg">
            <p className="font-mono text-xs uppercase tracking-eyebrow text-accent">
              500 / System Fault
            </p>

            <h1 className="mt-6 text-headline leading-tight text-txt-primary">
              Synthmind is temporarily unavailable
            </h1>

            <p className="mt-6 text-subtitle text-txt-secondary leading-relaxed">
              A fault occurred while loading the site shell. Reloading usually
              resolves it.
            </p>

            {error.digest && (
              <p className="mt-4 font-mono text-xs text-txt-quaternary">
                REF {error.digest}
              </p>
            )}

            <button
              type="button"
              onClick={reset}
              className="mt-10 rounded-lg border border-accent/30 bg-accent/10 px-7 py-3 text-sm font-semibold text-txt-primary transition-colors hover:bg-accent/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-accent"
            >
              Reload
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
