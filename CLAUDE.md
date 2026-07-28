# Synthmind — Blueprint Design System Rules

> These rules encode the "Blueprint" design system（静默精密 / Quiet Precision — 蓝图制图语言）. All AI agents MUST follow them when implementing UI components, translating Figma designs, or modifying frontend code.
>
> **本文件是本仓的唯一约定正本**（`AGENTS.md` 只是指向这里的指针 + PR 规范；
> 项目速览见 `README.md`）。**现行 spec 正本**（`docs/superpowers/specs/`）：
> 背景 = `2026-07-27-void-field-v1-deep-space-design.md`（深空引力场，单文正本）·
> 卡 = `2026-07-26-card-system-v7-glass-design.md` ·
> 物件 = `2026-07-27-blueprint-object-v3.1-nameplate-living-traces-design.md`
> （几何/材质基座 = `2026-07-27-blueprint-object-v3-solid-design.md`，两文并读）·
> 信息架构 = `2026-07-27-ia-hierarchy-redesign-design.md` ·
> 概念奠基（仅 §1/§2/§7/§8 仍有效）= `2026-07-25-frontend-redesign-design.md`。
> 🚨 **同目录其余 spec/brief 已退役，文件头带 🛑/📕 横幅——横幅优先于正文，别照旧版实施。**

## Code Language Policy

- **Code** (variables, functions, files): English
- **Comments**: Chinese (内部使用)
- **UI copy**: English (面向英文用户)

---

## 1. Project Structure

- `src/app/layout.tsx` — 根 layout 只放 html/body/globals.css/metadata；页面壳层（SiteHeader/SiteFooter + VoidField 单实例）在 `(public)/layout.tsx`
- `src/data/` — TS 常量即内容层（非 CMS）：case-studies.ts（软件产品）/ real-estate.ts（地产盘）/ navigation.ts / process.ts（交付流程四步，about 详版 + 首页 ProcessStrip 一句话版**双消费同源，不复制第二份文案**）
- 安全响应头（CSP / HSTS / nosniff / Permissions-Policy 等）在 `next.config.js` 的 `headers()`——2026-07-27 从 `src/proxy.ts`（Next 16 的 middleware 约定文件名）迁入并删除该文件：全站静态预渲染，为恒定 header 每请求跑一趟 Node middleware 不划算，平台在边缘直接附加即可。**别再建 `src/proxy.ts` / `middleware.ts`**，改 header 一律改 `next.config.js`
- 其余目录结构以 `ls src/` 为准（shared 组件清单看 `src/components/shared/`）

### Component Reuse Rules
- **ALWAYS** check `src/components/shared/` before creating new UI components
- **ALWAYS** check `src/data/` for existing data constants before hardcoding
- **NEVER** hardcode the site URL or contact email — import `SITE_URL` / `CONTACT_EMAIL` from `src/lib/constants.ts`
- Page-specific components go in their domain folder (`home/`, `products/`, `case-study/`)
- Generic reusable components go in `shared/`

### Real Estate Module — IMPORTANT
地产营销站（Avella / Kingshaven / Woodbine Parkside / UnionGlens / Rosaleen）**打包为一个项目**（2026-07-26 定案）：
- 数据层：`src/data/real-estate.ts`（`RealEstateSite` 接口，**只收已上线的盘**——域名未解析不收录）
- 展示：`/products` 作品网格一张项目卡（S.06，站内链接）+ `/products/real-estate` 聚合详情页（叙事 + stats + `<RealEstateSiteGrid />` 每盘外链真实站点）
- 旧详情页 slug 在 `next.config.js` 中 `permanent:true`（= 308）重定向到 `/products/real-estate`（`#real-estate` 页内锚点已退役）
- 新增地产盘 = 上线后在 `real-estate.ts` 加一条 + logo 放 `public/product/`；新增软件产品 = 在 `case-studies.ts` 加一条（详情页自动生成）
- 导航 label = **Our Work**（路由仍是 `/products`，2026-07-26 起）

### Homepage Structure — IMPORTANT
🚨 **首页结构以 IA v1 为准（2026-07-27 起）** = Hero → SocialProofBar →
01 `<InDevelopmentShowcase />` → 02 `<FeaturedWork />` → 03 `<ProcessStrip />` →
`<CTABanner />` 六段说服链（要回答：你们做什么 / 凭什么信你 / 我下一步去哪）。
2026-07-26 的「主页只留 Hero + SocialProofBar 两段极简」定案**已作废**——
homepage-slim spec 里那三段删除指令已加退役横幅，**别再删 FeaturedWork /
ProcessStrip / CTABanner**（正本 = `2026-07-27-ia-hierarchy-redesign-design.md` §3）。

### Brokerage Platform Page — IMPORTANT（在建旗舰产品）
`/products/brokerage-platform`（2026-07-27 新建）是 AI 原生 BMS 的完整介绍页；
`/products` 第一段的 `<InDevelopmentShowcase />` 已精简为入口卡（身份背书 + 一句话 +
标签 + 进入链接），**长文案不要往回搬**。页面三段：CSIO 标准与 eDocs 认证（重心）/
平台能力全景 / 产品蓝图 + 已签约经纪行。CSIO 身份行（徽章 + 名录 + 新闻稿双外链）
= 共享组件 `<CsioMemberRow />`，两处消费，不要再写第二份 JSX。

🚨 **对外事实红线（改这两处文案前必读，源文件头注释有完整版）**：
- **客户绝不点名**：已上线的经纪运营系统服务真实经纪行——品牌名、生产数据量
  （客户数 / case 数 / 账号数）、承保商白名单均属客户商业数据，未获书面授权不得出现
- **CSIO 认证是进行时**：阶段 1 技术测试已跑通（官方 42 封样本批端到端、零 unmatched），
  阶段 2 申请与 demo 未完成、证书未颁——只能写 "certification in progress"，
  **禁写 "CSIO certified"**；**连 "CSIO-compliant" 也避开**（未认证前的合规声明
  同样会被 CSIO 反问），一律改用 "built to / designed around CSIO standards"。
  拿证后才可放开口径
- **已签约方 = 经纪行（brokerages）不是保险公司（carriers）**——carrier 不使用
  brokerage 管理系统，写成 carrier 是行业逻辑硬伤（2026-07-27 David 确认）；
  不点名、不写数字（数字会被追问且会过时）
- **在建产品时态**：能力描述用名词式规格或 "designed to / being built to"，
  禁用「系统已经在做 X」的完成时态；内部项目代号不出现在任何对外文案

---

## 2. Design Concept — Blueprint（先读这个再写 UI）

全站视觉隐喻 = **工程制图/蓝图**：Synth Blue 就是蓝图蓝，客户行业全部活在图纸与单据里（建筑提交文件 / 保单 / 签署文档 / 地产平面图）。设计纪律：

