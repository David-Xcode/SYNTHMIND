// ─── 地产营销站聚合详情页 · Blueprint ───
// 地产打包为一个项目（2026-07-26 定案）：与软件产品 case study 平级的
// 聚合详情页——整体叙事（同一经纪行长期合作）+ 可核实 stats + 每盘外链卡。
// 静态段优先于 [slug] 动态段，与 case-study 详情页路由无冲突。
// 旧盘 slug 的 308 重定向（next.config.js）与首页 marquee 地产 logo 都指到这里

import type { Metadata } from 'next';
import Breadcrumb from '@/components/layout/Breadcrumb';
import RealEstateSiteGrid from '@/components/products/RealEstateSiteGrid';
import AnimateOnScroll from '@/components/shared/AnimateOnScroll';
import CTABanner from '@/components/shared/CTABanner';
import PageHero from '@/components/shared/PageHero';
import SectionTitle from '@/components/shared/SectionTitle';
import StatCard from '@/components/shared/StatCard';
import { realEstateSites } from '@/data/real-estate';
import { BASE_OPEN_GRAPH, SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Real Estate Marketing Sites — Synthmind',
  description:
    'Live pre-construction marketing sites for GTA developments — custom design systems, lead capture, and SEO, delivered end to end for one Toronto brokerage.',
  alternates: { canonical: '/products/real-estate' },
  openGraph: {
    ...BASE_OPEN_GRAPH,
    url: `${SITE_URL}/products/real-estate`,
    title: 'Real Estate Marketing — Synthmind',
    description:
      'Pre-construction marketing sites for GTA developments, live in production.',
  },
};

// 可核实 stats（spec §4.2）：站点数从数据层派生；双语 = 家族内多站 EN+中文；
// 3 wk = UnionGlens 上线周期（数据层 highlight 同源口径）
const STATS = [
  { value: String(realEstateSites.length), label: 'Live sites' },
  { value: '2', label: 'Languages served' },
  { value: '3 wk', label: 'Fastest launch' },
];

export default function RealEstatePage() {
  return (
    <>
      <Breadcrumb
        items={[
          { label: 'Our Work', href: '/products' },
          { label: 'Real Estate' },
        ]}
      />

      <PageHero
        eyebrow="REAL ESTATE MARKETING"
        light="Property"
        bold="Launch Sites"
        subtitle="Pre-construction marketing sites delivered end to end for GTA developments — custom design systems, lead capture, and SEO, all live in production."
      />

      {/* hero 后第一章：不加 ruled-line，pt 收半档（IA v1 §2.4） */}
      <section className="relative pt-12 pb-24 px-4">
        <div className="max-w-6xl mx-auto">
          {/* 整体叙事 — 同一客户的长期合作（T-One 关系已公开：各盘页脚 +
              站内 T-ONE Submit case study），只陈述可数事实 */}
          <AnimateOnScroll>
            <p className="max-w-3xl text-txt-secondary leading-relaxed">
              Every site in this portfolio comes from a long-term partnership
              with one client — T-One Group Realty, a Toronto real estate
              brokerage. For each development we deliver the complete launch
              package: a design system built around the project&apos;s brand,
              lead pipelines with automated email follow-up, and search-ready
              structured data — deployed to production in weeks, not months.
            </p>
          </AnimateOnScroll>

          {/* 可核实统计行 */}
          <div className="mt-10 grid max-w-2xl grid-cols-1 gap-5 sm:grid-cols-3">
            {STATS.map((stat, index) => (
              <AnimateOnScroll key={stat.label} delay={index * 80 + 100}>
                <StatCard size="lg" value={stat.value} label={stat.label} />
              </AnimateOnScroll>
            ))}
          </div>

          {/* 每盘一卡，外链真实站点 — SectionTitle 补齐 h1→h2→h3 标题层级
              与全站图签节奏（缺 h2 会触发 axe heading-order） */}
          <div className="mt-16">
            {/* 无 sheetNo：本页只有这一个编号级 section，孤悬 01 暗示不存在的
                02（编号只用于真实序列）；章级 md + 左对齐现为 SectionTitle
                默认，显式传参已随标题三档制去掉 */}
            <AnimateOnScroll>
              <SectionTitle
                eyebrow="THE PORTFOLIO"
                light="Every Site,"
                bold="Live"
              />
            </AnimateOnScroll>
            <RealEstateSiteGrid />
          </div>
        </div>
      </section>

      <CTABanner
        headline="Launching a development?"
        subtitle="We deliver the complete marketing site — design system, lead capture, and SEO — ready for your VIP launch."
      />
    </>
  );
}
