# Card System v7 — 玻璃检视窗 + Contact 单据化重构（设计定案）

> 2026-07-26 经 superpowers:brainstorming 与用户逐项定案。
> 调研正本 = `2026-07-26-card-system-rework-brief.md`（迁移覆盖表 §1 / 文案审计 §2 以其为准，本文不重复）。
> 本 spec 与 CLAUDE.md §2/§4/§5/§6 修订同 commit 落盘——CLAUDE.md 不得与实现脱节。

---

## 0. 用户定案记录（两轮 brainstorm 结论）

| 决策点 | 定案 |
|---|---|
| §3.2A 玻璃材质 | **毛玻璃优先 + 降级预案**：blur ≤12px；实施最早步真机性能 spike，不过关全站降级光滑玻璃 |
| §3.2B 倾斜参数 | **≤2.5° · 盒内跟随 · 慢弹簧**（k≈22 / ζ≈0.65，厚玻璃板惯性） |
| §3.2C 变体划分 | **interactive / static / container 三分 + 正交装饰 props**（accent 竖线 / sheetNo / cropMarks / pad） |
| 品牌自称 | **全站彻底回避 startup/studio，含 title/metadata**——身份词换能力/行业描述 |
| Contact IA | **单据化表单 + 进首屏**；hero 压缩为紧凑标题行 |
| 联系邮箱 | **全站撤下邮箱展示**（Contact 页 / SiteFooter / JSON-LD email 字段）；`CONTACT_EMAIL` 常量仅供 API route 发信。留言表单是唯一联系入口（Resend 双向确认闭环已在线） |
| 表单对比度 | 用户点名痛点：**input 背景色块与填写内容必须拉开层次**——废透明底下划线，改实底凹格 |
| 定价文案 | $3,000 / $10,000–50,000+ 仍准确，保留，仅统一术语 |

---

## 1. 材质系统 — 玻璃检视窗（inspection pane）

### 1.1 叙事

v6 Lantern Wall 的墙后有真光（右上余晖 + 随指针移动的 `bp-wall-lamp`）。卡片 = **压在灯箱墙前的玻璃检视窗**：毛玻璃把墙后指针灯揉成柔光晕、把砖缝光磨成雾光——玻璃第一次有光学意义，零新增光源。这是对 v4「图纸不是玻璃」条款的设计系统修订（物理世界先变了），非违规。

### 1.2 `--glass-*` token 簇（新增于 globals.css `:root`）

与砖/按钮的哑光 `--mat-*` 分开——玻璃与砖是两种材质，共享明度轴逻辑不共享值。
全部 rgba 基于既有豁免色（`rgba(12,16,23,α)` = bg-surface、`rgba(8,11,16,α)` = bg-base、中性明度轴 白/黑），**不引入新字面色**。初值（实施时可在 ±20% 内微调，调完回写此表）：

```css
--glass-blur: 12px;                            /* 毛玻璃采样半径，上限 12px */
--glass-face: rgba(12, 16, 23, 0.58);          /* 毛玻璃档面底 — blur 已提供分离 */
--glass-face-solid: rgba(12, 16, 23, 0.84);    /* 光滑玻璃档面底 — 无 blur 时保对比度 */
--glass-edge-top: rgba(255, 255, 255, 0.07);   /* 顶棱受光白线（inset 1px） */
--glass-edge-bottom: rgba(0, 0, 0, 0.35);      /* 底缘压暗（inset -1px） */
--glass-reflect-a: rgba(74, 159, 229, 0.05);   /* 内反射对角渐变起 */
--glass-reflect-b: rgba(74, 159, 229, 0.0);    /* 内反射对角渐变止 */
```

### 1.3 双降级机制（两者独立，勿混淆）

