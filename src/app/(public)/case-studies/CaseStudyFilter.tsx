'use client';

// ─── 案例筛选客户端组件 · Neural ───
// 蓝色滑动指示器 / Neural 行业色 / 无 mouseGlow

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AnimateOnScroll from '@/components/shared/AnimateOnScroll';
import GlassCard from '@/components/shared/GlassCard';
import { industries } from '@/data/industries';
import type { CaseStudy, IndustrySlug } from '@/data/case-studies';

interface CaseStudyFilterProps {
  caseStudies: CaseStudy[];
}

// Neural 行业 badge 色
const industryBadgeColors: Record<string, string> = {
  insurance: 'text-industry-insurance bg-industry-insurance/10 border-industry-insurance/20',
  'real-estate': 'text-industry-realestate bg-industry-realestate/10 border-industry-realestate/20',
  'accounting-tax': 'text-industry-accounting bg-industry-accounting/10 border-industry-accounting/20',
  construction: 'text-industry-construction bg-industry-construction/10 border-industry-construction/20',
};

const filters: { label: string; value: IndustrySlug | 'all' }[] = [
  { label: 'All', value: 'all' },
  ...industries.map((ind) => ({ label: ind.name, value: ind.slug })),
];

export default function CaseStudyFilter({ caseStudies }: CaseStudyFilterProps) {
  const [activeFilter, setActiveFilter] = useState<IndustrySlug | 'all'>('all');
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const filterRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  // 计算滑动指示器位置
  const updateIndicator = useCallback(() => {
    const el = filterRefs.current.get(activeFilter);
    if (el) {
      const parent = el.parentElement;
      if (parent) {
        const parentRect = parent.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        setIndicatorStyle({
          left: elRect.left - parentRect.left,
          width: elRect.width,
        });
      }
    }
  }, [activeFilter]);

  useEffect(() => {
    updateIndicator();
    // debounce resize handler（150ms）— 避免 layout thrashing
    let timer: ReturnType<typeof setTimeout>;
    const debouncedUpdate = () => {
      clearTimeout(timer);
      timer = setTimeout(updateIndicator, 150);
    };
    window.addEventListener('resize', debouncedUpdate);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', debouncedUpdate);
    };
  }, [updateIndicator]);

  const filtered =
    activeFilter === 'all'
      ? caseStudies
      : caseStudies.filter((cs) => cs.industry === activeFilter);

  // 计算每个筛选器的数量
  const getCounts = (value: IndustrySlug | 'all') =>
    value === 'all'
      ? caseStudies.length
      : caseStudies.filter((cs) => cs.industry === value).length;

  return (
    <section className="pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 筛选标签 — 蓝色滑动指示器 */}
        <div className="relative flex flex-wrap justify-center gap-2 mb-12">
          {/* 滑动蓝色背景 */}
          <div
            className="absolute top-0 h-full bg-accent/10 border border-accent/20 rounded-lg transition-all duration-300 ease-out-expo pointer-events-none"
            style={{
              left: `${indicatorStyle.left}px`,
              width: `${indicatorStyle.width}px`,
            }}
          />

          {filters.map((filter) => (
            <button
              key={filter.value}
              ref={(el) => { if (el) filterRefs.current.set(filter.value, el); }}
              onClick={() => setActiveFilter(filter.value)}
              className={`relative text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200 ${
                activeFilter === filter.value
                  ? 'text-accent'
                  : 'text-txt-quaternary hover:text-txt-secondary'
              }`}
            >
              {filter.label}
              <span className={`ml-1.5 text-xs ${
                activeFilter === filter.value ? 'text-accent/60' : 'text-txt-quaternary/50'
              }`}>
                {getCounts(filter.value)}
              </span>
            </button>
          ))}
        </div>

        {/* 案例网格 — reveal 动画 */}
        <div
          key={activeFilter}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-reveal"
        >
          {filtered.map((cs, index) => {
            const badgeColor = cs.industry ? industryBadgeColors[cs.industry] : 'text-txt-tertiary bg-bg-muted border-accent/[0.12]';
            return (
              <AnimateOnScroll key={cs.slug} delay={index * 60}>
                <Link href={`/case-studies/${cs.slug}`} className="block h-full">
                  <GlassCard variant="elevated" className="h-full group cursor-pointer">
                    <div className="h-10 mb-5 flex items-center">
                      <Image
                        src={cs.logo}
                        alt={`${cs.title} logo`}
                        width={120}
                        height={36}
                        className="h-8 w-auto object-contain filter brightness-0 invert opacity-50 group-hover:opacity-90 transition-opacity duration-300"
                      />
                    </div>

                    <h3 className="text-base font-medium text-txt-primary mb-2 tracking-tight">{cs.title}</h3>
                    <p className="text-txt-tertiary text-sm leading-relaxed mb-4">
                      {cs.tagline}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2.5 py-1 rounded-full border ${badgeColor}`}>
                        {cs.industryLabel || 'Small Business'}
                      </span>
                      <span className="inline-flex items-center gap-1 text-accent text-sm font-medium group-hover:gap-1.5 transition-all duration-300">
                        View
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
