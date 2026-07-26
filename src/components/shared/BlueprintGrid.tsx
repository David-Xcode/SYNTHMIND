// ─── 蓝图基准网格背景 · Blueprint ───
// v3 起为双层结构：静态格线层 + 懒构建砖墙层（GridBricks，桌面精指针专属）
// 径向 mask 在 wrap 上（两层同步渐隐）；砖层激活时静态层整层隐藏，
// 砖块自绘同规格格线——静止时与纯静态网格逐像素一致（隐藏感纪律）
// 吸满最近的 relative 父容器；仅用于 Hero 与关键 section，不满屏铺
// className 透传给 wrap（PageHero 的 depth-drift-back 使砖随图纸层整体异速漂移）

import GridBricks from './GridBricks';

interface BlueprintGridProps {
  className?: string;
}

export default function BlueprintGrid({ className = '' }: BlueprintGridProps) {
  return (
    <div
      aria-hidden="true"
      className={`bp-grid-wrap pointer-events-none absolute inset-0 ${className}`}
    >
      <div className="blueprint-grid absolute inset-0" />
      <GridBricks />
    </div>
  );
}
