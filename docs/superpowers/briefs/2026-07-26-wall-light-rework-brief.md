# 砖墙开孔光效返工令 —「墙后单一光场」（v4.2-light）

> 🛑 **已彻底作废 — 绝对不要执行。**
> 本文的全部主题「**墙后单一光场**」已于 2026-07-27 被 Graphite Wall v8 整体推翻：
> **墙后没有任何发光体**，`.bp-wall-ambient` / `.bp-wall-lamp` 已删除，CLAUDE.md §2
> 明写「禁止以任何形式复活」。照本文实施 = 直接违反现行设计纪律。
> 墙体现行正本 = `docs/superpowers/specs/2026-07-27-graphite-wall-v8-design.md`。

## 你接手的是什么

- **v4.2 已实施并提交**（commit `8fb3006`，基线干净）：邻域砖池翻板墙
  （WallBricks 砖池架构、away 铰链外翻 ≤80° 夹 88、pitch 48 密度）、
  无底纹排版（.sheet-panel 退役、txt 提档）、嵌墙按钮（齐平/顶出/按入）。
  `npm run lint` / `npx tsc --noEmit` / `npm run build` 全过。
- 设计正本 = `docs/superpowers/specs/2026-07-26-living-blueprint-v4.2-design.md`。
  **本返工只推翻其 §2.5（涌光模型）与相关 CLAUDE.md 口径，其余定案不动。**
- 视觉自检进行到一半：砖墙密度/翻板/滚动对齐/无底纹可读性/详情页/页脚已过；
  **尚欠**：按钮三态特写（上轮截图时 locator.hover 把页面滚跑了，改用原生
  mouse.move 重测）、390px、RM 旗标、curl 验无 JS SSR DOM。
- **code-review-loop 未跑**——光效返工完成后与 v4.2 全部改动一起审。
- dev server 可能仍在 **3120**；动手前 `lsof -nP -iTCP:<port> -sTCP:LISTEN`
  查 3100/3120，**3000 上常跑 David 别的项目，别碰**；验证一律 3100+。

## David 的返工原话（2026-07-26，一条不许漏）

> 「你这个翻牌之后，我不是说每一个方块后面都有个独立灯光，它应该是背景有
> 一个光。然后你翻开之后，它是一种从背景打出来的光。就好比说你现在有一面墙，
> 这面墙翻开之后，外面的阳光直接射入，它是这种效果。」

## 错在哪（现状 vs 正确模型）

- **现状**（v4.2 §2.5 已实施）：每个物化格的槽腔底衬自带两层光——
  `.bp-brick-uglow`（格内径向，**光心在各自格中央**）+ `.bp-brick-spill`
  （格外溢光，也是 per-cell）。观感 = **每砖一盏独立小灯**：相邻开孔各有
  光心，光斑互不连续。
- **正确模型**：墙后只有**一个连续光场**（「墙外的天光/阳光」）。开孔 =
  在墙上开窗，露出的是**同一片光的不同部分**——相邻开孔的光斑必须在几何上
  **拼得上**（连续性是硬验收项）；单孔进光量随翻开角（开缝大小）变化，
  但光心/方向属于场景，不属于任何一块砖。

## 技术要点与坑（先读再设计）

1. **连续性的白名单内实现（建议主案）**：每孔一个「窗口」元素（inset 0 +
   裁切）+ 窗口内「光斑」子元素（尺寸 ≥ 光场直径），**全部光斑用
   `transform: translate3d` 锚定到同一文档坐标（光心）**→ 多个窗口显露的
   在数学上就是同一片光。transform 在动画属性白名单内，零豁免。
   裁切用 `.overflow-clip-safe` 语义（墙层无 scroll-driven 子树，hidden
   本身无害，但 clip 更稳）。
2. **禁走的路**：逐 pointermove 写 `background-position` 对齐光场（违反
   「动画属性只 transform/opacity/filter/stroke-dashoffset」）；给共享光场
   层逐帧改 CSS mask（同违）；`background-attachment: fixed`（iOS 坑 +
   光心无法跟指针）。
3. **层序前提（现有资产不能丢）**：field 内 z0 = 槽腔底衬（**不透明深腔，
   负责遮静态 tile**——v4.2 的核心遮蔽机制）、z1 = 砖、z2 = 翻起砖。
   窗口/光斑活在底衬内部（DOM 序在腔壁 ::before 之后即可）。
4. **溢光改单例**：指针邻域一个整体洗墙光晕（单元素 transform 跟随 +
   opacity ∝ 邻域峰值开角），退役 per-cell `.bp-brick-spill`。
5. **需要裁决的设计点**（出小样对比后你终审）：
   - a. **光心位置**——跟随指针（光总在你揭开的地方后面）vs 场景固定
     （如视口上方天光，与洗墙光同源）。倾向跟随指针（反馈直接），但光斑
     直径要 ≥2× 影响半径，让「同一片光」可读；
   - b. **光强上限与哑光纪律修法**——「阳光射入」允许比 v4.2 的 α0.8 更亮
     （孔内光是**场景光源**，不是墙面材质光效——spec 显式立法新口径，
     全局禁 bloom 条款保持）；
   - c. **光强 ∝ 开角**保留与否（物理上开缝大小决定进光量，建议保留）；
   - d. 按钮涌光（frame ::after 槽光）是否同步换语言——低优先级，可维持
     「槽内灯带」现状，spec 注明即可。
6. **性能复测**：光斑子元素每孔一个（DOM 增量与池同量级）；光心 translate
   在 retarget（pointermove 级）写入，**帧循环只写 opacity**。风暴口径 =
   v4.2 spec §2.2 F 组（1440×900 裸原型 75fps 满帧、零长帧；真实站点允许
   小幅回落但不许长帧串）。
7. **原型技法**（上轮验证有效）：独立 HTML 原型 + FPS rig（`__storm`
   Lissajous 合成指针风暴 / `__freeze` 定格截图）+ Playwright 头部 Chromium；
   参数化 URL query 对比小样。合成 PointerEvent 能驱动 JS 监听（弹簧/FPS
   可测），CSS `:hover` 必须真实输入——见项目记忆
   `browser-testing-3d-css-pitfalls`。

## 改动锚点

- `src/components/shared/WallBricks.tsx`：`makeBrick`（uglow/spill 节点改
  窗口+光斑）、`applyStyle`（光 opacity 写入）、`retarget`（光心 translate
  写入点）、单例溢光生命周期
- `src/app/globals.css`：`.bp-brick-under / -uglow / -spill` 块重写
- spec §2.5 重写 + §0 推翻清单追加；CLAUDE.md §2 / §6（brick-flip 条目的
  涌光口径）同步
- 验收：**连续性**（冻帧截图中相邻开孔的光斑拼合无缝、扫动中无逐格闪灯感）
  + FPS + 「砖墙不干扰文字可读性」+ 五路径（无 JS 路径零变化——光只存在于
  JS 砖池内）+ lint/build + CLAUDE.md 零出入

## 流程

读 CLAUDE.md + v4.2 spec + 本简报 → 光效小样 2–3 案（光心跟随 vs 场景固定 ×
亮度档）冻帧截图对比 + FPS 实测 → 你做终审裁决并说明理由 → 修 spec →
实施 → 补完 v4.2 尚欠的验收（按钮三态特写 / 390px / RM 旗标 / curl SSR DOM）
→ code-review-loop 全量（v4.2 + 本返工一起，零 verdict-changing + 修复必
重审）→ 主对话结构化汇报。

这是公司门面，宁可多迭代两轮视觉，不要一次交付了事。
