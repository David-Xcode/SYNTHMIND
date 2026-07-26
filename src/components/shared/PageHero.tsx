// ─── 内页 Hero · Blueprint ───
// about / products 共享的页头区块：
// 蓝图基准网格（滚动异速深度层）+ 径向光晕 + 图签 + light/bold 标题 + 副标题

import AnimateOnScroll from './AnimateOnScroll';
import BlueprintGrid from './BlueprintGrid';
import SheetLabel from './SheetLabel';

interface PageHeroProps {
  eyebrow: string;
  /** 标题普通字重部分 */
  light: string;
  /** 标题 Archivo 宽体蓝色高亮部分 */
  bold: string;
  subtitle?: string;
}

export default function PageHero({
  eyebrow,
  light,
  bold,
  subtitle,
}: PageHeroProps) {
  return (
    <section className="relative pt-8 pb-24 px-4 overflow-hidden">
      {/* 蓝图基准网格 — 随滚动反向缓移，制造轻微深度层 */}
      <BlueprintGrid className="depth-drift-back" />

      {/* 微妙径向光晕背景 — .hero-glow 定义在 globals.css */}
      <div
        className="pointer-events-none absolute inset-0 hero-glow"
        aria-hidden="true"
      />

      <div className="relative max-w-3xl mx-auto text-center">
        <AnimateOnScroll>
          <SheetLabel>{eyebrow}</SheetLabel>
        </AnimateOnScroll>

        <AnimateOnScroll delay={100}>
          <h1 className="mt-6 text-display leading-tight">
            <span className="font-sans font-light text-txt-primary">
              {light}{' '}
            </span>
            <span className="font-display font-semibold stretch-wide text-accent">
              {bold}
            </span>
          </h1>
        </AnimateOnScroll>

        {subtitle && (
          <AnimateOnScroll delay={200}>
            <p className="mt-6 text-subtitle text-txt-secondary leading-relaxed max-w-2xl mx-auto">
              {subtitle}
            </p>
          </AnimateOnScroll>
        )}
      </div>
    </section>
  );
}
