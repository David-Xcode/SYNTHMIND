// ─── AI 原生 BMS 平台详情页 · Blueprint ───
// 在建旗舰产品的完整介绍（2026-07-27 新建）：CSIO 标准与 eDocs 认证进度为
// 页面重心，其次是平台能力全景与「能力汇入一个平台」的产品蓝图。
// 静态段，与 [slug] 动态段共存（同 /products/real-estate 先例）。
//
// 🚨 事实边界（对外材料红线，改文案前必读）：
// ① 客户身份绝不点名——已上线的经纪运营系统服务的是真实经纪行，品牌名/生产
//    数据量（客户数、case 数、账号数）未获书面授权不得出现；承保商白名单同理
//    （那是客户的业务数据，不是我们的合作声明）
// ② CSIO 认证 = 进行时：阶段 1 技术测试已跑通（官方样本批端到端），阶段 2
//    申请与 demo 未完成、证书未颁——只能写 "in progress"，禁写 "certified"；
//    连 "CSIO-compliant" 也避开，改用 "built to CSIO standards"（未认证前
//    合规声明同样会被 CSIO 反问）
// ③ 已签约方 = **经纪行（brokerages）不是保险公司（carriers）**——carrier
//    不使用 brokerage 管理系统，写成 carrier 是行业逻辑硬伤（2026-07-27 David
//    确认）；不点名、不写数字
// ④ 在建产品时态：能力描述一律名词式规格或 "designed to / being built to"，
//    禁用「系统已经在做 X」的完成时态叙述

import type { Metadata } from 'next';
import Breadcrumb from '@/components/layout/Breadcrumb';
import CsioMemberRow from '@/components/products/CsioMemberRow';
import AnimateOnScroll from '@/components/shared/AnimateOnScroll';
import Card from '@/components/shared/Card';
import CTABanner from '@/components/shared/CTABanner';
import HighlightTag from '@/components/shared/HighlightTag';
import PageHero from '@/components/shared/PageHero';
import SectionTitle from '@/components/shared/SectionTitle';
import SheetLabel from '@/components/shared/SheetLabel';
import {
  BASE_OPEN_GRAPH,
  CSIO_PRESS_RELEASE_URL,
  SITE_URL,
} from '@/lib/constants';

export const metadata: Metadata = {
  title: 'AI-Native Brokerage Platform — Synthmind',
  description:
    "The brokerage management system we're building for Ontario insurance brokerages — CSIO eDocs ingestion, AI document review, and playbook automation.",
  alternates: { canonical: '/products/brokerage-platform' },
  openGraph: {
    ...BASE_OPEN_GRAPH,
    url: `${SITE_URL}/products/brokerage-platform`,
    title: 'AI-Native Brokerage Platform — Synthmind',
    description:
      "The brokerage management system we're building for Ontario, on CSIO standards.",
  },
};

// CSIO eDocs 五个官方段名（申请表口径，Personal lines）
const EDOCS_SEGMENTS = [
  'Billing',
  'Cancellation & Lapse',
  'Policy Transaction',
  'Underwriting Request',
  'Claims',
];

// 平台能力全景 — 名词式规格描述（在建产品时态纪律，见文件头 ④）；
// David 点名的 AI 核保与 AI 助理排前两位
const CAPABILITIES = [
  {
    title: 'AI in-house underwriting',
    body: 'Before a file goes to the carrier, AI is designed to read every document in it — quotes, applications, driver records, licences, ownerships — and cross-check them against a library of validation rules. Dates that disagree, missing endorsements, VIN check-digit errors, conviction records that do not line up: surfaced before a human opens the file.',
    tags: ['Document extraction', 'Cross-file validation', 'Pre-bind review'],
  },
  {
    title: 'An AI assistant with a job description',
    body: 'Fixed playbooks, not open-ended chat. The assistant is being built to pull the client file, prepare a cancellation, prep an endorsement for signature, and file the paperwork where it belongs. Regulated actions — binding a policy, stamping a policy number — stay with a licensed human by design.',
    tags: ['Playbook automation', 'Human-in-the-loop', 'Tool allow-list'],
  },
  {
    title: 'Policy & client lifecycle',
    body: 'Clients, policies, coverages, renewals, and claims in one record instead of five systems — an append-only activity log behind every change, and e-signature workflows that file executed forms against the policy they belong to.',
    tags: ['Quote to bind', 'E-signature', 'Append-only audit log'],
  },
  {
    title: 'Broker workflow engine',
    body: 'Defined states with an owner and a deadline: assignment, follow-up, confirmation documents, approval records. The compliance trail becomes a by-product of doing the work rather than a second job at month end.',
    tags: ['Task states', 'Approvals', 'Compliance records'],
  },
  {
    title: 'Client communications',
    body: 'Policy events routed to the client and their broker as the right message, logged for audit. When a regulatory change or a renewal cycle calls for it, the same system is being built to handle targeted outreach to the book — no exporting a spreadsheet to a marketing tool.',
    tags: ['Event-driven notices', 'Producer routing', 'Send-once guarantees'],
  },
  {
    title: 'Back office',
    body: "Commission tracking and payroll for the brokerage itself, built to CRA requirements — the operational plumbing that usually lives in spreadsheets and a bookkeeper's inbox.",
    tags: ['Commission tracking', 'Payroll', 'Statement reconciliation'],
  },
];

