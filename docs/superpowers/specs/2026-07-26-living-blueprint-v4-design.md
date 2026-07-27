# Living Blueprint v4 —「Blueprint Material」设计定案

> 🛑 **已退役 — 勿作实施依据**（2026-07-27）
> 墙体现行正本 = `2026-07-27-graphite-wall-v8-design.md`（经 v4.1 → v4.2 → v6 → v8
> 四轮推翻）；按钮现行正本 = CLAUDE.md §7（Socketed Brick v4.2）；卡片现行正本 =
> `2026-07-26-card-system-v7-glass-design.md`；物件现行正本 =
> `2026-07-27-blueprint-object-v3.1-nameplate-living-traces-design.md`。
> 本文仅存架构决策史。

> 三个工作流把 Blueprint 从「一套活图纸系统」升维成「一间材质统一的工作室」：
> Hero 物件确立为全站材质标准（WF-A），按钮长成它的同族功能件（WF-B），
> 砖墙从 hero 彩蛋升级为全站满铺的动态背景材质（WF-C）。
> 上位正本：`2026-07-26-living-blueprint-v3-design.md`（砖墙/按钮 v3 结论）、
> `2026-07-26-blueprint-object-v2-modular-design.md`（物件材质正本）。
> 任务书：`docs/superpowers/briefs/2026-07-26-living-blueprint-v4-brief.md`。
>
> 设计立场升级（David 拍板）：砖墙材质本身可见——缝隙、砖体厚度、翘起对比、
> 透光全部升档且全站满铺；CLAUDE.md §2 满铺条款与 §6 brick-tilt「静止零差异」
> 口径同步修法。静默精密底线不动：单蓝色相、哑光禁强 bloom、克制运动周期。

---

## WF-A · 材质语言统一（物件 = 全站材质标准）

### A.1 概念草案与定案

| 草案 | 内容 | 判定 |
|------|------|------|
| A. 纯文档对照表 | 只在 spec 里建立映射，不动代码 | 否——token 漂移无约束，「同一间工厂」停在纸面；审查也无法机检 |
| B. **CSS 变量 `--mat-*` 块（定案）** | ≥2 消费方的材质原语提为 `:root` token，砖墙与按钮的 CSS 全部改喝同一 token | ✓ 单一事实源在代码里；新增消费方（未来卡片/图标）直接接入 |
| C. Tailwind config 全面 token 化 | 材质进 tailwind.config 生成 utility | 否——材质是多层渐变复合 + alpha 阶，utility 粒度不适配；按钮/砖墙引擎本就在 globals.css 层 |

**TSX 侧 STROKE 表保持字面量**（不改喝 var()）：SVG presentation attribute 的
var() 替换在个别 WebView 会失效（BlueprintObject 内 LABEL_PROPS 已记录同类坑，
fill 因此走 class）；物件是材质正本，正本用字面量、CSS token 对齐正本值，
由本表交叉锁定。改物件色阶时必须同步 `--mat-*`（表内标注对应关系）。

### A.2 材质 token 对照表（正本）

| 材质要素 | 物件正本（BlueprintObject） | v4 CSS token | 砖墙映射（WF-C） | 按钮映射（WF-B） |
|---|---|---|---|---|
| 面·实底基底 | `var(--bg-elevated)` 实底（面板与深底分离） | `--mat-face-base: rgba(17, 22, 32, 0.55)`（bg-elevated 的半透明形态） | 砖面基底（墙面比 bg-base 微亮一档，缝隙露深底） | secondary 面板基面（保 `rgba(12,16,23,.85)`，card-surface 同源，见 B.3） |
| 面·受光提亮 | front 面 `160deg rgba(74,159,229,0.07) → 0` | `--mat-face-tint: rgba(74, 159, 229, 0.05)` | 砖面顶部受光 fade（180deg，静态层硬约束见 C.4） | 面板渐变上端提亮（primary hover 升档） |
| 面·压暗轴 | right 面 `rgba(0,0,0,0.18→0.4)`（明度轴非第二色相） | `--mat-face-shade: rgba(0, 0, 0, 0.32)` | 砖底缘厚度暗示带 | 面板底缘 inset 压暗 |
| 线·主棱 | `STROKE.edgeFront rgba(74,159,229,0.5)` | `--mat-edge-strong: rgba(74, 159, 229, 0.5)` | 砖翘起时的增亮描边上限档 | 面板 hairline / hover 增亮边 |
| 线·辅助 | `STROKE.inner rgba(74,159,229,0.22)` | `--mat-edge-faint: rgba(74, 159, 229, 0.22)` | 砖面 24px 细分格（低 alpha 折算） | 插槽 hairline 框 |
| 光·缝光心 | 横缝 `rgba(74,159,229,0.7)` + blur 2px | `--mat-seam-glow: rgba(74, 159, 229, 0.7)` | 墙体透光层光心（静态低透，翘起露宽带） | 插槽内缝光（hover 增亮） |
| 光·缝光柔 | 竖缝 / 淡入终值 `0.55` | `--mat-seam-soft: rgba(74, 159, 229, 0.55)` | 透光层竖向光带 | — |
| 编号语言 | M.NN 装配码 / S.NN 图纸码（结构性） | （非 CSS） | **不编号**——墙是材质不是件 | **不编号**——按钮是功能件；装饰性编号仍禁 |

