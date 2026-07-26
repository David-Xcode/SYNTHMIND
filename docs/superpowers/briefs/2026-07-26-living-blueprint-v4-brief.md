# Synthmind 全站 v4 —「Blueprint Material」三大工作流：材质统一 + 独立按钮组件 + 全站砖墙架构重构

## 你接手的是什么

Synthmind（多伦多 AI 软件工作室，B2B lead-gen 站，Next.js 16 App Router + Tailwind 3.4 +
Biome，零动效依赖路线）。v3「Living Blueprint」刚交付并通过 4 轮审查（零 verdict-changing，
commit `549b1b9`，本地未 push）：移动端横陈 ELEV. 物件变体 + 副标题微信 WebView bug 根治
（SSR 可见基态纪律）、BlueprintGrid 砖墙翘起背景（hero + 三个 PageHero）、按钮升维为
「悬浮面板 + 底座插槽」双层结构。

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

动手前必读（按顺序）：
1. 仓库根 `CLAUDE.md` — 设计系统正本（§6 动效白名单三硬规则 + RM 三件套、§7 按钮、§4 色彩）
2. `docs/superpowers/specs/2026-07-26-living-blueprint-v3-design.md` — v3 定案（砖墙/按钮/移动变体的全部决策与代价记录）
3. `docs/superpowers/specs/2026-07-26-blueprint-object-v2-modular-design.md` — 物件模块系统（材质标准的正本：面填充渐变、hairline 色阶、缝光系统、三层 wrapper 纪律）
4. 全局记忆 `browser-testing-3d-css-pitfalls.md` — 工具假象与技法（会自动加载；v3 期增补了 Playwright 真实输入触发 CSS 伪类、headless RM 截图版式假象、stacking context 层序等条目）

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
  幅度必须比物件更克制——按钮是功能件不是展品；晃动建议 ≤±0.5° 级别，由你实测定）
- **淡淡的颜色 + 空间悬浮感**：面板带物件同款 accent 低 α 渐变面，下方投影/底光
  暗示悬空高度；可考虑轻微的静态 3D 姿态（若引入真 preserve-3d 面，记住每按钮
  自带 perspective、不建链）
- affordance 优先于炫技：一眼确知可点击；hover 抬起/按入落座的 v3 状态机语言保留
- 语义仍是真实 `<Link>`/`<button>`；焦点可见、键盘可达、触达 ≥44px；RM 下呼吸/晃动
  全停、按压跳变保留；触屏静态 3D 姿态 + :active 按入
- **这次允许标记迁移**（v3 是零迁移约束，v4 组件化本来就要动使用点）：全站 6 处
  按钮使用点（HomeHero×2 / CTABanner / ContactForm×2 / ErrorBoundary / FeaturedWork）
  统一换组件；.btn-* CSS 类的去留（保留为组件内部实现 vs 彻底收编）由你定，
  §7 修法同步
- v3 已踩平的坑直接继承：`--btn-dy` 双层反向状态机、面板面住 `::after`（stacking
  context 层序，见踩坑账本 #1）、infinite 动画与按压 transition 分层不同元素、
  尺寸由组件锁定不接受外部覆写

### WF-C · 全站架构重构 + 满铺动态砖墙

- **重新拆分站点模块**：现有首页 section（SocialProofBar / CapabilitiesSection /
  FeaturedWork / ProcessSection / CTABanner）与内页在满铺砖墙背景上的层次关系重新
  设计——内容面板（卡片/图签）浮在砖墙之上，层次读作「图纸钉在砖墙上」还是
  「模块嵌进墙体」由你提案；不要单一色调的平底背景再出现
- **架构分叉（必须先出草案权衡再定案）**：
  a) 每 section 一个砖墙实例（v3 现状模式的推广）——实现直接但 N 实例 N 监听，
     滚动中多实例并存的预算/一致性问题要解
  b) **单一 fixed 背景层**贯穿全页（一个砖场实例、一个弹簧场、视口级预算恒定）——
     架构更优但要解决与 hero-tilt/depth-drift 的关系、各 section 透明度层次、
     z-index 栈序、iOS fixed 背景的滚动表现
  倾向 b，但由你实测定案；depth-drift 在满铺砖墙下是否还有存在意义一并裁决
- **砖体升级**：缝隙加大（当前 0，目标可见缝——建议 4–8px 级别实测定）、砖加厚
  （厚度暗示：底/侧缘面或渐变，翘起时厚度可读）、翘起对比度加强（当前 tilt ≤10°/
  lift ≤14px/增亮 0.16α——上限可上调，幅度写进白名单）、**移开时背后透光加深**
  （砖下埋光层，静态微弱、翘起时透出——物件缝光系统的墙体版）
