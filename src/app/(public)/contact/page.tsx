// ─── Contact 页面 ───
// 完整版联系表单 + 联系信息 + FAQ

import type { Metadata } from 'next';
import Breadcrumb from '@/components/layout/Breadcrumb';
import SectionTitle from '@/components/shared/SectionTitle';
import AnimateOnScroll from '@/components/shared/AnimateOnScroll';
import GlassCard from '@/components/shared/GlassCard';
import ContactForm from '@/components/shared/ContactForm';
import {
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

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
    icon: EnvelopeIcon,
    label: 'Email',
    value: 'synthmind.technology@gmail.com',
    href: 'mailto:synthmind.technology@gmail.com',
  },
  {
    icon: MapPinIcon,
    label: 'Location',
    value: 'Toronto, Canada',
  },
  {
    icon: ClockIcon,
    label: 'Response Time',
    value: 'Usually within 24 hours',
  },
];

const faqs = [
  {
    question: 'How long does a typical project take?',
    answer: 'MVP in 2-4 weeks. Full product in 2-3 months. Timeline depends on scope and complexity.',
  },
  {
    question: 'What industries do you work with?',
    answer: 'We specialize in insurance, real estate, accounting/tax, and construction — but our AI and software expertise applies across traditional industries.',
  },
  {
    question: 'Do you offer ongoing support?',
    answer: 'Yes. Post-launch support is included, and we offer maintenance packages for long-term partnerships.',
  },
  {
    question: 'What\'s your tech stack?',
    answer: 'Next.js, React, TypeScript, Tailwind CSS, Node.js, and AI models (Gemini, Claude). We deploy on Vercel and AWS.',
  },
  {
    question: 'How much does a project cost?',
    answer: 'It depends on scope. A simple website starts around $3,000. AI-powered platforms range from $10,000-$50,000+. Book a free call and we\'ll give you an honest estimate.',
  },
];

export default function ContactPage() {
  return (
    <>
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
            <AnimateOnScroll className="lg:col-span-3" delay={200}>
              <ContactForm variant="full" source="contact-page" />
            </AnimateOnScroll>

            {/* 右：联系信息 */}
            <AnimateOnScroll className="lg:col-span-2" delay={400}>
              <div className="space-y-8">
                <h3 className="text-lg font-medium text-white/90 mb-6">Get in Touch</h3>

                {contactInfo.map((info) => {
                  const IconComponent = info.icon;
                  return (
                    <div key={info.label} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[#3498db]/10 border border-[#3498db]/20 flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-5 h-5 text-[#3498db]" />
                      </div>
                      <div>
                        <p className="text-white/50 text-xs font-light uppercase tracking-wider mb-1">
                          {info.label}
                        </p>
                        {info.href ? (
                          <a
                            href={info.href}
                            className="text-white/80 text-sm font-light hover:text-[#3498db] transition-colors"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <p className="text-white/80 text-sm font-light">{info.value}</p>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* 简短说明 */}
                <div className="pt-6 border-t border-white/10">
                  <p className="text-gray-500 text-sm font-light leading-relaxed">
                    David handles all inquiries personally. No sales team, no runaround — you talk directly to the person who will build your project.
                  </p>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gradient-to-b from-[#1a1f2e] to-[#252b3b] px-4">
        <div className="max-w-3xl mx-auto">
          <AnimateOnScroll>
            <SectionTitle light="Common" bold="Questions" />
          </AnimateOnScroll>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <AnimateOnScroll key={index} delay={index * 100 + 200}>
                <GlassCard>
                  <h4 className="text-white/90 font-medium mb-2">{faq.question}</h4>
                  <p className="text-gray-400 text-sm font-light leading-relaxed">{faq.answer}</p>
                </GlassCard>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
