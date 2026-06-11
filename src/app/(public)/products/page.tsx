// ─── 产品总览页 · Neural ───
// 两段式结构：软件产品网格（进详情页）+ 地产营销站统一模块（外链真实站点）

import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Breadcrumb from '@/components/layout/Breadcrumb';
import RealEstateShowcase from '@/components/products/RealEstateShowcase';
import AnimateOnScroll from '@/components/shared/AnimateOnScroll';
import ArrowRightIcon from '@/components/shared/ArrowRightIcon';
import GlassCard from '@/components/shared/GlassCard';
import PageHero from '@/components/shared/PageHero';
import SectionTitle from '@/components/shared/SectionTitle';
import { caseStudies } from '@/data/case-studies';

export const metadata: Metadata = {
  title: 'Products | Synthmind',
  description:
    'AI-powered software products and real estate marketing sites built for real businesses. See our work.',
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

      <PageHero
        eyebrow="OUR PRODUCTS"
        light="Real Solutions for"
        bold="Real Businesses."
        subtitle="From AI-powered document systems to modern marketing platforms — every project starts with understanding the problem and ends with working software."
      />

      {/* ── 软件产品网格 ── */}
      <section className="relative py-24 bg-bg-surface px-4">
        <hr className="ruled-line absolute top-0 left-0 right-0" />
        <div className="max-w-6xl mx-auto">
          <AnimateOnScroll>
            <SectionTitle
              eyebrow="SOFTWARE PRODUCTS"
              light="Custom"
              bold="Software"
              subtitle="Platforms and tools we designed, built, and shipped — each with its own case study."
              size="md"
            />
          </AnimateOnScroll>

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
                        suppressHydrationWarning
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
                        <ArrowRightIcon className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </GlassCard>
                </Link>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── 地产营销站统一模块 ── */}
      <RealEstateShowcase />
    </>
  );
}
