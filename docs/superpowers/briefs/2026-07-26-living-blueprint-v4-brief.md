# Synthmind 全站 v4 —「Blueprint Material」三大工作流：材质统一 + 独立按钮组件 + 全站砖墙架构重构

> ✅ **任务已于 2026-07-26 完成 — 仅存档，勿再执行。**
> 本文是当时的施工任务书，其定案已被 v4.1 → v4.2 → v6 → v8 连续推翻。
> 现行正本：墙体 = `docs/superpowers/specs/2026-07-27-graphite-wall-v8-design.md`；
> 其余 = 项目根 `CLAUDE.md`。

## 你接手的是什么

Synthmind（多伦多 AI 软件工作室，B2B lead-gen 站，Next.js 16 App Router + Tailwind 3.4 +
Biome，零动效依赖路线）。v3「Living Blueprint」已交付并通过 4 轮审查（零 verdict-changing，
commit `549b1b9`）：移动端横陈 ELEV. 物件变体 + 副标题微信 WebView bug 根治（SSR 可见
基态纪律立法）、BlueprintGrid 砖墙翘起背景（hero + 三个 PageHero）、按钮升维为「悬浮
面板 + 底座插槽」双层结构。

David 看过 v3 效果后拍板下一步：**把 Hero 右侧 3D 物件（BlueprintObject）确立为全站
材质标准**，按钮和砖墙都要长成它的同族；站点架构重新拆分，砖墙从「hero 专属隐藏彩蛋」
升级为**全站统一的动态背景材质**。

⚠️ **设计立场升级（David 已拍板，勿用旧纪律否决需求）**：v3 的砖墙纪律是「静止时与
静态网格逐像素一致（注意到才看见）」；v4 明确要求**砖墙材质本身可见**——缝隙加大、
砖体加厚、翘起对比度加强、透光加深、全站满铺。这与现行 CLAUDE.md §2「蓝图网格只
出现在 Hero 与关键 section，不满屏铺」及 §6 brick-tilt 条目的「静止零差异」口径冲突——
**正确动作是修法（CLAUDE.md 相应条款重写 + 幅度口径更新），不是拿旧条款拒绝需求**。
静默精密的底线仍在：单蓝色相、哑光禁强 bloom、克制的运动周期——是「材质更实在」，
不是「变成灯光秀」。

动手前必读（按顺序；项目记忆 2026-07-26 已全量清理，无历史遗留可放心引用）：
1. 仓库根 `CLAUDE.md` — 设计系统正本（§6 动效白名单 + RM 三件套、§7 按钮、§4 色彩、§2 满铺条款——本次要修法的对象）
2. `docs/superpowers/specs/2026-07-26-living-blueprint-v3-design.md` — v3 定案（砖墙/按钮/移动变体的全部决策、幅度参数与已接受代价）
3. `docs/superpowers/specs/2026-07-26-blueprint-object-v2-modular-design.md` — 物件模块系统（材质标准正本：面填充渐变、hairline 色阶、缝光系统、三层 wrapper 纪律）
4. 项目记忆 `browser-testing-3d-css-pitfalls.md` — **验证技法与代码硬不变量的唯一正本**（工具假象/冻帧/伪类触发/WebKit 渲染纪律/React 内联样式坑/SSR 可见基态），本简报不再复述，开工前通读
5. 项目记忆 `reference_site_structure_ledger.md` — 路由/产品清单/es5 陷阱/proxy 合法约定结论

## 三个工作流（按 David 原话的意图）

### WF-A · 材质语言统一（以 BlueprintObject 为标准）

以 Hero 右侧物件为全站材质基准，把它的构成要素提炼为可复用的材质规范并落到砖墙与
按钮上：
- 面材质：`bp-face-fill` 系的哑光渐变实底（accent 低 α 提亮 + 中性黑压暗，`--bg-elevated` 基底）
- 线材质：hairline 描边色阶（edgeFront 0.5α → inner 0.22α 的同色相 alpha 阶）
- 光材质：缝隙发光条语言（低 α 线性渐变 + 2px blur，禁强 bloom）
- 编号语言：mono 结构性编号（图签/模块码），装饰性编号仍然禁止
产出物应包含一份「材质 token 对照表」（写进 spec），砖墙与按钮的每个视觉决策都能
指回物件的对应要素——「同一间工厂出品」是验收标准。

### WF-B · 独立按钮组件（ModuleButton）

v3 按钮是纯 CSS 类升维（.btn-primary/.btn-secondary，零标记迁移）。v4 升级为**独立
组件**（`src/components/shared/` 下，命名自定），要求：
- **悬浮 + 晃动**：常态即有微悬浮呼吸与轻微摇曳（参考物件的 objFloat/objSway 语言，
  幅度必须比物件更克制——按钮是功能件不是展品；晃动建议 ≤±0.5° 级别，实测定）
