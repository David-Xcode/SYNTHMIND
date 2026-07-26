// ─── 满铺蓝图砖墙 · Living Blueprint v4 ───
// 设计定案：docs/superpowers/specs/2026-07-26-living-blueprint-v4-design.md（WF-C）
// 全站唯一背景材质，(public)/layout 挂载一次（fixed 单实例）：
// 「墙不动、图纸动」——内容滚动，墙作为深度基准静止，fixed 层滚动零重绘
//
// 层结构（globals.css .bp-wall* 系）：
// ├─ bp-wall-light   透光层（埋于砖下，砖翘起让开时露出宽光带——
// │                  物件缝光系统的墙体版，纯几何显影）
// ├─ bp-wall-face×2  奇偶行静态砖面（CSS 直出：无 JS/触屏/RM 三路径
// │                  也看到完整材质——缝隙/受光/厚度暗示/细分格）
// └─ WallBricks      桌面精指针懒构建 JS 砖场（data-bricks 同帧接管，
//                    静止态与静态层逐像素等价）
// Server Component — 纯装饰背景，aria-hidden；SSR 增量仅 4 个空 div

import WallBricks from './WallBricks';

export default function BlueprintWall() {
  return (
    <div aria-hidden="true" className="bp-wall">
      <div className="bp-wall-light" />
      <div className="bp-wall-face" />
      <div className="bp-wall-face bp-wall-face--b" />
      <WallBricks />
    </div>
  );
}
