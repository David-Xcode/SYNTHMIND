// ─── Our Work 总览页 · Blueprint ───
// 两段式结构（2026-07-26 重排：旗舰在建产品从页尾升到页首）：
// ① AI-Native BMS 旗舰模块（CSIO 会员 + 官方新闻稿双背书）
// ② Shipped 作品网格：5 软件产品（进详情页）+ 1 地产项目卡（进聚合详情页）
// 产品卡 = 图纸卡：S.NN 图纸编号 + crop marks 角标

import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/layout/Breadcrumb';
import CaseStudyCard from '@/components/products/CaseStudyCard';
import InDevelopmentShowcase from '@/components/products/InDevelopmentShowcase';
import AnimateOnScroll from '@/components/shared/AnimateOnScroll';
import Card from '@/components/shared/Card';
import CardActionRow from '@/components/shared/CardActionRow';
import Eyebrow from '@/components/shared/Eyebrow';
import PageHero from '@/components/shared/PageHero';
import SectionTitle from '@/components/shared/SectionTitle';
import { caseStudies } from '@/data/case-studies';
import { realEstateSites } from '@/data/real-estate';
import { BASE_OPEN_GRAPH, SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Our Work — Synthmind | Real Solutions for Real Businesses',
  description:
    "The AI-native brokerage platform we are building for Canada's insurance industry, and the software already live and running businesses today.",
  alternates: { canonical: '/products' },
  openGraph: {
    ...BASE_OPEN_GRAPH,
    url: `${SITE_URL}/products`,
    title: 'Our Work — Synthmind',
    description: 'Real solutions built for real businesses.',
  },
};

export default function ProductsPage() {
  return (
    <>
      <Breadcrumb items={[{ label: 'Our Work' }]} />

      <PageHero
        eyebrow="OUR WORK"
        light="Real Solutions for"
        bold="Real Businesses."
        subtitle="The platform we're building for Canada's insurance industry, and every project we've already shipped."
      />

      {/* ── 旗舰在建产品 · CSIO 会员背书 ──
          afterHero：hero 后第一章不加线 + pt 收半档（IA v1 §2.4） */}
      <InDevelopmentShowcase afterHero />

      {/* ── Shipped 作品网格 ── */}
      <section className="relative py-24 px-4">
        <hr className="ruled-line absolute top-0 left-0 right-0" />
        <div className="max-w-6xl mx-auto">
          <AnimateOnScroll>
            <SectionTitle
              sheetNo="02"
              eyebrow="SHIPPED WORK"
              light="Work That"
              bold="Shipped"
              subtitle="Every project below is live and running someone's business today."
            />
          </AnimateOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {caseStudies.map((cs, index) => (
              <AnimateOnScroll key={cs.slug} delay={index * 80 + 100}>
                <CaseStudyCard
                  caseStudy={cs}
                  sheetNo={`S.${String(index + 1).padStart(2, '0')}`}
                />
              </AnimateOnScroll>
            ))}

            {/* 第 6 卡 — 地产项目卡：全部地产盘打包为一个项目，进聚合详情页。
                卡头 mono 注记 = 真实数量序列（结构性编号，不占自由标注预算） */}
            <AnimateOnScroll delay={caseStudies.length * 80 + 100}>
              {/* 不加 aria-label：卡内容（注记/标题/描述）自描述，覆盖它反而
                  让可访问名丢失细节，且与五张软件卡的行为不一致 */}
              <Link href="/products/real-estate" className="block h-full group">
                <Card
                  variant="interactive"
                  sheetNo={`S.${String(caseStudies.length + 1).padStart(2, '0')}`}
                  cropMarks
                  className="h-full flex flex-col"
                >
                  <div className="h-10 mb-4 flex items-center">
                    <span className="font-mono text-sm font-semibold text-accent">
                      {String(realEstateSites.length).padStart(2, '0')} / LIVE
                      SITES
                    </span>
                  </div>

                  {/* 行业眉标 — 与五张软件卡同形态（CaseStudyCard） */}
                  <Eyebrow tone="tertiary" className="block mb-2">
                    Real estate
                  </Eyebrow>

                  <h3 className="text-base font-medium text-txt-primary mb-2 tracking-tight">
                    Real Estate Launch Sites
                  </h3>
                  <p className="text-txt-secondary text-base leading-relaxed mb-4">
                    Pre-construction marketing sites for GTA developments — one
                    brokerage client, every launch live in production.
                  </p>

                  <div className="mt-auto flex items-center justify-end">
                    <CardActionRow>View the portfolio</CardActionRow>
                  </div>
                </Card>
              </Link>
            </AnimateOnScroll>
          </div>
        </div>
      </section>
    </>
  );
}