> token 只收录 ≥2 消费方的原语；单一消费方的复合渐变（物件 core 环底、
> 按钮 primary 渐变）留在各自声明处，注释指回本表。

---

## WF-B · ModuleButton 独立组件

### B.1 概念草案与定案

| 草案 | 内容 | 判定 |
|------|------|------|
| A. 纯语法糖 wrapper | 组件只包 v3 的 class + levitate span | 否——「悬浮+晃动+材质面」升级诉求落空，组件沦为转写层 |
| B. **组件 + CSS 引擎升级（定案）** | `.btn-*` 引擎保留并升级（材质面接 token、新增晃动），ModuleButton 成为唯一授权入口 | ✓ v3 踩坑资产（--btn-dy 状态机 / 双伪元素层序 / 尺寸锁定）零重写；标记迁移一次收口 |
| C. 真 preserve-3d 多面按钮 | 每按钮自带 perspective 的静态 3D 姿态 | 否——文字面倾斜伤可读性与 affordance；2.5D 双层已传达悬空，倾斜 ≤3° 的感知增量趋零（与 v3 草案 C 同判，v4 复核后维持） |

### B.2 组件 API 与迁移策略

`src/components/shared/ModuleButton.tsx`，**不加 `'use client'`（双栖）**：
server 树（HomeHero/CTABanner/FeaturedWork）里是 RSC 零 hydration；client 树
（ContactForm/ErrorBoundary）里自动随宿主打包，onClick 只在 client 上下文出现，
不触犯「函数跨 RSC 边界」。

```tsx
// href → next/link；无 href → <button>
<ModuleButton href="/contact" arrow>Book a Free Consultation</ModuleButton>
<ModuleButton href="/products" variant="secondary">View Our Work</ModuleButton>
<ModuleButton type="submit" disabled={sending} aria-busy={sending}>Send</ModuleButton>
<ModuleButton variant="secondary" onClick={reset}>Try Again</ModuleButton>
```

Props：`variant?: 'primary' | 'secondary'`（默认 primary）；`href?`；
`arrow?: boolean`（内置 ArrowRightIcon，hover 右移沿用 CTABanner 语言）；
`phase?: number`（呼吸相位错峰秒数 → wrapper 负 animation-delay；默认 0，
同屏多按钮由使用处错峰）；`className?` 仅限布局 utility（w-full 等——尺寸
utility 依旧被源序压掉，禁写）；其余原生属性透传（type/onClick/disabled/aria-*）。

渲染结构：`<span class="btn-module-frame [flex 布局类]"><Link|button class="btn-primary|btn-secondary">…</span>`
——wrapper 承载 infinite 呼吸+晃动，本体只有按压 transition（同元素同属性
动画冲突的分层纪律，v3 立法沿用）。

**迁移清单（全站 7 个实例 / 6 文件，全部换组件）**：HomeHero ×2、CTABanner ×1、
ContactForm ×2（提交 + Send another message）、ErrorBoundary ×1、FeaturedWork ×1。
`.btn-primary/.btn-secondary/.btn-module-frame` CSS 类保留为组件私有引擎——
§7 修法注明「组件是唯一授权入口，业务代码不得直接写类」；`.btn-levitate`
更名 `.btn-module-frame`（职责从可选呼吸升为组件骨架层）。

### B.3 视觉与动效升级

- **悬浮 + 晃动合帧**：float（translateY）与 sway（rotate）都写 transform，
  两个 infinite 动画同属性互相覆盖——**必须合并为单一 keyframes `btnHoverIdle`**
  （translateY ≤±2px 与 rotate ≤±0.4° 交织的有机曲线，周期 8s ease-in-out）。
  分层不了就合帧，与物件三层 wrapper 解耦同一条纪律的另一种解法。