- 科技感做**底色**而非主角；高级藏在细节里（图签、hairline、crop marks——注意到才看见）
- 排版精度 > 空间/材质 > 动效 > 色彩数量
- 编号只用于**真实序列**（图纸页码、流程步骤）；能力/价值等非序列内容禁止装饰性编号
- 标注预算：**自由文本** mono 测量标注（如坐标、尺寸）每屏 ≤2 处；图签（SheetLabel）与卡片图纸编号（S.NN）属结构性编号，不计入预算
- **深空引力场（Void Field v1）**：全站唯一背景 = `VoidField`（单实例，(public)/layout 的 relative wrapper 内挂载 + not-found 各一次，两者永不同时）——概念 = **背景是一片静止的深空，指针是压在空间上的引力井**。三条立场决定架构，不只是文案：
  ① **宇宙是静的，唯一的运动来自你施加的引力**。星云**不漂移、不呼吸、不闪烁**；shader 是 `(fragCoord, hole, strength)` 的**纯函数、无 uTime**。指针不动时空闲成本**不存在**（零 rAF / 零 GPU 提交 / 零主线程）——砖墙时代那套「视口门控 / 桌面专属」的**补救**条款在本架构下没有对应物（背景自己不动，没有需要门控的自发动画）。⚠️ **但「收敛即停帧 / 隐藏即停帧」不在此列**：它们正是零空闲成本的实现手段，必须保留，别把这句读成可以删掉停帧逻辑。
  ② **极简是硬要求**：≥90% 画面是接近纯黑的深空底，可见内容只有一道主星云带、一道次带、极稀疏的星点。**禁止**繁星点点 / 星系旋臂 / 行星 / 任何具象天体。
  ③ **深邃靠明度层次与暗角**（`VIG` 把四周压下去 + 带宽 > 屏宽暗示只看到局部），不靠元素数量。
  🚨 **背景层零光源纪律沿用且更严**：光只来自星云自身，**禁止任何「背景后的灯」**（砖墙 v6 的角落余晖与指针灯早已退役，同样禁止以新形式复活）。背景属场景（`.void-field` fixed 视口级，**内容从背景前滚过、背景不动**，零滚动耦合）；**层纪律 = 两层，且永不同时可见**：`.void-field-still` 静态帧（SSR 直出、唯一保底）与 `canvas.void-field-gl` WebGL2 实时层，后者画完第一帧才落 `[data-live]` 把前者整个 `display:none`——静态帧**不参与合成**（🚨 顺序反过来会露出 WebGL 默认清色纯黑一帧）。**禁止再造第三层**。指针交互 = **引力透镜**（弱场偏折 ∝ 1/r 的施瓦西近似：采样坐标被井心吸偏 + 事件视界压黑 + 光子环；`pointerdown` 时强度 0.30→1.00 走同一根弹簧；井心弹簧刻意偏软 k=9 ⇒ 快速拖动时明显滞后 = 「这个东西有质量」，核心体感是**惯性**不是位置跟随）；守单蓝色相 + 哑光禁强 bloom（**背景层是唯一允许第二色相的地方**，见 §4）；内容层次二级：**L0 背景 / L2 玻璃检视窗卡片**——**任何 section 不得持有底色**（L1 已于 v4.2 退役）。**卡片 = 悬在深空前的玻璃检视窗（v7 材质）**：毛玻璃把星云带的弥漫光揉得更柔、把深空底磨成均匀的雾（`@supports` 无 backdrop-filter 自动回退光滑玻璃档），内反射 `135deg` 高光朝**左上**与主星云带亮区同向（唯一合法方向——朝右上的 225deg 既对着已删除的余晖、又与星云带照度方向相反，禁止回改）（材质正本 = 2026-07-26-card-system-v7-glass-design spec）

## 3. Typography — Archivo + Manrope + IBM Plex Mono

Three fonts loaded via `next/font/google` in root layout. Tailwind classes:

| Font | Class | Usage | RESTRICTION |
|------|-------|-------|-------------|
| Archivo (variable, wdth 轴) | `font-display` | Page titles, hero headlines, bold words in SectionTitle, 物件机身品牌铭牌（BlueprintObject 的 SYNTHMIND，v3.1 豁免） | **NEVER for body text**；图签编号/测量标注仍 mono-only |
| Manrope | `font-sans` | Everything else (default body font) | Default — no class needed on body |
| IBM Plex Mono | `font-mono` | 图签编号、测量标注、stat 数字、流程步骤号 | **NEVER for paragraphs or headings** |

### Typography Patterns

**Display 宽体**：`font-display font-semibold` 的高亮词必须加 `.stretch-wide`（font-stretch 116%，Archivo 宽度轴）——这是 Blueprint 的排版签名。Sentence case，禁全大写大标题。

**图签（section 眉标）** — 用 `SheetLabel`（tick 短线 + 可选图纸编号 + mono 标签）：
```jsx
import SheetLabel from '@/components/shared/SheetLabel';
<SheetLabel no="02">CAPABILITIES</SheetLabel>   // 有编号 → "— 02 / CAPABILITIES"
<SheetLabel>GET IN TOUCH</SheetLabel>            // 无编号 → "— GET IN TOUCH"
```
`SectionTitle` 通过 `sheetNo` prop 透传。`Eyebrow` 保留用于卡片内小 caption（tone: accent/tertiary/quaternary），不带 tick。

**测量标注**：`.annotation` class（10px mono 大写）。装饰性标注加 `aria-hidden`。

**Section headings (via SectionTitle):**
```jsx
<span className="font-sans font-light">Our</span>{' '}
<span className="font-display font-semibold stretch-wide">Approach</span>
```

**Page heroes** — about/products 页头统一用 `<PageHero eyebrow light bold subtitle />`（径向光晕 + 图签 + 标题；背景 = layout 级满铺深空引力场，组件自身不再持有网格/深度层）；contact 页自 v7 起用紧凑标题行（SheetLabel + h1 + 一句副标题），首屏让位给表单卡。

**Responsive font sizes** (use Tailwind tokens, NOT arbitrary values):
- `text-display` — hero titles (clamp 2.5rem → 4.5rem)
- `text-headline` — section titles (clamp 2rem → 3.5rem)
- `text-title` — subsection titles (clamp 1.5rem → 2.25rem)
- `text-subtitle` — large body text (clamp 1.125rem → 1.5rem)

---

## 4. Color System — NEVER Hardcode Hex

**CRITICAL:** Always use Tailwind tokens from `tailwind.config.js`. Never write raw hex values.

**豁免：**
- 第三方技术品牌色（React 蓝、AWS 橙等）集中在 `src/lib/tech-brand-colors.ts`，组件不得内联 hex。
- 邮件 HTML（`src/lib/email-templates.ts`——2026-07-27 已从 route.ts 抽出，本处路径同步修正）的品牌色：邮件客户端不支持 CSS 变量 / Tailwind class，必须内联 hex，统一从 `src/lib/constants.ts` 的 `BRAND_ACCENT` / `BRAND_ACCENT_DARK` 取，不得在模板里写字面 hex。
  🚨 **改邮件模板前必读该文件头的回执纪律**（正本在那里，此处只是指针）：全站两封信 = 管理员通知（发给自己）+ 客户回执（发给填表人）。**回执正文不得回显任何用户提交的内容**——这是回执能够存在的前提，不是可权衡的细节。旧回执正是因为原样回显 Subject/Message 而在 2026-07-27 被判为发信中继并整体删除。发信地址一律取 `MAIL_FROM`，不得写字面量。
