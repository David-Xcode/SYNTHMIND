// ─── 节标题组件 · Neural ───
// Sora semibold 用于高亮词 / JetBrains Mono 用于眉标 / 支持左右不对称交替

interface SectionTitleProps {
  /** 普通字重的前缀文字 */
  light: string;
  /** 加粗的高亮文字 (使用 Sora semibold) */
  bold: string;
  /** 可选副标题 */
  subtitle?: string;
  /** 标题尺寸 */
  size?: 'lg' | 'md' | 'sm';
  /** 对齐方式 — 支持左右不对称交替 */
  align?: 'center' | 'left' | 'right';
  /** 彩色小标签 (如 "OUR PROCESS")，使用 JetBrains Mono */
  eyebrow?: string;
  /** 是否显示蓝色分割线，默认不显示 */
  divider?: boolean;
}

export default function SectionTitle({
  light,
  bold,
  subtitle,
  size = 'lg',
  align = 'center',
  eyebrow,
  divider = false,
}: SectionTitleProps) {
  // 根据 size 决定标题样式
  const headingClass = {
    lg: 'text-display tracking-tight',
    md: 'text-headline tracking-tight',
    sm: 'text-title tracking-tight',
  }[size];

  const alignClass = {
    center: 'text-center',
    left: 'text-left',
    right: 'text-right',
  }[align];

  const subtitleAlign =
    align === 'center' ? 'mx-auto' : align === 'right' ? 'ml-auto' : '';
  const dividerAlign =
    align === 'center' ? 'mx-auto' : align === 'right' ? 'ml-auto' : '';

  return (
    <div className={`${alignClass} mb-16`}>
      {eyebrow && (
        <span className="inline-block font-mono text-xs font-medium uppercase tracking-eyebrow text-accent mb-4">
          {eyebrow}
        </span>
      )}
      <h2 className={`${headingClass} text-txt-primary mb-4`}>
        <span className="font-sans font-light">{light}</span>{' '}
        <span className="font-display font-semibold">{bold}</span>
      </h2>
      {divider && (
        <div className={`w-16 h-px bg-accent/30 ${dividerAlign} mb-4`} />
      )}
      {subtitle && (
        <p
          className={`max-w-2xl mt-4 text-base md:text-lg text-txt-secondary leading-relaxed ${subtitleAlign}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
