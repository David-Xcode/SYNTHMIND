# Synthmind v4.2 —「翻板砖墙 / 无底纹排版 / 顶出式按钮」（承接 v4.1 的返工令）

> ✅ **任务已于 2026-07-26 完成 — 仅存档，勿再执行。**
> 本文是当时的施工任务书。其中「翻板砖墙」已被 v6 真砖重力井取代、残余光源又被 v8
> 删除；「无底纹排版」与「嵌墙按钮」仍有效但现行口径以 `CLAUDE.md` §2/§7 为准。
> 墙体现行正本 = `docs/superpowers/specs/2026-07-27-graphite-wall-v8-design.md`。

## 你接手的是什么

- **v4.1 已实施完成但未提交**（工作区 12 改 + 2 新，见下方清单）。
  `npm run lint` / `npx tsc --noEmit` / `npm run build` 全部通过；
  code-review-loop 跑了 3 轮，**零 Critical/High/Medium**，第 4 轮终审被
  David 叫停（第 3 轮的几条 Low/Nit 修复因此未经复审——判别联合类型收紧、
  footer/contact 文字提档到 tertiary、注释漂移修正、frameClassName 死 API
  删除、TextListSection className 双空格）。**建议先把 v4.1 提交为基线再动
  v4.2**，或在 v4.2 的审查轮里一并覆盖。
- v4.1 交付内容（正本 = `docs/superpowers/specs/2026-07-26-living-blueprint-v4.1-design.md`）：
  方砖网格化随滚墙（静态层文档级 absolute + JS 砖场 fixed + mod 回卷）、
  砖面 SVG data-URI tile（无网格纹路）、缝隙灯槽 + fixed 洗墙光、
  按钮长条砖化 + backglow + ButtonTilt 指针弹簧倾斜、CLAUDE.md §1/§2/§4/§6/§7 修法。
- **David 看过 v4.1 实机后提出 v4.2 需求（本简报），会推翻 v4.1 的部分定案——
  正确动作是修 spec + 修法，不是拿 v4.1 旧定案否决新需求。**
- 上一 session 的 dev server 可能仍在 **3120**；动手前照例
  `lsof -nP -iTCP:<port> -sTCP:LISTEN` 查 3100/3120，**3000 上常跑 David
  别的项目，别碰**。

### 工作区未提交清单（v4.1）

```
M CLAUDE.md
M src/app/(public)/contact/page.tsx      M src/app/(public)/layout.tsx
M src/app/globals.css                    M src/components/case-study/TextListSection.tsx
M src/components/home/HomeHero.tsx       M src/components/layout/SiteFooter.tsx
M src/components/shared/BlueprintWall.tsx  M src/components/shared/ModuleButton.tsx
M src/components/shared/PageHero.tsx     M src/components/shared/WallBricks.tsx
M src/lib/listen-mql.ts
?? docs/superpowers/specs/2026-07-26-living-blueprint-v4.1-design.md
?? src/components/shared/ButtonTilt.tsx
```

---

## David 的 v4.2 需求（原话要点，一条不许漏）

### 1. 背景墙优化

- **a. 翻开幅度到 ~80°**（当前 12°）——「我希望它翻开的幅度能达到 80 度左右」。
- **b. 网格更密集：缩小到当前的四分之一**。
- **c. 光效：鼠标悬停时光要从背景墙里面照出来**——「因为翻开的面积变大了，
  照出来的效果应该会更好」。

### 2. 移除底纹背景 + 提高字体对比度

- **a. 移除所有 section 的深色底**（原话举例：「what we build 后面的黑暗背景」，
  = `.sheet-panel` / 残留 `bg-bg-*` 段落底），**全部移除**。
- **b. 提高字体对比度**，让内容在砖墙上直接清晰可读。

### 3. 按钮整个重新设计

- 参考首页 **Hero 标志性组件（BlueprintObject）的模块交互**：
  「鼠标一放上去它就凸出来，移开后又凹进去」——按这种语言重做全站按钮。

---

## 三条需求的技术冲突与已知风险（交接重点，先读再动手）

### 1a. 80° 翻起 ≠ 把 `MAX_TILT` 改成 80

