// ─── 首页 · Blueprint ───
// 说服链着陆页（IA v1 §3，2026-07-27 定案）：首页从「名片」扩成「整站缩略图」，
// 每段回答一个问题并给出去处——
//   Hero（动）你们做什么 → 信任带（半动）过渡 → 01 旗舰 BMS（静）我们在建什么
//   → 02 精选案例（半动）凭什么信你 → 03 方法带（静）你们怎么做 → CTA（动）
// 2026-07-26 的「Hero + 信任带即结束」瘦身版已退役：高价值访客（加拿大经纪行，
// 由 CSIO 名录/新闻稿导入）此前在首页完全看不到 BMS 的存在，要两跳才到得了。
// 01 段与 /products 消费同一个 <InDevelopmentShowcase />，不复制 JSX。
// SiteHeader + SiteFooter 由 (public)/layout.tsx 提供

import type { Metadata } from 'next';
import FeaturedWork from '@/components/home/FeaturedWork';
import HomeHero from '@/components/home/HomeHero';
import ProcessStrip from '@/components/home/ProcessStrip';
import SocialProofBar from '@/components/home/SocialProofBar';
import InDevelopmentShowcase from '@/components/products/InDevelopmentShowcase';
import CTABanner from '@/components/shared/CTABanner';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import JsonLd from '@/components/shared/JsonLd';
import { BASE_OPEN_GRAPH, SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Synthmind | AI-Powered Software Development & Automation',
  description:
    'Toronto-based software team building AI tools that actually work. Workflow automation, legacy modernization, and custom AI solutions.',
  // 根 layout 已不再声明 canonical（避免未覆写的页面静默指向首页），
  // 首页自报，与其余 6 个内容页同口径（2026-07-27 审查修复）
  alternates: { canonical: '/' },
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

      {/* 01 — 旗舰在建产品（BrokerTool.ai）。首页副标题先说清「这是给谁的」：
          访客可能是从 CSIO 名录点进来的经纪行，第一句就要接住。
          ⚠️ 不要复述卡内定位句（"An AI-native brokerage management system for
          Canadian insurance brokerages…"）——两者同屏相距不到一屏，重复开头
          会读成卡壳 */}
      <InDevelopmentShowcase subtitle="Built for Canadian brokerages by a CSIO member — the industry's data standard is where we start, not an integration we bolt on later." />

      {/* 02 — 已上线精选：凭什么信你 */}
      <FeaturedWork />

      {/* 03 — 方法带：你们怎么做 */}
      <ProcessStrip />

      <CTABanner
        headline="Tell us where your week goes."
        subtitle="Insurance, real estate, accounting, construction — if your team is losing hours to paperwork, that is the conversation we want to have."
      />
    </>
  );
}
