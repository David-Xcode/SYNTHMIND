// ─── 节标题组件 · Neural ───
// Sora semibold 用于高亮词 / JetBrains Mono 用于眉标

import Eyebrow from './Eyebrow';

interface SectionTitleProps {
  /** 普通字重的前缀文字 */
  light: string;
  /** 加粗的高亮文字 (使用 Sora semibold) */
  bold: string;
  /** 可选副标题 */
  subtitle?: string;
  /** 标题尺寸 */
  size?: 'lg' | 'md' | 'sm';
  /** 对齐方式 */
  align?: 'center' | 'left';
  /** 彩色小标签 (如 "OUR PROCESS")，使用 JetBrains Mono */
  eyebrow?: string;
}

export default function SectionTitle({
  light,
  bold,
  subtitle,
  size = 'lg',
  align = 'center',
  eyebrow,
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
      {eyebrow && <Eyebrow className="inline-block mb-4">{eyebrow}</Eyebrow>}
      <h2 className={`${headingClass} text-txt-primary mb-4`}>
        <span className="font-sans font-light">{light}</span>{' '}
        <span className="font-display font-semibold">{bold}</span>
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