- **静态材质必须 CSS 直出**（关键架构约束）：v4 砖墙是可见背景材质，不再是
  JS 增强的隐形彩蛋——无 JS / 触屏 / RM 三条路径也必须看到静态砖墙质感（缝隙、
  砖面、微光全部 CSS background/静态 DOM 画出），JS 只接管「动」的部分且接管
  瞬间像素等价（v3 的 data-bricks 同帧切换机制可复用）
- 性能纪律不变：视口级瓦片预算（v3 是 220 硬上限 + 96 步进增宽 + 超限放弃）、
  只动 transform/opacity、rAF 收敛停帧、懒构建、被遮挡/离屏 section 不空转
  （fixed 方案天然只有一个场；per-section 方案必须 IO 门控）

## 硬约束（违反 = 返工）

- CLAUDE.md 全部规则的**修法后版本**：单蓝色相（禁第二色相）、8px 圆角、动画属性只
  允许 transform/opacity/filter/stroke-dashoffset、禁 backdrop-filter、代码英文注释中文
- 白名单修法义务：每种新/改动画类型写进 §6（幅度/周期/设备门控），砖墙与按钮的
  新幅度口径逐条列明；§2 满铺条款、§7 组件化条款同步重写；文档与实现零出入
- **SSR 可见基态纪律（v3 立法，不可倒退）**：任何内容/材质的可见性不得依赖
  hydration；入场揭示只允许对视口下方元素武装隐藏（useDeferredReveal 模式）
- LCP：各页 h1 无入场动画、LCP 元素身份不漂移；满铺砖墙不得进入 LCP 前渲染路径
  （静态 CSS 材质无妨，JS 砖 DOM 必须懒构建）；移动端基线 h1（v3 dev 实测 272ms
  @4x throttle，元素恒为 h1）
- `prefers-reduced-motion` 三件套照做（infinite 显式 none / delay 归零 / 淡入终值
  补偿）；RM 下砖墙 = 静态材质、按钮呼吸/晃动停、按压跳变保留
- RM / 无 JS / 触屏 / 移动端 390px / 微信 WebView 五条路径逐一实测（微信至少
  curl 验 SSR DOM + 请 David 真机过一遍）
- 零依赖路线不变（three/Motion/Lenis 均被否决过）
- tsconfig target es5：Map/Set 禁 for...of
- 完成后 code-review-loop 至零 verdict-changing（修复后必重审），主对话输出
  结构化审查汇报

## 踩坑账本（v2/v3 实测踩出，重踩 = 浪费半天）

1. **带 transform 的元素是 stacking context，负 z 伪元素画在元素自身背景之上**
   （CSS 2.1 App.E）——「::before z:-1 藏到背景后」只在无 stacking context 时成立。
   v3 按钮为此把面板面移入 ::after(z-1)、插槽 ::before(z-2)、元素本体 background:none。
   低 α 会让层序错误侥幸不可见——按机理推，别只看截图
2. **WebKit 无平面切分（BSP），相交平面按质心排序**——任何多平面 3D 结构守
   「零平面相交」硬不变量；共面重叠 = z-fighting，位移「循环+hover 叠加峰值」核算
3. **preserve-3d 链上任何一层缺 transform-style，WebKit 压扁整个子树**（Chromium
   宽容看不出来）——逐层断言 computed 值；砖类元素用 per-element 自带 perspective
   不建链可整体绕开（v3 GridBricks 即此路线，且因此免疫父级 mask 的分组扁平化）
4. **同元素同属性动画必冲突**——入场/循环/hover/按压分层到不同元素（物件三层
   wrapper、按钮 levitate wrapper 都是现成范式）
5. `.bp-draw` 只能用于 `<path>`（WebKit 不支持 rect/circle 的 pathLength）
6. **禁止 overflow-hidden 包住含 .sheet-reveal/.depth-drift-back 的子树**（劫持
   view() 时间轴静默失效），裁切用 `.overflow-clip-safe`
7. React 内联样式禁止 shorthand + longhand 混写切换（transition 与 transitionDelay
   重渲染冲突告警）——delay 折进 shorthand 每属性第二时间值
8. MediaQueryList 监听走 `src/lib/listen-mql.ts` 守卫（Safari ≤13 无 addEventListener）
9. **Playwright 真实输入管线（mouse.move/down、locator.hover）能触发 CSS
   :hover/:active；合成 dispatchEvent 永远不能**（但可触发 JS 监听器，弹簧采样/
   压测用它）；永动元素 hover 前先 `document.getAnimations().forEach(a=>a.pause())`
10. **getAnimations 冻帧**（pause + currentTime=N）验证入场编排；scroll 驱动动画设
    绝对时间会抛错，try/catch 过滤
