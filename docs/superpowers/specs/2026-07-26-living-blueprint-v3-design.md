# Living Blueprint v3 — 移动端重构 + 砖墙背景 + 3D 模组按钮 设计定案

> 三个工作流把 Blueprint 从「一个活物件」升维成「一套活图纸系统」：
> 移动端有自己的图纸（WF1）、网格背景藏着 3D 跟随系统（WF2）、
> 按钮成为与 Hero 物件同语言的悬空模组（WF3）。
> 上位正本：`2026-07-26-blueprint-object-v2-modular-design.md`（v2 模块系统）、
> `2026-07-25-blueprint-object-design.md`（v1 透视链/降级链结论）。

---

## WF1 · 移动端展示重构

### 1.1 根因定案：副标题消失 = JS 依赖型可见性在无 hydration 路径下的必然结果

微信 WebView 实测证据链：CSS 驱动的元素全部正常渲染（eyebrow `animate-reveal`、
h1、CTA、物件本体），JS 驱动可见性的元素全部空白（副标题 `TextReveal`）——
症状与「hydration 未执行/失败」完全吻合。`TextReveal` 的词级 span 以内联样式
SSR 直出 `opacity: 0`，`useIntersectionVisible` 初始 `useState(false)`，JS 不跑
文字就永远停在隐藏态。

`AnimateOnScroll` 是同一 bug 类：iOS/WKWebView 不支持 `animation-timeline`，
scrub 路径不生效，只剩 IO + 内联样式路径 → 微信里 hydration 失败时**整页
下方 section 全部空白**。必须一起修。

**新纪律（写进组件注释）：SSR 基态必须可见；JS 只允许在「确认将播放动画」
时才施加隐藏态。**

修复方案（两条路径）：

1. **Hero 副标题改为 Server 直出 CSS 逐词入场**：词级 span + `animate-reveal`
   + 内联 `animationDelay` 交错。CSS 动画不依赖 JS，`both` fill 保证终态可见；
   RM 全局 reset（时长 0.01ms + delay 归负）直接落终态。首屏入场本来就该
   load-time 播放，语义也更对。HomeHero 不再引用 TextReveal。
2. **TextReveal / AnimateOnScroll 改「可见基态 + 挂载后按需隐藏」**：
   `isVisible` 初始 `true`（SSR 直出可见）；挂载后（useEffect——元素在视口
   下方时 paint 后隐藏也不可见，且避开 useLayoutEffect 的 SSR 告警）检查
   元素是否完全在视口下方——是才置 `false` 并挂 IO 观察，否则保持可见跳过
   动画。**武装隐藏必须 transition:none 瞬时**（带过渡会让全页 wrapper 在
   hydration 时齐跑一轮 blur 渐隐）。视口内元素永不闪烁；无 JS / hydration
   失败 = 全部内容静态可见。scrub 路径（`.sheet-reveal` CSS 级联覆盖内联
   样式）行为不变。

### 1.2 移动端物件概念草案与定案

| 草案 | 内容 | 判定 |
|------|------|------|
| A. 缩放台改良 | 保留桌面构图，scale 提到 0.72 + 压缩文案节奏保证同屏 | 否——仍是 David 点名的「偷懒移植」；280×420 竖构图在 390px 视口里天然与竖排文案抢高度 |
| B. **Elevation Sheet 横陈组合体（定案）** | 移动端专属横向砌合变体：同一制图语言、同一模块系统，重新砌合成 300×168 的横向低台，置于 CTA 下方作「基座」 | ✓ 制图语义成立（同一物件的另一张视图：ELEV. 立面图）；横构图与竖屏文案天然互补；ModuleShell 全参数化，第二张模块表即可驱动 |
| C. 物件置顶主角化 | 物件在 h1 之上作 masthead | 否——B2B lead-gen 首屏信息层级不能让装饰物压过 value proposition；h1 前置也是 LCP 最稳的排布 |

**定案 B 几何（MOBILE 模块表，自下而上 M.01–M.05）**：

| 行 | 模块 | 前面板 (x,y,w,h) | 叙事 | 漂移 |
|----|------|------------------|------|------|
| R1 | M.01 base | 0,120,300,48 | 图签底座 SYNTHMIND / S.01 / ELEV. | 静止锚 |
| R2 | M.02 core | 0,58,186,56 | SYNTH CORE 环（紧凑版）+ 出线 | +Z 10px / 12s |
| R2 | M.03 port | 192,58,108,56 | 端口 + 焊盘 | +Z 12px / 10s |
| R3 | M.04 cap-L | 0,0,108,52 | 裁切角 + 顶面刻度 | −X 8px / 13s |
| R3 | M.05 cap-R | 114,0,186,52 | 十字基准顶面 | +X 8px / 15s（右缘外扩，无共面对象） |

