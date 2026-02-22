// ─── 案例详情模板页 ───
// 动态路由 + generateStaticParams 实现完全静态生成

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/layout/Breadcrumb';
import CaseStudyHero from '@/components/case-study/CaseStudyHero';
import ChallengeSection from '@/components/case-study/ChallengeSection';
import SolutionSection from '@/components/case-study/SolutionSection';
import TechStackBadges from '@/components/case-study/TechStackBadges';
import ResultsSection from '@/components/case-study/ResultsSection';
import RelatedCaseStudies from '@/components/case-study/RelatedCaseStudies';
import CTABanner from '@/components/shared/CTABanner';
import JsonLd from '@/components/shared/JsonLd';
import { getCaseStudyBySlug, getCaseStudiesByIndustry, getFeaturedCaseStudies, getAllSlugs } from '@/data/case-studies';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const cs = getCaseStudyBySlug(slug);
  if (!cs) return {};

  return {
    title: `${cs.title} Case Study | Synthmind`,
    description: cs.tagline,
    alternates: {
      canonical: `/case-studies/${slug}`,
    },
    openGraph: {
      title: `${cs.title} — Built by Synthmind`,
      description: cs.tagline,
      type: 'article',
    },
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const cs = getCaseStudyBySlug(slug);
  if (!cs) notFound();

  // 有行业分类时按行业查找，无行业时用 featured 做 fallback
  const related = (
    cs.industry
      ? getCaseStudiesByIndustry(cs.industry)
      : getFeaturedCaseStudies()
  ).filter((item) => item.slug !== cs.slug);

  // CreativeWork 结构化数据
  const caseStudyJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: `${cs.title} Case Study`,
    description: cs.tagline,
    url: `https://synthmind.ca/case-studies/${slug}`,
    author: {
      '@type': 'Organization',
      name: 'Synthmind',
    },
    keywords: cs.techStack.join(', '),
  };

  return (
    <>
      <JsonLd data={caseStudyJsonLd} />
      <Breadcrumb
        items={[
          { label: 'Case Studies', href: '/case-studies' },
          { label: cs.title },
        ]}
      />
      <CaseStudyHero caseStudy={cs} />
      <ChallengeSection challenges={cs.challenge} />
      <SolutionSection solutions={cs.solution} />
      <TechStackBadges techStack={cs.techStack} />
      <ResultsSection results={cs.results} />
      <CTABanner headline="Want similar results for your business?" />
      <RelatedCaseStudies caseStudies={related} />
    </>
  );
}
