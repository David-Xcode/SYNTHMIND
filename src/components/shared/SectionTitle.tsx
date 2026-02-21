// ─── 统一的节标题组件 ───
// 提取自 About / Services / Products / Contact 中重复出现的 h2 + 分割线模式

interface SectionTitleProps {
  /** 普通字重的前缀文字 */
  light: string;
  /** 加粗的高亮文字 */
  bold: string;
  /** 可选副标题 */
  subtitle?: string;
}

export default function SectionTitle({ light, bold, subtitle }: SectionTitleProps) {
  return (
    <div className="text-center mb-20">
      <h2 className="text-5xl md:text-6xl font-extralight text-white mb-6 tracking-wide">
        {light} <span className="font-normal">{bold}</span>
      </h2>
      <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto" />
      {subtitle && (
        <p className="max-w-3xl mx-auto mt-8 text-lg text-gray-300 font-light leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
