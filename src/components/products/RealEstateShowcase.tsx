// ─── 地产营销站统一展示模块 · Blueprint ───
// 4 个已上线楼盘站合并为一个模块：总述 + 紧凑卡片，外链直达真实站点
// id="real-estate" 供首页 marquee 与旧详情页 301 锚点跳转

import Image from 'next/image';
import AnimateOnScroll from '@/components/shared/AnimateOnScroll';
import Card from '@/components/shared/Card';
import CardActionRow from '@/components/shared/CardActionRow';
import ExternalArrowIcon from '@/components/shared/ExternalArrowIcon';
import Eyebrow from '@/components/shared/Eyebrow';
import HighlightTag from '@/components/shared/HighlightTag';
import SectionTitle from '@/components/shared/SectionTitle';
import { realEstateSites } from '@/data/real-estate';

export default function RealEstateShowcase() {
  return (
    <section id="real-estate" className="relative py-24 px-4 scroll-mt-24">
      <hr className="ruled-line absolute top-0 left-0 right-0" />

      <div className="max-w-6xl mx-auto">
        <AnimateOnScroll>
          <SectionTitle
            sheetNo="02"
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
                className="block h-full group"
                aria-label={`Visit ${site.name} live site`}
              >
                <Card
                  variant="interactive"
                  accent
                  className="h-full flex flex-col"
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
                  <Eyebrow tone="quaternary" className="block mt-1">
                    {site.location}
                  </Eyebrow>

                  <p className="mt-3 text-txt-tertiary text-sm leading-relaxed">
                    {site.description}
                  </p>

                  {/* 能力标签 */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {site.highlights.map((highlight) => (
                      <HighlightTag key={highlight}>{highlight}</HighlightTag>
                    ))}
                  </div>

                  {/* 外链指示 — 推到卡片底部对齐 */}
                  <div className="mt-auto pt-5 flex items-center justify-end">
                    <CardActionRow
                      icon={<ExternalArrowIcon className="w-3.5 h-3.5" />}
                    >
                      Visit live site
                    </CardActionRow>
                  </div>
                </Card>
              </a>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