- **默认全量开启**：v4 立场是按钮常态即活（brief 原话），不再限 ≤3 处——
  全站 7 颗、同屏最多 3 颗，wrapper 错峰（phase）避免同频。§6 白名单口径
  同步改写。
- **材质面接 token**：secondary 面板基面保持 `rgba(12,16,23,.85)`（实底遮插槽
  的硬功能，card-surface 同源豁免不动），其上叠 `--mat-face-tint` 受光渐变
  ——「淡淡的颜色」来自物件同款 accent 低 α 面而非新色；primary 渐变保留
  （CTA affordance 优先），顶棱受光/底缘压暗改喝 `--mat-face-shade` 语义档。
- **空间悬浮感加深**：面板下投影升档（0 8px 18px accent 0.18）+ hover 时
  插槽缝光从 `rgba(74,159,229,0.06)` 升 `0.10`（已有）再叠 `--mat-seam-soft`
  低 α 内光线——悬空高度读得出来但不发光秀。
- **disabled 停摆**：`.btn-module-frame:has(:disabled) { animation: none }`
  ——半落座的按钮不该还在呼吸；:has 老内核不支持时软降级（继续呼吸，无害）。
- **RM**：`.btn-module-frame` 进显式 `animation: none` 列表；按压跳变保留。
- 触屏：静态悬空姿态 + `:active` 按入（v3 机制原样，纯 CSS）。
- 焦点/触达：`:focus-visible` 2px accent 外描边 + 3px offset、padding 锁定
  ≥44px——全部继承，组件化不碰。

---

## WF-C · 全站架构重构 + 满铺动态砖墙

### C.1 架构草案与定案（brief 要求先权衡再定案）

| 草案 | 内容 | 判定 |
|------|------|------|
| a. per-section 实例推广 | v3 BlueprintGrid 模式铺到所有 section | 否——N 实例 N 套监听/弹簧场，滚动中多实例并存预算不恒定，必须再加 IO 门控离屏实例；指针跨 section 边界时弹簧场断裂重置，「一面墙」读感破功；每 section 都要 relative/z 协调 |
| b. **单一 fixed 背景层（定案）** | `position:fixed; inset:0` 单实例贯穿全站 | ✓ 一个砖场一个弹簧场，预算恒 = 视口面积（1440×900 ≈ 80 砖）；指针监听升 window 级，坐标即视口坐标，连 getBoundingClientRect 都不需要；「墙不动、图纸动」是正确的物理隐喻，天然深度线索；fixed 层滚动时不参与失效重绘，比 v3 absolute+depth-drift 更省 |
| c. sticky 分段墙 | 每页一实例 sticky 撑满 | 否——sticky 容器高 = 页高时预算按页面积爆炸；视口高则 stacking 陷阱多，是 b 的劣化版 |

**b 的四个已知风险与解法**（实施期逐项实测确认，任一翻车即回退 a）：
1. **iOS fixed**：踩坑的是 `background-attachment: fixed`，`position:fixed`
   元素无此问题；且触屏路径本就不建 JS 砖层，静态材质纯 CSS 合成层一次栅格化。
2. **z 栈序**：墙 `z-index: -1`（fixed 直属 layout），body 背景画在 canvas
   最底、墙画其上、一切在流内容画墙上——各 section 摘掉不透明背景即可，
   不需要给全站内容加 z。
3. **hero-tilt / depth-drift 关系**：hero-tilt 保留（内容在静墙前抬起，深度
   对比反而更强）；**depth-drift 退役**——固定墙就是异速层的极限形态（速度
   0），两套深度系统并存互相打架。`.depth-drift-back` keyframes/类/白名单
   条目全删，PageHero 摘除。
4. **各 section 透明度层次**：见 C.3 层次方案。

### C.2 砖体几何参数表（v3 → v4；「实测定」列为微调许可区间）

