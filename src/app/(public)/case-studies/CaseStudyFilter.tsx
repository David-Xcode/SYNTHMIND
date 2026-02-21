'use client';

// ─── 案例筛选客户端组件 ───
// 按行业标签筛选案例列表

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AnimateOnScroll from '@/components/shared/AnimateOnScroll';
import { industries } from '@/data/industries';
import type { CaseStudy, IndustrySlug } from '@/data/case-studies';

interface CaseStudyFilterProps {
  caseStudies: CaseStudy[];
}

// 从 industries 数据动态生成筛选标签，避免硬编码导致数据不同步
const filters: { label: string; value: IndustrySlug | 'all' }[] = [
  { label: 'All', value: 'all' },
  ...industries.map((ind) => ({ label: ind.name, value: ind.slug })),
];

export default function CaseStudyFilter({ caseStudies }: CaseStudyFilterProps) {
  const [activeFilter, setActiveFilter] = useState<IndustrySlug | 'all'>('all');

  const filtered =
    activeFilter === 'all'
      ? caseStudies
      : caseStudies.filter((cs) => cs.industry === activeFilter);

  return (
    <section className="pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 筛选标签 */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={`text-sm font-light px-4 py-2 rounded-lg transition-all duration-300 ${
                activeFilter === filter.value
                  ? 'bg-[#3498db] text-white'
                  : 'bg-white/5 text-white/50 hover:text-white/80 hover:bg-white/10'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* 案例网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filtered.map((cs, index) => (
            <AnimateOnScroll key={cs.slug} delay={index * 80}>
              <Link href={`/case-studies/${cs.slug}`} className="block h-full">
                <article className="glass-card rounded-2xl p-8 h-full group cursor-pointer">
                  <div className="h-12 mb-6 flex items-center">
                    <Image
                      src={cs.logo}
                      alt={`${cs.title} logo`}
                      width={120}
                      height={36}
                      className="h-9 w-auto object-contain filter brightness-0 invert opacity-60 group-hover:opacity-90 transition-opacity"
                    />
                  </div>

                  <h3 className="text-lg font-medium text-white/90 mb-2">{cs.title}</h3>
                  <p className="text-gray-400 text-sm font-light leading-relaxed mb-4">
                    {cs.tagline}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-3 py-1 rounded-full font-light ${
                      cs.industryLabel
                        ? 'text-[#3498db] bg-[#3498db]/10 border border-[#3498db]/20'
                        : 'text-gray-400 bg-white/5 border border-white/10'
                    }`}>
                      {cs.industryLabel || 'Small Business'}
                    </span>
                    <span className="text-[#3498db] text-sm font-light group-hover:translate-x-1 transition-transform inline-block">
                      View &rarr;
                    </span>
                  </div>
                </article>
              </Link>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
