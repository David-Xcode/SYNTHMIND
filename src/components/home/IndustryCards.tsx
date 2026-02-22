'use client';

// ─── 行业卡片网格 · Neural ───
// 大号 mono 编号 / 统一 accent / 无行业 icon

import Link from 'next/link';
import AnimateOnScroll from '@/components/shared/AnimateOnScroll';
import GlassCard from '@/components/shared/GlassCard';
import SectionTitle from '@/components/shared/SectionTitle';
import { industries } from '@/data/industries';

export default function IndustryCards() {
  return (
    <section className="relative py-32 bg-bg-base">
      <div className="absolute top-0 inset-x-0 ruled-line" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll>
          <SectionTitle
            eyebrow="Industries"
            light="Industries We"
            bold="Serve"
          />
        </AnimateOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {industries.map((industry, index) => {
            const number = String(index + 1).padStart(2, '0');

            return (
              <AnimateOnScroll key={industry.slug} delay={index * 80 + 100}>
                <Link href={`/industries/${industry.slug}`} className="block h-full rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base">
                  <GlassCard variant="elevated" className="h-full group cursor-pointer relative overflow-hidden">
                    {/* 大号 mono 编号 — 视觉焦点 */}
                    <span className="font-mono text-6xl md:text-7xl font-bold leading-none select-none text-accent/[0.07] group-hover:text-accent/[0.15] transition-colors duration-500">
                      {number}
                    </span>

                    <div className="mt-4">
                      <h3 className="text-base font-medium text-txt-primary mb-2 tracking-tight">
                        {industry.name}
                      </h3>
                      <p className="text-txt-tertiary text-sm leading-relaxed mb-4 line-clamp-2">
                        {industry.description}
                      </p>
                      <span className="inline-flex items-center gap-1.5 text-accent text-sm font-medium group-hover:gap-2.5 transition-all duration-300">
                        Learn more
                        {/* 箭头 — hover 右移 */}
                        <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                    </div>
                  </GlassCard>
                </Link>
              </AnimateOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
