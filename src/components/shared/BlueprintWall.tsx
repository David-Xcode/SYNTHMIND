// ─── 真砖重力井墙 · Lantern Wall v6 ───
// 概念：墙 = 光前面的一排真砖；指针 = 压在墙上的重力井。
// 全站唯一背景材质，(public)/layout 的 relative wrapper 内挂载一次。
// 墙属场景（fixed）：内容从墙前滚过，墙与光都不动——零滚动耦合。
//
// 单层砖纪律：任何时刻只有一层砖——
// 桌面指针路径 = WallBricks 铺满视口的真砖 div（缝隙是真空隙，
// 墙后的灯直接从缝里透出）；触屏/RM/无 JS = 静态 tile（像素等价）；
// 接管经 .bp-wall[data-live] 互斥切换，永不叠加。
//
// 层结构（globals.css .bp-wall* 系；层序由 z-index 决定，z 均在 .bp-wall 的 -1 下）：
// ├─ bp-wall-ambient 角落余晖 + 环境光（墙后，零 JS 恒在）
// ├─ bp-wall-lamp    指针灯（墙后，WallBricks 弹簧驱动）………… z auto
// ├─ bp-wall-face    静态方砖面 tile（无指针路径的那层砖）……… z 1
// └─ bp-wall-grid    真砖阵（WallBricks 懒启动：重力井塌陷）…… z 1（互斥）
// Server Component — 纯装饰背景，aria-hidden；SSR 增量仅 4 个空 div

import ErrorBoundary from './ErrorBoundary';
import WallBricks from './WallBricks';

export default function BlueprintWall() {
  return (
    <div aria-hidden="true" className="bp-wall">
      <div className="bp-wall-ambient" />
      <div className="bp-wall-face" />
      {/* 边界收在 client 岛自身：WallBricks 抛错只丢重力井增强，
          余晖 + 静态 tile（SSR 层）无恙——墙是 v6 唯一背景材质，不可全灭 */}
      <ErrorBoundary fallback={null}>
        <WallBricks />
      </ErrorBoundary>
    </div>
  );
}
