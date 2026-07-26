// ─── 随滚方砖墙 · Living Blueprint v4.2 ───
// 设计定案：docs/superpowers/specs/2026-07-26-living-blueprint-v4.2-design.md
// 全站唯一背景材质，(public)/layout 的 relative wrapper 内挂载一次：
// 静态墙文档级 absolute——无 JS/触屏/RM 三路径也随页面滚动；
// JS 砖池文档级锚定（滚动全程合成器精确，v4.1 fixed 回卷已退役）
//
// 层结构（globals.css .bp-wall* 系；DOM 序 = 画序，z 均在 .bp-wall 的 -1 下）：
// ├─ bp-wall-light   光槽层（缝隙灯槽，随滚，恒在）
// ├─ bp-wall-face    静态方砖面（SVG data-URI tile 单层，CSS 直出随滚，
// │                  恒在——物化格的遮蔽由砖池逐格底衬承担）
// ├─ WallBricks      桌面精指针懒启动邻域砖池（指针半径内的砖沿边铰链
// │                  外翻 ≤80°、槽腔涌光；池上限 512，与视口尺寸解耦）
// └─ bp-wall-wash    fixed 洗墙光——恒在最上（静态面与 DOM 砖同受光）；
//                    光源属视口：墙动光不动
// Server Component — 纯装饰背景，aria-hidden；SSR 增量仅 5 个空 div

import WallBricks from './WallBricks';

export default function BlueprintWall() {
  return (
    <div aria-hidden="true" className="bp-wall">
      <div className="bp-wall-light" />
      <div className="bp-wall-face" />
      <WallBricks />
      <div className="bp-wall-wash" />
    </div>
  );
}