1. **浏览器支持回退**（CSS 层，自动）：基础类写光滑玻璃档（`--glass-face-solid`，无 blur）；`@supports ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)))` 块内升级为毛玻璃档（`--glass-face` + blur，**双属性都写**——Safari ≤17 / iOS ≤17 只认 -webkit- 前缀）。老内核/微信 WebView 自动得到光滑玻璃，无 JS 参与。
   ⚠️ **Backdrop 采样纪律**（审查两轮 + 真机逐级挂载/hover 态实验定位）：玻璃卡任何祖先的 `filter` 计算值必须是 `none`——非 none 的 filter（**含 identity 值 `blur(0px)`**）构成 Backdrop Root（规范行为），采样不到墙 = 毛玻璃静默失效。**transform 经 hover 态实测不截断采样**（CardTilt 逐帧 3D transform 悬停期毛玻璃照常生效——第 1 轮曾把 transform 误列为共犯，第 2 轮复测归因修正）。落地规则：① 内联/过渡路径 filter 终态写 `'none'`（transform 同写 none 属卫生习惯非必需）；② filter 不得进 scrub/fill 动画关键帧（插值输出永远是 list 形态——`sheetSettle` 已移除 filter 关键帧；现存豁免 `reveal`/`wordReveal` 仅限无玻璃卡后代的子树）；③ 玻璃卡 wrapper 经 `@supports` 块内 `.sheet-reveal:has(.card-glass) { animation: none }` 退出 scrub 落回 IO 路径——scrub fill transform 推定无害但未在 animation-timeline 内核实测，保守定案。
2. **性能门槛**（构建时决策，一次性）：实施阶段 3 第一步做真机 spike——products 页 9+ 卡挂毛玻璃 + tilt 原型，用户真机 Chrome 指针快速扫过卡片群，**门槛 = 无可感掉帧（均值 ≥55fps）**。不过关 → 删除 `@supports` 升级块，全站定光滑玻璃，spec 与 CLAUDE.md 同步改记「光滑玻璃定案」。防工具假象纪律见 memory `browser-testing-3d-css-pitfalls`（hover/指针必须真实输入触发）。

### 1.4 厚度与可读性

- 厚度三件套：顶棱受光 + 底缘压暗（`box-shadow: inset`，与按钮/砖 tile 同一中性明度轴语言）+ 内反射（**background 渐变栈第一层** `linear-gradient(225deg, --glass-reflect-a, --glass-reflect-b)`——225deg 高光朝右上与余晖同向；不占伪元素，`::after` 归 accent 竖线，`::before` 空闲备用）。
- 圆角 8px、hairline 边框（`--border-default` / hover `--border-strong`）沿用。
- **可读性红线**：玻璃底上正文对比度 ≥4.5:1（tertiary 及以上），毛玻璃/光滑两档分别实测抽查；不达标调 face alpha，不降文字档。

---

## 2. tilt 引擎抽取 — `src/lib/pointer-tilt-engine.ts`

### 2.1 原则

**全站一个引擎、一套监听，per-entry 参数**。ButtonTilt 现有单例引擎（rAF 半隐式欧拉、收敛停帧、rect 缓存 + scroll/resize 失效、RM 中途 teardown、hover+fine 门控、盒内满权重盒外即零、per-element perspective）整体抽出；`STIFFNESS/DAMPING/MAX_TILT/perspective/轴系数` 从模块常量降为 entry 携带参数。**禁止存在第二份引擎代码**。

### 2.2 API

```ts
export interface TiltParams {
  maxTilt: number;      // deg
  stiffness: number;
  damping: number;
  perspective: number;  // px
  xDiv: number;         // rx 归一分母系数（占 rect.height 比例）
  yDiv: number;         // ry 归一分母系数（占 rect.width 比例）
}
// 门控（hover+fine 且非 RM）在内部判定；不满足返回 undefined，元素保持纯静态
export function registerTilt(
  el: HTMLElement,
  params: TiltParams,
  disabled?: boolean,   // 按钮 disabled 恒零目标；卡片不传
): (() => void) | undefined;
```

### 2.3 参数表

| 消费者 | maxTilt | stiffness | damping | perspective | xDiv / yDiv |
|---|---|---|---|---|---|
| ButtonTilt（回归等价，一个参数都不许漂移） | 4° | 30 | 6.6 (ζ≈0.6) | 500px | 0.9 / 0.6 |
| CardTilt（新） | 2.5° | 22 | 6.2 (ζ≈0.65) | 900px | 0.9 / 0.9 |

- 卡片慢弹簧 = 厚玻璃板惯性——重的东西摆得慢，厚重感的一半靠这个参数。
- ButtonTilt / CardTilt 都变成薄 client 岛（useEffect 里 registerTilt，返回值即 cleanup）。
- RM 中途开启 → 引擎整体 teardown 清零（全部 entries，不分消费者）；触屏/RM/无 JS = 纯静态透传，SSR 可见基态。