| 参数 | v3 | v4 定案 | 微调区间 / 上限 |
|---|---|---|---|
| 砖 pitch | 192×96 | 192×96；大屏 MQ 阶梯 `--wall-brick-w`/`--wall-row-h`：≥2200px 视口 288×96、≥3000px 384×144（4K 无缩放 3840×2160 → 15 行 ×11 列 = 165 砖 ✓；纯宽度阶梯在 16:9 大屏会超预算，行高必须同步放大） | pitch 恒 24 倍数 |
| 缝宽 | 0（隐形） | **6px**（左缝 + 上缝归属每砖 cell） | 4–8px 实测 |
| 错缝 | 96px 固定 | `--wall-brick-w / 2`（96/144/192，全为 24 倍数，细分格连续） | — |
| 砖面材质 | 纯格线自绘 | 面基底 + 受光 fade + 24px 细分格 + 顶缘 1px 提亮 + 底缘厚度暗示带 | alpha 见 A.2 |
| tilt | ≤10° | **≤12°** | 白名单上限 12° |
| lift | ≤14px | **≤18px** | 白名单上限 18px |
| 翘起增亮 | 格线 0.16α + 面 0.03 | 格线 0.22α + 面 0.04 + 描边趋 `--mat-edge-strong` | 禁强 bloom |
| 透光 | 无 | 静态缝光 ≤0.08；砖移开露宽光带（透光层埋在砖下，纯几何显影）+ glow ∝ lift | 光带 alpha ≤0.14 |
| 厚度暗示 | 无 | 底缘压暗带（`--mat-face-shade`）+ 每砖 shadow 子层（opacity ∝ lift 的下投影） | 不做真 3D 侧面（见 C.5） |
| 弹簧 | k40 ζ0.55 | 同 | — |
| 影响半径 | 240px | 240px | — |
| 预算 | 220/section | **220/视口**（fixed 恒定；1440×900 ≈ 80） | 硬上限，超限放弃增强 |

### C.3 层次方案：「图纸钉在砖墙上」（定案）

| 草案 | 判定 |
|------|------|
| **图纸钉墙（定案）**：L0 墙（fixed）/ L1 sheet-panel（半透明实底段落）/ L2 卡片（不透明 elevated） | ✓ 「内容 = 图纸」的全站隐喻已由 sheet-reveal 入场确立，钉墙是自然延伸；实现 = 背景类替换，零新组件 |
| 模块嵌墙：section 做 inset 凹陷 | 否——凹陷读感依赖强内阴影或 backdrop 处理，与哑光禁 bloom / 禁 blur 冲突 |

三级层次纪律：
- **L0 墙**：全站唯一背景，无 section 再持有整幅不透明底色（「无单一色调平底」验收线）。
- **L1 `.sheet-panel`**（新 CSS 类）：原 `bg-bg-surface` section 的替身——
  `rgba(12, 16, 23, 0.78)` 半透明实底 + 上下 hairline 边（读作钉在墙上的大幅
  图纸区）；禁 blur。
- **L2 卡片**：GlassCard 三变体不动（不透明 elevated 是可读性锚点）。

接线清单：
- `(public)/layout.tsx`：挂 `<BlueprintWall />`（skip-link 之后、header 之前）。
- HomeHero：摘 `<BlueprintGrid />`、摘 `bg-bg-base`、摘底部 to-bg-base 缝合渐变
  （墙连续无需缝合）；光晕/坐标标注/滚动指示器保留。
- PageHero：摘 `<BlueprintGrid className="depth-drift-back" />`。
- SocialProofBar：摘 bg；左右 from-bg-base 渐变遮罩 → 容器 `mask-image`
  线性 alpha 渐隐（对任意背景成立）。
- Capabilities / Process / 各内页 `bg-bg-surface` section → `.sheet-panel`。
- FeaturedWork / about 的 `bg-bg-base` section → 摘除（透墙）。
- SiteFooter：`bg-bg-base` → 半透明形态（`rgba(8,11,16,0.9)` 级），墙隐约收尾；
  实测可读性优先，观感不成立就回不透明。
- SiteHeader：滚动态保持**不透明** bg-base——无 blur 前提下半透明页头会让
  滚过的正文透字，可读性优先。
- case-study 组件（CaseStudyHero/SolutionSection/TextListSection/ResultsSection/
  TechStackBadges）与 products 页组件：同规则清一遍 bg-bg-*。
- 旧 `BlueprintGrid.tsx` / `GridBricks.tsx` → 重构为 `BlueprintWall.tsx`
  （Server：静态材质层结构）+ `WallBricks.tsx`（client 砖场）；旧文件删除，
  CLAUDE.md §1 结构树同步。

### C.4 静态材质必须 CSS 直出（关键架构约束的实现定案）

无 JS / 触屏 / RM 三路径必须看到同一张静态砖墙。结构：