11. **Playwright WebKit 截图压扁 preserve-3d 是工具假象**（引擎功能层可测，像素
    不可信）；MCP 窗口遮挡时 rAF 假 2fps，先 bringToFront；像素级 Safari 验证请
    David 亲眼看
12. **headless Chrome `--window-size` + `--screenshot` 的 RM 旗标截图版式宽度不可信**
    （布局按外框算）——只用于验证静态完成态落位，版式回 Playwright viewport
13. 🚨 **3000 端口先查占用再动**（David 常在 3000 跑别的项目，误杀过）；验证一律
    3100+ 高位端口——**本 session 的 dev server 可能还在 3100 跑着**（`lsof -nP
    -iTCP:3100 -sTCP:LISTEN` 查，是 synthmind 的就直接用或杀掉重起）
14. dev 控制台的 `eval() is not supported` 报错 = proxy.ts CSP 未放行 unsafe-eval ×
    React dev 模式调试特性，**production 零影响**（React 生产不用 eval）。可顺手修：
    proxy.ts 里 dev 环境 CSP 加 `'unsafe-eval'`（生产分支不动）；不修也不影响验收
15. 工作区应干净接手（v3 已全部提交）；开工前 `git status` 确认，有杂物先问 David

## 现有资产清单（v3 全部可复用/可改造）

- `src/components/home/BlueprintObject.tsx` — 材质标准正本：双变体数据表驱动
  （desktop 280×344 七模块塔 / mobile 300×168 五模块横陈），STROKE 色阶表、
  bp-face-fill 渐变、缝光 SEAMS 表、三层 wrapper
- `src/components/shared/GridBricks.tsx` — 砖墙弹簧场（懒构建、预算 220 硬上限、
  半隐式欧拉、收敛停帧、RM teardown）——WF-C 的改造母体，积分器直接复用
- `src/app/globals.css` — 按钮系统（--btn-dy 状态机 + ::after 面板/::before 插槽）、
  .bp-brick*、.bp-grid-wrap（mask 承载）、.min-h-svh-safe / .overflow-clip-safe、
  RM 全套、.word-reveal
- `src/components/shared/BlueprintGrid.tsx` — wrapper（静态层 + 砖层），WF-C 架构
  定案后可能整体重构
- `src/hooks/useDeferredReveal.ts` — SSR 可见基态揭示 hook（全站 reveal 原语）
- `src/lib/listen-mql.ts`、`src/components/home/HeroObjectPhysics.tsx`（弹簧参数
  参考：ROT k30 ζ0.6 / HOVER k40 ζ0.85；砖场 k40 ζ0.55）
- git：基线 `6907ad4`（v2）→ `d9e0d48`（v3 spec）→ `549b1b9`（v3 实现），全部
  本地未 push；push 走 `ssh.github.com:443`（22 端口被封）

## 流程要求

读完必读文档 → 逐工作流给 2-3 个概念草案 + 权衡（WF-A 要含材质 token 对照表雏形；
WF-B 要含组件 API 与迁移策略；WF-C 要含 per-section vs fixed 背景层的实测对比与
砖体几何参数表）→ 你做最终判断并说明理由 → 写 v4 设计定案文档
（docs/superpowers/specs/）→ 实施 → 3100+ 端口起 dev server 截图自检迭代
（桌面 + 390px + 冻帧 + RM 旗标 + curl SSR DOM）→ code-review-loop 至零
verdict-changing → 结构化汇报。

## 验收标准

- 全站任一页面：背景是有质感的动态砖墙（静态 CSS 直出可见材质），无单一色调平底；
  砖缝/厚度/翘起对比度/透光深度较 v3 明显增强但仍守单蓝色相 + 哑光禁强 bloom
- 桌面：指针滑过砖块翘起跟随、背后透光、离开缓落；60fps 不掉帧（含滚动中）；
  瓦片预算视口级恒定
- 按钮组件：悬浮 + 微晃 + 淡色渐变面 + 空间悬浮感；hover 抬起/按入落座；与 Hero
  物件一眼同族；全站 6 处使用点迁移完成且键盘/焦点/44px/RM 全过
- 移动端 390px 首屏叙事不倒退（v3 验收线：文案 + 活物件同屏、副标题正常）
- RM / 无 JS / 触屏 / 移动端 / 微信 WebView 五路径逐一验证
- `npm run lint` + `npm run build` 通过；CLAUDE.md 修法与实现零出入；LCP 元素
  恒为 h1 不劣化
- code-review-loop 零 verdict-changing + 主对话结构化汇报

这是公司门面，宁可多迭代两轮视觉，不要一次交付了事。