---

## 3. Card 组件 — `src/components/shared/Card.tsx`

### 3.1 API

```tsx
interface CardProps {
  children: ReactNode;
  variant: 'interactive' | 'static' | 'container';
  accent?: boolean;      // 左侧蓝色渐变竖线 = 重点标记（正交，任何变体可用）
  sheetNo?: string;      // 图纸编号 mono 角标（如 "S.01"）——三种旧编号实现统一于此
  cropMarks?: boolean;   // 四角裁切标记（内部渲染 CropMarks，自带 relative）
  pad?: 'none' | 'sm' | 'md' | 'lg';  // p-0 / p-5 / p-6 / p-8，默认 md——消灭「要自定义
                                      // 就绕开组件」的破口；none 供 container 形态
                                      //（内部子元素自带 padding，如 FAQ 手风琴）
  className?: string;
}
```

### 3.2 变体语义（修复 7+ 处误导 hover 的病根）

| 变体 | 语义 | 行为 |
|---|---|---|
| `interactive` | 整卡可点（自身被 Link/`<a>` 包裹） | CardTilt wrapper（JS 逐帧 ≤2.5°）+ 本体 hover 顶起（CSS transition：`perspective(900px) translateZ(8px)` + 投影落墙 + 边框增亮）+ active 微收 |
| `static` | 纯展示 | 恒定玻璃材质，零 hover 位移零 tilt；仅边框在 hover 时从 default → strong 的极弱受光响应 |
| `container` | 外壳静、内部子元素自带交互（FAQ 手风琴 / 含链接或按钮的展示卡） | 与 static 渲染**完全相同的 class**——差异纯语义，错配无视觉信号，选型对定义不对效果 |

- **transform 写入者分层**（照抄 ModuleButton 三层先例）：CardTilt wrapper = JS 逐帧 transform；卡片本体 = CSS transition（顶起/边框/投影）。两者永不同元素。
- per-element perspective 内嵌 transform 值，不建 preserve-3d 链；禁常驻 will-change。
- 组件不带 `'use client'`（双栖）；CardTilt 仅 interactive 变体渲染，client 岛自动随包。
- 路由不进 Card：整卡可点由使用处外层 `<Link>`/`<a>` 包裹（沿用现有模式）。

### 3.3 CSS 类（globals.css，替换 §「Sheet 三级卡片系统」整块）

`.card-glass`（基底：面底/棱线/内反射/圆角/边框）、`.card-glass-interactive`（hover 顶起 transition 组）、`.card-glass-accent`（`::after` 左竖线——`::before` 已被内反射占用）、`.card-tilt`（wrapper，透传盒）。
业务代码**只准走 `<Card>` 组件**，禁止直写这些类（与 ModuleButton 同款纪律）。
旧 `.card-surface` / `.card-elevated` / `.card-spotlight` 与 `GlassCard.tsx` 全部删除。
**完成定义：`grep -r 'card-surface\|card-elevated\|card-spotlight\|GlassCard' src/` 零命中。**

### 3.4 RM 三件套对号入座

- tilt：引擎门控 + teardown 路径（JS 侧，不依赖 CSS）。
- 顶起/边框 transition：globals.css reduced-motion 块通配归零已覆盖 `transition-delay`；顶起 transition 本身随 RM 通配 `transition-duration: 0.01ms` 即时到位（非 infinite，无需显式关）。
- 无新增 scroll-driven / infinite 动画。

---

## 4. 迁移映射（覆盖清单 = brief §1.1 全部 14 处，漏一处 = 漏迁移）