当前砖是**无厚度 2D div 绕砖心 rotateX/rotateY**（`WallBricks.tsx` 的
`perspective(600px) rotateX() rotateY() translateZ()`），12° 时厚度感来自
底缘压暗带 + sibling 投影。直接把常量改 80 会出三个问题：

1. **绕中心转 80° = 砖面几乎侧对视线**，投影面积趋 0——观感是「砖消失了」
   而不是「翻开了」。要「翻板/掀起」的读感，得改成**沿砖的一条边做铰链**
   （`transform-origin` 设到边缘 + 绕该边旋转），像门一样掀开。
2. **背面朝向观众**：铰链翻起后看到的是 div 背面（当前 tile 背景在正面），
   需要 `backface-visibility` 处理或给砖真厚度（两面 + 侧面 = 每砖 DOM 数
   ×2~3，与 1b 的密度需求叠乘，预算压力剧增）。
3. **相邻砖遮挡**：80° 翻起的砖在屏幕上的高度 ≈ 一整块砖，会盖住上方邻砖，
   `z-index` 层序与「同时翻起多少砖」都要重新设计（可能要把影响半径收窄到
   只让指针正下方少数几块翻起，反而更像真实交互）。

项目记忆 `browser-testing-3d-css-pitfalls` 的 3D 硬不变量在此全部适用
（preserve-3d 链、WebKit 无 BSP 按质心排序、共面 z-fighting、per-element
perspective 不建链）——**大角度 + 高密度是这些坑的高发区，动手前重读**。

### 1b. 密度 ×4 与性能预算是**硬冲突**，必须实测定案

- 当前：pitch 96px @1440×900 = **165 砖**；v4.1 实测预算上限 **400**
  （368 砖满帧 85fps；**600 砖 min 67fps 掉帧**）。
- 「缩小到四分之一」的两种解读：
  - **面积 1/4（边长减半）→ pitch 48px @1440×900 = 600 砖** → 已实测掉帧；
  - 边长 1/4 → pitch 24px → 2400 砖，绝无可能。
- 叠加 1a 的 80° 翻转（重绘区域更大）与可能的双面砖（DOM ×2），**必须重新
  设计架构**，候选：
  - 只在指针影响半径内**动态建砖**（远处/静止区不建 DOM，指针移动时增删）；
  - 影响半径从 240px 收窄（与 1a 的「少数砖大幅翻起」天然一致）；
  - 静态材质继续 CSS 直出（tile 只改 pitch 变量，零成本），JS 只管翻的那几块；
  - canvas 2D 渲染砖层（零 npm 依赖，但要重做整套材质与 RM/触屏降级路径，
    且与「静态 CSS 直出」纪律的关系要裁决）。
- **先出方案对比 + FPS 实测再定 pitch，别无脑改常量**。

### 1c.「光从墙里照出来」要裁决哑光纪律

当前光槽层埋在砖下、靠几何显影（砖让开才露光），全站守「哑光禁强 bloom」。
David 要的是**翻开后有光涌出来**——建议做成「指针邻域局部光斑 + 翻起角度
驱动的光强」，全局仍哑光。**这条要在 spec 里显式裁决并同步 CLAUDE.md §2/§6**，
不要既写着禁 bloom 又偷偷加 bloom。

### 2. 移除 section 底 = L1 层退役 + 文字层级重定

- `.sheet-panel`（v4 定案的 L1「图纸面板」）与残留的 `bg-bg-*` 段落底全部摘除
  → 层次纪律从 **L0/L1/L2** 变成 **L0 墙 / L2 卡片**，v4 spec C.3 与
  CLAUDE.md §2 相应条款要改。
- 可读性从此**全靠文字对比度**承担：CLAUDE.md §3/§4 的文字层级
  （`txt-primary #E8ECF0` / `secondary #A6AEBA` / `tertiary #868E9C` /
  `quaternary #606876`）需要整体提档。参考数据（v4.1 审查实测，墙面
  ≈`#10151E`）：quaternary 仅 **3.3:1 不达 AA**，tertiary **5.7:1 达标**。
  正文一律 ≥4.5:1，装饰性 annotation（`aria-hidden`）不受限。
