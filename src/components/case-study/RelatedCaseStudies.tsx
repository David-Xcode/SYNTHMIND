'use client';

// ─── 相关案例推荐 · Neural ───
// 蓝色 accent 链接 / 冷色边框

import Link from 'next/link';
import Image from 'next/image';
import AnimateOnScroll from '@/components/shared/AnimateOnScroll';
import type { CaseStudy } from '@/data/case-studies';

interface RelatedCaseStudiesProps {
  caseStudies: CaseStudy[];
}

export default function RelatedCaseStudies({ caseStudies }: RelatedCaseStudiesProps) {
  if (caseStudies.length === 0) return null;

  // 限制最多 2 个
  const displayed = caseStudies.slice(0, 2);

  return (
    <section className="py-16 px-4 bg-bg-base">
      <div className="max-w-3xl mx-auto">
        <AnimateOnScroll>
          <h3 className="font-mono text-xs text-txt-quaternary uppercase tracking-eyebrow font-medium mb-8 text-center">
            Related Projects
          </h3>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {displayed.map((cs, index) => (
            <AnimateOnScroll key={cs.slug} delay={index * 100}>
              <Link href={`/case-studies/${cs.slug}`} className="block">
                <div className="card-elevated p-5 group cursor-pointer flex items-center gap-5">
                  {/* 左侧 Logo */}
                  <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-bg-surface border border-[var(--border-default)] flex items-center justify-center">
                    <Image
                      src={cs.logo}
                      alt={`${cs.title} logo`}
                      width={48}
                      height={48}
                      className="w-8 h-8 object-contain filter brightness-0 invert opacity-50 group-hover:opacity-80 transition-opacity"
                    />
                  </div>

                  {/* 右侧内容 */}
                  <div className="min-w-0">
                    <h4 className="text-sm font-medium text-txt-primary mb-0.5 truncate">{cs.title}</h4>
                    <p className="text-txt-quaternary text-xs mb-2">{cs.industryLabel || 'Small Business'}</p>
                    <span className="inline-flex items-center gap-1 text-accent text-xs font-medium group-hover:gap-1.5 transition-all duration-300">
                      View
                      <svg className="w-3 h-3" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
