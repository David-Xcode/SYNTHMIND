// ─── About 页面 · Blueprint ───
// 使命驱动叙事 — 6 区块结构（section 带图纸编号 01-04）

import type { Metadata } from 'next';
import Breadcrumb from '@/components/layout/Breadcrumb';
import AnimateOnScroll from '@/components/shared/AnimateOnScroll';
import Card from '@/components/shared/Card';
import CTABanner from '@/components/shared/CTABanner';
import Eyebrow from '@/components/shared/Eyebrow';
import PageHero from '@/components/shared/PageHero';
import SectionTitle from '@/components/shared/SectionTitle';
import StatCard from '@/components/shared/StatCard';
import { caseStudies } from '@/data/case-studies';
import { processSteps } from '@/data/process';
import { realEstateSites } from '@/data/real-estate';
import { BASE_OPEN_GRAPH, INDUSTRIES_SERVED, SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'About Synthmind | Modern Software for Traditional Industries',
  description:
    'Synthmind is a Toronto-based software team building software that modernizes traditional businesses. We deliver workflow automation, legacy modernization, and custom AI solutions.',
  alternates: { canonical: '/about' },
  openGraph: {
    ...BASE_OPEN_GRAPH,
    url: `${SITE_URL}/about`,
    title: 'About Synthmind',
    description: 'A Toronto-based team building software that actually works.',
  },
};

// ── 数据常量 ──

const stats = [
  {
    // 从数据层派生（软件案例 + 地产盘）——新增产品自动跟上，硬编码退役
    value: `${caseStudies.length + realEstateSites.length}+`,
    label: 'Products Delivered',
    color: 'text-accent',
  },
  {
    // 「100% Client Retention」零支撑绝对值已移除（v7 文案审计）；
    // 行业数可由数据层与 FAQ 交叉验证（insurance / real estate /
    // accounting & tax / construction）——常量化后与首页信任带图签同源
    value: String(INDUSTRIES_SERVED),
    label: 'Industries Served',
    color: 'text-accent-400',
  },
  {
    value: '2–4 wks',
    label: 'Average MVP Launch',
    color: 'text-accent-700',
  },
];

const solutions = [
  {
    eyebrow: 'AUTOMATION',
    title: 'Workflow Automation',
    description:
      'Insurance brokers scanning documents by hand. Construction PMs tracking budgets in spreadsheets. We identify the manual loops and replace them with intelligent pipelines that run 24/7.',
  },
  {
    eyebrow: 'MODERNIZATION',
    title: 'Legacy Modernization',
    description:
      'Your core system works — it just looks and feels like 2008. We build modern interfaces on top of legacy infrastructure so your team gets a better experience without a risky re-platform.',
  },
  {
    eyebrow: 'AI SOLUTIONS',
    title: 'Custom AI Solutions',
    description:
      'Off-the-shelf AI rarely fits niche industries. We train and deploy models tailored to your domain — from document extraction for accountants to risk scoring for underwriters.',
  },
];

// 价值观不是序列 — 不带装饰性编号（Blueprint 规则：编号只用于真实次序）
const values = [
  {
    title: 'Industry First, Technology Second',
    description:
      'We spend more time understanding your industry than picking frameworks. The right solution starts with deep domain knowledge, not a tech stack.',
  },
  {
    title: 'Build With, Not For',
    description:
      'We embed in your team, learn your language, and co-create solutions. You are not outsourcing — you are gaining engineering partners who care about your outcome.',
  },
  {
    title: 'Ship Working Software',
    description:
      'No decks, no vaporware. Every engagement produces working software you can demo, test, and deploy. We measure progress in releases, not slide counts.',
  },
];

// processSteps 已提为 src/data/process.ts —— 首页 03 方法带复述同一套流程，
// 两处消费同源（本页用 description 长版，首页用 summary 一句话版）

