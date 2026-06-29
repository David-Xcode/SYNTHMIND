// ─── 客户 Logo 展示条 · Neural ───
// 双容器无缝 marquee / JetBrains Mono 标签
// 9 个 logo × 4 重复 → 轨道宽度覆盖 4K (3840px)
// Server Component — CSS marquee 不需要 JS，AnimateOnScroll 作为 Client 子组件自动处理

import Image from 'next/image';
import Link from 'next/link';
import AnimateOnScroll from '@/components/shared/AnimateOnScroll';
import Eyebrow from '@/components/shared/Eyebrow';
import { caseStudies } from '@/data/case-studies';
import { realEstateSites } from '@/data/real-estate';

const REPEAT_COUNT = 4;

// 软件产品 → 各自详情页；地产盘 → products 页 Real Estate 模块锚点
const logoItems = [
  ...caseStudies.map((cs) => ({
    key: cs.slug,
    src: cs.logo,
    label: cs.title,
    href: `/products/${cs.slug}`,
  })),
  ...realEstateSites.map((site) => ({
    key: site.slug,
    src: site.logo,
    label: site.name,
    href: '/products#real-estate',
  })),
];

// 模块级常量 — 替代 useMemo，Server Component 中每次请求只执行一次
const logos = Array.from({ length: REPEAT_COUNT }, () => logoItems).flat();

export default function SocialProofBar() {
  return (
    <section className="py-16 bg-bg-base overflow-hidden">
      <AnimateOnScroll>
        <Eyebrow tone="tertiary" className="block text-center mb-8">
          Trusted by businesses across industries
        </Eyebrow>
      </AnimateOnScroll>

      {/* Marquee 容器 */}
      <div className="relative">
        {/* 左侧渐变遮罩 */}
        <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-bg-base to-transparent z-10 pointer-events-none" />
        {/* 右侧渐变遮罩 */}
        <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-bg-base to-transparent z-10 pointer-events-none" />

        {/* 双容器滚动轨道 */}
        <div className="flex items-center w-max animate-marquee hover:[animation-play-state:paused]">
          {/* 第一份轨道 — 可点击跳转到对应项目 */}
          <div className="flex items-center gap-16 shrink-0 pr-16">
            {logos.map((item, i) => (
              <Link
                key={`a-${item.key}-${i}`}
                href={item.href}
                className="flex-shrink-0 transition-all duration-300 hover:scale-105"
              >
                <Image
                  src={item.src}
                  alt={`View ${item.label} project`}
                  width={120}
                  height={36}
                  className="h-8 w-auto object-contain filter brightness-0 invert opacity-30 hover:opacity-80 hover:drop-shadow-accent transition-all duration-300"
                  suppressHydrationWarning
                />
              </Link>
            ))}
          </div>
          {/* 第二份（无缝循环）— aria-hidden + tabIndex 避免重复聚焦 */}
          <div
            className="flex items-center gap-16 shrink-0 pr-16"
            aria-hidden="true"
          >
            {logos.map((item, i) => (
              <Link
                key={`b-${item.key}-${i}`}
                href={item.href}
                tabIndex={-1}
                className="flex-shrink-0 transition-all duration-300 hover:scale-105"
              >
                <Image
                  src={item.src}
                  alt=""
                  width={120}
                  height={36}
                  className="h-8 w-auto object-contain filter brightness-0 invert opacity-30 hover:opacity-80 hover:drop-shadow-accent transition-all duration-300"
                  suppressHydrationWarning
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
