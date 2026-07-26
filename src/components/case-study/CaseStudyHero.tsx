// ─── 案例详情页头部 · Blueprint ───
// Logo badge + Archivo 宽体标题 + 外链
// h1/tagline 不进 AnimateOnScroll — 详情页 LCP 元素不加入场动画（CLAUDE.md 性能纪律）
// Server Component：自身无 hooks/事件，交互全在 client 叶子（AnimateOnScroll）

import Image from 'next/image';
import AnimateOnScroll from '@/components/shared/AnimateOnScroll';
import type { CaseStudy } from '@/data/case-studies';

interface CaseStudyHeroProps {
  caseStudy: CaseStudy;
}

export default function CaseStudyHero({ caseStudy }: CaseStudyHeroProps) {
  return (
    <section className="relative pt-8 pb-16 px-4">
      <div className="relative max-w-4xl mx-auto text-center">
        {/* Logo badge — 蓝色边框 */}
        <AnimateOnScroll>
          <div className="inline-flex items-center gap-3 mb-8 px-4 py-2 rounded-full border border-accent/[0.14] bg-bg-surface">
            <Image
              src={caseStudy.logo}
              alt={`${caseStudy.title} logo`}
              width={100}
              height={28}
              className="h-6 w-auto object-contain filter brightness-0 invert opacity-70"
              suppressHydrationWarning
            />
          </div>
        </AnimateOnScroll>

        {/* 标题 + 副标题 — LCP 候选，首帧即满不透明渲染 */}
        <h1 className="font-display font-semibold stretch-wide text-headline text-txt-primary mb-4 tracking-tight">
          {caseStudy.title}
        </h1>
        <p className="text-lg text-txt-secondary leading-relaxed max-w-2xl mx-auto mb-6">
          {caseStudy.tagline}
        </p>

        {/* 在线链接 */}
        <AnimateOnScroll delay={150}>
          <a
            href={caseStudy.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-txt-tertiary hover:text-accent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg-base rounded-lg"
          >
            Visit site
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
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