- 总高 48+6+56+6+52 = 168；总宽 300；DEPTH 与桌面一致 120；轴测基姿态同
  rotateX(−16°) rotateY(−28°)——同一物件、同一图纸角度，只是另一张 sheet
- 竖缝错缝：R2 在 x186–192，R3 在 x108–114（bond pattern 延续）
- 缝光 4 条（横 2 + 竖 2），z=54 规则、溢出补位规则、WebKit 零平面相交
  不变量全部继承 v2；顶行才渲染顶面、右缘才渲染右面同理
- datum 基准面移动端省略（横构图 + 小屏预算；图签行已承载制图叙事）
- 入场编排压缩：asm delay 0.7–1.1s，焊盘圆点 2s 亮起、~2.5s 全收尾
  （桌面 ~2.95s）——移动端首屏节奏更快，编排在可视位置完整播放
- 渲染：`BlueprintObject` 增加 `variant` prop（数据表切换，ModuleShell 复用）；
  桌面实例 `hidden lg:block` + HeroObjectPhysics；移动实例 `lg:hidden` 为
  **纯 Server 静态场景**（.bp-object-scene + backglow/shadow 兄弟层，无 client
  组件——避免桌面上隐藏实例重复挂指针监听）；backglow 宽度改 CSS 变量
  （桌面 380px / 移动 340px）。**已知代价（接受）**：两变体都进 SSR HTML
  （另一端 display:none，动画不跑）——换取无 JS/微信路径的直出可见；
  动态 import 门控会把移动物件重新绑回 hydration，违背本工作流根修法
- 320 级窄屏（<340px）：`.bp-object-root` 整体 scale(0.85) 兜底（300px 低台
  + 轴测投影超出 272px 内容盒）
- `.bp-object-stage` 缩放台删除（被真变体取代）；`hero-tilt` 维持 ≥lg

### 1.3 移动端首屏垂直预算（390×844，微信 WebView 可用高 ~720px）

eyebrow → h1（2–3 行）→ 副标题（Server CSS 词入场；<sm 用 text-base——
5 行 subtitle 会把物件挤出微信折叠线）→ CTA（WF3 模组按钮，纵向堆叠，
触达 ≥44px）→ 横陈组合体（~230px 含顶面投影与投影光）。
节奏收紧：section 改 `.min-h-svh-safe`（100svh 优先、100vh 回退——同
overflow-clip-safe 的渐进增强模式）+ `<lg items-start`，pt-28 → pt-24
（<lg），栅格 gap-6（<lg），CTA mt-10 → mt-8（<lg），物件区 mt-2；
滚动指示器 <lg 隐藏（与物件基座在同一落点，视觉冲突且占预算）。
验收：390px 首屏文案 + 活物件同屏，副标题正常渲染；740px 视口（微信
WebView 实测可用高）实绘组合体完整可见。

---

## WF2 · 砖墙翘起背景（BlueprintGrid 升维）

### 2.1 概念草案与定案

| 草案 | 内容 | 判定 |
|------|------|------|
| A. 纯 CSS per-tile :hover | 每砖 :hover 翘起，零 JS | 否——单砖独立弹起无衰减场、无跟随、无缓落，读作机械开关；且瓦片 DOM 要 SSR 直出（所有设备付 DOM 成本） |
| B. Canvas 网格形变 | 每帧重绘扭曲网格 | 否——逐帧位图重绘背离 transform/opacity 合成器纪律，径向 mask 还要在 canvas 里复刻一遍 |
| C. **DOM 砖 + 弹簧场 + 懒构建（定案）** | 真实 DOM 瓦片，指针邻域弹簧驱动 transform，首次指针进入才构建 | ✓ 合成器友好、降级即静态网格、非 hover 设备零成本 |

### 2.2 定案细节

**砖块几何**：192×96 横砖，行间 96px 错缝（真砖墙 bond pattern）。每砖自绘
上/左缘主格线 + 内部 x=96 主格竖线 + 24px 细分格线（background-image 静态
栅格，与现网格逐像素一致）——**静止时与现状网格零差异**（隐藏感硬要求）。
砖激活时替换掉静态层的绘制（同帧 class 切换，像素等价无跳变），翘起时砖带着
自己的格线离开底面，露出 bg-base 深底 = 「墙上揭下一块图纸砖」。