| 现调用点 | 新形态 |
|---|---|
| products 案例卡（Link 包裹） | `interactive` + `sheetNo` + `cropMarks` |
| products 在建 teaser（Link 锚点） | `interactive` + `accent` |
| about What We Build ×3 | `static` + `accent` |
| about Our Values ×3 | `static` |
| about 流程卡 ×4（自制水印数字） | `static`（水印大数字退役；步骤号保留为行内 mono 小号 accent 形态——步骤序号与图纸页码 sheetNo 是两种语义，见 §5 编号行） |
| FeaturedWork（Link） | `interactive` + `accent` |
| CapabilitiesSection | `static` + `cropMarks` |
| RealEstateShowcase（外链 `<a>`） | `interactive` + `accent` |
| InDevelopmentShowcase（不可点，卡内含 CSIO 外链与站内 CTA 链） | `container` + `accent`（全站最误导 hover 就此修复；含内部交互故非 static——审查第 1 轮修正） |
| FAQAccordion（直写 card-surface） | `container` |
| ContactForm 成功卡（直写 card-elevated p-8） | 裸内容（外层页面已有 container 单据卡包裹，再套 Card = 玻璃卡套玻璃卡——审查第 1 轮修正） |
| AnimatedStat（直写 card-surface p-5） | `static` + `pad="sm"`（并入 StatCard，见 §5） |
| ResultsSection ResultCard（直写 card-elevated p-6） | `static`（并入 StatCard） |
| TextListSection 仿卡片（手写 rounded-lg border-l-2） | `static` + `accent` + `pad="sm"` |

## 5. 附属收敛（brief §1.3 全做）

| 目标 | 定案 |
|---|---|
| **StatCard** | 新 `src/components/shared/StatCard.tsx`：useCountUp + useIntersectionVisible + 数字正则解析统一一份；AnimatedStat 与 ResultsSection.ResultCard 均改为其消费者（外壳 = Card static） |
| **HighlightTag** | 抽 shared chip 组件，两处逐字符重复 className 收编 |
| **外链箭头** | 抽独立共享 `ExternalArrowIcon`（外链「出框」语义与 ArrowRightIcon 行进语义不同，不合并），两份逐字符相同内联 SVG 删除 |
| **卡片收尾行** | 抽 `CardActionRow`（label + 站内/外链箭头 variant + group-hover:gap），4 处重复收编 |
| **IconBadge** | 抽 shared 圆徽（size + tone: success/error）；emerald/red 为功能反馈色沿用，不属装饰色相 |
| **图纸编号** | 双语义两形态：图纸**页码** = Card `sheetNo` 角标（唯一实现）；流程/列表**步骤序号** = 行内 `font-mono text-sm font-semibold text-accent`（about 流程卡与 TextListSection 共用同一形态）。水印大数字与 text-2xl 水印序号两种旧实现退役 |
| Challenge/SolutionSection 薄包装 | 内联进使用处，删两个文件（顺手项） |

## 6. Contact 页重构

### 6.1 结构（首屏即表单）

- Hero 压缩为紧凑标题行：SheetLabel（GET IN TOUCH）+ h1 + 一句副标题。**不再用 PageHero**（CLAUDE.md「about/products/contact 统一 PageHero」条款同步修订为 about/products）。h1 是 LCP，不加入场动画。
- 双栏骨架保留（lg:grid-cols-5，表单 3 + 信任栏 2），表单卡整体进首屏。
- FAQ 段保留（Card container）。

### 6.2 表单卡 = 图签化单据

- 外壳 = `Card variant="container" pad="lg"`；卡头 = SheetLabel 眉标 + hairline 分隔。「RFI」概念只由视觉承载（图签/编号/mono 字段标注），文案用通用语——受众含保险/会计，不推行业黑话。
- **字段 = 单据填写格（对比度修复核心）**：废除 `bg-transparent border-b` 透明下划线。每字段：
  - 外置 mono 小标签（`.annotation` 语言，10px 大写，txt-tertiary）——label 从 placeholder 提出；
  - input 实底凹格：`rgba(8, 11, 16, 0.8)`（bg-base 豁免 rgba 化，比玻璃面深一档成「凹进单据的格子」）+ `--border-subtle` 边框 + 4px 圆角 + 顶缘极轻内阴影；
  - 填写文字 `txt-primary`；placeholder 降为示例提示（quaternary 可用，有外置 label 后不再承担标签职责）；
  - focus = accent 边框增亮 + 2px accent alpha ring（`0 0 0 2px rgba(74,159,229,0.3)`——1px 边框换色在深底上太弱，ring 保键盘焦点可见性；`:focus-visible` 同口径）；**focus-line 中心展开下划线退役**——外置 label + 实底格后，它与格子边框语义重复。
  - 层次链：墙 → 玻璃卡 → 深色填写格，三层拉开——用户点名的「混在一起」就此消灭。
