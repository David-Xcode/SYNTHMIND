// ─── 首页 Hero · Blueprint ───
// 左文案 + 右活蓝图的不对称分栏；视频背景已移除（LCP 减重 + 消除微信 WebView 包袱）
// Server Component — 动效全部走 CSS（animate-reveal / hero-tilt）与 client 叶子（TextReveal）

import Link from 'next/link';
import ArrowRightIcon from '@/components/shared/ArrowRightIcon';
import BlueprintGrid from '@/components/shared/BlueprintGrid';
import SheetLabel from '@/components/shared/SheetLabel';
import TextReveal from '@/components/shared/TextReveal';
import HomeHeroBlueprint from './HomeHeroBlueprint';

export default function HomeHero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-bg-base">
      {/* 蓝图基准网格 — hero 专属，径向渐隐 */}
      <BlueprintGrid />

      {/* 背景光晕装饰 */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {/* 主光晕 — 顶部偏左 */}
        <div className="absolute -top-32 left-1/4 h-[480px] w-[480px] rounded-full bg-accent/[0.04] blur-[120px]" />
        {/* 辅助光晕 — 右下 */}
        <div className="absolute top-1/3 right-[10%] h-[320px] w-[320px] rounded-full bg-accent/[0.03] blur-[100px]" />
      </div>

      {/* 内容区 — 不对称分栏（左 7 / 右 5） */}
      <div className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-6 pt-28 pb-24 lg:grid-cols-[7fr_5fr]">
        {/* 左：文案 */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          {/* 图签眉标 */}
          <div
            className="mb-6 animate-reveal"
            style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
          >
            <SheetLabel>AI-Powered Software Studio</SheetLabel>
          </div>

          {/* 标题 — LCP 元素：首帧即满不透明渲染，不加入场动画（沿用既有 LCP 纪律） */}
          <h1 className="text-display tracking-tight">
            <span className="font-sans font-light text-txt-primary">
              Unleash Human{' '}
            </span>
            <span className="font-display font-semibold stretch-wide text-txt-primary">
              Potential
            </span>
            <br className="hidden sm:block" />
            <span className="font-sans font-light text-txt-primary">
              {' '}
              with{' '}
            </span>
            <span className="font-display font-semibold stretch-wide text-accent">
              AI.
            </span>
          </h1>

          {/* 副标题 — 逐词入场 */}
          <TextReveal
            text="A Toronto-based startup building AI tools that actually work — workflow automation, legacy modernization, and custom solutions for traditional industries."
            className="mt-6 max-w-xl text-subtitle text-txt-secondary"
            delay={400}
            stagger={40}
          />

          {/* CTA 按钮 */}
          <div
            className="mt-10 flex flex-wrap justify-center gap-4 animate-reveal lg:justify-start"
            style={{ animationDelay: '0.7s', animationFillMode: 'both' }}
          >
            <Link
              href="/contact"
              className="btn-primary px-7 py-3 text-sm sm:text-base"
            >
              Book a Free Consultation
              <ArrowRightIcon />
            </Link>
            <Link
              href="/products"
              className="btn-secondary px-7 py-3 text-sm sm:text-base"
            >
              View Our Work
            </Link>
          </div>
        </div>

        {/* 右：活蓝图 — 滚动时从绘图桌上抬起（hero-tilt scrub，桌面端专属） */}
        <div className="hero-tilt hidden lg:block">
          <HomeHeroBlueprint />
        </div>
      </div>

      {/* 角落坐标标注 — 藏在细节里的多伦多坐标 */}
      <span
        className="annotation absolute bottom-8 left-8 hidden md:block"
        aria-hidden="true"
      >
        TORONTO, CA / 43.65°N 79.38°W
      </span>

      {/* 底部渐变过渡 */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-40"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-bg-base to-transparent" />
      </div>

      {/* 滚动指示器 */}
      <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="flex h-8 w-5 items-start justify-center rounded-full border border-txt-quaternary/40 p-1.5">
          <div className="h-2 w-0.5 animate-scroll-pulse rounded-full bg-txt-quaternary" />
        </div>
      </div>
    </section>
  );
}
