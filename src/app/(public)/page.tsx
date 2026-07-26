// ─── 首页 · Blueprint ───
// Lead Generation 着陆页：Hero 活蓝图 + 信任带 + 能力 / 精选作品 / 流程 + CTA
// SiteHeader + SiteFooter 由 (public)/layout.tsx 提供

import type { Metadata } from 'next';
import CapabilitiesSection from '@/components/home/CapabilitiesSection';
import FeaturedWork from '@/components/home/FeaturedWork';
import HomeHero from '@/components/home/HomeHero';
import ProcessSection from '@/components/home/ProcessSection';
import SocialProofBar from '@/components/home/SocialProofBar';
import CTABanner from '@/components/shared/CTABanner';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import JsonLd from '@/components/shared/JsonLd';
import { BASE_OPEN_GRAPH, SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Synthmind | AI-Powered Software Development & Automation',
  description:
    'Toronto-based software team building AI tools that actually work. Workflow automation, legacy modernization, and custom AI solutions.',
  openGraph: {
    ...BASE_OPEN_GRAPH,
    title: 'Synthmind | AI Solutions That Actually Work',
    description:
      'Practical AI tools for traditional industries, built in Toronto.',
  },
};

// Organization 结构化数据
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Synthmind',
  url: SITE_URL,
  logo: `${SITE_URL}/synthmind_logo.png`,
  description:
    'Toronto-based software company building AI-powered tools for traditional industries.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Toronto',
    addressRegion: 'ON',
    addressCountry: 'CA',
  },
  // contactPoint 已随 v7 邮箱撤展示移除（表单是唯一联系入口）
  // CSIO 会员身份 — 与 /products 的 InDevelopmentShowcase 模块对应
  memberOf: {
    '@type': 'Organization',
    name: 'CSIO — Centre for Study of Insurance Operations',
    url: 'https://csio.com',
  },
  sameAs: ['https://github.com/synthmind'],
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={organizationJsonLd} />
      <ErrorBoundary fallback={null}>
        <HomeHero />
      </ErrorBoundary>
      <ErrorBoundary fallback={null}>
        <SocialProofBar />
      </ErrorBoundary>
      <CapabilitiesSection />
      <FeaturedWork />
      <ProcessSection />
      <CTABanner
        headline="Ready to put AI to work?"
        subtitle="Tell us what eats your team's time — we'll sketch the blueprint."
      />
    </>
  );
}
