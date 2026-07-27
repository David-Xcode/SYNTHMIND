// ─── 产品详情模板页 ───
// 动态路由 + generateStaticParams 实现完全静态生成

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CaseStudyHero from '@/components/case-study/CaseStudyHero';
import CaseStudyNav from '@/components/case-study/CaseStudyNav';
import ResultsSection from '@/components/case-study/ResultsSection';
import TechStackBadges from '@/components/case-study/TechStackBadges';
import TextListSection from '@/components/case-study/TextListSection';
import Breadcrumb from '@/components/layout/Breadcrumb';
import CTABanner from '@/components/shared/CTABanner';
import JsonLd from '@/components/shared/JsonLd';
import {
  getAdjacentCaseStudies,
  getAllSlugs,
  getCaseStudyBySlug,
} from '@/data/case-studies';
import { BASE_OPEN_GRAPH, SITE_URL } from '@/lib/constants';

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
      ...BASE_OPEN_GRAPH,
      title: `${cs.title} — Built by Synthmind`,
      description: cs.tagline,
      type: 'article',
      url: `${SITE_URL}/products/${slug}`,
    },
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const cs = getCaseStudyBySlug(slug);
  if (!cs) notFound();

  // 页尾闭环：相邻案例（顺序派生，首尾环绕）
  const { prev, next } = getAdjacentCaseStudies(slug);

  // CreativeWork 结构化数据
  const caseStudyJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: cs.title,
    description: cs.tagline,
    url: `${SITE_URL}/products/${slug}`,
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
        items={[{ label: 'Our Work', href: '/products' }, { label: cs.title }]}
      />
      <CaseStudyHero caseStudy={cs} />
      {/* v7：Challenge/SolutionSection 薄包装（仅传字面量）已内联省掉 */}
      <TextListSection
        sheetNo="01"
        eyebrow="CHALLENGE"
        titleLight="The"
        titleBold="Challenge"
        items={cs.challenge}
      />
      <TextListSection
        sheetNo="02"
        eyebrow="SOLUTION"
        titleLight="The"
        titleBold="Solution"
        items={cs.solution}
      />
      <TechStackBadges techStack={cs.techStack} />
      <ResultsSection results={cs.results} />
      {/* 页尾闭环 — 下一站 + 转化出口（IA v1 §4.4） */}
      <CaseStudyNav prev={prev} next={next} />
      <CTABanner
        headline="Have a workflow like this?"
        subtitle="Tell us what your team repeats every week — we will tell you honestly whether software can take it off their hands."
      />
    </>
  );
}
