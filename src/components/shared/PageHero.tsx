// ─── 内页 Hero · Neural ───
// about / products 共享的页头区块：径向光晕 + 眉标 + light/bold 标题 + 副标题
// 此前两页各自复制了整段结构与内联渐变，统一收拢

import AnimateOnScroll from './AnimateOnScroll';
import Eyebrow from './Eyebrow';

interface PageHeroProps {
  eyebrow: string;
  /** 标题普通字重部分 */
  light: string;
  /** 标题 Sora semibold 蓝色高亮部分 */
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
      {/* 微妙径向光晕背景 — .hero-glow 定义在 globals.css */}
      <div
        className="pointer-events-none absolute inset-0 hero-glow"
        aria-hidden="true"
      />

      <div className="relative max-w-3xl mx-auto text-center">
        <AnimateOnScroll>
          <Eyebrow>{eyebrow}</Eyebrow>
        </AnimateOnScroll>

        <AnimateOnScroll delay={100}>
          <h1 className="mt-6 text-display leading-tight">
            <span className="font-sans font-light text-txt-primary">
              {light}{' '}
            </span>
            <span className="font-display font-semibold text-accent">
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
