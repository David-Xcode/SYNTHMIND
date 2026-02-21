'use client';

// ─── 客户 Logo 展示条 ───
// 改造自原 Products.tsx，展示所有客户 Logo 作为社会信任信号

import Image from 'next/image';
import AnimateOnScroll from '@/components/shared/AnimateOnScroll';
import { caseStudies } from '@/data/case-studies';

export default function SocialProofBar() {
  return (
    <section className="py-20 bg-gradient-to-b from-[#252b3b] to-[#1a1f2e]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll>
          <p className="text-center text-white/30 text-sm font-light tracking-widest uppercase mb-12">
            Trusted by businesses across industries
          </p>
        </AnimateOnScroll>

        <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:justify-center items-center gap-8 sm:gap-12 lg:gap-20">
          {caseStudies.map((cs, index) => (
            <AnimateOnScroll key={cs.slug} delay={index * 100 + 100}>
              <div className="flex justify-center">
                <Image
                  src={cs.logo}
                  alt={`${cs.title} logo`}
                  width={120}
                  height={36}
                  className="h-9 w-auto object-contain filter brightness-0 invert opacity-40 hover:opacity-90 transition-opacity duration-300"
                />
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
