// ─── 旗舰在建产品模块 · Blueprint ───
// /products 第一段：AI 原生 BMS 的入口卡（2026-07-27 精简——完整介绍、
// CSIO eDocs 标准详解与认证进度已迁到 /products/brokerage-platform，
// 本卡只留身份背书 + 一句话定位 + 能力标签 + 进入链接）
// CSIO 身份行走共享 <CsioMemberRow />（徽章 + 名录验证 + 官方新闻稿双外链）
// 事实边界（完整版见平台详情页文件头）：不公开内部代号与客户身份；已签约方是
// 经纪行不是保险公司；在建功能用名词式规格或 "designed to" 时态

import Link from 'next/link';
import CsioMemberRow from '@/components/products/CsioMemberRow';
import AnimateOnScroll from '@/components/shared/AnimateOnScroll';
import ArrowRightIcon from '@/components/shared/ArrowRightIcon';
import Card from '@/components/shared/Card';
import Eyebrow from '@/components/shared/Eyebrow';
import HighlightTag from '@/components/shared/HighlightTag';
import SectionTitle from '@/components/shared/SectionTitle';

// 平台能力标签 — 详情页有全景，这里只点最有辨识度的四项
const HIGHLIGHTS = [
  'CSIO eDocs ingestion',
  'AI in-house underwriting',
  'Playbook automation',
  'Human-in-the-loop by design',
];

export default function InDevelopmentShowcase() {
  return (
    <section id="in-development" className="relative py-24 px-4 scroll-mt-24">
      <hr className="ruled-line absolute top-0 left-0 right-0" />

      <div className="max-w-6xl mx-auto">
        <AnimateOnScroll>
          <SectionTitle
            sheetNo="01"
            eyebrow="WHAT WE'RE BUILDING"
            light="The AI-Native"
            bold="Brokerage Platform"
            subtitle="Taking everything we've learned shipping AI products and bringing it to Canada's insurance industry."
            size="md"
          />
        </AnimateOnScroll>

        <AnimateOnScroll delay={100}>
          <Card variant="container" accent>
            {/* CSIO 会员身份行 — 徽章 + 名录验证 + 官方新闻稿背书 */}
            <CsioMemberRow className="mb-6" />

            {/* 卡片标题不复述 section 标题（h2 已是产品名）——这里给定位句；
                动名词而非过去分词：在建产品不写「已重建完成」 */}
            <h3 className="text-title font-display font-semibold stretch-wide text-txt-primary tracking-tight">
              Rebuilding brokerage management on the industry standard
            </h3>
            {/* 地点是信息性 metadata → tertiary 档（quaternary 仅装饰） */}
            <Eyebrow tone="tertiary" className="block mt-1">
              Ontario, Canada
            </Eyebrow>

            <p className="mt-4 max-w-3xl text-txt-secondary text-sm leading-relaxed">
              A brokerage management system for Ontario insurance brokerages,
              designed around CSIO data standards from day one. AI handles the
              paperwork — brokers make the decisions.
            </p>

            {/* 能力标签 */}
            <div className="mt-5 flex flex-wrap gap-1.5">
              {HIGHLIGHTS.map((highlight) => (
                <HighlightTag key={highlight}>{highlight}</HighlightTag>
              ))}
            </div>

            {/* 主出口 = 详情页；意向客户的转化出口在详情页底部 CTA */}
            <div className="mt-6">
              <Link
                href="/products/brokerage-platform"
                className="inline-flex items-center gap-1 text-accent text-sm font-medium hover:gap-1.5 transition-all duration-300"
              >
                Explore the platform
                <ArrowRightIcon className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Card>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
