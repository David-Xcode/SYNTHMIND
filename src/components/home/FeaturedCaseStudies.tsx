'use client';

// ─── 精选案例展示 · Neural ───
// 等宽三列 / 统一 accent badge / GlassCard spotlight

import Image from 'next/image';
import Link from 'next/link';
import AnimateOnScroll from '@/components/shared/AnimateOnScroll';
import GlassCard from '@/components/shared/GlassCard';
import SectionTitle from '@/components/shared/SectionTitle';
import { getFeaturedCaseStudies } from '@/data/case-studies';

export default function FeaturedCaseStudies() {
  const featured = getFeaturedCaseStudies();

  return (
    <section className="relative py-32 bg-bg-surface">
      {/* 顶部分割线 */}
      <div className="absolute top-0 inset-x-0 ruled-line" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll>
          <SectionTitle
            eyebrow="Case Studies"
            light="Featured"
            bold="Projects"
            subtitle="Real solutions built for real businesses."
          />
        </AnimateOnScroll>

        {/* 等宽三列网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((cs, index) => (
            <AnimateOnScroll key={cs.slug} delay={index * 100 + 100}>
              <Link href={`/case-studies/${cs.slug}`} className="block h-full">
                <GlassCard
                  variant="spotlight"
                  as="article"
                  className="h-full group cursor-pointer"
                >
                  {/* Logo */}
                  <div className="h-10 mb-5 flex items-center">
                    <Image
                      src={cs.logo}
                      alt={`${cs.title} logo`}
                      width={120}
                      height={36}
                      className="h-8 w-auto object-contain filter brightness-0 invert opacity-50 group-hover:opacity-90 transition-opacity duration-300"
                    />
                  </div>

                  {/* 标题 + 标语 */}
                  <h3 className="text-base font-medium text-txt-primary mb-2 tracking-tight">
                    {cs.title}
                  </h3>
                  <p className="text-txt-tertiary text-sm leading-relaxed mb-4 line-clamp-2">
                    {cs.tagline}
                  </p>

                  {/* 行业标签 — 统一 accent */}
                  <span className="inline-block text-xs px-3 py-1 rounded-full border text-accent bg-accent/10 border-accent/20">
                    {cs.industryLabel || 'Small Business'}
                  </span>

                  {/* 查看链接 */}
                  <div className="mt-5">
                    <span className="inline-flex items-center gap-1.5 text-accent text-sm font-medium group-hover:gap-2.5 transition-all duration-300">
                      View case study
                      <svg
                        className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
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
                    </span>
                  </div>
                </GlassCard>
              </Link>
            </AnimateOnScroll>
          ))}
        </div>

        {/* 查看全部 */}
        <AnimateOnScroll delay={400}>
          <div className="text-center mt-12">
            <Link href="/case-studies" className="btn-secondary px-6 py-2.5">
              View All Projects
            </Link>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
