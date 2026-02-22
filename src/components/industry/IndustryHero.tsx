'use client';

// ─── 行业页头部 · Neural ───
// 去饱和材质行业色 / 无 radial glow / 大号装饰图标保留

import Link from 'next/link';
import AnimateOnScroll from '@/components/shared/AnimateOnScroll';
import { industryIcons } from '@/components/shared/IndustryIcons';
import type { Industry } from '@/data/industries';

// Neural 行业色映射
const industryConfig: Record<string, { color: string }> = {
  insurance: { color: 'text-industry-insurance' },
  'real-estate': { color: 'text-industry-realestate' },
  'accounting-tax': { color: 'text-industry-accounting' },
  construction: { color: 'text-industry-construction' },
};

interface IndustryHeroProps {
  industry: Industry;
}

export default function IndustryHero({ industry }: IndustryHeroProps) {
  const config = industryConfig[industry.slug] || industryConfig.insurance;
  const IconComponent = industryIcons[industry.slug] || industryIcons.insurance;

  return (
    <section className="relative pt-8 pb-24 px-4 overflow-hidden">
      {/* 大号装饰性行业图标 (半透明背景) */}
      <div className="absolute top-8 right-[10%] pointer-events-none opacity-[0.03] hidden lg:block">
        <IconComponent className="w-80 h-80" />
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        <AnimateOnScroll>
          <div
            className={`inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border border-accent/[0.14] bg-bg-surface text-xs font-medium ${config.color}`}
          >
            <IconComponent className="w-3.5 h-3.5" />
            {industry.name}
          </div>

          <h1 className="font-display font-semibold text-headline text-txt-primary mb-5 tracking-tight">
            {industry.headline}
          </h1>
          <p className="text-base md:text-lg text-txt-secondary leading-relaxed max-w-3xl mx-auto mb-10">
            {industry.description}
          </p>
          <Link href="/contact" className="btn-primary px-7 py-3">
            Get a Free Assessment
            <svg
              className="w-4 h-4"
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
        </AnimateOnScroll>
      </div>
    </section>
  );
}
