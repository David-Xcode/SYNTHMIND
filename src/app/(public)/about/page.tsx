// ─── About 页面 · Neural ───
// Display 原则标题 / DM Mono 步骤编号 / 蓝色分割线 / 无环境光

import type { Metadata } from 'next';
import Breadcrumb from '@/components/layout/Breadcrumb';
import SectionTitle from '@/components/shared/SectionTitle';
import AnimateOnScroll from '@/components/shared/AnimateOnScroll';
import GlassCard from '@/components/shared/GlassCard';
import CTABanner from '@/components/shared/CTABanner';

export const metadata: Metadata = {
  title: 'About Synthmind | AI-Powered Software Studio in Toronto',
  description:
    'Synthmind is a solo AI-powered software studio run by David in Toronto. We build tools that actually work for traditional industries — no hype, just working software.',
  openGraph: {
    title: 'About Synthmind',
    description: 'Solo software studio building AI tools for traditional industries.',
  },
};

const principles = [
  {
    number: '01',
    title: 'Ship Fast',
    description:
      'No endless meetings or approval chains. We move quickly from idea to working software.',
    accent: { color: 'text-industry-accounting' },
  },
  {
    number: '02',
    title: 'Stay Lean',
    description:
      'Small team means lower overhead, direct communication, and focused execution.',
    accent: { color: 'text-industry-realestate' },
  },
  {
    number: '03',
    title: 'Build Smart',
    description:
      'AI-first approach to every project. Automate the boring stuff, focus on what matters.',
    accent: { color: 'text-industry-construction' },
  },
];

const processSteps = [
  {
    title: 'Discovery',
    description: 'A quick kickoff call to understand your business, pain points, and goals. No lengthy SOW — just clarity.',
  },
  {
    title: 'Design',
    description: 'Rapid prototyping with real UI — not wireframes that need another round of translation. You see what you get.',
  },
  {
    title: 'Build',
    description: 'Iterative development with weekly async updates. David handles everything end-to-end: design, code, deployment, AI integration.',
  },
  {
    title: 'Launch',
    description: 'Deployment to production with monitoring. Post-launch support included — we don\'t disappear after shipping.',
  },
];

export default function AboutPage() {
  return (
    <>
      <Breadcrumb items={[{ label: 'About' }]} />

      {/* Hero — 左右双栏 */}
      <section className="relative pt-8 pb-24 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* 左：文字 */}
            <div>
              <AnimateOnScroll>
                <SectionTitle light="About" bold="Synthmind" align="left" eyebrow="Our Story" />
              </AnimateOnScroll>

              <AnimateOnScroll delay={150}>
                <div className="space-y-5">
                  <p className="text-base md:text-lg text-txt-secondary leading-relaxed">
                    Synthmind is a software studio focused on building AI-powered tools for traditional industries.
                    We specialize in taking repetitive, time-consuming workflows and turning them into automated,
                    intelligent systems that just work.
                  </p>
                  <p className="text-base text-txt-tertiary leading-relaxed">
                    Run by David in Toronto, Canada. No corporate layers, no account managers —
                    just a direct line to the person writing your code. Every project gets the same
                    level of attention, from a 2-week MVP to a full-scale platform.
                  </p>
                </div>
              </AnimateOnScroll>
            </div>

            {/* 右：装饰性数据卡片 — 无环境光 */}
            <AnimateOnScroll delay={200}>
              <div className="relative grid grid-cols-2 gap-3">
                <div className="card-surface p-5 rounded-xl">
                  <div className="font-mono text-2xl font-bold text-accent mb-1">6+</div>
                  <div className="text-xs text-txt-quaternary">Projects Shipped</div>
                </div>
                <div className="card-surface p-5 rounded-xl">
                  <div className="font-mono text-2xl font-bold text-industry-realestate mb-1">4</div>
                  <div className="text-xs text-txt-quaternary">Industries Served</div>
                </div>
                <div className="card-surface p-5 rounded-xl">
                  <div className="font-mono text-2xl font-bold text-industry-accounting mb-1">AI</div>
                  <div className="text-xs text-txt-quaternary">First Approach</div>
                </div>
                <div className="card-surface p-5 rounded-xl">
                  <div className="font-mono text-2xl font-bold text-industry-construction mb-1">1:1</div>
                  <div className="text-xs text-txt-quaternary">Direct Access</div>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* Principles — Neural 主题色 */}
      <section className="py-24 bg-bg-surface px-4">
        {/* 顶部分割线 */}
        <div className="absolute left-0 right-0 ruled-line" style={{ marginTop: '-6rem' }} />

        <div className="max-w-6xl mx-auto">
          <AnimateOnScroll>
            <SectionTitle light="How We" bold="Work" eyebrow="Principles" />
          </AnimateOnScroll>

          <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {principles.map((principle, index) => (
              <AnimateOnScroll key={principle.title} delay={index * 80 + 100}>
                <GlassCard variant="elevated" className="h-full">
                  <span className={`font-mono text-3xl font-bold ${principle.accent.color} mb-4 block leading-none`}>
                    {principle.number}
                  </span>
                  <h3 className="font-display font-semibold text-lg text-txt-primary mb-2 tracking-tight">{principle.title}</h3>
                  <p className="text-txt-tertiary text-sm leading-relaxed">
                    {principle.description}
                  </p>
                </GlassCard>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Process — DM Mono 水印编号 + 主题色时间线 */}
      <section className="py-24 bg-bg-base px-4">
        <div className="max-w-3xl mx-auto">
          <AnimateOnScroll>
            <SectionTitle
              light="Our"
              bold="Process"
              subtitle="From idea to production in weeks, not months."
              eyebrow="How It Works"
            />
          </AnimateOnScroll>

          <div className="relative">
            {/* 时间线连接线 — 主题色 */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-accent/30 via-accent/10 to-transparent hidden md:block" />

            <div className="space-y-8">
              {processSteps.map((step, index) => (
                <AnimateOnScroll key={step.title} delay={index * 100 + 100}>
                  <div className="relative flex gap-6 items-start md:pl-16">
                    {/* 时间线节点 — 主题色 */}
                    <div className="absolute left-0 top-2 hidden md:block">
                      <div className="w-3 h-3 rounded-full bg-accent/30 border-2 border-accent/50" />
                    </div>

                    {/* 步骤卡片 */}
                    <div className="relative flex-1 card-surface p-6 rounded-xl">
                      {/* 大号水印编号 — 装饰性 */}
                      <span className="absolute top-3 right-4 font-mono text-5xl font-bold text-txt-quaternary/15 leading-none select-none">
                        {String(index + 1).padStart(2, '0')}
                      </span>

                      <div className="relative">
                        <div className="flex items-center gap-3 mb-3">
                          {/* 功能性小编号 — 取代图标盒 */}
                          <span className="font-mono text-sm font-semibold text-accent">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <h3 className="text-base font-medium text-txt-primary tracking-tight">{step.title}</h3>
                        </div>
                        <p className="text-txt-tertiary text-sm leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTABanner
        headline="Let's build something together."
        subtitle="No sales pitch — just a conversation about what you need."
        buttonText="Start a Conversation"
      />
    </>
  );
}
