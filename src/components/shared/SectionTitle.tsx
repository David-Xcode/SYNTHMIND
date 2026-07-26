// ─── 节标题组件 · Blueprint ───
// Archivo 宽体用于高亮词 / SheetLabel 图签（可带图纸编号）

import SheetLabel from './SheetLabel';

interface SectionTitleProps {
  /** 普通字重的前缀文字 */
  light: string;
  /** 加粗的高亮文字 (Archivo semibold 宽体) */
  bold: string;
  /** 可选副标题 */
  subtitle?: string;
  /** 标题尺寸 */
  size?: 'lg' | 'md' | 'sm';
  /** 对齐方式 */
  align?: 'center' | 'left';
  /** 图签标签 (如 "OUR PROCESS")，IBM Plex Mono */
  eyebrow?: string;
  /** 图纸编号 (如 "02") — 页内 section 序号，随 eyebrow 渲染 */
  sheetNo?: string;
}

export default function SectionTitle({
  light,
  bold,
  subtitle,
  size = 'lg',
  align = 'center',
  eyebrow,
  sheetNo,
}: SectionTitleProps) {
  // 根据 size 决定标题样式
  const headingClass = {
    lg: 'text-display tracking-tight',
    md: 'text-headline tracking-tight',
    sm: 'text-title tracking-tight',
  }[size];

  return (
    <div
      className={`${align === 'center' ? 'text-center' : 'text-left'} mb-16`}
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
