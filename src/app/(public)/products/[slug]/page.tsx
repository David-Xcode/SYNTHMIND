// ─── 产品详情模板页 ───
// 动态路由 + generateStaticParams 实现完全静态生成

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CaseStudyHero from '@/components/case-study/CaseStudyHero';
import ChallengeSection from '@/components/case-study/ChallengeSection';
import ResultsSection from '@/components/case-study/ResultsSection';
import SolutionSection from '@/components/case-study/SolutionSection';
import TechStackBadges from '@/components/case-study/TechStackBadges';
import Breadcrumb from '@/components/layout/Breadcrumb';
import JsonLd from '@/components/shared/JsonLd';
import { getAllSlugs, getCaseStudyBySlug } from '@/data/case-studies';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const cs = getCaseStudyBySlug(slug);
  if (!cs) return {};

  return {
    title: `${cs.title} | Synthmind`,
    description: cs.tagline,
    alternates: {
      canonical: `/products/${slug}`,
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

  // CreativeWork 结构化数据
  const caseStudyJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: cs.title,
    description: cs.tagline,
    url: `https://synthmind.ca/products/${slug}`,
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
          { label: 'Products', href: '/products' },
          { label: cs.title },
        ]}
      />
      <CaseStudyHero caseStudy={cs} />
      <ChallengeSection challenges={cs.challenge} />
      <SolutionSection solutions={cs.solution} />
      <TechStackBadges techStack={cs.techStack} />
      <ResultsSection results={cs.results} />
    </>
  );
}
