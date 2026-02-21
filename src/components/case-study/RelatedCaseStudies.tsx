'use client';

// ─── 相关案例推荐 ───
// 展示同行业的其他案例（排除当前案例）

import Link from 'next/link';
import Image from 'next/image';
import AnimateOnScroll from '@/components/shared/AnimateOnScroll';
import type { CaseStudy } from '@/data/case-studies';

interface RelatedCaseStudiesProps {
  caseStudies: CaseStudy[];
}

export default function RelatedCaseStudies({ caseStudies }: RelatedCaseStudiesProps) {
  if (caseStudies.length === 0) return null;

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <AnimateOnScroll>
          <h3 className="text-sm text-white/40 uppercase tracking-widest font-light mb-8 text-center">
            Related Projects
          </h3>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {caseStudies.slice(0, 3).map((cs, index) => (
            <AnimateOnScroll key={cs.slug} delay={index * 100 + 100}>
              <Link href={`/case-studies/${cs.slug}`} className="block">
                <div className="glass-card rounded-2xl p-6 group cursor-pointer">
                  <div className="h-10 mb-4 flex items-center">
                    <Image
                      src={cs.logo}
                      alt={`${cs.title} logo`}
                      width={100}
                      height={30}
                      className="h-7 w-auto object-contain filter brightness-0 invert opacity-50 group-hover:opacity-80 transition-opacity"
                    />
                  </div>
                  <h4 className="text-sm font-medium text-white/80 mb-1">{cs.title}</h4>
                  <p className="text-gray-500 text-xs font-light">{cs.industryLabel || 'Small Business'}</p>
                </div>
              </Link>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
