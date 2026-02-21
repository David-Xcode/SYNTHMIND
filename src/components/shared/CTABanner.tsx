'use client';

// ─── CTA 横幅组件 ───
// 多变体：full（全宽蓝色渐变）/ inline（嵌入式，带邮箱输入）
// 用于页面底部的转化引导

import Link from 'next/link';
import AnimateOnScroll from './AnimateOnScroll';

interface CTABannerProps {
  headline: string;
  /** CTA 按钮文字，默认 "Book a Free Consultation" */
  buttonText?: string;
  /** CTA 链接目标，默认 /contact */
  href?: string;
}

export default function CTABanner({
  headline,
  buttonText = 'Book a Free Consultation',
  href = '/contact',
}: CTABannerProps) {
  return (
    <AnimateOnScroll>
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="rounded-2xl bg-gradient-to-r from-[#2980b9]/20 via-[#3498db]/30 to-[#2980b9]/20 border border-[#3498db]/20 px-8 py-16 sm:px-16">
            <h2 className="text-3xl md:text-4xl font-light text-white mb-8">
              {headline}
            </h2>
            <Link
              href={href}
              className="inline-block bg-[#3498db] hover:bg-[#2980b9] text-white font-light px-8 py-3 rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#3498db]/25"
            >
              {buttonText}
            </Link>
          </div>
        </div>
      </section>
    </AnimateOnScroll>
  );
}
