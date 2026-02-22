'use client';

// ─── 行业案例网格 · Neural ───
// 去饱和行业色 / 无 mouseGlow / 冷色 tech tag

import Image from 'next/image';
import Link from 'next/link';
import AnimateOnScroll from '@/components/shared/AnimateOnScroll';
import GlassCard from '@/components/shared/GlassCard';
import SectionTitle from '@/components/shared/SectionTitle';
import type { CaseStudy } from '@/data/case-studies';

interface CaseStudyGridProps {
  caseStudies: CaseStudy[];
  title?: string;
}

export default function CaseStudyGrid({
  caseStudies,
  title = 'Our Work in This Industry',
}: CaseStudyGridProps) {
  if (caseStudies.length === 0) return null;

  return (
    <section className="py-24 bg-bg-base px-4">
      <div className="max-w-6xl mx-auto">
        <AnimateOnScroll>
          <SectionTitle
            light="Our"
            bold="Work"
            subtitle={title !== 'Our Work in This Industry' ? title : undefined}
            eyebrow="Case Studies"
          />
        </AnimateOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {caseStudies.map((cs, index) => (
            <AnimateOnScroll key={cs.slug} delay={index * 80 + 100}>
              <Link href={`/case-studies/${cs.slug}`} className="block h-full">
                <GlassCard
                  variant="elevated"
                  className="h-full group cursor-pointer"
                >
                  <div className="h-10 mb-5 flex items-center">
                    <Image
                      src={cs.logo}
                      alt={`${cs.title} logo`}
                      width={120}
                      height={36}
                      className="h-8 w-auto object-contain filter brightness-0 invert opacity-50 group-hover:opacity-90 transition-opacity duration-300"
                    />
                  </div>

                  <h3 className="text-base font-medium text-txt-primary mb-2 tracking-tight">
                    {cs.title}
                  </h3>
                  <p className="text-txt-tertiary text-sm leading-relaxed mb-4">
                    {cs.tagline}
                  </p>

                  {/* 技术栈预览 */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {cs.techStack.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="text-xs text-txt-quaternary bg-bg-muted px-2 py-0.5 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <span className="inline-flex items-center gap-1 text-accent text-sm font-medium group-hover:gap-1.5 transition-all duration-300">
                    View case study
                    <svg
                      className="w-3.5 h-3.5"
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
                </GlassCard>
              </Link>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