export default function AboutPage() {
  return (
    <>
      <Breadcrumb items={[{ label: 'About' }]} />

      {/* ── Section 1: Hero — Mission Statement ── */}
      <PageHero
        eyebrow="OUR MISSION"
        light="Traditional Industries Deserve"
        bold="Modern Software."
        subtitle="Synthmind is a Toronto-based software team. We build software that modernizes how insurance, real estate, accounting, and construction companies operate — practical tools that work."
      />

      {/* ── Section 2: Why We Exist — 行业问题 + 公司数据 ──
          hero 后第一章：不加 ruled-line（hero 光晕已承担分隔），pt 收半档
          消除 PageHero pb-24 叠出的空档（IA v1 §2.4） */}
      <section className="pt-12 pb-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* 左栏：叙事 */}
            <div>
              <AnimateOnScroll>
                <SectionTitle
                  sheetNo="01"
                  light="Why We"
                  bold="Exist"
                  eyebrow="THE PROBLEM"
                />
              </AnimateOnScroll>

              <AnimateOnScroll delay={150}>
                {/* -mt-8 hack 已随标题间距分级（mb-10）删除 */}
                <div className="space-y-5">
                  <p className="text-base md:text-lg text-txt-secondary leading-relaxed">
                    Insurance brokers still scan paper documents by hand.
                    Construction project managers track million-dollar budgets
                    in spreadsheets. Accounting firms run websites that look
                    like they were built in 2008. These are not small businesses
                    struggling to survive — they are thriving companies held
                    back by outdated software.
                  </p>
                  <p className="text-base text-txt-tertiary leading-relaxed">
                    These industries do not lack ambition. They lack builders
                    who understand their world. That is the gap Synthmind exists
                    to fill — we bring modern engineering to industries that big
                    tech overlooks.
                  </p>
                </div>
              </AnimateOnScroll>
            </div>

            {/* 右栏：统计卡片 — 计数动画 */}
            <AnimateOnScroll delay={200}>
              <div className="space-y-4">
                {stats.map((stat) => (
                  <StatCard
                    key={stat.label}
                    value={stat.value}
                    label={stat.label}
                    valueClassName={stat.color}
                    duration={1200}
                  />
                ))}
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* ── Section 3: What We Build — 3 种解决方案 ── */}
      <section className="relative py-24 px-4">
        <hr className="ruled-line absolute top-0 left-0 right-0" />
        <div className="max-w-6xl mx-auto">
          <AnimateOnScroll>
            <SectionTitle
              sheetNo="02"
              light="What We"
              bold="Build"
              eyebrow="SOLUTIONS"
            />
          </AnimateOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {solutions.map((solution, index) => (
              <AnimateOnScroll key={solution.title} delay={index * 80 + 100}>
                <Card variant="static" accent className="h-full">
                  <Eyebrow>{solution.eyebrow}</Eyebrow>
                  <h3 className="mt-3 font-display font-semibold stretch-wide text-lg text-txt-primary tracking-tight">
                    {solution.title}
                  </h3>
                  {/* 承担实际阅读的正文 → secondary/base（IA v1 §2.2） */}
                  <p className="mt-2 text-txt-secondary text-base leading-relaxed">
                    {solution.description}
                  </p>
                </Card>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 4: Our Values — 行业特定原则 ── */}
      <section className="relative py-24 px-4">
        <hr className="ruled-line absolute top-0 left-0 right-0" />

        <div className="max-w-4xl mx-auto">
          <AnimateOnScroll>
            <SectionTitle
              sheetNo="03"
              light="Our"
              bold="Values"
              eyebrow="PRINCIPLES"
            />
          </AnimateOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {values.map((value, index) => (
              <AnimateOnScroll key={value.title} delay={index * 80 + 100}>
                <Card variant="static" className="h-full">
                  {/* 标题降 text-base（IA v1 §4.2）：60 字小卡不配 text-lg。
                      正文同步提到 base 后标题与正文字号相同——层级改由
                      Archivo 宽体的字形对比承担，不回调字号（§8 风险条款） */}
                  <h3 className="font-display font-semibold stretch-wide text-base text-txt-primary mb-2 tracking-tight">
                    {value.title}
                  </h3>
                  <p className="text-txt-secondary text-base leading-relaxed">
                    {value.description}
                  </p>
                </Card>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 5: Our Process — 水平四步 ── */}
      <section className="relative py-24 px-4">
        <hr className="ruled-line absolute top-0 left-0 right-0" />
        <div className="max-w-6xl mx-auto">
          <AnimateOnScroll>
            <SectionTitle
              sheetNo="04"
              light="Our"
              bold="Process"
              subtitle="From idea to production in weeks, not months."
              eyebrow="HOW IT WORKS"
            />
          </AnimateOnScroll>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {processSteps.map((step, index) => (
              <AnimateOnScroll key={step.title} delay={index * 80 + 100}>
                <Card variant="static" className="h-full">
                  {/* 步骤号 = 真实序列（水印大数字已随 v7 编号统一退役） */}
                  <span className="font-mono text-sm font-semibold text-accent">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-2 text-base font-medium text-txt-primary tracking-tight">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-txt-secondary text-base leading-relaxed">
                    {step.description}
                  </p>
                </Card>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 6: CTA Banner ── */}
      <CTABanner
        headline="Let's build the future of your industry."
        subtitle="Insurance, real estate, accounting, construction — wherever your business operates, we can help modernize it. A conversation, not a sales pitch."
        buttonText="Start a Conversation"
      />
    </>
  );
}
