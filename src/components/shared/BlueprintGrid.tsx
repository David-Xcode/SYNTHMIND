// ─── 蓝图基准网格背景 · Blueprint ───
// 纯装饰层；双层网格线 + 径向 mask 渐隐定义在 globals.css .blueprint-grid
// 吸满最近的 relative 父容器；仅用于 Hero 与关键 section，不满屏铺

interface BlueprintGridProps {
  className?: string;
}

export default function BlueprintGrid({ className = '' }: BlueprintGridProps) {
  return (
    <div
      aria-hidden="true"
      className={`blueprint-grid pointer-events-none absolute inset-0 ${className}`}
    />
  );
}
