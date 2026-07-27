// ─── 石墨墙 · Graphite Wall v9（错缝砌体）───
// 概念：墙 = 一面被左上 45° 掠射光斜照的实心石墨砌体；指针 = 压在上面的重力井。
// 全站唯一背景材质，(public)/layout 的 relative wrapper 内挂载一次。
// 墙属场景（fixed）：内容从墙前滚过，墙不动——零滚动耦合。
//
// 砌法（v9）：**running bond 半砖错缝**，砖 pitch = 3Q × Q（砖面 3.18:1，
// 与真实模数砖同比例），几何唯一事实源 = CSS 的 --wall-brick-h。
// 静态路径靠「同一张砖图叠两遍、第二遍偏移 (P/2, Q)」表达错缝——
// 全站仍然只有一张砖图。
//
// **墙后没有任何发光体**：v6 的角落余晖与指针灯已于 v8 退役。厚度靠材料
// 自己读出（受光棱线 / 倒角亮带 / 背光带 / 凹槽凸凹线索对调 / 逐砖明度
// 不均），深度靠变暗（砖陷得越深越透，露出更暗的砖床槽底）。
//
// 层纪律（v6「单层砖」的 v8 修订）：**一层砖 + 一层砖床，砖床恒在砖后**。
// 砖床不是砖也不是光，是砖的凹槽——判别标准 = 不参与遮掩、不冒充光、
// 不随帧变化。
//
// 层结构（globals.css .bp-wall* 系；z 均在 .bp-wall 的 -1 下）：
// ├─ bp-wall-face  砖床 + 砖 tile 叠加（无 JS/触屏/RM）…… z 1
// │                [data-live] 时丢掉砖层，只留砖床
// └─ bp-wall-grid  真砖阵（WallBricks 懒启动：重力井塌陷）… z 2
// Server Component — 纯装饰背景，aria-hidden；SSR 增量仅 2 个空 div

import ErrorBoundary from './ErrorBoundary';
import WallBricks from './WallBricks';

export default function BlueprintWall() {
  return (
    <div aria-hidden="true" className="bp-wall">
      <div className="bp-wall-face" />
      {/* 边界收在 client 岛自身：WallBricks 抛错 → 卸载 → teardown 删
          data-live → 砖层回到 .bp-wall-face，墙完整可读，只丢重力井增强 */}
      <ErrorBoundary fallback={null}>
        <WallBricks />
      </ErrorBoundary>
    </div>
  );
}
