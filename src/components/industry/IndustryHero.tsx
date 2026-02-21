'use client';

// ─── 行业页头部 ───
// 行业名 + 描述 + CTA

import Link from 'next/link';
import AnimateOnScroll from '@/components/shared/AnimateOnScroll';
import type { Industry } from '@/data/industries';

interface IndustryHeroProps {
  industry: Industry;
}

export default function IndustryHero({ industry }: IndustryHeroProps) {
  return (
    <section className="pt-8 pb-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <AnimateOnScroll>
          <h1 className="text-4xl md:text-5xl font-extralight text-white mb-6 tracking-wide">
            {industry.headline}
          </h1>
          <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto mb-8" />
          <p className="text-lg text-gray-300 font-light leading-relaxed max-w-3xl mx-auto mb-10">
            {industry.description}
          </p>
          <Link
            href="/contact"
            className="inline-block bg-[#3498db] hover:bg-[#2980b9] text-white font-light px-8 py-3 rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#3498db]/25"
          >
            Get a Free Assessment
          </Link>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
