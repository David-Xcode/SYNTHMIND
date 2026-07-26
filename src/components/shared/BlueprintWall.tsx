// ─── 随滚方砖墙 · Living Blueprint v4.1 ───
// 设计定案：docs/superpowers/specs/2026-07-26-living-blueprint-v4.1-design.md
// 全站唯一背景材质，(public)/layout 的 relative wrapper 内挂载一次：
// 静态墙文档级 absolute——无 JS/触屏/RM 三路径也随页面滚动（David 需求的
// 无 JS 正解）；JS 砖场 fixed + mod 回卷追随
//
// 层结构（globals.css .bp-wall* 系；DOM 序 = 画序，z 均在 .bp-wall 的 -1 下）：
// ├─ bp-wall-light   光槽层（缝隙灯槽，随滚；砖翘起让开时露宽光带）
// │                  ——data-bricks="on" 时本层退场，同一渐变栈改由砖场
// │                  背景承担（与砖同一 transform 下逐帧对齐，见 globals.css）
// ├─ bp-wall-face    静态方砖面（SVG data-URI tile 单层，CSS 直出随滚）
// ├─ WallBricks      桌面精指针懒构建 JS 砖场（fixed + mod 回卷，
// │                  data-bricks 同帧接管，静止态与静态层逐像素等价）
// └─ bp-wall-wash    fixed 洗墙光——恒在最上（静态面与 DOM 砖同受光，
//                    接管前后一致）；光源属视口：墙动光不动
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