- **淡淡的颜色 + 空间悬浮感**：面板带物件同款 accent 低 α 渐变面，下方投影/底光
  暗示悬空高度；可考虑轻微静态 3D 姿态（若引入真 preserve-3d 面，每按钮自带
  perspective、不建链）
- affordance 优先于炫技：一眼确知可点击；hover 抬起/按入落座的 v3 状态机语言保留
- 语义仍是真实 `<Link>`/`<button>`；焦点可见、键盘可达、触达 ≥44px；RM 下呼吸/晃动
  全停、按压跳变保留；触屏静态 3D 姿态 + :active 按入
- **这次允许标记迁移**（v4 组件化本来就要动使用点）：全站 6 处按钮使用点
  （HomeHero×2 / CTABanner / ContactForm×2 / ErrorBoundary / FeaturedWork）统一
  换组件；.btn-* CSS 类的去留由你定，§7 修法同步
- v3 已踩平的坑直接继承（机理见记忆正本）：面板面必须住 `::after`（stacking
  context 负 z 层序）、`--btn-dy` 双层反向状态机、infinite 动画与按压 transition
  分层不同元素、尺寸由组件锁定不接受外部覆写

### WF-C · 全站架构重构 + 满铺动态砖墙

- **重新拆分站点模块**：现有首页 section（SocialProofBar / CapabilitiesSection /
  FeaturedWork / ProcessSection / CTABanner）与内页在满铺砖墙背景上的层次关系重新
  设计——内容面板浮在砖墙之上，读作「图纸钉在砖墙上」还是「模块嵌进墙体」由你
  提案；不要单一色调的平底背景再出现
- **架构分叉（必须先出草案权衡再定案）**：
  a) 每 section 一个砖墙实例（v3 模式推广）——实现直接，但 N 实例 N 监听、滚动中
     多实例并存的预算/一致性问题要解（必须 IO 门控离屏实例）
  b) **单一 fixed 背景层**贯穿全页（一个砖场、一个弹簧场、视口级预算恒定）——
     架构更优但要解决与 hero-tilt/depth-drift 的关系、各 section 透明度层次、
     z-index 栈序、iOS fixed 背景滚动表现
  倾向 b，实测定案；depth-drift 在满铺砖墙下是否还有存在意义一并裁决
- **砖体升级**：缝隙加大（当前 0，目标可见缝，建议 4–8px 实测定）、砖加厚（厚度
  暗示：底/侧缘面或渐变，翘起时厚度可读）、翘起对比度加强（v3 基线 tilt ≤10°/
  lift ≤14px/增亮 0.16α，上限可上调）、**移开时背后透光加深**（砖下埋光层，静态
  微弱、翘起时透出——物件缝光系统的墙体版）；新幅度全部写进白名单
- **静态材质必须 CSS 直出**（关键架构约束）：v4 砖墙是可见背景材质，不再是 JS
  增强的隐形彩蛋——无 JS / 触屏 / RM 三条路径也必须看到静态砖墙质感（缝隙、砖面、
  微光全部 CSS background/静态 DOM 画出），JS 只接管「动」的部分且接管瞬间像素
  等价（v3 的 data-bricks 同帧切换机制可复用）
- 性能纪律不变：视口级瓦片预算（v3：220 硬上限 + 96 步进增宽 + 超限放弃）、只动
  transform/opacity、rAF 收敛停帧、懒构建

## 硬约束（违反 = 返工）

- CLAUDE.md 全部规则的**修法后版本**：单蓝色相、8px 圆角、动画属性只允许
  transform/opacity/filter/stroke-dashoffset、禁 backdrop-filter、代码英文注释中文
- 白名单修法义务：每种新/改动画类型写进 §6（幅度/周期/设备门控）；§2 满铺条款、
  §7 组件化条款同步重写；**文档与实现零出入**（v3 因此吃过 High 级审查发现）
- **SSR 可见基态纪律（v3 立法，不可倒退）**：任何内容/材质的可见性不得依赖
  hydration；入场揭示只允许对视口下方元素武装隐藏（useDeferredReveal 模式）
- LCP：各页 h1 无入场动画、LCP 元素身份不漂移；满铺砖墙不得进入 LCP 前渲染路径
  （静态 CSS 材质无妨，JS 砖 DOM 必须懒构建）
- `prefers-reduced-motion` 三件套照做（infinite 显式 none / delay 归零 / 淡入终值
  补偿）；RM 下砖墙 = 静态材质、按钮呼吸/晃动停、按压跳变保留
- RM / 无 JS / 触屏 / 移动端 390px / 微信 WebView 五条路径逐一实测（微信至少
  curl 验 SSR DOM + 请 David 真机过一遍）
