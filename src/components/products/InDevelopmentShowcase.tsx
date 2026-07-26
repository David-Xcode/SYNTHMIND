// ─── 旗舰在建产品模块 · Blueprint ───
// /products 第一段（2026-07-26 重排：从页尾附注升为页首旗舰叙事）：
// AI 原生保险经纪管理平台 + CSIO 会员双背书（名录 + 官方新闻稿引用）
// 单条目、文案内联 — 出现第二个开发中产品时再提取到 src/data/
// CSIO 身份用纯文字 chip + 官方外链（无 logo 资产授权，文字声明更合规可验证）
// 事实边界（spec §3.1 红线）：不公开内部代号、不提未合作 carrier、
// 在建功能一律进行时态；新闻稿原句引用不改写

import Link from 'next/link';
import CsioMemberBadge from '@/components/products/CsioMemberBadge';
import AnimateOnScroll from '@/components/shared/AnimateOnScroll';
import ArrowRightIcon from '@/components/shared/ArrowRightIcon';
import Card from '@/components/shared/Card';
import ExternalArrowIcon from '@/components/shared/ExternalArrowIcon';
import Eyebrow from '@/components/shared/Eyebrow';
import HighlightTag from '@/components/shared/HighlightTag';
import SectionTitle from '@/components/shared/SectionTitle';

// CSIO 官方会员名录 — 可验证的会员身份证明
const CSIO_DIRECTORY_URL = 'https://csio.com/membership/member-directory';
// CSIO 官方新闻稿（2026-07-21）— 七家新会员欢迎稿，含对 Synthmind 的一句话定位
const CSIO_PRESS_RELEASE_URL =
  'https://csio.com/news/csio-welcomes-seven-new-members-help-advance-industry-standards-and-connectivity';

// 平台能力标签 — 与地产聚合页的 highlights 同款样式
const HIGHLIGHTS = [
  'CSIO data standards',
  'AI document intake',
  'E-signature workflows',
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
            light="An AI-Native"
            bold="Brokerage Platform"
            subtitle="Taking everything we've learned shipping AI products and bringing it to Canada's insurance industry."
            size="md"
          />
        </AnimateOnScroll>

        <AnimateOnScroll delay={100}>
          <Card variant="container" accent>
            {/* CSIO 会员徽章行 — 名录验证 + 官方新闻稿双外链 */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-6">
              <CsioMemberBadge />
              <a
                href={CSIO_DIRECTORY_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Verify in the CSIO Member Directory (opens in a new tab)"
                className="inline-flex items-center gap-1 text-txt-tertiary hover:text-accent text-xs transition-colors duration-300"
              >
                Verify in the CSIO Member Directory
                <ExternalArrowIcon className="w-3 h-3" />
              </a>
              <a
                href={CSIO_PRESS_RELEASE_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Read the CSIO member announcement, July 2026 (opens in a new tab)"
                className="inline-flex items-center gap-1 text-txt-tertiary hover:text-accent text-xs transition-colors duration-300"
              >
                CSIO member announcement · July 2026
                <ExternalArrowIcon className="w-3 h-3" />
              </a>
            </div>

            <h3 className="text-title font-display font-semibold stretch-wide text-txt-primary tracking-tight">
              AI-Native Brokerage Management Platform
            </h3>
            {/* 地点是信息性 metadata → tertiary 档（quaternary 仅装饰） */}
            <Eyebrow tone="tertiary" className="block mt-1">
              Ontario, Canada
            </Eyebrow>

            {/* 官方背书引用块 — CSIO 新闻稿原句，不改写；
                左线用 border token 口径（accent 低 alpha），不新造材质 */}
            <blockquote
              cite={CSIO_PRESS_RELEASE_URL}
              className="mt-5 max-w-3xl border-l-2 border-accent/25 pl-4"
            >
              <p className="text-txt-secondary text-sm italic leading-relaxed">
                &ldquo;A Toronto-based technology company that develops
                AI-powered software to modernize how insurance organizations
                operate.&rdquo;
              </p>
              <cite className="mt-1.5 block text-xs not-italic text-txt-tertiary">
                —{' '}
                <a
                  href={CSIO_PRESS_RELEASE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors duration-300"
                >
                  CSIO member announcement, July 2026
                </a>
              </cite>
            </blockquote>

            <div className="mt-5 max-w-3xl space-y-3">
              <p className="text-txt-secondary text-sm leading-relaxed">
                Synthmind is a member of CSIO — the Centre for Study of
                Insurance Operations, the technology association of
                Canada&apos;s property &amp; casualty insurance industry. As a
                member we&apos;re building a CSIO-compliant, AI-native brokerage
                management system for Ontario insurance brokerages — designed
                around the industry&apos;s data standards from day one.
              </p>
              {/* 在建产品时态红线（spec §3.1）：designed to，不写完成时态 */}
              <p className="text-txt-secondary text-sm leading-relaxed">
                AI document intake is designed to turn carrier quote PDFs into
                structured records — with e-signature workflows, policy and
                client lifecycle management, and compliance-ready audit trails
                keeping the whole operation in one place.
              </p>
              {/* 宗旨句 — 产品设计原则对外化，扣主页 Unleash Human Potential */}
              <p className="text-txt-primary text-sm font-medium leading-relaxed">
                AI handles the paperwork — brokers make the decisions. Every
                automation keeps a human in charge of the judgment calls,
                because the goal isn&apos;t replacing brokers. It&apos;s
                unleashing them.
              </p>
            </div>

            {/* 能力标签 */}
            <div className="mt-5 flex flex-wrap gap-1.5">
              {HIGHLIGHTS.map((highlight) => (
                <HighlightTag key={highlight}>{highlight}</HighlightTag>
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
          </Card>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
