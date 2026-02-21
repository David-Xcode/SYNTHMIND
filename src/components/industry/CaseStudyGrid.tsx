'use client';

// ─── 行业案例网格 ───
// 展示该行业下所有关联的案例研究

import Link from 'next/link';
import Image from 'next/image';
import AnimateOnScroll from '@/components/shared/AnimateOnScroll';
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
    <section className="py-20 bg-gradient-to-b from-[#252b3b] to-[#1a1f2e] px-4">
      <div className="max-w-6xl mx-auto">
        <AnimateOnScroll>
          <SectionTitle light="Our" bold="Work" subtitle={title !== 'Our Work in This Industry' ? title : undefined} />
        </AnimateOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {caseStudies.map((cs, index) => (
            <AnimateOnScroll key={cs.slug} delay={index * 100 + 200}>
              <Link href={`/case-studies/${cs.slug}`} className="block h-full">
                <article className="glass-card rounded-2xl p-8 h-full group cursor-pointer">
                  {/* Logo */}
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

                  {/* 技术栈预览（前 3 个） */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {cs.techStack.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="text-xs text-white/40 bg-white/5 px-2 py-1 rounded-md"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <span className="text-[#3498db] text-sm font-light group-hover:translate-x-1 transition-transform inline-block">
                    View case study &rarr;
                  </span>
                </article>
              </Link>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