- 成功态 = 裸内容 + IconBadge(success)（外层页面 container 单据卡继续包裹——再套 Card 即玻璃卡套玻璃卡，审查第 1 轮修正，与 §4 迁移表一致）。
- **校验契约对齐**：`route.ts` 补 name/subject/message 必填（现仅强制 email），与前端 required 一致；长度上限沿用。

### 6.3 信任栏（右 2 列）

- 邮箱行移除。保留 Location / Response Time 为单据元数据行（mono 标注形态）。
- 新增「What happens next」三步（真实序列，编号合法）：01 即刻收到确认邮件 → 02 24 小时内亲自回复 → 03 免费咨询通话。消掉「发消息后会发生什么」的不确定性。
- 「no sales team」话术按 §7 改写为个人化自洽表述。

### 6.4 邮箱全站撤展示

- 移除：Contact 页联系块 mailto、SiteFooter mailto 行、Contact 页 LocalBusiness JSON-LD `email` 字段、首页 JSON-LD `email` 字段。
- 保留：`constants.ts` 的 `CONTACT_EMAIL`（API route 发信 + 邮件模板用）。前台 grep `CONTACT_EMAIL` 应只剩 constants.ts 与 route.ts。

## 7. 文案定位应用（阶段 4 独立 commit，清单 = brief §2）

- **身份词全站回避（含 title/metadata）**：7 处正文 startup + about title「AI Software Studio」等，全部换能力/行业描述（'software team' / 'we build…' / 'AI-powered software' 方向）；不新引入 studio 自称。
- 「团队直接对接」话术 → 个人化自洽（'talk directly to the person who builds it' 方向），不再展示邮箱地址。
- 定价数字保留；CTA 术语统一「Book a Free Consultation」；其余按 brief §2.1/§2.2 清单执行（100% Retention 移除/改写、无出处百分比改区间或定性、旧 tagline 替换、9+ 改派生、308 注释修正、撇号/破折号/title 模板统一）。
- CSIO 会员声明：上线前用户人工确认仍有效（阻塞项，汇报时提醒）。

## 8. CLAUDE.md 修订点（与本 spec 同 commit）

- **§2 设计概念**：内容层次「L0 墙 / L2 不透明卡片」→「L0 墙 / L2 玻璃检视窗卡片」；删「图纸不是玻璃」表述，玻璃叙事 + 毛玻璃/光滑双档写入；正本指针指向本 spec。
- **§4 色彩**：豁免清单增 `--glass-*` 簇口径（基于既有豁免色 rgba 化 + 中性明度轴，无新字面色）。
- **§5 卡片系统**：整节重写——Card API、三变体语义、正交 props、禁直写 `.card-glass*` 类、毛玻璃双降级机制、对比度红线。
- **§6 动画**：白名单增 `card-tilt`（≤2.5° 慢弹簧）与卡片 hover 顶起 transition；mouse-tracking 豁免第 4 例窄列举（CardTilt，共享 pointer-tilt-engine）；删「NO mouseGlow / 卡片一律不做」中与 interactive 卡冲突的表述（static/container 仍禁）；「禁 backdrop-filter」条款删除。
- **§3 Typography / PageHero**：contact 从 PageHero 统一清单移除。

## 9. 验证清单（阶段 5，= brief §6 + 本次新增）

- 真机 Chrome：毛玻璃性能门槛（§1.3#2）；tilt 手感 2.5° 收敛停帧；hover 顶起分层无跳变；墙后指针灯透玻璃观感；**表单填写格三层对比清晰**。
- ButtonTilt 抽取后回归：4° 手感逐参数等价，disabled 恒零，RM teardown。
- 触屏/RM/无 JS 三路径：静态基态完整、引擎不挂载、SSR 直出可读。
- 对比度抽查：毛玻璃与光滑两档下 tertiary 正文 ≥4.5:1；表单填写文字 primary。
- `npm run build` 通过；`grep -r 'card-surface\|card-elevated\|card-spotlight\|GlassCard' src/` 零命中；前台 `CONTACT_EMAIL` 仅剩 constants/route。
- 端口纪律：验证一律 3100+。
