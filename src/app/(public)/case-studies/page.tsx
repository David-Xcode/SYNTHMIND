// ─── 案例总览页 ───
// 展示所有案例，支持按行业筛选

import type { Metadata } from 'next';
import Breadcrumb from '@/components/layout/Breadcrumb';
import SectionTitle from '@/components/shared/SectionTitle';
import AnimateOnScroll from '@/components/shared/AnimateOnScroll';
import CaseStudyGrid from '@/components/industry/CaseStudyGrid';
import CTABanner from '@/components/shared/CTABanner';
import { caseStudies } from '@/data/case-studies';
import CaseStudyFilter from './CaseStudyFilter';

export const metadata: Metadata = {
  title: 'Case Studies | Synthmind',
  description:
    'Real AI-powered software solutions built for insurance, real estate, accounting, and construction businesses. See our work.',
  openGraph: {
    title: 'Case Studies — Synthmind',
    description: 'Real solutions built for real businesses.',
  },
};

export default function CaseStudiesPage() {
  return (
    <>
      <Breadcrumb items={[{ label: 'Case Studies' }]} />

      <section className="pt-8 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <AnimateOnScroll>
            <SectionTitle
              light="Our"
              bold="Work"
              subtitle="Real solutions built for real businesses across multiple industries."
            />
          </AnimateOnScroll>
        </div>
      </section>

      <CaseStudyFilter caseStudies={caseStudies} />

      <CTABanner headline="Ready to build something great?" />
    </>
  );
}