**瓦片预算**：容器实测尺寸 ÷ 砖尺寸；总数 >220 时砖宽按 96 步进增宽重算
直至 ≤220（4K/带鱼屏成立；错缝恒 96 = 主格倍数，任何砖宽都不破静止态像素
等价）；砖宽 768 封顶后仍超预算（8K 级全屏）→ **彻底放弃增强，静态网格
原样**——预算是硬上限，超限宁可不做。1440×900 hero 实测 80 砖。每砖 1 个
div + 1 个增亮子层 div（accent 0.16 α 格线 + 0.03 面填充，opacity 由 JS
随翘起量写入）。

**3D 实现**：每砖独立 `transform: perspective(600px) rotateX() rotateY()
translateZ()`——**自带透视，不建 preserve-3d 链**。径向 mask 在父容器上
（mask 分组会压扁 3D 链，per-brick 透视天然免疫；也整体绕开 WebKit 链上
断层压扁的坑类）。倾角 ≤10°、抬升 ≤14px。

**弹簧场**：指针半径 R=240px 内的砖获得目标姿态（近缘翘起背向指针 =
气流掠过；权重 (1−d/R)²），rAF 半隐式欧拉弹簧（k≈40，ζ≈0.55，轻微过冲 =
回弹质感；积分器同 HeroObjectPhysics 范式）。只积分活跃集（半径内或未收敛），
全部收敛即停帧。指针离开 section → 目标归零缓落。rect 缓存 TTL 150ms。

**构建与门控**：client 组件挂载时仅判定能力（`(hover:hover) and (pointer:fine)`
且非 RM），**首次 pointermove 才构建砖 DOM**——SSR HTML 零增量、hydration
零工作、LCP 零影响；触屏/RM/无 JS 三条路径 = 现状静态网格原样。会话中途
开 RM → teardown 恢复静态层（listenMql 能力守卫提为共享 util）。resize
防抖重建。无 `<section>` 祖先（wrap 是 pointer-events-none 收不到事件）
直接放弃增强。

**落点**：`BlueprintGrid` 升级为 wrapper（静态层 + 懒砖层），对外 API 不变
——HomeHero 与 PageHero（products/about/contact）自动获得砖墙。PageHero 的
`depth-drift-back` 移到 wrapper 上，砖随图纸层整体异速漂移，互不干扰。

---

## WF3 · 3D 模组按钮

### 3.1 波及面草案与定案

| 草案 | 内容 | 判定 |
|------|------|------|
| A. Hero 专属新组件 | 只做两颗 CTA，新 ModuleButton 组件 | 否——全站从此两套按钮语言并存，「统一模块语言」目标自败 |
| B. **§7 全站升维，零标记迁移（定案）** | 重写 `.btn-primary`/`.btn-secondary` CSS，伪元素造插槽结构，5 个使用文件零改动 | ✓ 单一按钮语言；迁移 = 纯 CSS，回退 = git revert 单文件区块 |
| C. preserve-3d 多面按钮 | 真三维六面体按钮 | 否——affordance 优先于炫技；焦点环/命中区/RM 复杂度全面上升，而按压质感 2.5D 已足够传达 |

### 3.2 定案细节：「悬浮面板 + 底座插槽」双层结构（单元素 + 双伪元素）

- **层序机理（实施中修正）**：元素带 transform 自建 stacking context 后，
  负 z 伪元素画在元素自身背景**之上**（CSS 2.1 App.E）——所以元素本体不带
  面板视觉，**面板面住 `::after`（z -1）**：渐变面 + hairline 边 + 底缘压暗 +
  顶缘 1px 提亮（受光棱线，中性白低 α，明度轴非第二色相）
- **`::before`（z -2）= 底座插槽（socket）**：与面板同形 8px 圆角 hairline
  框 + 内部 accent 低 α 缝光，静息位下沉 5px——**面板悬浮于插槽上方 5px
  是常态**，所有设备（含触屏）静态即读出 3D 悬空姿态；-1 晚于 -2 绘制，
  面板正确遮挡插槽
- **状态机走单一 CSS 变量 `--btn-dy`**：面板 `translateY(var(--btn-dy))`、
  插槽反向 `translateY(calc(5px - var(--btn-dy)))`（插槽视觉恒静止）。
  rest 0 / hover −2px（抬起 + 缝光增亮 + 光晕扩大）/ active +4px（按入
  插槽，间隙收拢 = 明确「按到底」实感）。transform 双层同时长过渡，同步无撕裂
- **悬浮呼吸**：hero 两颗 CTA 外包 `.btn-levitate` wrapper（±1.5px / 6s
  ease-in-out，双颗反相错峰）——wrapper 承载 infinite 动画，按钮本体只有
  transition，**同元素同属性动画冲突的三层解耦纪律的按钮版**。全站克制
  使用（≤3 处：hero ×2，CTABanner 可选 ×1）
