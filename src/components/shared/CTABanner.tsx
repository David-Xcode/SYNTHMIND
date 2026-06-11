'use client';

// ─── CTA 横幅 · Neural ───
// 径向光晕背景 + TextReveal 标题 + 蓝色渐变 CTA

import Link from 'next/link';
import AnimateOnScroll from './AnimateOnScroll';
import ArrowRightIcon from './ArrowRightIcon';
import TextReveal from './TextReveal';

interface CTABannerProps {
  headline: string;
  /** 副标题文案 */
  subtitle?: string;
  /** CTA 按钮文字，默认 "Book a Free Consultation" */
  buttonText?: string;
}

export default function CTABanner({
  headline,
  subtitle,
  buttonText = 'Book a Free Consultation',
}: CTABannerProps) {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      {/* 上下蓝色渐变分割线 */}
      <div className="absolute top-0 inset-x-0 ruled-line" />
      <div className="absolute bottom-0 inset-x-0 ruled-line" />

      {/* 径向光晕背景 — 居中位置（PageHero 默认偏上 30%） */}
      <div
        className="pointer-events-none absolute inset-0 hero-glow"
        aria-hidden="true"
        style={{ '--glow-y': '50%' } as React.CSSProperties}
      />

      <div className="relative z-10 max-w-3xl mx-auto text-center px-4">
        <TextReveal
          text={headline}
          as="h2"
          className="font-display font-semibold text-headline tracking-tight text-txt-primary mb-4"
          stagger={50}
        />

        {subtitle && (
          <AnimateOnScroll delay={100}>
            <p className="text-lg text-txt-secondary mb-10 max-w-xl mx-auto">
              {subtitle}
            </p>
          </AnimateOnScroll>
        )}

        <AnimateOnScroll delay={200}>
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 btn-primary text-base px-8 py-3.5"
          >
            <span>{buttonText}</span>
            <ArrowRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
