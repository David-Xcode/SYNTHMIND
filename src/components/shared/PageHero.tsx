// ─── 内页 Hero · Blueprint ───
// about / products 共享的页头区块（contact 自 v7 起用紧凑标题行，不再消费）：
// 径向光晕 + 图签 + light/bold 标题 + 副标题
// v6：背景 = layout 级 fixed 场景砖墙（BlueprintWall，内容从墙前滚过）；
// 本组件的网格与 depth-drift 深度层已退役（深度由材质层次与墙后灯光承担）

import AnimateOnScroll from './AnimateOnScroll';
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
    // overflow-clip-safe 而非 overflow-hidden：hidden 会创建 scroll container，
    // 劫持子元素 view() 时间轴的滚动器查找，sheet-reveal 全部失效
    <section className="relative pt-8 pb-24 px-4 overflow-clip-safe">
      {/* 微妙径向光晕背景 — .hero-glow 定义在 globals.css */}
      <div
        className="pointer-events-none absolute inset-0 hero-glow"
        aria-hidden="true"
      />

      <div className="relative max-w-3xl mx-auto text-center">
        <AnimateOnScroll>
          <SheetLabel>{eyebrow}</SheetLabel>
        </AnimateOnScroll>

        {/* h1 是各页 LCP 元素 — 不加入场动画（CLAUDE.md 性能纪律） */}
        <h1 className="mt-6 text-display leading-tight">
          <span className="font-sans font-light text-txt-primary">
            {light}{' '}
          </span>
          <span className="font-display font-semibold stretch-wide text-accent">
            {bold}
          </span>
        </h1>

        {subtitle && (
          <AnimateOnScroll delay={150}>
            <p className="mt-6 text-subtitle text-txt-secondary leading-relaxed max-w-2xl mx-auto">
              {subtitle}
            </p>
          </AnimateOnScroll>
        )}
      </div>
    </section>
  );
}
