// ─── Contact 页面 · Card System v7 单据化重构 ───
// 设计定案：card-system-v7-glass spec §6。页面唯一职责 = 让潜在客户
// 尽快发起第一次对话：hero 压缩为紧凑标题行（不用 PageHero），表单卡
// 进首屏；表单 = 图签化单据卡（单据感由视觉承载，不推行业术语）。
// 邮箱已全站撤下展示（Resend 留言闭环是唯一联系入口）——JSON-LD 的
// email 字段一并移除，CONTACT_EMAIL 常量仅供 API route 发信。

import type { Metadata } from 'next';
import Breadcrumb from '@/components/layout/Breadcrumb';
import AnimateOnScroll from '@/components/shared/AnimateOnScroll';
import Card from '@/components/shared/Card';
import ContactForm from '@/components/shared/ContactForm';
import Eyebrow from '@/components/shared/Eyebrow';
import JsonLd from '@/components/shared/JsonLd';
import SectionTitle from '@/components/shared/SectionTitle';
import SheetLabel from '@/components/shared/SheetLabel';
import { BASE_OPEN_GRAPH, SITE_URL } from '@/lib/constants';
import FAQAccordion from './FAQAccordion';
import { faqs } from './faqData';

export const metadata: Metadata = {
  title: 'Contact Synthmind | Book a Free Consultation',
  description:
    'Get in touch with Synthmind for AI-powered software development. Free consultation for insurance, real estate, accounting/tax, and construction businesses.',
  alternates: { canonical: '/contact' },
  openGraph: {
    ...BASE_OPEN_GRAPH,
    url: `${SITE_URL}/contact`,
    title: 'Contact Synthmind',
    description: 'Book a free consultation for your AI project.',
  },
};

// 发消息之后会发生什么 — 真实序列（编号合法）：
// 消掉「提交了会怎样」的不确定性，是表单页最便宜的信任构建
const nextSteps = [
  {
    title: 'Confirmation right away',
    description:
      'An automatic confirmation lands in your inbox the moment you hit send.',
  },
  {
    title: 'A personal reply',
    description:
      'You hear back directly from the person who would build your project.',
  },
  {
    title: 'A free consultation call',
    description:
      'We talk through your workflow and where software can actually help.',
  },
];

// FAQPage + LocalBusiness 结构化数据（email 字段已随邮箱撤展示移除）
const contactJsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Synthmind',
    url: SITE_URL,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Toronto',
      addressRegion: 'ON',
      addressCountry: 'CA',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  },
];

export default function ContactPage() {
  return (
    <>
      {contactJsonLd.map((data, i) => (
        <JsonLd key={i} data={data} />
      ))}
      <Breadcrumb items={[{ label: 'Contact' }]} />

      {/* 紧凑标题行 — v7 起不用 PageHero：首屏让位给表单卡。
          h1 是 LCP，不加入场动画 */}
      <section className="pt-14 md:pt-20 pb-10 px-4">
        <div className="max-w-6xl mx-auto">
          <SheetLabel>GET IN TOUCH</SheetLabel>
          <h1 className="mt-4 text-headline tracking-tight text-txt-primary">
            <span className="font-sans font-light">Let&apos;s</span>{' '}
            <span className="font-display font-semibold stretch-wide">
              Talk
            </span>
          </h1>
          <p className="mt-3 max-w-xl text-subtitle text-txt-secondary leading-relaxed">
            Tell us about your project — you&apos;ll hear back within 24 hours.
          </p>
        </div>
      </section>

      {/* 单据表单 + 信任栏 双栏 — 表单在首屏 */}
      <section className="pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14 items-start">
            {/* 左：图签化单据表单卡 */}
            <AnimateOnScroll className="lg:col-span-3" delay={100}>
              <Card variant="container" pad="lg">
                {/* 单据卡头 — 图签 + 单据编号 + hairline 分隔 */}
                <div className="flex items-center justify-between gap-4 pb-5 mb-6 border-b border-[var(--border-default)]">
                  <SheetLabel>PROJECT INQUIRY</SheetLabel>
                  <span className="annotation" aria-hidden="true">
                    FORM / 01
                  </span>
                </div>
                <ContactForm />
              </Card>
            </AnimateOnScroll>

            {/* 右：信任栏 — 发消息之后会发生什么 + 单据元数据行 */}
            <AnimateOnScroll className="lg:col-span-2" delay={220}>
              <div className="lg:pt-2">
                <SheetLabel>WHAT HAPPENS NEXT</SheetLabel>

                <ol className="mt-6 space-y-6">
                  {nextSteps.map((step, index) => (
                    <li key={step.title} className="flex gap-4">
                      {/* 步骤号 = 真实序列（全站统一序号形态） */}
                      <span
                        className="font-mono text-sm font-semibold text-accent pt-0.5"
                        aria-hidden="true"
                      >
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <h3 className="text-sm font-medium text-txt-primary tracking-tight">
                          {step.title}
                        </h3>
                        <p className="mt-1 text-txt-tertiary text-sm leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>

                {/* 单据元数据行 — mono 标注形态（邮箱行已撤下：
                    表单即联系方式） */}
                <div className="mt-8 pt-6 border-t border-[var(--border-default)] space-y-3">
                  <div className="flex items-baseline gap-3">
                    <Eyebrow tone="quaternary">Location</Eyebrow>
                    <span className="text-txt-secondary text-sm">
                      Toronto, Canada
                    </span>
                  </div>
                  <div className="flex items-baseline gap-3">
                    <Eyebrow tone="quaternary">Response</Eyebrow>
                    <span className="text-txt-secondary text-sm">
                      Within 24 hours
                    </span>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* FAQ — 可折叠手风琴 */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <AnimateOnScroll>
            <SectionTitle
              sheetNo="01"
              light="Common"
              bold="Questions"
              eyebrow="FAQ"
            />
          </AnimateOnScroll>

          <FAQAccordion faqs={faqs} />
        </div>
      </section>
    </>
  );
}
