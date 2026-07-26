// ─── 裁切角标 · Blueprint ───
// 图纸四角 L 形 crop marks — 微小细节，注意到才看见
// 吸满最近的 relative 父容器；仅用于关键卡片/区块，克制使用

interface CropMarksProps {
  className?: string;
}

// 四角共用的基础类（尺寸 8px，颜色走边框最重档）
const CORNER = 'absolute h-2 w-2 border-[var(--border-heavy)]';

export default function CropMarks({ className = '' }: CropMarksProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className}`}
    >
      <span className={`${CORNER} top-0 left-0 border-t border-l`} />
      <span className={`${CORNER} top-0 right-0 border-t border-r`} />
      <span className={`${CORNER} bottom-0 left-0 border-b border-l`} />
      <span className={`${CORNER} bottom-0 right-0 border-b border-r`} />
    </div>
  );
}