export default function BrokeragePlatformPage() {
  return (
    <>
      <Breadcrumb
        items={[
          { label: 'Our Work', href: '/products' },
          { label: 'Brokerage Platform' },
        ]}
      />

      <PageHero
        eyebrow="WHAT WE'RE BUILDING"
        light="The AI-Native"
        bold="Brokerage Platform"
        subtitle="CSIO eDocs that arrive filed and readable, AI review before a submission leaves the office, and an assistant that keeps the judgment calls with your brokers."
      />

      {/* ── 01 CSIO 标准与 eDocs（页面重心） ──
          hero 后第一章：不加 ruled-line，pt 收半档（IA v1 §2.4） */}
      <section className="relative pt-12 pb-24 px-4">
        <div className="max-w-6xl mx-auto">
          <AnimateOnScroll>
            <SectionTitle
              sheetNo="01"
              eyebrow="CSIO STANDARDS"
              light="Built on the"
              bold="Industry Standard"
              subtitle="Canada's property & casualty industry already agreed on how carriers and brokerages exchange data. We build to that agreement instead of around it."
            />
          </AnimateOnScroll>

          <AnimateOnScroll delay={100}>
            {/* accent 竖线交给引用块 — 卡与块两条平行竖线会重复重点标记 */}
            <Card variant="container">
              <CsioMemberRow />

              {/* 官方背书引用块 — CSIO 新闻稿原句，不改写 */}
              <blockquote
                cite={CSIO_PRESS_RELEASE_URL}
                className="mt-5 max-w-3xl border-l-2 border-accent/25 pl-4"
              >
                {/* 不加 italic：Manrope 无斜体字面，浏览器会合成伪斜体 */}
                <p className="text-txt-secondary text-base leading-relaxed">
                  &ldquo;A Toronto-based technology company that develops
                  AI-powered software to modernize how insurance organizations
                  operate.&rdquo;
                </p>
                <cite className="mt-2 block text-xs not-italic text-txt-tertiary">
                  — CSIO member announcement, July 2026
                </cite>
              </blockquote>

              <p className="mt-5 max-w-3xl text-txt-secondary text-base leading-relaxed">
                Synthmind is a member of CSIO — the Centre for Study of
                Insurance Operations, the technology association of
                Canada&apos;s property &amp; casualty insurance industry.
                Membership is a seat at the table where those data standards are
                written, and building to them is how a brokerage system stops
                being a silo.
              </p>
            </Card>
          </AnimateOnScroll>

          {/* eDocs 文档下载标准 — 本页重点。
              连续叙事出卡直排压墙（IA v1 §4.5 / 判据一）：三段正文不是可数
              实体，包卡只会让它与上面的 CSIO 实体背书卡抢同一层级。
              小节眉标走 SheetLabel（无编号——01 之下不再起第二套序列） */}
          <AnimateOnScroll delay={150}>
            <div className="mt-10 max-w-3xl">
              <SheetLabel>EDOCS DELIVERY</SheetLabel>
              <h3 className="mt-4 text-title font-display font-semibold stretch-wide text-txt-primary tracking-tight">
                Carrier documents, delivered to the standard
              </h3>

              <div className="mt-5 space-y-4">
                <p className="text-txt-secondary text-base leading-relaxed">
                  When a carrier issues a document — a billing notice, a
                  cancellation, a renewal package — the CSIO eDocs standard
                  defines how it reaches the brokerage: delivered electronically
                  through CSIOnet, tagged with an industry document code, ready
                  to be filed against the policy it belongs to. No portal
                  logins, no inbox archaeology, no re-keying.
                </p>
                <p className="text-txt-secondary text-base leading-relaxed">
                  Our ingestion pipeline runs the full standard exchange — sign
                  in, list, retrieve, store — and then does the two things a
                  broker actually feels. It translates the raw document code
                  into a plain-English description and paragraph, so the
                  document announces what it is without anyone opening the PDF.
                  And it files that document against the matching policy, rather
                  than dropping it in an unmatched pile for someone to sort out
                  on Friday afternoon.
                </p>
                <p className="text-txt-secondary text-base leading-relaxed">
                  We built support for all five eDocs segments in personal
                  lines, on the current code list and the legacy codes still in
                  circulation:
                </p>
              </div>

              <div className="mt-5 flex flex-wrap gap-1.5">
                {EDOCS_SEGMENTS.map((segment) => (
                  <HighlightTag key={segment}>{segment}</HighlightTag>
                ))}
              </div>
            </div>
          </AnimateOnScroll>

          {/* 认证进度 — 阶段 1 实测成绩 + 诚实的阶段 2 状态（同上出卡直排） */}
          <AnimateOnScroll delay={200}>
            <div className="mt-10 max-w-3xl">
              <SheetLabel>CERTIFICATION STATUS</SheetLabel>
              <h3 className="mt-4 text-title font-display font-semibold stretch-wide text-txt-primary tracking-tight">
                Certification: the technical phase is behind us
              </h3>

              <p className="mt-5 text-txt-secondary text-base leading-relaxed">
                CSIO delivered its official test batch to our certification
                mailbox — 42 sample eDocs spanning current and legacy document
                codes, including the multi-attachment and non-policy-level edge
                cases the standard is careful about. Every one of the 42 was
                retrieved, decoded, described, and filed end to end. Nothing
                landed in the unmatched queue. Formal eDocs certification is in
                progress; what remains is process, not engineering.
              </p>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ── 02 平台能力全景 ── */}
      <section className="relative py-24 px-4">
        <hr className="ruled-line absolute top-0 left-0 right-0" />
        <div className="max-w-6xl mx-auto">
          <AnimateOnScroll>
            <SectionTitle
              sheetNo="02"
              eyebrow="PLATFORM"
              light="One System for the"
              bold="Whole Brokerage"
              subtitle="Six capability areas, designed as one system rather than five separate tools that email each other. Here's what each is being built to do."
            />
          </AnimateOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {CAPABILITIES.map((capability, index) => (
              <AnimateOnScroll key={capability.title} delay={index * 80 + 100}>
                {/* 纯展示卡 → static（零 hover 位移） */}
                <Card variant="static" className="h-full flex flex-col">
                  <h3 className="text-base font-medium text-txt-primary mb-3 tracking-tight">
                    {capability.title}
                  </h3>
                  {/* 能力说明 = 承担实际阅读的正文 → secondary/base（§2.2） */}
                  <p className="text-txt-secondary text-base leading-relaxed">
                    {capability.body}
                  </p>
                  <div className="mt-auto pt-4 flex flex-wrap gap-1.5">
                    {capability.tags.map((tag) => (
                      <HighlightTag key={tag}>{tag}</HighlightTag>
                    ))}
                  </div>
                </Card>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── 03 产品蓝图 + 已签约经纪行 ── */}
      <section className="relative py-24 px-4">
        <hr className="ruled-line absolute top-0 left-0 right-0" />
        <div className="max-w-6xl mx-auto">
          <AnimateOnScroll>
            <SectionTitle
              sheetNo="03"
              eyebrow="WHERE THIS IS HEADING"
              light="What's Proven,"
              bold="Coming Together"
            />
          </AnimateOnScroll>

          <AnimateOnScroll delay={100}>
            <Card variant="static">
              <div className="max-w-3xl space-y-4">
                <p className="text-txt-secondary text-base leading-relaxed">
                  These capability areas did not start on a whiteboard. Three of
                  them already run as separate production systems inside Ontario
                  brokerages — AI document review in one, broker workflow and
                  compliance records in another, client notifications and
                  campaigns in a third. Each earned its place against real
                  files, real deadlines, and real regulatory obligations.
                </p>
                <p className="text-txt-secondary text-base leading-relaxed">
                  The platform brings that proven ground into a single system
                  built on CSIO standards from the first table. Brokerages have
                  already signed on, waiting on the system we are building for
                  them.
                </p>
                {/* 宗旨句 — 与主页 Unleash Human Potential 同轴 */}
                <p className="text-txt-primary text-base font-medium leading-relaxed">
                  AI handles the paperwork — brokers make the decisions. Every
                  automation we ship leaves the judgment call with a licensed
                  human, because the goal was never to replace brokers. It was
                  to give them their week back.
                </p>
              </div>
            </Card>
          </AnimateOnScroll>
        </div>
      </section>

      <CTABanner
        headline="Running a brokerage?"
        subtitle="Tell us where your team loses its week — we'll show you what we're building to get it back."
      />
    </>
  );
}
