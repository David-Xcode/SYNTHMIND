'use client';

// ─── 首页 Hero · Neural ───
// 径向渐变光晕 + TextReveal 逐词入场 + LineDrawDivider
// 视频背景提取到 HomeHeroVideo 组件，通过 ssr: false 动态加载
// → SSR HTML 中不含 <video> → 微信 WebView 无法修改 → 消除 hydration mismatch
// 保留 'use client' 因为 next/dynamic ssr:false 必须在 Client Component 中

import Link from 'next/link';
import dynamic from 'next/dynamic';
import TextReveal from '@/components/shared/TextReveal';
import LineDrawDivider from '@/components/shared/LineDrawDivider';

// ssr: false — 视频仅在客户端渲染，服务端 HTML 零 <video> 标签
const HomeHeroVideo = dynamic(() => import('./HomeHeroVideo'), { ssr: false });

export default function HomeHero() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen bg-bg-base overflow-hidden">
      {/* 视频背景 — 客户端动态加载，SSR 中不存在 */}
      <HomeHeroVideo />

      {/* 背景光晕装饰 — 在视频之上 */}
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

        {/* 蓝色线条 — 从中心向两端画出 */}
        <div
          className="mt-6 mb-4 animate-reveal"
          style={{ animationDelay: '0.4s', animationFillMode: 'both' }}
        >
          <LineDrawDivider width={64} delay={600} duration={800} />
        </div>

        {/* 副标题 — 逐词入场 */}
        <TextReveal
          text="A Toronto-based startup building AI tools that actually work — workflow automation, legacy modernization, and custom solutions for traditional industries."
          className="text-subtitle text-txt-secondary max-w-xl"
          delay={500}
          stagger={40}
        />

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
            href="/products"
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

      {/* 滚动指示器 — 自定义 scrollPulse 替代 bounce */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none">
        <div className="w-5 h-8 rounded-full border border-txt-quaternary/40 flex items-start justify-center p-1.5">
          <div className="w-0.5 h-2 bg-txt-quaternary rounded-full animate-scroll-pulse" />
        </div>
      </div>
    </section>
  );
}