```
.bp-wall (fixed inset-0 z-[-1], aria-hidden)
├─ .bp-wall-light      透光层：横向每 96px、竖向每 (brick-w/2) 的柔光带
│                      （blur 由渐变形状表达，静态一次栅格化；砖下部分被
│                      砖面遮住，砖移开自动显影 = 物件缝光的墙体版）
├─ .bp-wall-face--a    偶行砖面（背景：面基底/受光 fade/细分格/厚度缘）
├─ .bp-wall-face--b    奇行砖面（同背景，position 偏移 (brick-w/2, 96px)）
└─ .bp-wall-field      JS 砖场容器（懒构建）
```

**砖面矩形阵列的免 DOM 画法**：单层 repeating-gradient 只能画无限长条纹，
砖面 = 竖缝条纹 × 行带条纹的**交集**——每个 face 元素挂双层 mask
（`repeating-linear-gradient(90deg, transparent 0 6px, black 6px brickW)` ×
`repeating-linear-gradient(180deg, transparent 0 6px, black 6px 96px,
transparent 96px 192px)`），`mask-composite: intersect` +
`-webkit-mask-composite: source-in`。奇偶两元素各管一半行带，错缝走
mask/background-position 偏移。老内核不支持 composite 时软降级 = 无缝满面
细网格（仍成立的安静背景，非事故）。face 元素是纯 2D 背景层无 3D 子树，
mask 分组扁平化无碍（v3 wrap-mask 教训已内建规避——JS 砖场是无 mask 的
sibling）。

**超宽屏预算与静态一致性**：v3 的「JS 按 96 步进增宽」在 v4 会让 DOM 砖缝
与静态层错位（缝隙可见后此缺口致命）。定案：砖 pitch 由 **CSS 媒体查询阶梯**
统一声明（`--wall-brick-w`/`--wall-row-h`：默认 192×96；≥2200px 视口
288×96；≥3000px 384×144），静态层与 JS 同读一套 var——JS 只读不定，
永不产生第二事实源；读出的 pitch 算出砖数仍 >220（无缩放 5K、超长竖屏等
异形屏）→ JS 彻底放弃增强，静态墙原样。

**JS 接管像素等价**：WallBricks 首次 pointermove 构建 DOM 砖（face 同 token
绘制，静止态与静态层逐像素一致），`data-bricks="on"` 同帧把 face--a/b 置
opacity 0（v3 机制复用）；透光层**不隐藏**（砖下遮挡关系由 DOM 砖接管）。

### C.5 WallBricks（砖场 JS）相对 GridBricks 的变化

- 监听升 window 级：`window pointermove`（passive）+
  `document.documentElement pointerleave`（离窗缓落）；坐标 = clientX/Y 直用
  （fixed 层原点即视口原点，rect 缓存整个退役）。
- 砖 cell：face div（cell 内缩 6px 上/左缝）+ glow 子层（增亮）+ shadow
  子层（下投影，opacity ∝ lift——厚度/悬浮高度暗示）。~80 砖 × 3 节点。
- **不做真 3D 侧面**：per-brick 加 preserve-3d 子面 = 给 220 个元素重开
  WebKit 透视链审查面，厚度暗示走「底缘压暗带 + 投影子层」已可读（brief
  明示「底/侧缘面**或渐变**」）；翘起 12° 下侧面可见宽度 ≤4px，感知增量
  不值风险预算。
- 活跃砖 z-index 置 1、收敛归零时清除（状态切换非逐帧动画，不入动画属性
  纪律管辖）：投影子层要压在邻砖面上，且多砖同时翘起时层序稳定——
  transformed 元素本就晚于普通流绘制，z 切换只兜排序边界。
- 弹簧积分器/收敛停帧/懒构建/RM teardown/resize 防抖重建：v3 原样继承。
- 滚动自洽：墙 fixed 不动、指针视口坐标不随滚动变——滚动时砖场目标天然
  正确，零滚动处理代码。

### C.6 可读性护栏（独立验收项）

- alpha 预算封顶：面基底 ≤0.55、受光 fade ≤0.05、细分格 ≤0.03、静态缝光
  ≤0.08——全部低于正文对比度扰动阈值；
- 密集正文一律落在 L1/L2 面板内；直压墙的文字段落（SectionTitle 副标题、
  ProcessSection 步骤文案）逐屏截图实测；
- 验收：390px 与桌面各页滚动全程截图过一遍「文字可读性」独立检查。

