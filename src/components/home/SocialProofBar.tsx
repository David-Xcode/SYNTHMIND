// ─── 客户 Logo 展示条 · Blueprint ───
// 双容器无缝 marquee / SheetLabel 图签
// 10 个 logo × 4 重复 → 轨道宽度覆盖 4K (3840px)
// Server Component — CSS marquee 不需要 JS，AnimateOnScroll 作为 Client 子组件自动处理

import Image from 'next/image';
import Link from 'next/link';
import AnimateOnScroll from '@/components/shared/AnimateOnScroll';
import SheetLabel from '@/components/shared/SheetLabel';
import { caseStudies } from '@/data/case-studies';
import { realEstateSites } from '@/data/real-estate';
import { INDUSTRIES_SERVED } from '@/lib/constants';

const REPEAT_COUNT = 4;

// 软件产品 → 各自详情页；地产盘 → 地产聚合详情页
const logoItems = [
  ...caseStudies.map((cs) => ({
    key: cs.slug,
    src: cs.logo,
    label: cs.title,
    href: `/products/${cs.slug}`,
  })),
  ...realEstateSites.map((site) => ({
    key: site.slug,
    src: site.logo,
    label: site.name,
    href: '/products/real-estate',
  })),
];

// 模块级常量 — 替代 useMemo，Server Component 中每次请求只执行一次
const logos = Array.from({ length: REPEAT_COUNT }, () => logoItems).flat();

export default function SocialProofBar() {
  return (
    // overflow-clip-safe：clip 不创建 scroll container（overflow-hidden 会让
    // 子元素的 view() 时间轴绑到本节，sheet-reveal 退化）
    // v4：透墙 section（背景 = 满铺砖墙）；两端渐隐改 mask（.marquee-fade）
    // IA v1 §3：本节不再是首页收尾，而是 hero 与 01 旗舰段之间的过渡带——
    // 上下留白双双收紧，让它贴着 hero 读成同一口气
    <section className="pt-10 pb-16 overflow-clip-safe">
      <AnimateOnScroll className="text-center">
        {/* 可数口径的信任声明（§2.5）：数字从数据层派生，新增产品自动跟上；
            行业数走 INDUSTRIES_SERVED，与 about stats 同源 */}
        <SheetLabel tone="tertiary" className="mb-8">
          {caseStudies.length + realEstateSites.length} products live across{' '}
          {INDUSTRIES_SERVED} industries
        </SheetLabel>
      </AnimateOnScroll>

      {/* Marquee 容器 — mask 两端淡出（对任意背景成立） */}
      <div className="relative marquee-fade">
        {/* 双容器滚动轨道 */}
        <div className="flex items-center w-max animate-marquee hover:[animation-play-state:paused]">
          {/* 第一份轨道 — 可点击跳转到对应项目 */}
          <div className="flex items-center gap-16 shrink-0 pr-16">
            {logos.map((item, i) => (
              <Link
                key={`a-${item.key}-${i}`}
                href={item.href}
                className="flex-shrink-0 transition-all duration-300 hover:scale-105"
              >
                <Image
                  src={item.src}
                  alt={`View ${item.label} project`}
                  width={120}
                  height={36}
                  className="h-8 w-auto object-contain filter brightness-0 invert opacity-45 hover:opacity-80 hover:drop-shadow-accent transition-all duration-300"
                  suppressHydrationWarning
                />
              </Link>
            ))}
          </div>
          {/* 第二份（无缝循环）— aria-hidden + tabIndex 避免重复聚焦 */}
          <div
            className="flex items-center gap-16 shrink-0 pr-16"
            aria-hidden="true"
          >
            {logos.map((item, i) => (
              <Link
                key={`b-${item.key}-${i}`}
                href={item.href}
                tabIndex={-1}
                className="flex-shrink-0 transition-all duration-300 hover:scale-105"
              >
                <Image
                  src={item.src}
                  alt=""
                  width={120}
                  height={36}
                  className="h-8 w-auto object-contain filter brightness-0 invert opacity-45 hover:opacity-80 hover:drop-shadow-accent transition-all duration-300"
                  suppressHydrationWarning
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
