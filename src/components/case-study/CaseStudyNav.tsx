// ─── 案例详情页尾导航 · Blueprint ───
// IA v1 §4.4 转化断点修复：详情页读完是死胡同——没有下一站，也没有转化出口。
// 本组件补上「下一站」（相邻案例，数据层顺序派生并首尾环绕），CTABanner 补上
// 转化出口，两者一起构成页尾闭环。
// Server Component：无 hooks/事件，交互全在 client 叶子（AnimateOnScroll）

import Link from 'next/link';
import AnimateOnScroll from '@/components/shared/AnimateOnScroll';
import ArrowRightIcon from '@/components/shared/ArrowRightIcon';
import Card from '@/components/shared/Card';
import Eyebrow from '@/components/shared/Eyebrow';
import type { CaseStudy } from '@/data/case-studies';

interface CaseStudyNavProps {
  prev: CaseStudy | null;
  next: CaseStudy | null;
}

// 两侧共用一张卡；方向只影响眉标文案与箭头朝向
function NavCard({
  caseStudy,
  direction,
}: {
  caseStudy: CaseStudy;
  direction: 'prev' | 'next';
}) {
  const isPrev = direction === 'prev';
  return (
    <Link href={`/products/${caseStudy.slug}`} className="block h-full group">
      <Card variant="interactive" className="h-full">
        {/* 方向词是链接可访问名的一部分（信息性，非装饰）→ tertiary 档；
            quaternary 是装饰/aria-hidden 专用，与三个兄弟卡组件同口径 */}
        <Eyebrow
          tone="tertiary"
          className={`block ${isPrev ? '' : 'text-right'}`}
        >
          {isPrev ? 'Previous project' : 'Next project'}
        </Eyebrow>
        <div
          className={`mt-3 flex items-center gap-2 ${isPrev ? '' : 'justify-end text-right'}`}
        >
          {/* ArrowRightIcon 自身已带 aria-hidden，且不透传 rest props */}
          {isPrev && (
            <ArrowRightIcon className="w-3.5 h-3.5 rotate-180 text-accent flex-shrink-0 transition-transform duration-300 group-hover:-translate-x-0.5" />
          )}
          <span className="text-base font-medium text-txt-primary tracking-tight">
            {caseStudy.title}
          </span>
          {!isPrev && (
            <ArrowRightIcon className="w-3.5 h-3.5 text-accent flex-shrink-0 transition-transform duration-300 group-hover:translate-x-0.5" />
          )}
        </div>
        {/* 行业眉标与 CaseStudyCard 同形态（mono 大写），同一数据不两种排版 */}
        <Eyebrow
          tone="tertiary"
          className={`block mt-2 ${isPrev ? '' : 'text-right'}`}
        >
          {caseStudy.industry}
        </Eyebrow>
      </Card>
    </Link>
  );
}

export default function CaseStudyNav({ prev, next }: CaseStudyNavProps) {
  if (!prev && !next) return null;

  return (
    <nav className="relative py-16 px-4" aria-label="More case studies">
      <hr className="ruled-line absolute top-0 left-0 right-0" />
      <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-5">
        {prev && (
          <AnimateOnScroll>
            <NavCard caseStudy={prev} direction="prev" />
          </AnimateOnScroll>
        )}
        {next && (
          // 只有 next（数据层恰好两条时的分支）：卡片仍钉在右列，
          // 否则整卡右对齐的内容会指着空着的右半格
          <AnimateOnScroll delay={80} className={prev ? '' : 'sm:col-start-2'}>
            <NavCard caseStudy={next} direction="next" />
          </AnimateOnScroll>
        )}
      </div>
    </nav>
  );
}