---

## 降级矩阵（三工作流合并）

| 条件 | 砖墙（WF-C） | 按钮（WF-B） | 材质 token（WF-A） |
|------|-------------|--------------|--------------------|
| 无 JS / hydration 失败 | 静态材质墙完整可见（纯 CSS 直出） | 完整悬空姿态 + :hover/:active + 呼吸照常（纯 CSS） | 不涉及 JS |
| prefers-reduced-motion | JS 砖不构建/中途 teardown；静态材质墙原样（无 infinite 动画可关——墙的静态层本就零动画） | 呼吸+晃动显式 none；按压跳变保留 | — |
| 触屏 | 能力门控不构建；静态材质墙 | 静态悬空姿态 + :active 按入 | — |
| 微信 WebView | = 无 JS 路径；curl 验 SSR DOM | 同触屏 | — |
| 老内核（无 mask-composite） | 软降级：无缝满面细网格 | :has 不支持 → disabled 时呼吸不停（无害） | var() 全兼容 |
| 超宽/异形屏 | MQ 阶梯砖宽；仍超 220 → JS 放弃增强 | — | — |

## 白名单与 CLAUDE.md 修法清单（文档与实现零出入）

- **§2 重写**：「蓝图网格只出现在 Hero 与关键 section，不满屏铺」→「砖墙 =
  全站唯一背景材质（fixed 单实例 BlueprintWall），材质可见；单蓝色相 + 哑光
  禁强 bloom 底线不变；内容层次走 L0/L1/L2（墙/图纸面板/卡片）」。
- **§6 修订**：
  - `brick-tilt` 条目重写：全站 fixed 墙、倾角 ≤12°、抬升 ≤18px、静态材质
    CSS 直出、「静止零差异」口径删除、接管瞬间像素等价保留；
  - `btnFloat` → `btnHoverIdle`：呼吸+晃动合帧（≤±2px / ≤±0.4°、周期 ≥8s、
    组件内建全站默认、disabled/:has 停摆、RM 显式 none）；「全站 ≤3 处」
    口径删除；
  - `depth-drift` 条目删除（v4 裁决退役）；FORBIDDEN 的满屏 parallax 条目
    措辞同步（深度暗示由 fixed 墙承担）；
  - float/mouse-tracking 豁免口径核对（砖层豁免仍是窄列举第 2 例，改述为
    BlueprintWall）。
- **§7 重写**：ModuleButton 组件是唯一授权入口；`.btn-*` 为组件私有引擎；
  API/错峰/disabled 停摆/RM 行为。
- **§1 结构树**：BlueprintGrid/GridBricks → BlueprintWall/WallBricks +
  ModuleButton；PageHero 描述更新。

## 文件清单

- 新 `src/components/shared/BlueprintWall.tsx`、`WallBricks.tsx`、
  `ModuleButton.tsx`；删 `BlueprintGrid.tsx`、`GridBricks.tsx`
- 改 `src/app/globals.css`：`--mat-*` token 块、`.bp-wall*` 材质系、按钮
  引擎升级（btnHoverIdle / .btn-module-frame / token 接入）、`.sheet-panel`、
  depth-drift 删除、RM 增补
- 改 `(public)/layout.tsx`（挂墙）、HomeHero、PageHero、SocialProofBar、
  CapabilitiesSection、ProcessSection、FeaturedWork、CTABanner、ContactForm、
  ErrorBoundary、SiteFooter、about/contact/products 页、case-study 组件
  （bg-bg-* 层次清理 + 按钮迁移）
- 改 `CLAUDE.md` §1/§2/§6/§7

## 验收（任务书原样）

- 全站任一页面：动态砖墙背景（静态 CSS 直出可见材质），无单一色调平底；
  缝/厚度/对比/透光较 v3 明显增强，仍守单蓝色相 + 哑光；不干扰可读性
- 桌面：翘起跟随、透光、缓落；60fps 含滚动；瓦片预算视口级恒定
- 按钮：悬浮 + 微晃 + 淡色渐变面 + 空间悬浮感；hover 抬起/按入；与物件同族；
  7 实例迁移完成，键盘/焦点/44px/RM 全过
- 移动端 390px 首屏叙事不倒退；RM / 无 JS / 触屏 / 移动端 / 微信 五路径验证
- lint + build 过；CLAUDE.md 修法零出入；LCP 恒为 h1
- code-review-loop 零 verdict-changing + 主对话结构化汇报
