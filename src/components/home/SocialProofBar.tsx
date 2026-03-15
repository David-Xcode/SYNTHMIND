// ─── 客户 Logo 展示条 · Neural ───
// 双容器无缝 marquee / JetBrains Mono 标签
// 4× 重复 → ~4416px 轨道宽度，覆盖 4K (3840px)
// Server Component — CSS marquee 不需要 JS，AnimateOnScroll 作为 Client 子组件自动处理

import Image from 'next/image';
import Link from 'next/link';
import AnimateOnScroll from '@/components/shared/AnimateOnScroll';
import { caseStudies } from '@/data/case-studies';

const REPEAT_COUNT = 4;

// 模块级常量 — 替代 useMemo，Server Component 中每次请求只执行一次
const logos = Array.from({ length: REPEAT_COUNT }, () => caseStudies).flat();

export default function SocialProofBar() {

  return (
    <section className="py-16 bg-bg-base overflow-hidden">
      <AnimateOnScroll>
        <p className="text-center font-mono text-txt-tertiary text-xs font-medium tracking-eyebrow uppercase mb-8">
          Trusted by businesses across industries
        </p>
      </AnimateOnScroll>

      {/* Marquee 容器 */}
      <div className="relative">
        {/* 左侧渐变遮罩 */}
        <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-bg-base to-transparent z-10 pointer-events-none" />
        {/* 右侧渐变遮罩 */}
        <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-bg-base to-transparent z-10 pointer-events-none" />

        {/* 双容器滚动轨道 */}
        <div className="flex items-center w-max animate-marquee hover:[animation-play-state:paused]">
          {/* 第一份轨道 — 可点击跳转到对应项目页 */}
          <div className="flex items-center gap-16 shrink-0 pr-16">
            {logos.map((cs, i) => (
              <Link
                key={`a-${cs.slug}-${i}`}
                href={`/products/${cs.slug}`}
                className="flex-shrink-0 transition-all duration-300 hover:scale-105"
              >
                <Image
                  src={cs.logo}
                  alt={`View ${cs.title} project`}
                  width={120}
                  height={36}
                  className="h-8 w-auto object-contain filter brightness-0 invert opacity-30 hover:opacity-80 hover:drop-shadow-accent transition-all duration-300"
                />
              </Link>
            ))}
          </div>
          {/* 第二份（无缝循环）— aria-hidden + tabIndex 避免重复聚焦 */}
          <div
            className="flex items-center gap-16 shrink-0 pr-16"
            aria-hidden="true"
          >
            {logos.map((cs, i) => (
              <Link
                key={`b-${cs.slug}-${i}`}
                href={`/products/${cs.slug}`}
                tabIndex={-1}
                className="flex-shrink-0 transition-all duration-300 hover:scale-105"
              >
                <Image
                  src={cs.logo}
                  alt=""
                  width={120}
                  height={36}
                  className="h-8 w-auto object-contain filter brightness-0 invert opacity-30 hover:opacity-80 hover:drop-shadow-accent transition-all duration-300"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
