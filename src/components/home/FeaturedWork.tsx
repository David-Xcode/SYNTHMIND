// ─── 首页 02 · Shipped 精选 · Blueprint ───
// 说服链第二段（IA v1 §3）：回答「凭什么信你」——三张已上线案例卡 +
// 通向 /products 全量作品的出口。卡片形态走共享 <CaseStudyCard />，
// 与 /products 六卡网格同源；精选口径存数据层 featured 标记，不在此硬编码。
// Server Component：交互全在 client 叶子（AnimateOnScroll / Card 内 CardTilt）

import Link from 'next/link';
import CaseStudyCard from '@/components/products/CaseStudyCard';
import AnimateOnScroll from '@/components/shared/AnimateOnScroll';
import ArrowRightIcon from '@/components/shared/ArrowRightIcon';
import SectionTitle from '@/components/shared/SectionTitle';
import { caseStudies, featuredCaseStudies } from '@/data/case-studies';

// slug → 全量作品集里的图纸页码（1-based）。模块级常量：Server Component 中
// 每次请求只建一次，省掉渲染循环里的 findIndex 嵌套扫描
const sheetIndex = new Map(caseStudies.map((cs, i) => [cs.slug, i + 1]));

export default function FeaturedWork() {
  return (
    <section className="relative py-24 px-4">
      <hr className="ruled-line absolute top-0 left-0 right-0" />

      <div className="max-w-6xl mx-auto">
        <AnimateOnScroll>
          <SectionTitle
            sheetNo="02"
            eyebrow="SHIPPED WORK"
            light="Already Live,"
            bold="Already Working"
            subtitle="The platform above is built out of problems we have already solved for someone else. These three are running in production today."
          />
        </AnimateOnScroll>

        {/* 断点阶梯与 /products 网格一致：md 直接上三列会把每卡压到
            ~184px 内容宽，提档后的 text-base 描述要折 7–8 行 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredCaseStudies.map((cs, index) => (
            <AnimateOnScroll key={cs.slug} delay={index * 80 + 100}>
              {/* 图纸编号取全量作品集里的真实页码（不是精选内的 1/2/3）——
                  编号只用于真实序列，首页与 /products 指同一张 sheet */}
              <CaseStudyCard
                caseStudy={cs}
                sheetNo={`S.${String(sheetIndex.get(cs.slug) ?? 0).padStart(2, '0')}`}
              />
            </AnimateOnScroll>
          ))}
        </div>

        {/* 段出口 — 每段给一个去处（说服链纪律） */}
        <AnimateOnScroll delay={featuredCaseStudies.length * 80 + 180}>
          <div className="mt-10">
            <Link
              href="/products"
              className="inline-flex items-center gap-1 text-accent text-sm font-medium transition-all duration-300 hover:gap-1.5"
            >
              View all work
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </Link>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