- `BlueprintObject` / 能力图标等 hairline SVG 的 rgba 描边色阶（同一蓝色相不同 alpha），及其逐面着色 fill 的中性黑压暗渐变与中性白受光渐变/棱线、底缘压暗 inset（`rgba(0,0,0,α)` / `rgba(255,255,255,α)` — 均为明度轴不是第二色相；v3 Solid Machine 起物件面与按钮/玻璃卡共享厚度暗示语言，顶面白色受光洗属同一豁免，正本 = 2026-07-27-blueprint-object-v3-solid-design spec §2）。
- 按钮系统（globals.css §7 块）的厚度暗示 inset：中性白受光棱线 `rgba(255,255,255,α)` 与中性黑压暗 `rgba(0,0,0,α)`（同为明度轴）。**secondary 面基色消费 `var(--bg-elevated)`**（Void Field v1 §4.2 起直接锚到背景层级 token —— #111620 与砖墙时代那个已删除的面基色**逐位相同、零视觉变化**，换的只是语义锚点：按钮 = 悬在深空前的仪器面板键）；槽缝环 = `var(--bg-base)` 实底。✅ v8 遗留的未结项「按钮槽腔比砖床亮两档、未统一」已随砖床删除而**自动溶解**——背景层不再有任何槽结构，槽腔深浅从此只对自己负责。基色一律走 token，不得回退字面 rgba。
- 背景 token 的 rgba 形态（半透明基面与投影）：`rgba(8,11,16,α)` = `--bg-base` #080B10、`rgba(12,16,23,α)` = bg-surface #0C1017——玻璃卡面底 / 按钮投影在用。**只允许这两个既有 hex 的 rgba 化，不得引入新的字面背景色**。
- 功能反馈色（成功/错误状态专用，非装饰色相）：`emerald-400` / `red-400` 仅限 `IconBadge` 圆徽与表单错误提示文字——状态语义是国际惯例，不受单色相纪律约束，但**禁止把功能色用于装饰**。
- 深空引力场（globals.css `.void-field*` 块 + `--void-deep`，Void Field v1）：**背景层是全站唯一允许第二色相的地方**（见下方色相纪律）。**四个**颜色常量住在 `src/lib/void-field-shader.ts` 的 GLSL 里（`DEEP` #0B0E14 / `BLUE` #4A9FE5 / `EMBER` #7A4A6E / `STARLIGHT` 蓝白星光 vec3(0.82,0.88,1.0)）——GLSL 无法消费 `var()`，故与 CSS 侧的 `--void-deep`、`--accent-rgb` **交叉锁定，改值两处同步**。CSS 侧只有 `--void-deep` 一个字面色。⚠️ `STARLIGHT` 是唯一不受下方亮度不变量约束的项（星点是孤立亮点），**提亮它等于抬高全站最亮像素**，改前重跑实算。
- 玻璃卡材质（globals.css `.card-glass*` 块 + `:root` 的 `--glass-*` 簇，v7）：面底 = 既有背景 hex 的 rgba 化（`rgba(12,16,23,α)` / `rgba(8,11,16,α)`），棱线/压暗 = 中性明度轴，内反射 = accent 低 alpha——全部落在上述既有豁免口径内，**不得引入新字面色**；新玻璃材质决策优先消费 `--glass-*` token（正本对照表见 v7 spec §1.2）。

**材质 token 簇分离**：`--mat-*`（物件，正本对照表见 v4 spec A.2）/ `--glass-*`（玻璃卡，正本 = v7 spec §1.2）——**共享明度轴逻辑，不共享值**。物件消费 `--mat-*`，卡片消费 `--glass-*`，按钮消费 `--bg-elevated` + `--mat-face-tint`，一律不得另起字面 rgba。⚠️ `--wall-*` 簇已随砖墙整体删除；背景层现在没有材质 token 簇（画面全部由 shader 常量生成，CSS 侧只剩 `--void-deep` 一个兜底色）。⚠️ **`--mat-*` 簇的四类分工（2026-07-27 审查逐个核实后修正——此前笼统写作「除 face-tint 外全簇无消费方、全是交叉锁定锚点」，不准确）**：
- **已被 CSS 消费（4）**：`--mat-face-tint` / `--mat-seam-glow` / `--mat-seam-soft` / `--mat-seam-rest`（后三者于 v8 审查中上岗，锁死缝光在 CSS/RM/门控三处的交接值）
- **真交叉锁定锚点（3）**：`--mat-edge-strong` / `--mat-edge-faint` / `--mat-trace-pulse` —— 无 CSS 消费方，但与 `BlueprintObject` TSX 的 STROKE 表逐值对应，**改物件描边色阶必须同步，勿因「未使用」删除**
- **假锚点（1）**：`--mat-face-shade` 值 0.32 落在 TSX 侧 0.30–0.55 的区间内，对不上任何单值，**不具备检测能力**——它给人「有交叉锁定」的错觉而实际没有
- **死码（1）**：`--mat-face-base` 零消费方、零对应值，可删

新材质决策一律消费对应簇，不得另起字面 rgba（TSX 侧与 SVG data-URI tile 保持字面量是 SVG 的 var() 兼容豁免，均与 token 交叉锁定）。

### Accent Scale (Synth Blue = 蓝图蓝)
| Token | Hex | Usage |
|-------|-----|-------|
| `accent` | #4A9FE5 | Primary accent, buttons, links |
| `accent-400` | #5DAAE9 | Hover states |
| `accent-700` | #2870AB | Dark accent |

> 色阶只保留这三档。需要透明度用 opacity modifier：`bg-accent/10`、`border-accent/30`、`text-accent/50`。
> **单色相纪律的现行口径（Void Field v1 §3.1 改写）**：
> **UI 层单色相** —— 按钮 / 链接 / 图标 / 正文 / 边框只有 Synth Blue，**禁止引入第二色相**，这仍是 Blueprint 的立场；
> **背景层允许第二色相** —— 仅限深空引力场的次星云带（`EMBER` #7A4A6E 余烬品红，混合比上限 `EMBER_MIX ≤ 0.7`）。
> 理由：人眼在暗部对色相极不敏感，低饱和的第二色相在低 alpha 下读作「一丝暖」而非「另一种颜色」；
> 拉高饱和度会立刻塌成塑料感。**它在这里是深度线索，不是装饰色**——把这个豁免搬去 UI 层即违纪。
> **数值护栏**：次带混合色的峰值贡献 = `AMP2 + CORE×0.7` = 0.075 + 0.021 = **0.096 ≤ 0.10**
> （这是第二色相豁免上唯一的量化约束，改 `AMP2`/`CORE` 时一并核）。

**CSS 侧蓝色的唯一事实源 = `--accent-rgb: 74 159 229`**（2026-07-27 审查引入，替换掉 globals.css 里散落 40 处的 `74, 159, 229` 字面三元组）。需要带透明度的 accent 一律写 `rgb(var(--accent-rgb) / α)`，**不要再手打三元组**。
`--accent-dark: #3488cc` 同时 token 化 —— 它是 §7 按钮 primary 渐变逐字授权的暗端，与 `src/lib/constants.ts` 的 `BRAND_ACCENT_DARK`（邮件 HTML 用）**交叉锁定，改一处必须同步另一处**。
⚠️ 口径说明：「色阶只保留三档」针对的是 **Tailwind token 层**（组件写 class 时只有 accent / 400 / 700 可选）；`--accent-dark` 属**渐变构造用的 CSS 内部值**，不产出 utility、不供业务代码直接消费，两者不冲突。新增任何第四档 utility 仍然禁止。

