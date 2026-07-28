// ─── 深空引力场 · Void Field v1 ───
// 概念：背景 = 一片静止的深空，指针 = 压在空间上的引力井。
// 全站唯一背景（L0），(public)/layout 与 not-found 各挂一次（永不同时）。
// 正本 = docs/superpowers/specs/2026-07-27-void-field-v1-deep-space-design.md
//
// 三条立场：
// ① 宇宙是静的 —— 星云不漂移、不呼吸、不闪烁，唯一的运动来自你施加的
//    引力。指针不动时空闲成本**不存在**（零 rAF / 零 GPU / 零主线程）
// ② 极简是硬要求 —— ≥90% 画面是接近纯黑的深空底，可见内容只有一道主
//    星云带、一道次带、极稀疏的星点。禁止繁星点点 / 旋臂 / 任何具象天体
// ③ 深邃靠明度层次与暗角，不靠元素数量
//
// 层纪律 —— **两层，且永不同时可见**：
// ├─ .void-field-still  静态帧（SSR 直出，唯一保底）………… z 1
// └─ canvas.void-field-gl  WebGL2 实时层（client 岛挂载后创建）… z 2
//    初始化成功 → 落 [data-live] → 静态帧整个 display:none
// 判别标准（对应砖墙「砖床不是砖也不是光」）：静态帧层**不参与合成**。
// canvas 以 alpha:false 创建并清成不透明色，静态层留在下面只会白费一次
// 合成。🚨 禁止再造第三层 —— 砖墙历史上「tile + DOM 砖 + 底衬 + 假涌光」
// 四层互相遮掩的机器已因不可维护而退役。
//
// 背景属场景：fixed 全视口，内容从背景前滚过、背景不动（零滚动耦合）。
// Server Component —— 纯装饰，aria-hidden；SSR 增量仅 2 个空 div
// （canvas 不在 SSR 输出里，无 JS 时不留空白 canvas 压在静态帧上）

import ErrorBoundary from './ErrorBoundary';
import VoidFieldGL from './VoidFieldGL';

export default function VoidField() {
  return (
    <div aria-hidden="true" className="void-field">
      <div className="void-field-still" />
      {/* 边界收在 client 岛自身：抛错 → 卸载 → teardown 撤 data-live
          → 静态帧原地复位，背景完整可读，只丢引力井增强 */}
      <ErrorBoundary fallback={null}>
        <VoidFieldGL />
      </ErrorBoundary>
    </div>
  );
}
