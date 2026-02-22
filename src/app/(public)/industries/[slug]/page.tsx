// ─── 行业模板页 ───
// 动态路由 + generateStaticParams 实现完全静态生成

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/layout/Breadcrumb';
import IndustryHero from '@/components/industry/IndustryHero';
import PainPoints from '@/components/industry/PainPoints';
import CaseStudyGrid from '@/components/industry/CaseStudyGrid';
import CTABanner from '@/components/shared/CTABanner';
import JsonLd from '@/components/shared/JsonLd';
import { getIndustryBySlug, getAllIndustrySlugs } from '@/data/industries';
import { getCaseStudiesByIndustry } from '@/data/case-studies';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllIndustrySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const industry = getIndustryBySlug(slug);
  if (!industry) return {};

  return {
    title: `${industry.name} Solutions | Synthmind`,
    description: industry.description,
    alternates: {
      canonical: `/industries/${slug}`,
    },
    openGraph: {
      title: `${industry.name} — AI Solutions by Synthmind`,
      description: industry.description,
    },
  };
}

export default async function IndustryPage({ params }: PageProps) {
  const { slug } = await params;
  const industry = getIndustryBySlug(slug);
  if (!industry) notFound();

  // industry 已在 notFound() 之后确认存在，用 industry.slug 代替不安全的强制类型转换
  const relatedCaseStudies = getCaseStudiesByIndustry(industry.slug);

  // Service 结构化数据
  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${industry.name} AI Solutions`,
    description: industry.description,
    url: `https://synthmind.ca/industries/${slug}`,
    provider: {
      '@type': 'Organization',
      name: 'Synthmind',
      url: 'https://synthmind.ca',
    },
    areaServed: {
      '@type': 'Country',
      name: 'Canada',
    },
  };

  return (
    <>
      <JsonLd data={serviceJsonLd} />
      <Breadcrumb
        items={[
          { label: 'Industries', href: '/#industries' },
          { label: industry.name },
        ]}
      />
      <IndustryHero industry={industry} />
      <PainPoints painPoints={industry.painPoints} />
      <CaseStudyGrid caseStudies={relatedCaseStudies} />
      <CTABanner headline={industry.ctaText} />
    </>
  );
}
