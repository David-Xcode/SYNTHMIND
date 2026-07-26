// ─── 首页 · Blueprint ───
// 极简着陆页（2026-07-26 瘦身定案）：Hero 活蓝图 + 信任带，到此为止——
// 能力/作品/流程叙事全部收进 /products（Our Work），转化入口 = Hero 双按钮 +
// 可点击 marquee logo。SiteHeader + SiteFooter 由 (public)/layout.tsx 提供

import type { Metadata } from 'next';
import HomeHero from '@/components/home/HomeHero';
import SocialProofBar from '@/components/home/SocialProofBar';
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
    </>
  );
}
