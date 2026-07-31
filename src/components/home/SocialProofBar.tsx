// ─── 客户 Logo 展示条 · Blueprint ───
// 双轨无缝 marquee / SheetLabel 图签
// Server Component — CSS marquee 不需要 JS，AnimateOnScroll 作为 Client 子组件自动处理
//
// 2026-07-27 审查修复（a11y + DOM 体积）：
// - 可聚焦的只剩**第一组**（当前 13 个）logo。此前两轨里第一轨的 Link 全部
//   可 Tab，键盘用户要按 40 次才能走过 hero，屏幕阅读器逐条朗读 4 遍
// - REPEAT_COUNT 4 → 3：无缝双轨的覆盖要求作用于**单轨**，
//   3 组已覆盖 4K(3840)；降到 2 会在单轨 2 组宽度以上的视口露空档
//
// 2026-07-31 增补 3 个地产盘（10 → 13 logo）：单组 1377 → 2002px。
// - 覆盖仍成立：单轨 3 组 = 6005px > 3840
// - 🚨 marquee 时长必须同步：见 globals.css 的 .animate-marquee ——
//   平移量随内容宽度走而时长固定，不改就等于把滚动提速 45%（已改 60s → 87s）
// - ⚠️ 如实记录：上面那次 DOM/合成层瘦身**已被产品增长吃回去并反超**。
//   当前 13×6 = 78 节点、合成宽 6×2002 = 12010px，已高于瘦身前的 80 节点 / 11708px。
//   REPEAT_COUNT 降到 2 可以还手（52 节点 / 8008px 且仍 > 3840，比 10-logo 时代
//   宽裕——那时 2 组只有 2754px 才必须用 3），但这属于设计决策，留给下一次触碰时
//   连同「13 个 logo 是否还该全上跑马灯」一起判断，不在增站的顺手改动里做。
// - focus-within 暂停（WCAG 2.2.2）：Tab 进跑马灯即停，焦点不再随轨道漂移。
//   与 hover 暂停不同，focus-within 不受 hoverOnlyWhenSupported 门控

import Image from 'next/image';
import Link from 'next/link';
import AnimateOnScroll from '@/components/shared/AnimateOnScroll';
import SheetLabel from '@/components/shared/SheetLabel';
import { caseStudies } from '@/data/case-studies';
import { realEstateSites } from '@/data/real-estate';
import { INDUSTRIES_SERVED } from '@/lib/constants';

const REPEAT_COUNT = 3;

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

// 轨道 A / B 各 REPEAT_COUNT 组，共 2×REPEAT_COUNT 组等宽——marquee 的
// translateX(-50%) 恰好平移 REPEAT_COUNT 组，图案原样回绕
const DECORATIVE_RUNS = Array.from(
  { length: REPEAT_COUNT * 2 - 1 },
  (_, i) => `dup-${i}`,
);

const LOGO_CLASS =
  'h-8 w-auto object-contain filter brightness-0 invert opacity-45 hover:opacity-80 hover:drop-shadow-accent transition-all duration-300';

/**
 * 一组 logo。decorative = 纯视觉重复副本：整组 aria-hidden + 不可聚焦，
 * 无障碍树里只留唯一一组真实链接
 */
function LogoRun({
  keyPrefix,
  decorative = false,
}: {
  keyPrefix: string;
  decorative?: boolean;
}) {
  return (
    <div
      className="flex items-center gap-16 shrink-0 pr-16"
      aria-hidden={decorative || undefined}
    >
      {logoItems.map((item) => (
        <Link
          key={`${keyPrefix}-${item.key}`}
          href={item.href}
          tabIndex={decorative ? -1 : undefined}
          className="flex-shrink-0 transition-all duration-300 hover:scale-105"
        >
          <Image
            src={item.src}
            alt={decorative ? '' : `View ${item.label} project`}
            width={120}
            height={36}
            className={LOGO_CLASS}
            suppressHydrationWarning
          />
        </Link>
      ))}
    </div>
  );
}

export default function SocialProofBar() {
  return (
    // overflow-clip-safe：clip 不创建 scroll container（overflow-hidden 会让
    // 子元素的 view() 时间轴绑到本节，sheet-reveal 退化）
    // v4：透背景 section（背景 = 满铺深空引力场）；两端渐隐改 mask（.marquee-fade）
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
        {/* 无缝滚动轨道 */}
        <div className="flex items-center w-max animate-marquee hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]">
          {/* 唯一一组真实可聚焦链接 */}
          <LogoRun keyPrefix="live" />
          {/* 其余全部为视觉重复（含整条回绕轨道） */}
          {DECORATIVE_RUNS.map((id) => (
            <LogoRun key={id} keyPrefix={id} decorative />
          ))}
        </div>
      </div>
    </section>
  );
}