- **语义零变化**：仍是 `<Link>`/`<button>` + class；`:focus-visible` 显式
  2px accent 外描边 + 3px offset；触达面积 = 元素盒（类内 padding 锁定
  ≥44px；使用处的 px-*/py-*/text-* 覆写会被源序压掉——已从全部 5 个使用点
  清除死 utility）；`:active` 在触屏同样触发按入；disabled 半落座 +2px
  且 hover/active 规则带 :not(:disabled) 不响应
- **RM**：`.btn-levitate` 显式 `animation: none`；hover/active 过渡被全局
  reset 压到 0.01ms（状态跳变仍传达按压语义，无位移动画）
- **禁用态**：ContactForm 提交按钮 disabled 时插槽间隙收半、无 hover 抬起
  （实现时核对现状 disabled 样式）

---

## 降级矩阵（三工作流合并）

| 条件 | WF1 移动 Hero | WF2 砖墙 | WF3 按钮 |
|------|---------------|----------|----------|
| 无 JS / hydration 失败 | 副标题 CSS 词入场照常；全页 reveal 基态可见 | 静态网格原样 | 完整 3D 姿态 + :hover/:active 照常（纯 CSS） |
| prefers-reduced-motion | 词入场/物件循环全停，静态完成态 | 静态网格（不构建；中途开启则 teardown） | 呼吸停，按压跳变保留 |
| 触屏 | 物件循环照常，无 hover/物理 | 静态网格（能力门控不构建） | 静态悬空姿态 + :active 按入 |
| 微信 WebView | = 无 JS 路径全兜底 + SSR DOM 验证 | 触屏路径 | 触屏路径 |
| <lg 视口 | 横陈变体（本工作流主体） | 精指针才构建（窄视口+鼠标即可用） | 同桌面（无 hover 分支） |

## 白名单修法（CLAUDE.md §6 / §7，实施与文档零出入）

§6 ALLOWED 增补：
- `brick-tilt` — 背景砖墙指针邻域翘起跟随（rAF 阻尼弹簧；倾角 ≤10°、抬升
  ≤14px、半径 ~240px；仅 hover+fine 指针设备懒构建；触屏/RM/无 JS = 静态
  网格；mouse-tracking 豁免第 2 例，仅限 BlueprintGrid 砖层）
- `btnFloat` — CTA 按钮悬浮呼吸（`.btn-levitate` wrapper ≤±2px、周期 ≥6s、
  全站 ≤3 处）
- 按钮按压位移 — `--btn-dy` 双层反向 transition（hover −2px / active +4px，
  插槽恒静止）
- 词级 `animate-reveal` 交错（Server 直出，首屏副标题）

§6 FORBIDDEN 修订：mouse-tracking 豁免口径改为两例窄列举（Hero 物件弹簧 /
BlueprintGrid 砖层弹簧场）；float 豁免同步补 `btnFloat`。

§7 重写：双层悬浮模组结构、状态机变量、focus-visible、RM 行为、迁移零标记
说明。

## 文件清单

- 改 `src/components/shared/TextReveal.tsx`、`AnimateOnScroll.tsx`、
  `src/hooks/useIntersectionVisible.ts`（可见基态 + 挂载后按需隐藏）
- 改 `src/components/home/HomeHero.tsx`（副标题 Server 词入场、移动布局
  节奏、双物件实例接线）
- 改 `src/components/home/BlueprintObject.tsx`（variant 数据表：MOBILE_MODULES
  / MOBILE_SEAMS / 蚀刻表；尺寸常量按变体取值）
- 新 `src/components/shared/GridBricks.tsx`（client 砖层）；改
  `BlueprintGrid.tsx`（wrapper 化）；新 `src/lib/listen-mql.ts`（守卫共享）
- 改 `src/app/globals.css`（.bp-brick* / 按钮系统重写 / .btn-levitate /
  移动 stage 移除 / RM 增补）
- 改 `CLAUDE.md` §6/§7
- 改 `src/components/shared/CTABanner.tsx`（若 CTA 加 levitate）

## 验收（任务书原样）

- 390px 首屏：文案 + 活物件同屏、副标题正常（含微信 SSR 路径）、无大段空白
- 桌面砖墙：静止 = 现状网格零差异；滑过翘起跟随、离开缓落；60fps；触屏/RM 原样
- 按钮三态齐全（悬浮/hover 抬起/按入），焦点可见，触达 ≥44px，跳转正常
- RM / 无 JS / 触屏 / 移动端 / 微信 WebView 五路径逐一验证
- lint + build 通过；LCP 不劣化（移动端基线 h1@188ms）；§6/§7 与实现零出入
