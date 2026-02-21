'use client';

// ─── 案例详情页头部 ───
// Logo + 标题 + 标语 + 在线地址链接

import Image from 'next/image';
import AnimateOnScroll from '@/components/shared/AnimateOnScroll';
import type { CaseStudy } from '@/data/case-studies';

interface CaseStudyHeroProps {
  caseStudy: CaseStudy;
}

export default function CaseStudyHero({ caseStudy }: CaseStudyHeroProps) {
  return (
    <section className="pt-8 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <AnimateOnScroll>
          <div className="text-center">
            {/* Logo */}
            <div className="h-16 mb-8 flex items-center justify-center">
              <Image
                src={caseStudy.logo}
                alt={`${caseStudy.title} logo`}
                width={180}
                height={48}
                className="h-12 w-auto object-contain filter brightness-0 invert opacity-80"
              />
            </div>

            <h1 className="text-4xl md:text-5xl font-extralight text-white mb-4 tracking-wide">
              {caseStudy.title}
            </h1>
            <p className="text-lg text-gray-300 font-light leading-relaxed max-w-2xl mx-auto mb-6">
              {caseStudy.tagline}
            </p>

            {/* 行业标签（可选） + 在线链接 */}
            <div className="flex items-center justify-center gap-4">
              {caseStudy.industryLabel && (
                <span className="text-xs text-[#3498db] bg-[#3498db]/10 border border-[#3498db]/20 px-3 py-1 rounded-full font-light">
                  {caseStudy.industryLabel}
                </span>
              )}
              <a
                href={caseStudy.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white/50 hover:text-[#3498db] transition-colors font-light"
              >
                Visit site &rarr;
              </a>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
