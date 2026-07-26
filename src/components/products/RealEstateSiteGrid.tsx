// ─── 地产盘卡片网格 · Blueprint ───
// /products/real-estate 聚合详情页的核心展示件：每盘一张 interactive 卡，
// 外链直达真实站点。数据单源 src/data/real-estate.ts（只收已上线的盘）。
// 前身 = RealEstateShowcase（/products 页内 section，2026-07-26 随地产
// 打包为独立项目退役）——卡片样式与外链行为原样保留

import Image from 'next/image';
import AnimateOnScroll from '@/components/shared/AnimateOnScroll';
import Card from '@/components/shared/Card';
import CardActionRow from '@/components/shared/CardActionRow';
import ExternalArrowIcon from '@/components/shared/ExternalArrowIcon';
import Eyebrow from '@/components/shared/Eyebrow';
import HighlightTag from '@/components/shared/HighlightTag';
import { realEstateSites } from '@/data/real-estate';

export default function RealEstateSiteGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {realEstateSites.map((site, index) => (
        <AnimateOnScroll key={site.slug} delay={index * 80 + 100}>
          <a
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block h-full group"
            aria-label={`Visit ${site.name} live site (opens in a new tab)`}
          >
            <Card variant="interactive" accent className="h-full flex flex-col">
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
              {/* 位置是信息性 metadata → tertiary 档（quaternary 仅装饰） */}
              <Eyebrow tone="tertiary" className="block mt-1">
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
  );
}
