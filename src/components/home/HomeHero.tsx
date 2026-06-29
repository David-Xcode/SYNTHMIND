'use client';

// ─── 首页 Hero · Neural ───
// 径向渐变光晕 + TextReveal 逐词入场 + LineDrawDivider
// 视频背景提取到 HomeHeroVideo 组件，通过 ssr: false 动态加载
// → SSR HTML 中不含 <video> → 微信 WebView 无法修改 → 消除 hydration mismatch
// 保留 'use client' 因为 next/dynamic ssr:false 必须在 Client Component 中

import dynamic from 'next/dynamic';
import Link from 'next/link';
import ArrowRightIcon from '@/components/shared/ArrowRightIcon';
import Eyebrow from '@/components/shared/Eyebrow';
import LineDrawDivider from '@/components/shared/LineDrawDivider';
import TextReveal from '@/components/shared/TextReveal';

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
        <div
          className="mb-6 animate-reveal"
          style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
        >
          <Eyebrow>AI-Powered Software Studio</Eyebrow>
        </div>

        {/* 标题 — LCP 元素：首帧即满不透明渲染，不加 animate-reveal 入场动画。
            reveal 从 opacity:0 起步 + 0.25s 延迟会让浏览器推迟计入 LCP（典型反模式）。
            入场动效保留在 eyebrow / divider / 副标题 / CTA 等非 LCP 元素上。 */}
        <h1 className="text-display tracking-tight">
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
          <LineDrawDivider delay={600} />
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
            <ArrowRightIcon />
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
