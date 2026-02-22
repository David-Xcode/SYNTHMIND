'use client';

// ─── CTA 横幅 · Neural ───
// 蓝色渐变分割线 + Sora Display 标题

import Link from 'next/link';
import AnimateOnScroll from './AnimateOnScroll';

interface CTABannerProps {
  headline: string;
  /** 副标题文案 */
  subtitle?: string;
  /** CTA 按钮文字，默认 "Book a Free Consultation" */
  buttonText?: string;
  /** CTA 链接目标，默认 /contact */
  href?: string;
}

export default function CTABanner({
  headline,
  subtitle,
  buttonText = 'Book a Free Consultation',
  href = '/contact',
}: CTABannerProps) {
  return (
    <section className="relative py-24 sm:py-32">
      {/* 上下蓝色渐变分割线 */}
      <div className="absolute top-0 inset-x-0 ruled-line" />
      <div className="absolute bottom-0 inset-x-0 ruled-line" />

      <div className="relative z-10 max-w-3xl mx-auto text-center px-4">
        <AnimateOnScroll>
          <h2 className="font-display font-semibold text-headline tracking-tight text-txt-primary mb-4">
            {headline}
          </h2>
        </AnimateOnScroll>

        {subtitle && (
          <AnimateOnScroll delay={100}>
            <p className="text-lg text-txt-secondary mb-10 max-w-xl mx-auto">
              {subtitle}
            </p>
          </AnimateOnScroll>
        )}

        <AnimateOnScroll delay={200}>
          <Link
            href={href}
            className="group inline-flex items-center gap-2 btn-primary text-base px-8 py-3.5"
          >
            <span>{buttonText}</span>
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