- 波及面：CapabilitiesSection / ProcessSection / 内页各 section /
  case-study 组件 / SiteFooter（v4.1 刚调成 `bg-bg-base/70`）——逐个清。

### 3. 按钮语言换成「模块顶出」

- 参考正本 = `globals.css` 的 `.bp-module:hover`（沿签名轴偏移 ≤10px +
  描边增亮，`@media (hover: hover)` 限定防触屏粘滞）与 BlueprintObject 的
  模块系统（spec `2026-07-26-blueprint-object-v2-modular-design.md`）。
- 现状要处理的资产：`--btn-dy` 悬浮面板 + 底座插槽双伪元素状态机（v3 踩坑
  资产）、`btnHoverIdle` 呼吸、`ButtonTilt` 指针弹簧倾斜（v4.1 刚加）、
  backglow。**「hover 凸出 / 移开凹进」与现有悬浮姿态是两套隐喻**（悬浮 =
  一直浮着；顶出 = 平时嵌在墙里）——要裁决 ButtonTilt / 呼吸 / 插槽的去留，
  不要叠加成四种动画打架。
- 纪律不变：infinite 动画 / JS 逐帧 / transition 三个 transform 写入者永不
  同层；触达 ≥44px；`:focus-visible` 2px accent + 3px offset；触屏静态姿态 +
  `:active`；RM 全停。

---

## 必读（按序）

1. 仓库根 `CLAUDE.md`（v4.1 修法后版本——§2/§3/§4/§6/§7 都将再次修订）
2. `docs/superpowers/specs/2026-07-26-living-blueprint-v4.1-design.md`
   （**含「已接受代价」小节：JS 路径滚动落后一帧、SiteHeader 保持不透明、
   四个 --mat-* token 无 var() 消费是交叉锁定表项——这些结论继续有效，
   别当成新发现重报**）
3. `docs/superpowers/specs/2026-07-26-living-blueprint-v4-design.md`
   （层次纪律 L0/L1/L2 的原始论证，本次要改的对象）
4. 项目记忆 `browser-testing-3d-css-pitfalls`（3D/WebKit 硬不变量 + 验证技法
   正本：Playwright WebKit 不合成 3D、遮挡假 2fps、getAnimations 冻帧、
   真实输入才触发伪类、SSR 可见基态纪律）
5. 项目记忆 `reference_site_structure_ledger`（路由/产品清单/es5 陷阱/proxy 结论）

## 硬约束（v4/v4.1 原样有效）

- 零依赖路线；动画属性只 transform/opacity/filter/stroke-dashoffset；
  禁 backdrop-filter；单蓝色相 + 中性明度轴；圆角只有 8px 与 rounded-full
- SSR 可见基态纪律；LCP 恒为各页 h1；`prefers-reduced-motion` 三件套；
  tsconfig es5（Map/Set 用 `.forEach()`）
- 静态材质 CSS 直出：无 JS / 触屏 / RM 三路径必须看到完整砖墙材质且随页滚动；
  JS 只接管「动」，接管瞬间像素等价（`data-bricks` 同帧切换机制）
- **五路径实测**（RM / 无 JS / 触屏 / 390px / 微信 curl 验 SSR DOM）+
  桌面滚动 FPS + 「砖墙不干扰文字可读性」独立验收（本次因移除底纹，
  可读性验收权重最高）
- `npm run lint` + `npm run build` 通过；CLAUDE.md 修法与实现零出入
- 完成后 code-review-loop 至零 verdict-changing（修复后必重审），
  主对话输出结构化审查汇报
- push 走 443 已永久配置，普通 `git push` 即可

## 流程

读必读 → 三条需求各出 2–3 概念草案 + 权衡（**1a 必须含铰链几何与遮挡方案图解、
1b 必须含密度×预算×FPS 实测表、1c 含光效小样截图对比、3 含按钮交互小样**）→
你做最终判断并说明理由 → 写 v4.2 设计定案（specs/ 新文件，逐条注明推翻 v4/v4.1
哪些定案）→ 实施 → 3100+ 端口起 dev server 截图自检迭代（桌面 + 390px + 冻帧 +
RM 旗标 + curl SSR DOM）→ code-review-loop → 结构化汇报。

这是公司门面，宁可多迭代两轮视觉，不要一次交付了事。
