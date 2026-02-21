'use client';

// ─── 精选案例展示 ───
// 首页展示 3 个 featured 案例的缩略卡片

import Link from 'next/link';
import Image from 'next/image';
import AnimateOnScroll from '@/components/shared/AnimateOnScroll';
import SectionTitle from '@/components/shared/SectionTitle';
import { getFeaturedCaseStudies } from '@/data/case-studies';

export default function FeaturedCaseStudies() {
  const featured = getFeaturedCaseStudies();

  return (
    <section className="py-32 bg-gradient-to-b from-[#1a1f2e] to-[#252b3b]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll>
          <SectionTitle
            light="Featured"
            bold="Projects"
            subtitle="Real solutions built for real businesses."
          />
        </AnimateOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {featured.map((cs, index) => (
            <AnimateOnScroll key={cs.slug} delay={index * 100 + 200}>
              <Link href={`/case-studies/${cs.slug}`} className="block h-full">
                <article className="glass-card rounded-2xl p-8 h-full group cursor-pointer">
                  {/* Logo */}
                  <div className="h-12 mb-6 flex items-center">
                    <Image
                      src={cs.logo}
                      alt={`${cs.title} logo`}
                      width={120}
                      height={36}
                      className="h-9 w-auto object-contain filter brightness-0 invert opacity-60 group-hover:opacity-90 transition-opacity"
                    />
                  </div>

                  {/* 标题 + 标语 */}
                  <h3 className="text-lg font-medium text-white/90 mb-2">{cs.title}</h3>
                  <p className="text-gray-400 text-sm font-light leading-relaxed mb-4">
                    {cs.tagline}
                  </p>

                  {/* 行业标签 */}
                  <span className={`inline-block text-xs px-3 py-1 rounded-full font-light ${
                    cs.industryLabel
                      ? 'text-[#3498db] bg-[#3498db]/10 border border-[#3498db]/20'
                      : 'text-gray-400 bg-white/5 border border-white/10'
                  }`}>
                    {cs.industryLabel || 'Small Business'}
                  </span>

                  {/* 查看链接 */}
                  <div className="mt-6">
                    <span className="text-[#3498db] text-sm font-light group-hover:translate-x-1 transition-transform inline-block">
                      View case study &rarr;
                    </span>
                  </div>
                </article>
              </Link>
            </AnimateOnScroll>
          ))}
        </div>

        {/* 查看全部 */}
        <AnimateOnScroll delay={600}>
          <div className="text-center mt-12">
            <Link
              href="/case-studies"
              className="btn-premium inline-block"
            >
              View All Projects
            </Link>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
