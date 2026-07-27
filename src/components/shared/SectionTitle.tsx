// ─── 节标题组件 · Blueprint ───
// Archivo 宽体用于高亮词 / SheetLabel 图签（可带图纸编号）
//
// 标题三档制（IA v1 定案，spec §2.1）——档位 = 内容重量，不是「这一段想多醒目」：
// - 页级（display / 居中）：页面 h1 专属，由 PageHero / CTABanner 承担，
//   **不走本组件**——lg 档保留只为极窄的例外，正常页面不该出现
// - 章级 md（默认）：页内主要叙事单元，左对齐 + mb-10
// - 组级 sm：辅助内容（FAQ / 次级列表），左对齐 + mb-8
// 默认值方向即纪律：新 section 天然落章级，仪式感必须显式索取
// （size="lg" / align="center"），不再是「不写就得到 72px 居中大字」。

import SheetLabel from './SheetLabel';

interface SectionTitleProps {
  /** 普通字重的前缀文字 */
  light: string;
  /** 加粗的高亮文字 (Archivo semibold 宽体) */
  bold: string;
  /** 可选副标题 */
  subtitle?: string;
  /** 标题尺寸档位，默认章级 md（页级 lg 属例外，见文件头） */
  size?: 'lg' | 'md' | 'sm';
  /** 对齐方式，默认左对齐（居中只留给页面 hero 与 CTA） */
  align?: 'center' | 'left';
  /** 图签标签 (如 "OUR PROCESS")，IBM Plex Mono */
  eyebrow?: string;
  /** 图纸编号 (如 "02") — 页内 section 序号，随 eyebrow 渲染 */
  sheetNo?: string;
}

// 尺寸档 → 标题排版 + 下间距（间距随档位走，调用处不再手动补 margin）
const SIZE_CLASS = {
  lg: { heading: 'text-display tracking-tight', gap: 'mb-16' },
  md: { heading: 'text-headline tracking-tight', gap: 'mb-10' },
  sm: { heading: 'text-title tracking-tight', gap: 'mb-8' },
} as const;

export default function SectionTitle({
  light,
  bold,
  subtitle,
  size = 'md',
  align = 'left',
  eyebrow,
  sheetNo,
}: SectionTitleProps) {
  const { heading: headingClass, gap } = SIZE_CLASS[size];

  return (
    <div
      className={`${align === 'center' ? 'text-center' : 'text-left'} ${gap}`}
    >
      {eyebrow && (
        <SheetLabel no={sheetNo} className="mb-4">
          {eyebrow}
        </SheetLabel>
      )}
      <h2 className={`${headingClass} text-txt-primary mb-4`}>
        <span className="font-sans font-light">{light}</span>{' '}
        <span className="font-display font-semibold stretch-wide">{bold}</span>
      </h2>
      {subtitle && (
        <p
          className={`max-w-2xl mt-4 text-base md:text-lg text-txt-secondary leading-relaxed ${align === 'center' ? 'mx-auto' : ''}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
