// ─── 首页（重新设计）───
// 从单页滚动布局重构为 Lead Generation 着陆页
// SiteHeader + SiteFooter 由 (public)/layout.tsx 提供

import type { Metadata } from 'next';
import HomeHero from '@/components/home/HomeHero';
import SocialProofBar from '@/components/home/SocialProofBar';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import JsonLd from '@/components/shared/JsonLd';

export const metadata: Metadata = {
  title: 'Synthmind | AI-Powered Software Studio',
  description:
    'Toronto-based AI startup building tools that actually work. Workflow automation, legacy modernization, and custom AI solutions.',
  openGraph: {
    title: 'Synthmind | AI Solutions That Actually Work',
    description:
      'AI startup building tools that actually work. No corporate fluff — just working software.',
  },
};

// Organization 结构化数据
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Synthmind',
  url: 'https://synthmind.ca',
  logo: 'https://synthmind.ca/synthmind_logo.png',
  description:
    'Toronto-based AI startup building software for traditional industries.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Toronto',
    addressRegion: 'ON',
    addressCountry: 'CA',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'David.wang@synthmind.ca',
    contactType: 'customer service',
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
    </>
  );
}
