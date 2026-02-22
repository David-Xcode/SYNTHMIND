// ─── About 页面 · Neural ───
// 使命驱动创业公司叙事 — 6 区块结构

import type { Metadata } from 'next';
import Breadcrumb from '@/components/layout/Breadcrumb';
import AnimateOnScroll from '@/components/shared/AnimateOnScroll';
import CTABanner from '@/components/shared/CTABanner';
import GlassCard from '@/components/shared/GlassCard';
import SectionTitle from '@/components/shared/SectionTitle';

export const metadata: Metadata = {
  title: 'About Synthmind | AI Startup for Traditional Industries',
  description:
    'Synthmind is a Toronto-based AI startup building software that modernizes traditional industries. We deliver workflow automation, legacy modernization, and custom AI solutions for insurance, real estate, accounting, and construction.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Synthmind',
    description:
      'Toronto-based AI startup building software for traditional industries.',
  },
};

// ── 数据常量 ──

const stats = [
  { value: '6+', label: 'Projects Delivered', color: 'text-accent' },
  {
    value: '4',
    label: 'Industries We Serve',
    color: 'text-industry-realestate',
  },
  {
    value: '100%',
    label: 'Client Retention',
    color: 'text-industry-accounting',
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

const values = [
  {
    number: '01',
    title: 'Industry First, Technology Second',
    description:
      'We spend more time understanding your industry than picking frameworks. The right solution starts with deep domain knowledge, not a tech stack.',
    color: 'text-industry-insurance',
  },
  {
    number: '02',
    title: 'Build With, Not For',
    description:
      'We embed in your team, learn your language, and co-create solutions. You are not outsourcing — you are gaining engineering partners who care about your outcome.',
    color: 'text-industry-realestate',
  },
  {
    number: '03',
    title: 'Ship Working Software',
    description:
      'No decks, no vaporware. Every engagement produces working software you can demo, test, and deploy. We measure progress in releases, not slide counts.',
    color: 'text-industry-accounting',
  },
];

const processSteps = [
  {
    title: 'Discover',
    description:
      'We observe your team in action — shadowing workflows, mapping pain points, and identifying the highest-impact automation opportunities.',
  },
  {
    title: 'Design',
    description:
      'Rapid prototyping with real UI, not wireframes. You interact with working mockups so feedback is concrete and cycles are short.',
  },
  {
    title: 'Build',
    description:
      'Iterative development with weekly demos. Our engineers ship production-quality code every sprint — no handoffs, no waiting.',
  },
  {
    title: 'Scale',
    description:
      'Deployment, monitoring, and continuous optimization. We stay engaged post-launch to tune performance and extend capabilities as your needs grow.',
  },
];

export default function AboutPage() {
  return (
    <>
      <Breadcrumb items={[{ label: 'About' }]} />

      {/* ── Section 1: Hero — Mission Statement ── */}
      <section className="relative pt-8 pb-24 px-4 overflow-hidden">
        {/* 微妙径向光晕背景 */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 40% at 50% 30%, rgba(74,159,229,0.04), transparent)',
          }}
        />

        <div className="relative max-w-3xl mx-auto text-center">
          <AnimateOnScroll>
            <span className="font-mono text-xs font-medium uppercase tracking-eyebrow text-accent">
              OUR MISSION
            </span>
          </AnimateOnScroll>

          <AnimateOnScroll delay={100}>
            <h1 className="mt-6 text-display leading-tight">
              <span className="font-sans font-light text-txt-primary">
                Traditional Industries Deserve{' '}
              </span>
              <span className="font-display font-semibold text-accent">
                Modern Software.
              </span>
            </h1>
          </AnimateOnScroll>

          <AnimateOnScroll delay={200}>
            <p className="mt-6 text-subtitle text-txt-secondary leading-relaxed max-w-2xl mx-auto">
              Synthmind is a Toronto-based AI startup. We build software that
              modernizes how insurance, real estate, accounting, and
              construction companies operate — no hype, just working tools.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ── Section 2: Why We Exist — 行业问题 + 公司数据 ── */}
      <section className="relative py-24 bg-bg-surface px-4">
        <hr className="ruled-line absolute top-0 left-0 right-0" />

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* 左栏：叙事 */}
            <div>
              <AnimateOnScroll>
                <SectionTitle
                  light="Why We"
                  bold="Exist"
                  eyebrow="THE PROBLEM"
                  align="left"
                  size="md"
                />
              </AnimateOnScroll>

              <AnimateOnScroll delay={150}>
                <div className="-mt-8 space-y-5">
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

            {/* 右栏：统计卡片 */}
            <AnimateOnScroll delay={200}>
              <div className="space-y-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="card-surface p-5 rounded-xl">
                    <div
                      className={`font-mono text-2xl font-bold ${stat.color} mb-1`}
                    >
                      {stat.value}
                    </div>
                    <div className="text-xs text-txt-quaternary">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* ── Section 3: What We Build — 3 种解决方案 ── */}
      <section className="py-24 bg-bg-base px-4">
        <div className="max-w-6xl mx-auto">
          <AnimateOnScroll>
            <SectionTitle light="What We" bold="Build" eyebrow="SOLUTIONS" />
          </AnimateOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {solutions.map((solution, index) => (
              <AnimateOnScroll key={solution.title} delay={index * 80 + 100}>
                <GlassCard variant="spotlight" className="h-full">
                  <span className="font-mono text-xs font-medium uppercase tracking-eyebrow text-accent">
                    {solution.eyebrow}
                  </span>
                  <h3 className="mt-3 font-display font-semibold text-lg text-txt-primary tracking-tight">
                    {solution.title}
                  </h3>
                  <p className="mt-2 text-txt-tertiary text-sm leading-relaxed">
                    {solution.description}
                  </p>
                </GlassCard>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 4: Our Values — 行业特定原则 ── */}
      <section className="relative py-24 bg-bg-surface px-4">
        <hr className="ruled-line absolute top-0 left-0 right-0" />

        <div className="max-w-4xl mx-auto">
          <AnimateOnScroll>
            <SectionTitle light="Our" bold="Values" eyebrow="PRINCIPLES" />
          </AnimateOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {values.map((value, index) => (
              <AnimateOnScroll key={value.title} delay={index * 80 + 100}>
                <GlassCard variant="elevated" className="h-full">
                  <span
                    className={`font-mono text-3xl font-bold ${value.color} mb-4 block leading-none`}
                  >
                    {value.number}
                  </span>
                  <h3 className="font-display font-semibold text-lg text-txt-primary mb-2 tracking-tight">
                    {value.title}
                  </h3>
                  <p className="text-txt-tertiary text-sm leading-relaxed">
                    {value.description}
                  </p>
                </GlassCard>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 5: Our Process — 水平四步 ── */}
      <section className="py-24 bg-bg-base px-4">
        <div className="max-w-6xl mx-auto">
          <AnimateOnScroll>
            <SectionTitle
              light="Our"
              bold="Process"
              subtitle="From idea to production in weeks, not months."
              eyebrow="HOW IT WORKS"
            />
          </AnimateOnScroll>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {processSteps.map((step, index) => (
              <AnimateOnScroll key={step.title} delay={index * 80 + 100}>
                <div className="relative card-surface p-6 rounded-xl h-full">
                  {/* 大号水印编号 */}
                  <span className="absolute top-3 right-4 font-mono text-5xl font-bold text-txt-quaternary/15 leading-none select-none">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <div className="relative">
                    <span className="font-mono text-sm font-semibold text-accent">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="mt-2 text-base font-medium text-txt-primary tracking-tight">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-txt-tertiary text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 6: CTA Banner ── */}
      <CTABanner
        headline="Let's build the future of your industry."
        subtitle="Insurance, real estate, accounting, construction — wherever your business operates, we can help modernize it. No sales pitch, just a conversation."
        buttonText="Start a Conversation"
      />
    </>
  );
}
