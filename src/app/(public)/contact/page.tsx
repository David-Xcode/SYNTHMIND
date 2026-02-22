// ─── Contact 页面 · Neural ───
// 蓝色 focus 环 / DM Mono 标签 / 冷色调

import type { Metadata } from 'next';
import Breadcrumb from '@/components/layout/Breadcrumb';
import SectionTitle from '@/components/shared/SectionTitle';
import AnimateOnScroll from '@/components/shared/AnimateOnScroll';
import ContactForm from '@/components/shared/ContactForm';
import JsonLd from '@/components/shared/JsonLd';
import FAQAccordion from './FAQAccordion';
import { faqs } from './faqData';

export const metadata: Metadata = {
  title: 'Contact Synthmind | Book a Free Consultation',
  description:
    'Get in touch with Synthmind for AI-powered software development. Free consultation for insurance, real estate, accounting, and construction businesses.',
  openGraph: {
    title: 'Contact Synthmind',
    description: 'Book a free consultation for your AI project.',
    url: 'https://synthmind.ca/contact',
    siteName: 'Synthmind',
    locale: 'en_CA',
  },
};

const contactInfo = [
  {
    label: 'Email',
    value: 'info@synthmind.ca',
    href: 'mailto:info@synthmind.ca',
  },
  {
    label: 'Location',
    value: 'Toronto, Canada',
  },
  {
    label: 'Response Time',
    value: 'Usually within 24 hours',
  },
];

// FAQPage + LocalBusiness 结构化数据
const contactJsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Synthmind',
    url: 'https://synthmind.ca',
    email: 'info@synthmind.ca',
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

      {/* Hero */}
      <section className="pt-8 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <AnimateOnScroll>
            <SectionTitle
              light="Let's"
              bold="Talk"
              subtitle="Have a question or ready to start your AI project? Drop us a message."
            />
          </AnimateOnScroll>
        </div>
      </section>

      {/* 表单 + 联系信息 双栏布局 */}
      <section className="pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
            {/* 左：完整表单 */}
            <AnimateOnScroll className="lg:col-span-3" delay={100}>
              <ContactForm variant="full" source="contact-page" />
            </AnimateOnScroll>

            {/* 右：联系信息 — 主题色图标 */}
            <AnimateOnScroll className="lg:col-span-2" delay={250}>
              <div className="space-y-7">
                <h3 className="text-base font-medium text-txt-primary mb-5 tracking-tight">Get in Touch</h3>

                {contactInfo.map((info) => (
                  <div key={info.label} className="relative flex items-start gap-4 pl-4">
                    {/* 左侧蓝色渐变竖线 — 借鉴 .card-spotlight::before */}
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-accent/40 to-accent/10" />
                    <div>
                      <p className="font-mono text-txt-quaternary text-xs font-medium uppercase tracking-eyebrow mb-0.5">
                        {info.label}
                      </p>
                      {info.href ? (
                        <a
                          href={info.href}
                          className="text-txt-secondary text-sm hover:text-accent transition-colors duration-200"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-txt-secondary text-sm">{info.value}</p>
                      )}
                    </div>
                  </div>
                ))}

                <div className="pt-5 border-t border-[var(--border-default)]">
                  <p className="text-txt-quaternary text-sm leading-relaxed">
                    David handles all inquiries personally. No sales team, no runaround — you talk directly to the person who will build your project.
                  </p>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* FAQ — 可折叠手风琴 */}
      <section className="py-24 bg-bg-surface px-4">
        <div className="max-w-3xl mx-auto">
          <AnimateOnScroll>
            <SectionTitle light="Common" bold="Questions" eyebrow="FAQ" />
          </AnimateOnScroll>

          <FAQAccordion faqs={faqs} />
        </div>
      </section>
    </>
  );
}
