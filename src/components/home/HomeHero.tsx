// ─── 首页 Hero · 纯 CSS 服务端组件 ───
// 径向渐变光晕背景 + 交错 reveal 入场
// 不含任何 hooks / 浏览器 API → Server Component

import Link from 'next/link';

export default function HomeHero() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen bg-bg-base overflow-hidden">
      {/* 背景光晕装饰 — 纯 CSS 径向渐变 */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {/* 主光晕 — 顶部偏左 */}
        <div className="absolute -top-32 left-1/4 h-[480px] w-[480px] rounded-full bg-accent/[0.04] blur-[120px]" />
        {/* 辅助光晕 — 右下 */}
        <div className="absolute top-1/3 right-[10%] h-[320px] w-[320px] rounded-full bg-accent/[0.03] blur-[100px]" />
      </div>

      {/* 内容区 */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-3xl">
        {/* 眉标 */}
        <span
          className="font-mono text-xs font-medium uppercase tracking-eyebrow text-accent mb-6 animate-reveal"
          style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
        >
          AI-Powered Software Studio
        </span>

        {/* 标题 */}
        <h1
          className="text-display tracking-tight animate-reveal"
          style={{ animationDelay: '0.25s', animationFillMode: 'both' }}
        >
          <span className="font-sans font-light text-txt-primary">
            Unleash Human{' '}
          </span>
          <span className="font-display font-semibold text-txt-primary">
            Potential
          </span>
          <br className="hidden sm:block" />
          <span className="font-sans font-light text-txt-primary"> with </span>
          <span className="font-display font-semibold text-accent">AI.</span>
        </h1>

        {/* 蓝色短线 */}
        <div
          className="w-16 h-px bg-accent/40 mt-6 mb-4 animate-reveal"
          style={{ animationDelay: '0.4s', animationFillMode: 'both' }}
        />

        {/* 副标题 */}
        <p
          className="text-subtitle text-txt-secondary max-w-xl animate-reveal"
          style={{ animationDelay: '0.5s', animationFillMode: 'both' }}
        >
          A Toronto-based startup building AI tools that actually work —
          workflow automation, legacy modernization, and custom solutions for
          traditional industries.
        </p>

        {/* CTA 按钮 */}
        <div
          className="flex flex-wrap justify-center gap-4 mt-10 animate-reveal"
          style={{ animationDelay: '0.7s', animationFillMode: 'both' }}
        >
          <Link
            href="/contact"
            className="btn-primary text-sm sm:text-base px-7 py-3"
          >
            Book a Free Consultation
            <svg
              className="w-4 h-4"
              aria-hidden="true"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
          <Link
            href="/case-studies"
            className="btn-secondary text-sm sm:text-base px-7 py-3"
          >
            View Our Work
          </Link>
        </div>
      </div>

      {/* 底部渐变过渡 */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-bg-base to-transparent" />
      </div>

      {/* 滚动指示器 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none">
        <div className="w-5 h-8 rounded-full border border-txt-quaternary/40 flex items-start justify-center p-1.5">
          <div className="w-0.5 h-2 bg-txt-quaternary rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
