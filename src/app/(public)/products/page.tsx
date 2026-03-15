// ─── 产品总览页 · Neural ───
// 展示所有产品，简洁网格布局

import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Breadcrumb from '@/components/layout/Breadcrumb';
import AnimateOnScroll from '@/components/shared/AnimateOnScroll';
import GlassCard from '@/components/shared/GlassCard';
import { caseStudies } from '@/data/case-studies';

export const metadata: Metadata = {
  title: 'Products | Synthmind',
  description:
    'Real AI-powered software solutions built for real businesses. See our work.',
  alternates: { canonical: '/products' },
  openGraph: {
    title: 'Products — Synthmind',
    description: 'Real solutions built for real businesses.',
  },
};

export default function ProductsPage() {
  return (
    <>
      <Breadcrumb items={[{ label: 'Products' }]} />

      {/* ── Hero ── */}
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
              OUR PRODUCTS
            </span>
          </AnimateOnScroll>

          <AnimateOnScroll delay={100}>
            <h1 className="mt-6 text-display leading-tight">
              <span className="font-sans font-light text-txt-primary">
                Real Solutions for{' '}
              </span>
              <span className="font-display font-semibold text-accent">
                Real Businesses.
              </span>
            </h1>
          </AnimateOnScroll>

          <AnimateOnScroll delay={200}>
            <p className="mt-6 text-subtitle text-txt-secondary leading-relaxed max-w-2xl mx-auto">
              From AI-powered document systems to modern marketing platforms —
              every project starts with understanding the problem and ends with
              working software.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ── 产品网格 ── */}
      <section className="relative py-24 bg-bg-surface px-4">
        <hr className="ruled-line absolute top-0 left-0 right-0" />
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {caseStudies.map((cs, index) => (
              <AnimateOnScroll key={cs.slug} delay={index * 80 + 100}>
                <Link href={`/products/${cs.slug}`} className="block h-full">
                  <GlassCard
                    variant="elevated"
                    className="h-full group cursor-pointer"
                  >
                    <div className="h-10 mb-5 flex items-center">
                      <Image
                        src={cs.logo}
                        alt={`${cs.title} logo`}
                        width={120}
                        height={36}
                        className="h-8 w-auto object-contain filter brightness-0 invert opacity-50 group-hover:opacity-90 transition-opacity duration-300"
                      />
                    </div>

                    <h3 className="text-base font-medium text-txt-primary mb-2 tracking-tight">
                      {cs.title}
                    </h3>
                    <p className="text-txt-tertiary text-sm leading-relaxed mb-4">
                      {cs.tagline}
                    </p>

                    <div className="flex items-center justify-end">
                      <span className="inline-flex items-center gap-1 text-accent text-sm font-medium group-hover:gap-1.5 transition-all duration-300">
                        View
                        <svg
                          className="w-3.5 h-3.5"
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
                      </span>
                    </div>
                  </GlassCard>
                </Link>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
