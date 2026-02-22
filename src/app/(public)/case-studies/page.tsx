// ─── 案例总览页 · Neural ───
// 展示所有案例，支持按行业筛选，风格与 About 页统一

import type { Metadata } from 'next';
import Breadcrumb from '@/components/layout/Breadcrumb';
import AnimateOnScroll from '@/components/shared/AnimateOnScroll';
import CTABanner from '@/components/shared/CTABanner';
import { caseStudies } from '@/data/case-studies';
import CaseStudyFilter from './CaseStudyFilter';

export const metadata: Metadata = {
  title: 'Case Studies | Synthmind',
  description:
    'Real AI-powered software solutions built for insurance, real estate, accounting, and construction businesses. See our work.',
  alternates: { canonical: '/case-studies' },
  openGraph: {
    title: 'Case Studies — Synthmind',
    description: 'Real solutions built for real businesses.',
  },
};

export default function CaseStudiesPage() {
  return (
    <>
      <Breadcrumb items={[{ label: 'Case Studies' }]} />

      {/* ── Hero — 与 About 页统一的叙事开场 ── */}
      <section className="relative pt-8 pb-24 px-4 overflow-hidden">
        {/* 微妙径向光晕背景 */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 40% at 50% 30%, rgba(74,159,229,0.04), transparent)',
          }}
        />

        <div className="relative max-w-3xl mx-auto text-center">
          <AnimateOnScroll>
            <span className="font-mono text-xs font-medium uppercase tracking-eyebrow text-accent">
              OUR PORTFOLIO
            </span>
          </AnimateOnScroll>

          <AnimateOnScroll delay={100}>
            <h1 className="mt-6 text-display leading-tight">
              <span className="font-sans font-light text-txt-primary">
                Real Solutions for{' '}
              </span>
              <span className="font-display font-semibold text-accent">
                Real Businesses.
              </span>
            </h1>
          </AnimateOnScroll>

          <AnimateOnScroll delay={200}>
            <p className="mt-6 text-subtitle text-txt-secondary leading-relaxed max-w-2xl mx-auto">
              From AI-powered document systems to modern marketing platforms —
              every project starts with understanding the industry and ends with
              working software.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ── Filter + Grid — 交替背景 + 分割线 ── */}
      <section className="relative py-24 bg-bg-surface px-4">
        <hr className="ruled-line absolute top-0 left-0 right-0" />
        <CaseStudyFilter caseStudies={caseStudies} />
      </section>

      {/* ── CTA ── */}
      <CTABanner
        headline="Ready to build something great?"
        subtitle="Insurance, real estate, accounting, construction — whatever your industry, we build software that works. Let's talk."
        buttonText="Start a Conversation"
      />
    </>
  );
}
