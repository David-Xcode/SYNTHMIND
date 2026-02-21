// ─── About 页面 ───

import type { Metadata } from 'next';
import Breadcrumb from '@/components/layout/Breadcrumb';
import SectionTitle from '@/components/shared/SectionTitle';
import AnimateOnScroll from '@/components/shared/AnimateOnScroll';
import GlassCard from '@/components/shared/GlassCard';
import CTABanner from '@/components/shared/CTABanner';
import {
  BoltIcon,
  UserGroupIcon,
  CpuChipIcon,
  MagnifyingGlassIcon,
  PaintBrushIcon,
  CodeBracketIcon,
  RocketLaunchIcon,
} from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'About Synthmind | AI-Powered Software Studio in Toronto',
  description:
    'Synthmind is a solo AI-powered software studio run by David in Toronto. We build tools that actually work for traditional industries — no hype, just working software.',
  openGraph: {
    title: 'About Synthmind',
    description: 'Solo software studio building AI tools for traditional industries.',
    url: 'https://synthmind.ca/about',
    siteName: 'Synthmind',
    locale: 'en_CA',
  },
};

const principles = [
  {
    icon: BoltIcon,
    title: 'Ship Fast',
    description:
      'No endless meetings or approval chains. We move quickly from idea to working software.',
  },
  {
    icon: UserGroupIcon,
    title: 'Stay Lean',
    description:
      'Small team means lower overhead, direct communication, and focused execution.',
  },
  {
    icon: CpuChipIcon,
    title: 'Build Smart',
    description:
      'AI-first approach to every project. Automate the boring stuff, focus on what matters.',
  },
];

const processSteps = [
  {
    icon: MagnifyingGlassIcon,
    title: 'Discovery',
    description: 'A quick kickoff call to understand your business, pain points, and goals. No lengthy SOW — just clarity.',
  },
  {
    icon: PaintBrushIcon,
    title: 'Design',
    description: 'Rapid prototyping with real UI — not wireframes that need another round of translation. You see what you get.',
  },
  {
    icon: CodeBracketIcon,
    title: 'Build',
    description: 'Iterative development with weekly async updates. David handles everything end-to-end: design, code, deployment, AI integration.',
  },
  {
    icon: RocketLaunchIcon,
    title: 'Launch',
    description: 'Deployment to production with monitoring. Post-launch support included — we don\'t disappear after shipping.',
  },
];

export default function AboutPage() {
  return (
    <>
      <Breadcrumb items={[{ label: 'About' }]} />

      {/* Hero */}
      <section className="pt-8 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <AnimateOnScroll>
            <SectionTitle light="About" bold="Synthmind" />
          </AnimateOnScroll>

          <AnimateOnScroll delay={200}>
            <div className="space-y-6 text-center">
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed font-light">
                Synthmind is a software studio focused on building AI-powered tools for traditional industries.
                We specialize in taking repetitive, time-consuming workflows and turning them into automated,
                intelligent systems that just work.
              </p>
              <p className="text-lg text-gray-400 leading-relaxed font-light">
                Run by David in Toronto, Canada. No corporate layers, no account managers —
                just a direct line to the person writing your code. Every project gets the same
                level of attention, from a 2-week MVP to a full-scale platform.
              </p>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Principles */}
      <section className="py-20 bg-gradient-to-b from-[#1a1f2e] to-[#252b3b] px-4">
        <div className="max-w-6xl mx-auto">
          <AnimateOnScroll>
            <SectionTitle light="How We" bold="Work" />
          </AnimateOnScroll>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-4xl mx-auto">
            {principles.map((principle, index) => {
              const IconComponent = principle.icon;
              return (
                <AnimateOnScroll key={principle.title} delay={index * 100 + 200}>
                  <GlassCard className="h-full">
                    <div className="w-14 h-14 rounded-xl bg-[#3498db]/10 border border-[#3498db]/20 flex items-center justify-center mb-6">
                      <IconComponent className="w-7 h-7 text-[#3498db]" />
                    </div>
                    <h3 className="text-lg font-medium text-white/90 mb-2">{principle.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed font-light">
                      {principle.description}
                    </p>
                  </GlassCard>
                </AnimateOnScroll>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-gradient-to-b from-[#252b3b] to-[#1a1f2e] px-4">
        <div className="max-w-4xl mx-auto">
          <AnimateOnScroll>
            <SectionTitle light="Our" bold="Process" subtitle="From idea to production in weeks, not months." />
          </AnimateOnScroll>

          <div className="space-y-8">
            {processSteps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <AnimateOnScroll key={step.title} delay={index * 100 + 200}>
                  <div className="flex gap-6 items-start">
                    {/* 步骤编号 + 图标 */}
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 rounded-xl bg-[#3498db]/10 border border-[#3498db]/20 flex items-center justify-center">
                        <IconComponent className="w-7 h-7 text-[#3498db]" />
                      </div>
                    </div>

                    {/* 内容 */}
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-[#3498db] text-sm font-light">0{index + 1}</span>
                        <h3 className="text-lg font-medium text-white/90">{step.title}</h3>
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed font-light">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </AnimateOnScroll>
              );
            })}
          </div>
        </div>
      </section>

      <CTABanner headline="Let's build something together." buttonText="Start a Conversation" />
    </>
  );
}
