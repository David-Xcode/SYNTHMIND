// ─── 案例卡 · Blueprint ───
// 软件案例的唯一卡片形态，两处消费同源（IA v1 §4.1）：/products 六张网格 +
// 首页 02 精选三张。加信息密度（行业眉标）时只改这里，不改两份 JSX。
// 整卡可点 → Card interactive；使用处外层不再包 Link（本组件自持）。
// Server Component：交互全在 client 叶子（CardTilt 由 Card 内部按变体挂载）

import Image from 'next/image';
import Link from 'next/link';
import Card from '@/components/shared/Card';
import CardActionRow from '@/components/shared/CardActionRow';
import Eyebrow from '@/components/shared/Eyebrow';
import type { CaseStudy } from '@/data/case-studies';

interface CaseStudyCardProps {
  caseStudy: CaseStudy;
  /** 图纸编号（如 "S.01"）— 产品即图纸集里的一张 sheet */
  sheetNo: string;
  /** 收尾行文案，默认 "View" */
  action?: string;
}

export default function CaseStudyCard({
  caseStudy,
  sheetNo,
  action = 'View',
}: CaseStudyCardProps) {
  return (
    <Link href={`/products/${caseStudy.slug}`} className="block h-full group">
      {/* flex-col + mt-auto：收尾行统一钉在卡底（等高网格对齐） */}
      <Card
        variant="interactive"
        sheetNo={sheetNo}
        cropMarks
        className="h-full flex flex-col"
      >
        <div className="h-10 mb-4 flex items-center">
          <Image
            src={caseStudy.logo}
            alt={`${caseStudy.title} logo`}
            width={120}
            height={36}
            className="h-8 w-auto object-contain filter brightness-0 invert opacity-50 group-hover:opacity-90 transition-opacity duration-300"
            suppressHydrationWarning
          />
        </div>

        {/* 行业 = 信息性 metadata → tertiary 档（quaternary 正文禁用） */}
        <Eyebrow tone="tertiary" className="block mb-2">
          {caseStudy.industry}
        </Eyebrow>

        <h3 className="text-base font-medium text-txt-primary mb-2 tracking-tight">
          {caseStudy.title}
        </h3>
        {/* 产品描述 = 卡内承担实际阅读的正文 → secondary/base（§2.2） */}
        <p className="text-txt-secondary text-base leading-relaxed mb-4">
          {caseStudy.tagline}
        </p>

        <div className="mt-auto flex items-center justify-end">
          <CardActionRow>{action}</CardActionRow>
        </div>
      </Card>
    </Link>
  );
}