### Background Layers (冷色海军黑)
| Token | Hex | Usage |
|-------|-----|-------|
| `bg-bg-base` | #080B10 | Page background |
| `bg-bg-surface` | #0C1017 | Card surface (lightest card) |
| `bg-bg-elevated` | #111620 | Standard card background |

### Text Layers (冷白色调)
| Token | Usage |
|-------|-------|
| `text-txt-primary` | Headings, primary body text (#E8ECF0) |
| `text-txt-secondary` | Subtitles, descriptions (#A6AEBA) |
| `text-txt-tertiary` | Captions, metadata, 辅助正文段落 (#929AA8 — 对星云带芯 5.49:1) |
| `text-txt-quaternary` | 装饰/aria-hidden 专用，**正文禁用** (#78818F — 对星云带芯 3.95:1) |

> v4.2 无底纹排版：正文直压背景，可读性全靠文字对比度——正文一律 ≥4.5:1；
> tertiary/quaternary 与 globals.css `:root` 的 `--text-*` 双处声明交叉锁定，
> 改值两处同步。
>
> 🚨 **背景层的对比度纪律收敛成一条不变量**（取代砖墙时代那张「对各棱线」
> 的六值梯队表——每加一条棱线就要重算一遍的结构已随墙消失）：
> **背景任一连续承载面的相对亮度 `L` ≤ 0.0323**
> （由 tertiary 的 L=0.32043 与 WCAG AA 4.5:1 反解：`(0.32043+0.05)/(L+0.05) ≥ 4.5`）。
> 实测（生产构建；**把 `stars()` 彻底禁用后单测**，这样测到的才是连续承载面
> 而不是星晕——用亮度启发式区分星点会误判，这是审查中纠正过的一次错误）：
>
> | 状态 | 星云带（含光子环）峰值 | L | tertiary |
> |---|---|---|---|
> | 无井（`uStrength`=0，静态帧口径） | `rgb(22,37,52)` | 0.017416 | **5.49:1** ✅ |
> | 空闲（`uStrength`=0.3 = `S_IDLE`） | `rgb(23,39,56)` | 0.019187 | **5.35:1** ✅ |
> | 按下（`uStrength`=1，光子环最强） | `rgb(27,49,70)` | 0.028718 | **4.71:1** ✅ |
>
> 表按现行 `LENS_R = 0.10` 实测，**井心沿带芯中心线扫 25 点取最坏**（2026-07-28
> 重测，正本 = void-field spec §5.5）。⚠️ 此前记的按下态 5.23:1 是**单点**井心
> 测的、偏乐观，同法扫描下 `LENS_R=0.42` 是 4.64:1 —— 引用这类数字先看口径。
> 强度递增仍成立（0.0287 > 0.0192 > 0.0174），且都在不变量内；
> `RING ≤ 0.09` 是硬上限，原型的 0.26 会把 tertiary 压到 3.06。
> （spec §5.4 的纸面推算给 4.57:1 —— 那是假设环峰与带芯峰完全重合的保守估计，
> 是**与几何无关的上界**，实测总比它宽松。两个数都对，别去「对齐」它们。）
> 🚨 **`LENS_R`（引力井的唯一尺寸旋钮）与强度类同档**：改它必须重跑本实算。
> 「只是缩放几何、不影响亮度」是**错的**——环半径决定它能否整体坐进带芯亮区
> （带芯半宽 ≈40px），叠加峰值会变。要改井的大小只动 `LENS_R`，井关于它自相似，
> `HORIZON` / 环心 1.75 / 环宽 0.34 这些**形态比例一律别碰**。
> ⚠️ **唯一的例外是星点**：峰值 `rgb(192,218,255)` L=0.686（tertiary 0.50:1），
> 但它是 2–3px 的孤立亮点、全屏约 15 颗、**面积占比 0.006%**。判为「不构成排版
> 承载面」，与砖墙时代对亚像素点的口径同类——⚠️ 那里是 0.625²px、这里是 2–3px
> 带晕，**面积大一个量级，类比本身是弱的；真正撑住这个判断的是 0.006% 这个
> 实测面积与「星点只在带内出现」**。**压到合规 = 星点消失**，没有中间档，
> 别试图靠调 `STAR` 密度或 alpha 折中（正本记录 = void-field spec §4.1.1）。
> quaternary 依旧 3.95 < 4.5 ⇒ **恒为装饰/aria-hidden 专用，正文禁用**——
> 这条结论换了背景也没变。
> 🚨 任何新增发光项（新的带、新的环、新的高光）都必须重跑这个实算，
> 而不是凭感觉「看起来不亮」。

### Border CSS Variables (use in inline styles or globals.css)
```css
--border-subtle:  rgba(74, 159, 229, 0.06)   /* 最轻 */
--border-default: rgba(74, 159, 229, 0.10)   /* 默认 */
--border-strong:  rgba(74, 159, 229, 0.18)   /* hover */
--border-heavy:   rgba(74, 159, 229, 0.25)   /* 强调 / crop marks */
```
> v4.1 起**没有网格线 token**（`--grid-line-*` 已随「背景禁绝网格纹路」删除）——
> 背景肌理由 shader 独家承担，不要新造格线变量、也不要往背景上叠图。

### Radial Glow / Background
- 页头/CTA 的径向光晕用 globals.css 的 `.hero-glow` class（`--glow-y` 控制垂直位置），不要内联 radial-gradient。
- 深空引力场 = `<VoidField />`（(public)/layout 与 not-found 各挂一次、永不同时，**页面/组件不得重复实例化**）：`.void-field` fixed 属场景（内容从背景前滚过，零滚动耦合、滚动零 JS）；层序 = `.void-field-still` 静态帧（z1）→ `canvas.void-field-gl` 实时层（z2）。
  文件分工：`VoidField.tsx`（Server，骨架 + 静态帧 + ErrorBoundary 包住 client 岛）/ `VoidFieldGL.tsx`（Client，WebGL2 渲染器 + 弹簧 + 生命周期）/ **`src/lib/void-field-shader.ts` = GLSL 源与全部数值常量的唯一事实源**（🚨 组件里禁止就地写数值字面量）。
- **降级链五级，全部已实装**：① 无 JS/SSR → 静态帧（唯一保底，永远存在）；② 无 WebGL2 或编译链接失败 → 不落 `data-live`，`console.error` 记录**不抛**（抛出会经 ErrorBoundary 打掉整个岛，而静态帧本就是完整画面）；③ `prefers-reduced-motion: reduce` → **不挂 canvas**（零 rAF）；④ 触屏 / `hover:none` / `pointer:coarse` → **不挂 canvas**；⑤ `webglcontextlost` → `preventDefault()` + 撤 `data-live`，`restored` 后重建资源复原。
  ⚠️ ③④ 的媒体查询必须**动态双向**监听（走 `src/lib/listen-mql.ts`）：外接鼠标、系统偏好切换都会在运行时改变判定——这比砖墙时代的「RM 单向拆除」更严。
- ⚠️ **层纪律**：两层且**永不同时可见**，静态帧不参与合成。禁止再造第三层，禁止任何形式的背景层光源（画面里的光只能来自星云自身）。
- 🚨 **静态帧与实时层必须同源**：`public/void-still-{l,p}.webp` 由**同一支 shader**、同一组常量、`uStrength=0` 离线渲出（横 1600×900 / 竖 900×1600，`@media (orientation: portrait)` 切换，只加载其中一张）。改任何 shader 常量都要**重渲这两张图**，否则降级路径与实时路径会画出两个不同的宇宙。生成方式与压缩档位实测见 spec §7.1.1。⚠️ 文件名不带 hash，而 `next.config.js` 给它们的是 `max-age=3600, stale-while-revalidate=604800`——**重渲后老访客最长 7 天内仍可能拿到旧宇宙**（只影响降级路径、会自愈）。要立刻生效就给文件名加版本后缀，别把它当 bug 去查。

---

## 5. Card System — 玻璃检视窗（Card 组件 · v7）

全站卡片**唯一授权入口** = `<Card>`（`src/components/shared/Card.tsx`）。
`.card-glass` / `.card-glass-interactive` / `.card-glass-accent` / `.card-tilt` 是组件私有
CSS 引擎（globals.css §5 块），**业务代码禁止直接写这些类**（与 ModuleButton 同款纪律）。
旧 GlassCard / `.card-surface|elevated|spotlight` 已于 v7 退役——全库 grep 零命中是迁移完成的定义。

```tsx
import Card from '@/components/shared/Card';

<Card variant="interactive" sheetNo="S.01" cropMarks>...</Card> // 整卡可点（使用处外层自行包 Link/a）
<Card variant="static" accent>...</Card>                        // 纯展示重点卡
<Card variant="container" pad="lg">...</Card>                   // 外壳静、内部子元素自带交互（FAQ 形态）
```

Props：`variant`（interactive / static / container，**按交互语义选择，不按视觉浓淡**；
⚠️ static 与 container 渲染完全相同的 class——差异纯语义，错配无视觉信号，对着定义选）、
`accent`（左侧蓝色渐变竖线 = 重点标记，正交于变体）、`sheetNo`（图纸**页码**mono 角标
的全站唯一实现——水印大数字已退役；流程/列表的**步骤序号**是另一统一形态：行内
`font-mono text-sm font-semibold text-accent`，about 流程卡与 TextListSection 共用）、
`cropMarks`、`pad`（none/sm/md/lg = p-0/p-5/p-6/p-8，默认 md；none 供 container 形态
内部子元素自带 padding 用——**禁止为改 padding 绕开组件直写 CSS 类**）、`className`。
组件不带 `'use client'`（双栖；CardTilt client 岛仅 interactive 变体渲染）。

### Card Rules — IMPORTANT
- **变体 = 交互语义**：整卡可点才配 interactive（hover 顶起 + tilt + 投影落向背景）；纯展示
  一律 static（恒定材质，零 hover 位移——「不可点的卡带可点式反馈」是 v7 修复的病灶，禁止回潮）；
  container 外壳静、交互属于内部子元素。**卡片全部 hover/active 反馈都门控在
  hover-capable 设备**——CSS 引擎侧（`.card-glass*`）手写 `@media (hover:hover)`，
  Tailwind utility 侧（group-hover 箭头/logo 提亮等）由 tailwind.config 的
  `future.hoverOnlyWhenSupported` 全站统一编译进同一媒体查询；触屏 tap 站内路由卡
  与外链卡不再粘滞（Hero 模块先例）；触屏卡是链接，tap 即跳转，无按压反馈
- **材质 = 玻璃检视窗**：光滑玻璃档为基态（`--glass-face-solid` 实底，无 blur），
  `@supports`（backdrop-filter or -webkit-backdrop-filter，双属性都写——Safari ≤17
  只认前缀）内升级毛玻璃档（`--glass-face` + blur ≤12px）；厚度 = 顶棱受光 +
  底缘压暗（中性明度轴 inset）+ accent 低 alpha 内反射（**135deg** background 渐变栈，
  非伪元素；::after 归 accent 竖线）
- 🚨 **Backdrop 采样纪律**（真机逐级挂载实验 + hover 态复测定位）：玻璃卡任何祖先的
  `filter` 计算值必须是 `none`——非 none 的 filter（**含 `blur(0px)` 等 identity 值**）
  构成 Backdrop Root（规范行为），子孙 backdrop-filter 只能采样到该祖先内（透明）
  而非背景面，毛玻璃**静默失效**（不报错）。落地规则：
  ① 内联/过渡路径的 filter 终态写 `'none'`（transform 终态同写 none 是卫生习惯，
  但实测**祖先 transform 不截断采样**——CardTilt 逐帧 3D transform 悬停期毛玻璃
  照常生效，tilt 与本纪律无冲突）；
  ② **filter 不得进 scrub/fill 动画关键帧**——插值输出永远是 list 形态，`to: none`
  在 fill both 下 computed 仍为 `blur(0px)`（sheetSettle 已移除 filter 关键帧；
  现存豁免：`reveal` / `wordReveal` 关键帧仍含 filter，仅限 Hero 等**无玻璃卡后代**
  的子树使用——把卡片放进 animate-reveal / .word-reveal 子树即静默复现）；
  ③ 玻璃卡 wrapper 经 `.sheet-reveal:has(.card-glass) { animation: none }` 退出
  scrub 落回 IO 内联路径——scrub fill 的 transform 虽按 ① 推定无害，但未在支持
  animation-timeline 的内核实测，保守定案保确定性。新增入场动画对号入座
- **transform 写入者分层**：CardTilt wrapper = JS 弹簧逐帧（≤2.5°，pointer-tilt-engine）/
  卡片本体 = hover 顶起 CSS transition（`perspective(900px) translateZ(8px)` + 投影落向背景 +
  边框增亮）——永不同元素；per-element perspective 不建 preserve-3d 链；禁常驻 will-change
- Card corner radius is always **8px**（按钮同 8px；全站圆角 = 8px 与 rounded-full 两种 + 唯一窄豁免：表单填写格 `.form-field` 4px，spec §6.2 授权的「格子小于卡」层级暗示）
- 玻璃底上正文对比度 ≥4.5:1（毛玻璃/光滑两档分别成立）
- 统计卡一律 `<StatCard>`（count-up 全站唯一实现）；**整卡可点的收尾行**一律
  `<CardActionRow>`（group-hover 形态；箭头经 `icon` prop 传入——默认站内
  ArrowRightIcon，外链传 `<ExternalArrowIcon/>`）——container 卡内的自悬停链接
  不属此列（如 InDev CTA，自带 hover:gap）；禁止内联箭头 SVG；
  chip 用 `<HighlightTag>`、圆徽用 `<IconBadge>`

---

## 6. Animation Rules — 滚动 3D（零依赖 CSS）

技术基座：`animation-timeline: view()/scroll()`（scrub 式滚动联动）+ CSS 3D transform；不支持的浏览器由 `AnimateOnScroll` 的 IntersectionObserver 内联样式路径接管（CSS 动画级联高于内联样式，双路径共存）。

### 三条踩过坑的硬规则 — IMPORTANT
1. **禁止 `overflow-hidden` 包住任何含 `.sheet-reveal` 的子树**：hidden 会创建 scroll container，劫持 `view()` 时间轴的滚动器查找，整个子树的滚动动画**静默失效**（不报错、不掉 lint）。需要裁切时一律用 globals.css 的 `.overflow-clip-safe`（clip 不建 scroll container；老内核回落 hidden）。
2. **`.bp-draw` 只能用在 `<path>` 上**：`pathLength` 在 `<rect>`/`<circle>` 上 WebKit 不支持，dasharray 归一化会碎成 1px 点线。矩形/圆都用等价 path 命令改写（见 BlueprintObject）。
3. **`prefers-reduced-motion` 四件套**：scroll-driven 动画必须显式 `animation: none`（时长重置对其无效）；`animation-delay`/`transition-delay` 必须通配归零（否则分段 delay 变成逐个"闪现"）；infinite 动画（marquee / scroll-pulse 类）必须显式关闭（0.01ms 周期 = 每帧乱跳）；**`html { scroll-behavior: auto }` 必须显式还原**——平滑滚动不是 animation，四条时长/延迟通配重置对它一律无效，路由跳转回顶与 skip link 会照常整屏平滑滚动（2026-07-27 审查补入，此前长期漏网，是全站 a11y 唯一的实际缺口）。四者都已在 globals.css 的 reduced-motion 块落实，新增动画时对号入座。

### The ONE Scroll Entrance
所有滚动入场动画用 `<AnimateOnScroll>`（内部 = `.sheet-reveal` 图纸沉降：scrub 关键帧只动 rotateX 5° + translateY + opacity；blur 揉入只活在 IO 内联路径——filter 进 scrub 关键帧会废掉毛玻璃，见 §5 Backdrop Root 纪律）。深度层异速位移（depth-drift）已于 v4 退役；背景属场景固定（fixed）、内容从背景前滚过，深度由材质层次（背景/卡片）与暗角下的明暗承担——**内容层之间**禁止引入异速滚动层。

```tsx
import AnimateOnScroll from '@/components/shared/AnimateOnScroll';

<AnimateOnScroll>
  <div>Content revealed on scroll</div>
</AnimateOnScroll>

// 交错入场 (卡片列表) — delay 在降级路径是 transitionDelay，
// 在 scrub 路径自动映射为 animation-range 偏移
{items.map((item, index) => (
  <AnimateOnScroll key={item.id} delay={index * 80 + 100}>
    <Card variant="static">...</Card>
  </AnimateOnScroll>
))}
```

可见性触发逻辑统一走 hooks（`src/hooks/`）— 不要在组件里手写 IntersectionObserver：
- **入场揭示**（TextReveal / AnimateOnScroll）→ `useDeferredReveal`：SSR 基态可见，挂载后仅对视口下方元素武装隐藏态。**纪律：SSR 基态必须可见，JS 只允许在确认将播放动画时才隐藏**——微信 WebView hydration 失败时整页内容仍完整可读（2026-07-26 真机踩坑定案）
- **状态触发**（count-up 等不隐藏内容的场景）→ `useIntersectionVisible`（初始 false 语义保留）
- 首屏 load-time 词入场用 Server 直出 `.word-reveal`（零 JS 依赖），不要用 TextReveal（视口内元素不播动画）

### ALLOWED Animations（白名单，全站只允许这些）

🚨 **两条覆盖全表的运行时纪律（2026-07-27 性能审查定案，正本 = `docs/CODE-REVIEW-2026-07-27.md` F1/F2）**：

1. **Hero 物件视口门控**：`.bp-object-gate[data-idle]` → 子树 `animation-play-state: paused`（`HeroObjectViewportGate` client 岛用 IntersectionObserver 驱动）。**物件滚出视口即全体停帧**。起因：门控前，hero 早已离屏且鼠标不动时，桌面仍持续吃 **29.2% 主线程 / 每帧 225 次全文档 layout**；门控后 0.48% / 1 次。白名单授权的是「这些动画可以存在」，**不等于它们可以在没人看的时候继续跑**。
2. **`modDrift` / `seamPulse` / `corePulse` / `objShadow` 现为桌面专属**（`@media (min-width:1024px) and (hover:hover)`），移动端只保留入场终值（静态值与 RM 块逐字同源，改一处必须同步另一处）。手机端 infinite 动画因此从 12 条降到 2 条。
   ⚠️ **周期长 ≠ 便宜**：这四条的成本不来自频率，而来自「无法下放合成器」——`modDrift` 的关键帧值引用 `var()` 自定义属性，`seamPulse`/`corePulse` 位于 `preserve-3d` 子树内，Chrome 对这两类一律不做合成动画。新增物件动画前先确认它能否合成，不能合成就必须受上述两条门控约束。

- ✅ `sheet-settle` — 图纸沉降入场（AnimateOnScroll；rotateX ≤5°）
- ✅ `bp-draw` / `bp-fade` — SVG 逐笔绘制 + 标注淡入（Hero 物件、hairline 图标）
- ✅ `hero-tilt` — Hero 物件滚动倾斜（scroll(root) scrub，前 600px；≥lg 专属——<lg 为横陈 ELEV. 变体不倾斜）
- ✅ `bpSolidify` — Hero 物件面板实体化淡入（挂载于 `.bp-face-fill` / backglow，入场叙事 Build 阶段）
- ✅ `objFloat` / `objSway` / `objShadow` — Hero 物件常态呼吸/摇曳/投影（`.obj-float` ≤±6px、`.obj-sway` ≤±3°、`.bp-object-shadow`；周期 ≥7s，仅 Hero 物件 BlueprintObject / HeroObjectPhysics；三条均受视口门控，`objShadow` 另为桌面专属）
  ⚠️ **已知未结项**：`objFloat`/`objSway` 在 `preserve-3d` 上做 transform 动画无法合成，hero **在视口内**时仍占主线程。⚠️ 当年那个「与砖阵 DOM 相乘触发每帧全文档 layout」的乘数**已随背景换代消失**（背景层不再有任何 DOM），但物件自身那份成本与背景无关、依然存在。根治需把 `objFloat` 的位移移到扁平包装层（`objSway` 要带子面旋转，必须留在 3D 链内）。留待物件结构重构一并处理，别当新问题重复立项
- ✅ Hero 物件弹簧物理 — HeroObjectPhysics 的 rAF 欠阻尼弹簧（指针阻尼跟随 + 回摆 + hover scale ≈1.03；只写 transform / opacity / CSS 变量；mouse-tracking 豁免第 1 例）
- ✅ `modAssemble` / `modDrift` — Hero 物件模块装配入场 + 错位-停驻-归位无限循环（漂移幅度 ≤18px / 装配入场偏移 ≤38px——物件 v3 随 360 体系等比重标；周期 **各异 + delay 实算错峰，非两两互质**——gcd(14,16)=2、gcd(15,10)=5，改任一 driftDur/driftDelay 必须重跑最坏同步窗实算，别照旧注释假设互质；仅 BlueprintObject 模块层，**桌面专属 + 受视口门控**）
- ✅ `seamIn` / `seamPulse` / `coreIn` / `corePulse` — Hero 物件缝隙发光条与核心环微光呼吸（opacity only，低 alpha 禁强 bloom；pulse 两条**桌面专属 + 受视口门控**，静态终值走 `--mat-seam-rest` 等 token 与 RM 块同源）
- ✅ `trace-pulse` — 走线数据脉冲（stroke-dashoffset invisible-hold 间歇式；dash 4 gap 196 @ pathLength 100——gap 必须 > pathLength+dash，否则图案周期回绕会让 hold 期 dash 停在路径起点；头 α≤0.85、零 blur；周期 ≥9s 互异 + delay 实算错峰（**非**两两互质——改 dur/delay 必须按 v3.1 spec §2.1 重跑碰撞实算）、可见窗 ≤15%；仅 BlueprintObject 桌面变体走线 overlay）
- ✅ `pip-cycle` — 状态灯序列（opacity 错相轮转，周期 ≥6s；RM 回落首格常亮；仅 BlueprintObject pips/端口阵列）
- ✅ `ring-step` — 刻度圈步进（transform rotate steps(24)，5s/格；可读步进靠组内 index 索引亮格——24 段对称虚线圈自身旋转是逐像素空操作；禁连续旋转——持续重栅格化；仅 BlueprintObject 核心刻度圈）
- ✅ Hero 物件单模块 `:hover` 偏移 — transition ≤11px 沿签名轴（物件 v3 等比重标）+ 描边增亮（`@media (hover: hover)` 限定防触屏粘滞；仅 `.bp-module`，卡片一律不做）
- ✅ `reveal` — 页面加载入场（`animate-reveal` utility，仅 Hero 非 LCP 元素）
- ✅ `wordReveal` — 首屏副标题词级交错入场（`.word-reveal`，Server 直出零 JS 依赖；≤8px 位移 / 2px blur，仅 load-time 词入场）
- ✅ `void-lens` — 引力透镜（VoidFieldGL：全局 2 根弹簧「井心 vec2 + 强度」半隐式欧拉，空间扭曲是井心与强度的**纯函数**，**零逐元素状态**——比砖墙重力井更彻底，那里形变的好歹还是 div，这里连元素都没有；`pointerdown` 时强度 0.30→1.00 走同一根弹簧；逐帧主线程写入 = **3 个 uniform + 1 次 drawArrays**，扭曲全在 GPU；弹簧收敛即停帧、标签页隐藏即停帧（实测指针静止 2s 内 **0 次 rAF**）；**零发光跟随**——唯一跟指针走的亮度项是光子环，而它是**被透镜偏折的星云光、不是新光源**，且 `RING ≤ 0.09` 是受对比度不变量约束的**硬上限**（原型的 0.26 会把 tertiary 压到 3.06:1）；DPR 上限 1.5（并监听 `(resolution: Xdppx)` —— 拖到不同 DPI 的屏不触发 resize 事件，不跟进会让 DITHER 被拉伸插值抹平）；仅 hover+fine 且非 RM **且非 forced-colors** 挂载，触屏/RM/强制配色/无 JS/无 WebGL2 = 静态帧；mouse-tracking 豁免第 2 例，仅限 VoidFieldGL。
  🚨 **shader 无 `uTime` 是架构前提**，不是优化：它同时保证「指针不动 = 零成本」与「静态降级帧与实时层同源」。新增任何时间相关项会**同时破坏这两条**，必须重新走 spec。
  🚨 改常量前必读 void-field spec §4.1.1 / §5.3 / §5.5：构图类（`OFF*`/`TILT`/`BAND*`/`NSCALE`/`NOISE`/`VIG`/`STAR`）可自由微调；**强度类（`AMP1`/`AMP2`/`CORE`/`RING`/`EMBER_MIX`）与尺寸旋钮 `LENS_R` 每次改动都必须重跑亮度实算**并把新数字写回 spec 与本文件。改完还要**重渲两张静态帧**——⚠️ 唯一的例外是 `LENS_R`：静态帧是 `uStrength=0`，此时 `d≡0` 且 `sGate=0`，它完全不参与成像，改它不必重渲）
- ✅ `btn-tilt` — 按钮悬停期微摆（ButtonTilt → `src/lib/pointer-tilt-engine.ts` 共享单例引擎，每按钮独立参数 k30 ζ0.6；倾角 ≤4°、仅指针在按钮盒内跟随（盒外即零——嵌在槽里的键不晃，v4.1 的 130px 邻域跟随已退役）；仅 hover+fine 且非 RM 挂引擎，触屏/RM/无 JS = 纯透传 span；与本体顶出 transition 分层两元素——JS 逐帧 / transition 永不同层；mouse-tracking 豁免第 3 例，仅限 ModuleButton）
- ✅ `card-tilt` — interactive 卡指针倾斜（CardTilt → pointer-tilt-engine 同一共享引擎、per-entry 参数：≤2.5° k22 ζ0.65 慢弹簧「厚玻璃板惯性」，perspective 900px；盒内跟随盒外即零；仅 hover+fine 且非 RM 挂载，触屏/RM/无 JS = 纯静态透传；**全站禁止第二份引擎代码**；mouse-tracking 豁免第 4 例，仅限 Card interactive 变体）
- ✅ 卡片 hover 顶起/active 微收 — interactive 卡本体 `perspective(900px) translateZ(8px)` transition + 投影落向背景 + 边框增亮；active `translateZ(2px)` 0.09s 快过渡 + 投影回落半档（与 tilt 分层两元素，照 ModuleButton 先例；hover/active 均包 `@media (hover:hover)`；static/container 卡零 hover 位移）
- ✅ 按钮顶出/按入 — 本体 `perspective() translateZ` transition（rest 齐平嵌槽 / hover +16px 顶出 / active −5px 按入 0.09s 快过渡；per-element perspective 不建 preserve-3d 链）+ 槽缝涌光 opacity 过渡（frame ::after，`:has(:hover)` 驱动，老内核软降级恒不亮；槽光属**内容层**的光（按钮是通电的模块），与背景层的零光源纪律正交；仅 .btn-primary/.btn-secondary。v4.1 的 btnHoverIdle 呼吸、backglow、`--btn-dy` 双层反向位移已全部退役）
- ✅ `marquee` — infinite horizontal scroll (SocialProofBar)
- ✅ `scaleIn` — 表单成功态缩放弹入
- ✅ `scroll-pulse` / `scale-in-dot` — 滚动指示器
- ✅ `border-color` 微响应 — static/container 卡 hover 边框 default→strong（非 interactive 卡唯一允许的 hover 反馈；位移/投影/光晕禁止）
- ✅ count-up 数字滚动（useCountUp）

### FORBIDDEN Animations
- ❌ `shimmer` / shimmer gradients
- ❌ `float` / floating animations（豁免仅一例：Hero 物件 `objFloat`——按钮呼吸已随 v4.2 嵌槽语义退役）
- ❌ `gradient-shift` / `gradientShift`
- ❌ `noise` texture overlays
- ❌ 满屏 parallax（背景属场景固定、内容从背景前滚过；**内容层之间**禁止异速滚动层——v3 的 depth-drift 已退役）
- ❌ `particle` effects
- ❌ mouse-tracking tilt / mouseGlow（豁免仅四例窄列举，均为 rAF 阻尼弹簧非 1:1 硬跟：① Hero 物件 HeroObjectPhysics 指针跟随；② VoidFieldGL 的引力透镜（**纯坐标扭曲 + 视界压黑，零发光跟随**——光子环受对比度不变量硬钳；`pointerdown` 加深走同一根弹簧，正本 = void-field spec）；③ ModuleButton 的 ButtonTilt 悬停微摆；④ Card interactive 变体的 CardTilt 指针倾斜——③④ 共享 `src/lib/pointer-tilt-engine.ts` 单例引擎（全站一套监听、per-entry 参数），禁止第二份引擎。static/container 卡与其余一切元素一律不做）
- ❌ 动画属性超出 transform / opacity / filter / stroke-dashoffset
  （⚠️ `void-lens` 不落在本条的属性模型内：它不动任何 CSS 属性，而是逐帧重绘
  一块 GPU 表面。约束它的是「收敛即停帧 + 3 个 uniform」那套，不是本条）

### 性能纪律
- LCP 元素（各页 h1）**不加入场动画**
- 不引入动效 JS 库（Motion/Lenis/three.js 均被否决过——用户已选零依赖路线）

---

## 7. Button System — ModuleButton 嵌槽键（Socketed Key v4.2）

全站按钮**唯一授权入口** = `<ModuleButton>`（`src/components/shared/ModuleButton.tsx`）。
`.btn-primary` / `.btn-secondary` / `.btn-module-frame` 是组件私有 CSS 引擎
（globals.css §7 块），**业务代码禁止直接写这些类**。

```jsx
import ModuleButton from '@/components/shared/ModuleButton';

<ModuleButton href="/contact" arrow>Book a Call</ModuleButton>              // Link 形态
<ModuleButton href="/products" variant="secondary">View</ModuleButton>
<ModuleButton type="submit" disabled={sending} aria-busy={sending}>Send</ModuleButton>
<ModuleButton variant="secondary" onClick={reset}>Try Again</ModuleButton>  // button 形态
```

Props：`variant`（primary 默认 / secondary）、`href`（有 → Link，无 → button）、
`arrow`（内置 ArrowRightIcon + hover 右移，**不要手动内联箭头**）、
`className`（本体布局，如 `w-full`）。`phase` 已随呼吸退役（v4.2），别再传。
props 是**判别联合**：`href` 与 `disabled`/`type`/`onClick` 互斥——Link 上没有
`:disabled` 伪类，禁用姿态会静默落空，所以类型层面禁止该组合。
组件不带 `'use client'`（双栖：server 树零 hydration，client 宿主自动随包）。

### Button Rules — IMPORTANT
- **语义 = 悬在深空前的仪器面板键**（Void Field v1 §4.2 起换锚；砖墙时代的
  「砌进墙里的一块砖」随墙退役，几何 / 槽缝环 / 槽光**全部原样保留**）：rest 与
  面板齐平（四周 3px 槽缝环可见、槽内常态微光）→ hover 顶出
  （translateZ +16px 近大投影 + 投影落向背景 + 槽光涌出洗上面板）→ active 按入槽内
  （−5px + 槽口内阴影，0.09s 快过渡）→ disabled 齐平变暗（opacity 0.55）
- **组件结构（transform 写入者分层）**：frame（`.btn-module-frame` 静态骨架，
  `isolation: isolate` 锁负 z 层序；`::before` = 槽缝环、`::after` = 涌光层）
  → `ButtonTilt`（`.btn-tilt` 悬停期 JS 弹簧微摆 ≤4°，client 岛，消费
  `src/lib/pointer-tilt-engine.ts` 共享引擎——与 CardTilt 同引擎不同参数）→ 本体
  （pop/press transition）——JS 逐帧 / transition 永不共存于同一元素；
  v4.1 的呼吸 infinite / backglow / `--btn-dy` 双伪元素反向抵消已全部退役
- **顶出用 per-element perspective**：`perspective(700px) translateZ(...)`
  内嵌在本体 transform 值里——不建 preserve-3d 链，tilt wrapper 的扁平化
  不影响投影；顶出近大投影会横向多盖 ~3px 槽缝，视觉叙事由涌光接管（定案，
  非缺陷）
- **槽缝环/涌光**（frame 伪元素，z -1）：槽腔 = `var(--bg-base)` 实底 +
  hairline 框 + 槽内常态微光 + 槽口上缘压暗；涌光 `:has(:hover)` 驱动
  opacity（老内核软降级恒不亮，无害）。⚠️ 背景层零光源，槽光不由「背景后的
  光」背书——现行口径 = **按钮是通电的模块**，槽光属**内容层**的光
  （与 BlueprintObject 的缝隙光同类），与背景层的零光源纪律正交；
  **背景侧任何形式的发光仍然被禁**
- **面材质直接画在本体元素背景上**（插槽外移 frame 后负 z 伪元素层序问题
  消失）：primary = accent 渐变通电键；secondary = 面板键同栈
  （`--bg-elevated` 实底 + `--mat-face-tint` 受光沉降 + 顶棱/底缘 inset）
- 触屏无 hover：静态齐平嵌槽 + `:active` 按入传达质感（纯 CSS，无 JS 依赖）
- `:focus-visible`：2px accent 外描边 + 3px offset（显式定义，勿删）
- 触达面积 ≥44px — 由类内 `padding: 0.75rem 1.75rem` 锁定
- 🚨 **引擎块在 `@tailwind utilities` 之后，同特异性按源序压过使用处 utility——
  它吞掉的远不止尺寸类**（2026-07-27 审查校正：旧表述只提尺寸，害人以为其余能覆写）。
  在 `<ModuleButton className>` / `<Card className>` 里写下列属性**一律静默无效**，
  不报错、不掉 lint、devtools 里能看到被划掉：
  `display` / `align-items` / `justify-content` / `gap` / `padding` /
  `border-radius` / `cursor` / `transition` / `color` / `font-weight` /
  `font-size` / `border` / `background(-image|-color)` / `box-shadow`
  **仍然生效的**：`margin` / `width` / `height` / flex 项属性 / `position` 偏移 /
  `text-align` 等引擎未声明的属性。
  要改上表任一项 = 改引擎本身或加组件 prop，**不要在使用处试图覆写**。
  同款契约适用于 `.card-glass` 与 `.form-field`。
- Primary: `linear-gradient(135deg, #4A9FE5, #3488CC)` background
- Border radius: **8px**（与卡片统一；槽缝环 10px 包络）
- Font: `text-sm font-semibold` (primary) / `text-sm font-medium` (secondary)
- 禁止给按钮加 `scale(0.98)` 按压（由 translateZ 按入取代）

---

## 8. Section Dividers

Use `.ruled-line` class for horizontal gradient dividers between page sections:

```jsx
<hr className="ruled-line" />
```

The line fades from transparent at edges to `--border-strong` in the center.

---

## 9. SectionTitle Component

**ALWAYS** use `<SectionTitle>` from `src/components/shared/SectionTitle.tsx` for section headers.

```tsx
import SectionTitle from '@/components/shared/SectionTitle';

<SectionTitle
  sheetNo="02"                     // 图纸编号 (页内 section 序号，可选)
  eyebrow="OUR PROCESS"            // 图签标签 (SheetLabel 渲染，可选)
  light="How We"                   // Manrope font-light
  bold="Deliver"                   // Archivo semibold + stretch-wide
  subtitle="Description text..."   // 副标题 (可选)
  size="lg"                        // lg | md | sm
  align="left"                     // center | left
/>
```
