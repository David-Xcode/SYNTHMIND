// ─── 地产营销站统一展示模块 · Neural ───
// 4 个已上线楼盘站合并为一个模块：总述 + 紧凑卡片，外链直达真实站点
// id="real-estate" 供首页 marquee 与旧详情页 301 锚点跳转

import Image from 'next/image';
import AnimateOnScroll from '@/components/shared/AnimateOnScroll';
import GlassCard from '@/components/shared/GlassCard';
import SectionTitle from '@/components/shared/SectionTitle';
import { realEstateSites } from '@/data/real-estate';

export default function RealEstateShowcase() {
  return (
    <section
      id="real-estate"
      className="relative py-24 bg-bg-base px-4 scroll-mt-24"
    >
      <hr className="ruled-line absolute top-0 left-0 right-0" />

      <div className="max-w-6xl mx-auto">
        <AnimateOnScroll>
          <SectionTitle
            eyebrow="REAL ESTATE MARKETING"
            light="Property"
            bold="Launch Sites"
            subtitle="Pre-construction marketing sites delivered end to end for GTA developments — design systems, bilingual AI assistants, lead capture, and SEO, all live in production."
            size="md"
          />
        </AnimateOnScroll>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {realEstateSites.map((site, index) => (
            <AnimateOnScroll key={site.slug} delay={index * 80 + 100}>
              <a
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full"
                aria-label={`Visit ${site.name} live site`}
              >
                <GlassCard
                  variant="spotlight"
                  className="h-full group cursor-pointer flex flex-col"
                >
                  <div className="h-10 mb-5 flex items-center">
                    <Image
                      src={site.logo}
                      alt={`${site.name} logo`}
                      width={120}
                      height={36}
                      className="h-8 w-auto object-contain filter brightness-0 invert opacity-50 group-hover:opacity-90 transition-opacity duration-300"
                      suppressHydrationWarning
                    />
                  </div>

                  <h3 className="text-base font-medium text-txt-primary tracking-tight">
                    {site.name}
                  </h3>
                  <p className="mt-1 font-mono text-xs uppercase tracking-eyebrow text-txt-quaternary">
                    {site.location}
                  </p>

                  <p className="mt-3 text-txt-tertiary text-sm leading-relaxed">
                    {site.description}
                  </p>

                  {/* 能力标签 */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {site.highlights.map((highlight) => (
                      <span
                        key={highlight}
                        className="text-xs text-txt-secondary bg-accent/[0.06] border border-accent/[0.12] rounded-md px-2 py-0.5"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>

                  {/* 外链指示 — 推到卡片底部对齐 */}
                  <div className="mt-auto pt-5 flex items-center justify-end">
                    <span className="inline-flex items-center gap-1 text-accent text-sm font-medium group-hover:gap-1.5 transition-all duration-300">
                      Visit live site
                      <svg
                        className="w-3.5 h-3.5"
                        aria-hidden="true"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        {/* 右上箭头 — 外链语义，区别于站内的 ArrowRightIcon */}
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M7 17L17 7m0 0H8m9 0v9"
                        />
                      </svg>
                    </span>
                  </div>
                </GlassCard>
              </a>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
