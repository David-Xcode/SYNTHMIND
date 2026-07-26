// ─── 首页精选作品 · Blueprint ───
// 从 case-studies 数据层取 3 个代表作，spotlight 卡片链到详情页
// 数据不在此硬编码 — 单一事实源在 src/data/case-studies.ts

import Image from 'next/image';
import Link from 'next/link';
import AnimateOnScroll from '@/components/shared/AnimateOnScroll';
import ArrowRightIcon from '@/components/shared/ArrowRightIcon';
import GlassCard from '@/components/shared/GlassCard';
import SectionTitle from '@/components/shared/SectionTitle';
import { caseStudies } from '@/data/case-studies';

// 精选顺序：小企业覆盖面 / AI 建筑文档 / AI 保险助手
const FEATURED_SLUGS = ['easy-sign', 't-one-submit', 'brokertool-ai'];

const featured = FEATURED_SLUGS.map((slug) =>
  caseStudies.find((cs) => cs.slug === slug),
).filter((cs): cs is NonNullable<typeof cs> => Boolean(cs));

export default function FeaturedWork() {
  return (
    <section className="relative bg-bg-base px-4 py-24">
      <hr className="ruled-line absolute top-0 left-0 right-0" />
      <div className="mx-auto max-w-6xl">
        <AnimateOnScroll>
          <SectionTitle
            sheetNo="02"
            eyebrow="SELECTED WORK"
            light="Software That"
            bold="Shipped"
            subtitle="Every project below is live and running someone's business today."
            size="md"
          />
        </AnimateOnScroll>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {featured.map((cs, index) => (
            <AnimateOnScroll key={cs.slug} delay={index * 80 + 100}>
              <Link href={`/products/${cs.slug}`} className="block h-full">
                <GlassCard
                  variant="spotlight"
                  className="group h-full cursor-pointer"
                >
                  <div className="mb-5 flex h-10 items-center">
                    <Image
                      src={cs.logo}
                      alt={`${cs.title} logo`}
                      width={120}
                      height={36}
                      className="h-8 w-auto object-contain opacity-50 brightness-0 invert filter transition-opacity duration-300 group-hover:opacity-90"
                      suppressHydrationWarning
                    />
                  </div>
                  <h3 className="mb-2 text-base font-medium tracking-tight text-txt-primary">
                    {cs.title}
                  </h3>
                  <p className="mb-4 text-sm leading-relaxed text-txt-tertiary">
                    {cs.tagline}
                  </p>
                  <div className="flex items-center justify-end">
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-accent transition-all duration-300 group-hover:gap-1.5">
                      View case study
                      <ArrowRightIcon className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </GlassCard>
              </Link>
            </AnimateOnScroll>
          ))}
        </div>

        <AnimateOnScroll delay={300} className="mt-10 text-center">
          <Link href="/products" className="btn-secondary px-7 py-3">
            View all products
          </Link>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