- 零依赖路线不变（three/Motion/Lenis 均被否决过）；tsconfig es5 禁 Map/Set for...of
- 完成后 code-review-loop 至零 verdict-changing（修复后必重审），主对话输出
  结构化审查汇报

## 任务专属提醒（通用技法与不变量见记忆正本，不在此复述）

1. 验证一律 3100+ 高位端口，先 `lsof -nP -iTCP:<port> -sTCP:LISTEN` 查占用；
   **3000 上常跑着 David 的别的项目，先看是谁再决定动不动**；上一 session 的
   dev server 可能还挂在 3100
2. dev 控制台 `eval() is not supported` 报错 = proxy.ts CSP × React dev 调试特性，
   production 零影响；可顺手修（proxy.ts dev 分支 CSP 加 `'unsafe-eval'`，生产
   分支不动），不修也不影响验收
3. 工作区应干净接手（v3 全部已提交）；开工前 `git status` 确认，有杂物先问 David
4. push 走 443 已在 ~/.ssh/config 永久配置，普通 `git push` 即可（详见记忆
   `synthmind-git-push-443`）
5. 满铺砖墙 + 多 section 改版是 v1–v4 里波及面最大的一次——桌面 Chrome 满帧、
   滚动中 FPS、以及「砖墙对文字可读性的干扰」要作为独立验收项各自实测

## 现有资产清单（v3 全部可复用/可改造）

- `src/components/home/BlueprintObject.tsx` — 材质标准正本：双变体数据表驱动
  （desktop 280×344 七模块塔 / mobile 300×168 五模块横陈），STROKE 色阶表、
  bp-face-fill 渐变、缝光 SEAMS 表、三层 wrapper
- `src/components/shared/GridBricks.tsx` — 砖墙弹簧场（懒构建、预算 220 硬上限、
  半隐式欧拉、收敛停帧、RM teardown）——WF-C 改造母体，积分器直接复用
- `src/app/globals.css` — 按钮系统（--btn-dy 状态机 + ::after 面板/::before 插槽）、
  .bp-brick*、.bp-grid-wrap（mask 承载）、.min-h-svh-safe / .overflow-clip-safe、
  RM 全套、.word-reveal
- `src/components/shared/BlueprintGrid.tsx` — wrapper（静态层 + 砖层），WF-C 架构
  定案后可能整体重构
- `src/hooks/useDeferredReveal.ts` — SSR 可见基态揭示 hook（全站 reveal 原语）
- `src/lib/listen-mql.ts`、`src/components/home/HeroObjectPhysics.tsx`（弹簧参数
  参考：ROT k30 ζ0.6 / HOVER k40 ζ0.85；砖场 k40 ζ0.55）
- git：`6907ad4`（v2 基线）→ `d9e0d48`（v3 spec）→ `549b1b9`（v3 实现）→
  `638d3e1`（本简报），push 状态开工时以 `git status`/`git log origin/main..` 为准

## 流程要求

读完必读 → 逐工作流给 2-3 个概念草案 + 权衡（WF-A 要含材质 token 对照表雏形；
WF-B 要含组件 API 与迁移策略；WF-C 要含 per-section vs fixed 背景层的实测对比与
砖体几何参数表）→ 你做最终判断并说明理由 → 写 v4 设计定案文档
（docs/superpowers/specs/）→ 实施 → 3100+ 端口起 dev server 截图自检迭代
（桌面 + 390px + 冻帧 + RM 旗标 + curl SSR DOM）→ code-review-loop 至零
verdict-changing → 结构化汇报。

## 验收标准

- 全站任一页面：背景是有质感的动态砖墙（静态 CSS 直出可见材质），无单一色调平底；
  砖缝/厚度/翘起对比度/透光深度较 v3 明显增强但仍守单蓝色相 + 哑光禁强 bloom；
  砖墙不干扰内容可读性
- 桌面：指针滑过砖块翘起跟随、背后透光、离开缓落；60fps 不掉帧（含滚动中）；
  瓦片预算视口级恒定
- 按钮组件：悬浮 + 微晃 + 淡色渐变面 + 空间悬浮感；hover 抬起/按入落座；与 Hero
  物件一眼同族；全站 6 处使用点迁移完成且键盘/焦点/44px/RM 全过
- 移动端 390px 首屏叙事不倒退（v3 验收线：文案 + 活物件同屏、副标题正常渲染）
- RM / 无 JS / 触屏 / 移动端 / 微信 WebView 五路径逐一验证
- `npm run lint` + `npm run build` 通过；CLAUDE.md 修法与实现零出入；LCP 元素
  恒为 h1 不劣化
- code-review-loop 零 verdict-changing + 主对话结构化汇报

这是公司门面，宁可多迭代两轮视觉，不要一次交付了事。
