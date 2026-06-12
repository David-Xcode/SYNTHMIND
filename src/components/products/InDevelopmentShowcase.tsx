// ─── 开发中产品展示模块 · Neural ───
// /products 第三段「What's Next」：CSIO 会员背书 + 开发中的保险经纪管理平台
// 单条目、文案内联 — 出现第二个开发中产品时再提取到 src/data/
// CSIO 身份用纯文字 chip + 官方名录外链（无 logo 资产授权，文字声明更合规可验证）

import Link from 'next/link';
import AnimateOnScroll from '@/components/shared/AnimateOnScroll';
import ArrowRightIcon from '@/components/shared/ArrowRightIcon';
import GlassCard from '@/components/shared/GlassCard';
import SectionTitle from '@/components/shared/SectionTitle';

// CSIO 官方会员名录 — 可验证的会员身份证明
const CSIO_DIRECTORY_URL = 'https://csio.com/membership/member-directory';

// 平台能力标签 — 与 RealEstateShowcase 的 highlights 同款样式
const HIGHLIGHTS = [
  'AI document intake',
  'Policy & client workflows',
  'Industry data standards',
];

export default function InDevelopmentShowcase() {
  return (
    <section
      id="in-development"
      className="relative py-24 bg-bg-surface px-4 scroll-mt-24"
    >
      <hr className="ruled-line absolute top-0 left-0 right-0" />

      <div className="max-w-6xl mx-auto">
        <AnimateOnScroll>
          <SectionTitle
            eyebrow="WHAT'S NEXT"
            light="What We're"
            bold="Building"
            subtitle="Taking everything we've learned shipping AI products and bringing it to Canada's insurance industry."
            size="md"
          />
        </AnimateOnScroll>

        <AnimateOnScroll delay={100}>
          <GlassCard variant="spotlight">
            {/* CSIO 会员徽章行 */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="font-mono text-xs font-medium uppercase tracking-eyebrow text-accent bg-accent/10 border border-accent/25 rounded-md px-2.5 py-1">
                CSIO Member
              </span>
              <a
                href={CSIO_DIRECTORY_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Verify in the CSIO Member Directory (opens in a new tab)"
                className="inline-flex items-center gap-1 text-txt-tertiary hover:text-accent text-xs transition-colors duration-300"
              >
                Verify in the CSIO Member Directory
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  {/* 右上箭头 — 外链语义，区别于站内的 ArrowRightIcon */}
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 17L17 7m0 0H8m9 0v9"
                  />
                </svg>
              </a>
            </div>

            <h3 className="text-title font-display font-semibold text-txt-primary tracking-tight">
              AI-Driven Brokerage Management Platform
            </h3>
            <p className="mt-1 font-mono text-xs uppercase tracking-eyebrow text-txt-quaternary">
              Ontario, Canada
            </p>

            <div className="mt-4 max-w-3xl space-y-3">
              <p className="text-txt-secondary text-sm leading-relaxed">
                Synthmind is a member of CSIO — the Centre for Study of
                Insurance Operations, the technology association of
                Canada&apos;s property &amp; casualty insurance industry.
              </p>
              <p className="text-txt-secondary text-sm leading-relaxed">
                We&apos;re building an AI-driven brokerage management system for
                Ontario insurance brokerages — automating document intake,
                policy and client workflows, and compliance-ready record
                keeping, designed around the industry&apos;s data standards.
              </p>
            </div>

            {/* 能力标签 */}
            <div className="mt-5 flex flex-wrap gap-1.5">
              {HIGHLIGHTS.map((highlight) => (
                <span
                  key={highlight}
                  className="text-xs text-txt-secondary bg-accent/[0.06] border border-accent/[0.12] rounded-md px-2 py-0.5"
                >
                  {highlight}
                </span>
              ))}
            </div>

            {/* 唯一转化出口 — 开发中产品不外链，意向客户引导到联系页 */}
            <div className="mt-6">
              <Link
                href="/contact"
                className="inline-flex items-center gap-1 text-accent text-sm font-medium hover:gap-1.5 transition-all duration-300"
              >
                Building a brokerage? Talk to us
                <ArrowRightIcon className="w-3.5 h-3.5" />
              </Link>
            </div>
          </GlassCard>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
