# Synthmind — Blueprint Design System Rules

> These rules encode the "Blueprint" design system（静默精密 / Quiet Precision — 蓝图制图语言）. All AI agents MUST follow them when implementing UI components, translating Figma designs, or modifying frontend code.
> 设计定案与路线图正本：`docs/superpowers/specs/2026-07-25-frontend-redesign-design.md`

## Code Language Policy

- **Code** (variables, functions, files): English
- **Comments**: Chinese (内部使用)
- **UI copy**: English (面向英文用户)

---

## 1. Project Structure

- `src/app/layout.tsx` — 根 layout 只放 html/body/globals.css/metadata；页面壳层（SiteHeader/SiteFooter + BlueprintWall 单实例）在 `(public)/layout.tsx`
- `src/data/` — TS 常量即内容层（非 CMS）：case-studies.ts（软件产品）/ real-estate.ts（地产盘）/ navigation.ts
- `src/proxy.ts` — Next 16 middleware 约定文件（安全 header），命名是框架约定不是笔误
- 其余目录结构以 `ls src/` 为准（shared 组件清单看 `src/components/shared/`）

### Component Reuse Rules
- **ALWAYS** check `src/components/shared/` before creating new UI components
- **ALWAYS** check `src/data/` for existing data constants before hardcoding
- **NEVER** hardcode the site URL or contact email — import `SITE_URL` / `CONTACT_EMAIL` from `src/lib/constants.ts`
- Page-specific components go in their domain folder (`home/`, `products/`, `case-study/`)
- Generic reusable components go in `shared/`

### Real Estate Module — IMPORTANT
地产营销站（Avella / Kingshaven / Woodbine Parkside / UnionGlens）**不再有独立详情页**：
- 数据层：`src/data/real-estate.ts`（`RealEstateSite` 接口）
- 展示：`/products` 页内的 `<RealEstateShowcase />`（`id="real-estate"` 锚点），卡片外链真实站点
- 旧详情页 slug 在 `next.config.js` 中 301 到 `/products#real-estate`
- 新增地产盘 = 在 `real-estate.ts` 加一条 + logo 放 `public/product/`；新增软件产品 = 在 `case-studies.ts` 加一条（详情页自动生成）

---

## 2. Design Concept — Blueprint（先读这个再写 UI）

全站视觉隐喻 = **工程制图/蓝图**：Synth Blue 就是蓝图蓝，客户行业全部活在图纸与单据里（建筑提交文件 / 保单 / 签署文档 / 地产平面图）。设计纪律：

- 科技感做**底色**而非主角；高级藏在细节里（图签、hairline、crop marks——注意到才看见）
- 排版精度 > 空间/材质 > 动效 > 色彩数量
- 编号只用于**真实序列**（图纸页码、流程步骤）；能力/价值等非序列内容禁止装饰性编号
- 标注预算：**自由文本** mono 测量标注（如坐标、尺寸）每屏 ≤2 处；图签（SheetLabel）与卡片图纸编号（S.NN）属结构性编号，不计入预算
- **真砖重力井墙（v6 Lantern Wall）**：全站唯一背景 = `BlueprintWall`（单实例，(public)/layout 的 relative wrapper 内挂载）——概念 = **墙是光前面的一排真砖，指针是压在墙上的重力井 + 墙后一盏灯**。墙属场景（`.bp-wall` fixed 视口级，**内容从墙前滚过、墙与光不动**，零滚动耦合——v4 的「随滚」已退役）；**单层砖纪律**：桌面指针路径 = WallBricks 首次 pointermove 铺满视口的真砖 div 阵（缝隙是真空隙，墙后光直接透出，无任何底衬/假光层），触屏/RM/无 JS = 静态 SVG tile（像素等价），经 `.bp-wall[data-live]` 互斥切换——**任何时刻只有一层砖**；指针交互 = **重力井塌陷**（近针砖向墙内陷成碗 ≤16px、坑壁沿坡度朝坑心倾 ≤15°、材料向坑心微聚、井深处砖面渐透 ≤25%——墙后灯光从塌陷缝与砖体渗出）；灯光 = 右上角落余晖 + 指针灯（均墙后），**砖面禁绝网格纹路**；守单蓝色相 + 哑光禁强 bloom（指针灯/井心透光是唯一窄豁免：强度弹簧驱动、离开归零，口径见 §6）；内容层次二级：**L0 墙 / L2 玻璃检视窗卡片**——**任何 section 不得持有底色**（L1 已于 v4.2 退役；v6 定案见 2026-07-26-lantern-wall-v6-design spec）。**卡片 = 压在灯箱墙前的玻璃检视窗（v7）**：墙后灯光透过毛玻璃揉成柔光晕、砖缝光磨成雾光（`@supports` 无 backdrop-filter 自动回退光滑玻璃档）——v4「图纸不是玻璃」条款已随 v6 灯箱物理修订退役（v7 定案见 2026-07-26-card-system-v7-glass-design spec）

## 3. Typography — Archivo + Manrope + IBM Plex Mono

Three fonts loaded via `next/font/google` in root layout. Tailwind classes:

| Font | Class | Usage | RESTRICTION |
|------|-------|-------|-------------|
| Archivo (variable, wdth 轴) | `font-display` | Page titles, hero headlines, bold words in SectionTitle | **NEVER for body text** |
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

**Page heroes** — about/products 页头统一用 `<PageHero eyebrow light bold subtitle />`（径向光晕 + 图签 + 标题；背景 = layout 级满铺砖墙，组件自身不再持有网格/深度层）；contact 页自 v7 起用紧凑标题行（SheetLabel + h1 + 一句副标题），首屏让位给表单卡。

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
- 邮件 HTML（`src/app/api/contact/route.ts`）的品牌色：邮件客户端不支持 CSS 变量 / Tailwind class，必须内联 hex，统一从 `src/lib/constants.ts` 的 `BRAND_ACCENT` / `BRAND_ACCENT_DARK` 取，不得在模板里写字面 hex。
- `BlueprintObject` / 能力图标等 hairline SVG 的 rgba 描边色阶（同一蓝色相不同 alpha），及其逐面着色 fill 的中性黑压暗渐变（`rgba(0,0,0,α)` — 明度轴不是第二色相）。
- 按钮系统（globals.css §7 块）的厚度暗示 inset：中性白受光棱线 `rgba(255,255,255,α)` 与中性黑压暗 `rgba(0,0,0,α)`（同为明度轴）。**secondary 面基色消费 `var(--mat-face-base)`**（砖面同源实底）；槽缝环 = `var(--bg-base)` 实底（v6 起墙侧无槽腔层，此口径仅按钮消费）——基色一律走 token，不得回退字面 rgba。
- 背景 token 的 rgba 形态（半透明基面与投影）：`rgba(8,11,16,α)` = `--bg-base` #080B10、`rgba(12,16,23,α)` = bg-surface #0C1017——`.card-surface` / 按钮投影在用。**只允许这两个既有 hex 的 rgba 化，不得引入新的字面背景色**。
- 砖墙材质（globals.css `.bp-wall*` / `.bp-brick*` 块）：同蓝色相 alpha 阶 + 中性明度轴，与物件同一豁免逻辑；砖面 SVG data-URI tile 内的字面色值属此豁免（data URI 无法消费 var()，与 `--mat-*` token 交叉锁定，改值两处同步）。
- 玻璃卡材质（globals.css `.card-glass*` 块 + `:root` 的 `--glass-*` 簇，v7）：面底 = 既有背景 hex 的 rgba 化（`rgba(12,16,23,α)` / `rgba(8,11,16,α)`），棱线/压暗 = 中性明度轴，内反射 = accent 低 alpha——全部落在上述既有豁免口径内，**不得引入新字面色**；新玻璃材质决策优先消费 `--glass-*` token（正本对照表见 v7 spec §1.2）。

**材质 token（v4 / v4.1）**：物件面/线/光系的共享原语已提为 `:root` 的 `--mat-*` 变量（`--mat-face-base/tint/shade`、`--mat-edge-strong/faint`、`--mat-seam-glow/soft`，正本对照表见 v4 spec A.2；`--mat-face-base` 已按 v4.1 spec §2.5 重定为 `rgba(17,22,32,0.9)` 高实度档，砖面与 secondary 按钮面同源消费）——砖墙/按钮的新材质决策**优先消费 token**，不得另起字面 rgba；改 `BlueprintObject` 的 STROKE/face 色阶必须同步 `--mat-*`（TSX 侧与砖面 SVG data-URI tile 保持字面量是 SVG 的 var() 兼容豁免，均与 token 交叉锁定）。

### Accent Scale (Synth Blue = 蓝图蓝)
| Token | Hex | Usage |
|-------|-----|-------|
| `accent` | #4A9FE5 | Primary accent, buttons, links |
| `accent-400` | #5DAAE9 | Hover states |
| `accent-700` | #2870AB | Dark accent |

> 色阶只保留这三档。需要透明度用 opacity modifier：`bg-accent/10`、`border-accent/30`、`text-accent/50`。**禁止引入第二色相** — 单色相纪律是 Blueprint 的立场。

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
| `text-txt-tertiary` | Captions, metadata, 辅助正文段落 (#929AA8 — 对墙面 ≈6.5:1) |
| `text-txt-quaternary` | 装饰/aria-hidden 专用，**正文禁用** (#78818F — 对墙面 ≈4.6:1) |

> v4.2 无底纹排版：正文直压砖墙，可读性全靠文字对比度——正文一律 ≥4.5:1；
> tertiary/quaternary 与 globals.css `:root` 的 `--text-*` 双处声明交叉锁定，
> 改值两处同步。

### Border CSS Variables (use in inline styles or globals.css)
```css
--border-subtle:  rgba(74, 159, 229, 0.06)   /* 最轻 */
--border-default: rgba(74, 159, 229, 0.10)   /* 默认 */
--border-strong:  rgba(74, 159, 229, 0.18)   /* hover */
--border-heavy:   rgba(74, 159, 229, 0.25)   /* 强调 / crop marks */
```
> v4.1 起**没有网格线 token**（`--grid-line-*` 已随「砖面禁绝网格纹路」删除）——
> 需要背景肌理一律走砖墙材质，不要新造格线变量。

### Radial Glow / Wall
- 页头/CTA 的径向光晕用 globals.css 的 `.hero-glow` class（`--glow-y` 控制垂直位置），不要内联 radial-gradient。
- 真砖重力井墙 = `<BlueprintWall />`（(public)/layout 已挂载一次，**页面/组件不得重复实例化**）：`.bp-wall` fixed 属场景（内容从墙前滚过，零滚动耦合、滚动零 JS）；层序 = 角落余晖 `.bp-wall-ambient` + 指针灯 `.bp-wall-lamp`（均墙后，z auto）→ 静态 tile `.bp-wall-face` / 真砖阵 `.bp-wall-grid`（同 z1，`[data-live]` 互斥切换）。砖 pitch 走 `--wall-brick-w`/`--wall-seam` 媒体查询阶梯（56 基准 / ≥2200px 64 / ≥3600px 96；缝恒 = pitch/16），**JS 只读不定**，解析失败即放弃增强（tile 原样）。
- ⚠️ **单层砖纪律**：任何时刻只有一层砖——禁止 tile 与真砖阵同时可见，禁止再造逐格底衬/假光层（v5 的「tile + DOM 砖 + 底衬 + 假涌光」四层互相遮掩机器已整体退役）；墙后的光必须是真光（余晖/指针灯直接从真缝隙透出）。

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
- **变体 = 交互语义**：整卡可点才配 interactive（hover 顶起 + tilt + 投影落墙）；纯展示
  一律 static（恒定材质，零 hover 位移——「不可点的卡带可点式反馈」是 v7 修复的病灶，禁止回潮）；
  container 外壳静、交互属于内部子元素
- **材质 = 玻璃检视窗**：光滑玻璃档为基态（`--glass-face-solid` 实底，无 blur），
  `@supports`（backdrop-filter or -webkit-backdrop-filter，双属性都写——Safari ≤17
  只认前缀）内升级毛玻璃档（`--glass-face` + blur ≤12px）；厚度 = 顶棱受光 +
  底缘压暗（中性明度轴 inset）+ accent 低 alpha 内反射（225deg background 渐变栈，
  非伪元素；::after 归 accent 竖线）
- 🚨 **Backdrop 采样纪律**（毛玻璃三杀手，全部真机逐级挂载实验定位）：玻璃卡任何
  祖先的 `filter` **与 `transform`** 计算值都必须是 `none`——非 none 的 filter 构成
  Backdrop Root（规范行为），非 none 的 transform（含 `translate(0)` 等 identity 值）
  在 Chromium 里同样把子孙 backdrop-filter 的采样域截断在该祖先内——两者任一存在，
  玻璃卡采样不到墙，毛玻璃**静默失效**（不报错）。三条落地规则：
  ① 内联/过渡路径的 filter/transform 终态写 `'none'`（AnimateOnScroll 已按此口径）；
  ② **filter 不得进 scrub/fill 动画关键帧**——插值输出永远是 list 形态，`to: none`
  在 fill both 下 computed 仍为 `blur(0px)`（sheetSettle 已移除 filter 关键帧）；
  ③ transform 是沉降动画本体无法剥离——**玻璃卡的 wrapper 经
  `.sheet-reveal:has(.card-glass) { animation: none }` 退出 scrub**，落回 IO 内联
  路径（入场沉降仍在，完成后全落 none）。新增入场动画对号入座
- **transform 写入者分层**：CardTilt wrapper = JS 弹簧逐帧（≤2.5°，pointer-tilt-engine）/
  卡片本体 = hover 顶起 CSS transition（`perspective(900px) translateZ(8px)` + 投影落墙 +
  边框增亮）——永不同元素；per-element perspective 不建 preserve-3d 链；禁常驻 will-change
- Card corner radius is always **8px**（按钮同 8px，全站圆角只有 8px 和 rounded-full 两种）
- 玻璃底上正文对比度 ≥4.5:1（毛玻璃/光滑两档分别成立）
- 统计卡一律 `<StatCard>`（count-up 全站唯一实现）；卡片收尾行一律 `<CardActionRow>`
  （站内/外链箭头 variant）——禁止内联箭头 SVG；chip 用 `<HighlightTag>`、圆徽用 `<IconBadge>`

---

## 6. Animation Rules — 滚动 3D（零依赖 CSS）

技术基座：`animation-timeline: view()/scroll()`（scrub 式滚动联动）+ CSS 3D transform；不支持的浏览器由 `AnimateOnScroll` 的 IntersectionObserver 内联样式路径接管（CSS 动画级联高于内联样式，双路径共存）。

### 三条踩过坑的硬规则 — IMPORTANT
1. **禁止 `overflow-hidden` 包住任何含 `.sheet-reveal` 的子树**：hidden 会创建 scroll container，劫持 `view()` 时间轴的滚动器查找，整个子树的滚动动画**静默失效**（不报错、不掉 lint）。需要裁切时一律用 globals.css 的 `.overflow-clip-safe`（clip 不建 scroll container；老内核回落 hidden）。
2. **`.bp-draw` 只能用在 `<path>` 上**：`pathLength` 在 `<rect>`/`<circle>` 上 WebKit 不支持，dasharray 归一化会碎成 1px 点线。矩形/圆都用等价 path 命令改写（见 BlueprintObject）。
3. **`prefers-reduced-motion` 三件套**：scroll-driven 动画必须显式 `animation: none`（时长重置对其无效）；`animation-delay`/`transition-delay` 必须通配归零（否则分段 delay 变成逐个"闪现"）；infinite 动画（marquee / scroll-pulse 类）必须显式关闭（0.01ms 周期 = 每帧乱跳）。三者都已在 globals.css 的 reduced-motion 块落实，新增动画时对号入座。

### The ONE Scroll Entrance
所有滚动入场动画用 `<AnimateOnScroll>`（内部 = `.sheet-reveal` 图纸沉降：scrub 关键帧只动 rotateX 5° + translateY + opacity；blur 揉入只活在 IO 内联路径——filter 进 scrub 关键帧会废掉毛玻璃，见 §5 Backdrop Root 纪律）。深度层异速位移（depth-drift）已于 v4 退役；v6 起墙属场景固定（fixed）、内容从墙前滚过，深度由材质层次（墙/卡片）与墙后灯光承担——**内容层之间**禁止引入异速滚动层。

```tsx
import AnimateOnScroll from '@/components/shared/AnimateOnScroll';

<AnimateOnScroll>
  <div>Content revealed on scroll</div>
</AnimateOnScroll>

// 交错入场 (卡片列表) — delay 在降级路径是 transitionDelay，
// 在 scrub 路径自动映射为 animation-range 偏移
{items.map((item, index) => (
  <AnimateOnScroll key={item.id} delay={index * 80 + 100}>
    <GlassCard>...</GlassCard>
  </AnimateOnScroll>
))}
```

可见性触发逻辑统一走 hooks（`src/hooks/`）— 不要在组件里手写 IntersectionObserver：
- **入场揭示**（TextReveal / AnimateOnScroll）→ `useDeferredReveal`：SSR 基态可见，挂载后仅对视口下方元素武装隐藏态。**纪律：SSR 基态必须可见，JS 只允许在确认将播放动画时才隐藏**——微信 WebView hydration 失败时整页内容仍完整可读（2026-07-26 真机踩坑定案）
- **状态触发**（count-up 等不隐藏内容的场景）→ `useIntersectionVisible`（初始 false 语义保留）
- 首屏 load-time 词入场用 Server 直出 `.word-reveal`（零 JS 依赖），不要用 TextReveal（视口内元素不播动画）

### ALLOWED Animations（白名单，全站只允许这些）
- ✅ `sheet-settle` — 图纸沉降入场（AnimateOnScroll；rotateX ≤5°）
- ✅ `bp-draw` / `bp-fade` — SVG 逐笔绘制 + 标注淡入（Hero 物件、hairline 图标）
- ✅ `hero-tilt` — Hero 物件滚动倾斜（scroll(root) scrub，前 600px；≥lg 专属——<lg 为横陈 ELEV. 变体不倾斜）
- ✅ `bpSolidify` — Hero 物件面板实体化淡入（挂载于 `.bp-face-fill` / backglow，入场叙事 Build 阶段）
- ✅ `objFloat` / `objSway` / `objShadow` — Hero 物件常态呼吸/摇曳/投影（`.obj-float` ≤±6px、`.obj-sway` ≤±3°、`.bp-object-shadow`；周期 ≥7s，仅 Hero 物件 BlueprintObject / HeroObjectPhysics）
- ✅ Hero 物件弹簧物理 — HeroObjectPhysics 的 rAF 欠阻尼弹簧（指针阻尼跟随 + 回摆 + hover scale ≈1.03；只写 transform / opacity / CSS 变量；mouse-tracking 豁免第 1 例）
- ✅ `modAssemble` / `modDrift` — Hero 物件模块装配入场 + 错位-停驻-归位无限循环（幅度 ≤14px，周期 ≥10s 错峰；仅 BlueprintObject 模块层）
- ✅ `seamIn` / `seamPulse` / `coreIn` / `corePulse` — Hero 物件缝隙发光条与核心环微光呼吸（opacity only，低 alpha 禁强 bloom）
- ✅ Hero 物件单模块 `:hover` 偏移 — transition ≤10px 沿签名轴 + 描边增亮（`@media (hover: hover)` 限定防触屏粘滞；仅 `.bp-module`，卡片一律不做）
- ✅ `reveal` — 页面加载入场（`animate-reveal` utility，仅 Hero 非 LCP 元素）
- ✅ `wordReveal` — 首屏副标题词级交错入场（`.word-reveal`，Server 直出零 JS 依赖；≤8px 位移 / 2px blur，仅 load-time 词入场）
- ✅ `brick-well` — 真砖重力井塌陷（WallBricks：全局仅 3 标量弹簧「井心 x/y + 强度」半隐式欧拉，砖的下陷 ≤16px / 坡斜 ≤15° / 向心聚拢 ≤3px / 微缩 ≤5% / 透光 ≤25% 全部是井心位置的纯函数，零砖级状态；影响半径 ~200px、坑底经中心阻尼放平；逐帧只写 transform/opacity、圈外砖 lastW 双零跳过、弹簧收敛即停帧；井心透光与指针灯是哑光纪律唯一窄豁免：强度弹簧驱动、离开归零、灯光心 α≤0.9；per-element perspective 不建 preserve-3d 链；仅 hover+fine 且非 RM 懒启动接管（`[data-live]` 隐藏 tile，像素等价无感切换），触屏/RM/无 JS = 静态 tile 原样；mouse-tracking 豁免第 2 例，仅限 BlueprintWall 砖层）
- ✅ `btn-tilt` — 按钮悬停期微摆（ButtonTilt → `src/lib/pointer-tilt-engine.ts` 共享单例引擎，每按钮独立参数 k30 ζ0.6；倾角 ≤4°、仅指针在按钮盒内跟随（盒外即零——嵌墙砖在槽里不晃，v4.1 的 130px 邻域跟随已退役）；仅 hover+fine 且非 RM 挂引擎，触屏/RM/无 JS = 纯透传 span；与本体顶出 transition 分层两元素——JS 逐帧 / transition 永不同层；mouse-tracking 豁免第 3 例，仅限 ModuleButton）
- ✅ `card-tilt` — interactive 卡指针倾斜（CardTilt → pointer-tilt-engine 同一共享引擎、per-entry 参数：≤2.5° k22 ζ0.65 慢弹簧「厚玻璃板惯性」，perspective 900px；盒内跟随盒外即零；仅 hover+fine 且非 RM 挂载，触屏/RM/无 JS = 纯静态透传；**全站禁止第二份引擎代码**；mouse-tracking 豁免第 4 例，仅限 Card interactive 变体）
- ✅ 卡片 hover 顶起 — interactive 卡本体 `perspective(900px) translateZ(8px)` transition + 投影落墙 + 边框增亮（与 tilt 分层两元素，照 ModuleButton 先例；static/container 卡零 hover 位移）
- ✅ 按钮顶出/按入 — 本体 `perspective() translateZ` transition（rest 齐平嵌墙 / hover +16px 顶出 / active −5px 按入 0.09s 快过渡；per-element perspective 不建 preserve-3d 链）+ 槽缝涌光 opacity 过渡（frame ::after，`:has(:hover)` 驱动，老内核软降级恒不亮；与砖墙涌光同一豁免语言；仅 .btn-primary/.btn-secondary。v4.1 的 btnHoverIdle 呼吸、backglow、`--btn-dy` 双层反向位移已全部退役）
- ✅ `marquee` — infinite horizontal scroll (SocialProofBar)
- ✅ `scaleIn` — 表单成功态缩放弹入
- ✅ `scroll-pulse` / `scale-in-dot` — 滚动指示器
- ✅ `border-color` 微响应 — static/container 卡 hover 边框 default→strong（非 interactive 卡唯一允许的 hover 反馈；位移/投影/光晕禁止）
- ✅ count-up 数字滚动（useCountUp）

### FORBIDDEN Animations
- ❌ `shimmer` / shimmer gradients
- ❌ `float` / floating animations（豁免仅一例：Hero 物件 `objFloat`——按钮呼吸已随 v4.2 嵌墙语义退役）
- ❌ `gradient-shift` / `gradientShift`
- ❌ `noise` texture overlays
- ❌ 满屏 parallax（v6 起墙属场景固定、内容从墙前滚过；**内容层之间**禁止异速滚动层——v3 的 depth-drift 已退役）
- ❌ `particle` effects
- ❌ mouse-tracking tilt / mouseGlow（豁免仅四例窄列举，均为 rAF 阻尼弹簧非 1:1 硬跟：① Hero 物件 HeroObjectPhysics 指针跟随；② BlueprintWall 砖层 WallBricks 重力井塌陷——含墙后指针灯 `.bp-wall-lamp`（光斑随井心弹簧移动，四例中唯一的发光跟随；光心 α≤0.9、离开归零，正本 = v6 spec）；③ ModuleButton 的 ButtonTilt 悬停微摆；④ Card interactive 变体的 CardTilt 指针倾斜——③④ 共享 `src/lib/pointer-tilt-engine.ts` 单例引擎（全站一套监听、per-entry 参数），禁止第二份引擎。static/container 卡与其余一切元素一律不做）
- ❌ 动画属性超出 transform / opacity / filter / stroke-dashoffset

### 性能纪律
- LCP 元素（各页 h1）**不加入场动画**
- 不引入动效 JS 库（Motion/Lenis/three.js 均被否决过——用户已选零依赖路线）

---

## 7. Button System — ModuleButton 嵌墙砖（Socketed Brick v4.2）

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
- **语义 = 砌进墙里的一块砖**（BlueprintObject 模块「hover 凸出/移开凹进」的
  按钮版）：rest 与墙齐平（四周 3px 槽缝环可见、槽内常态微光）→ hover 顶出
  （translateZ +16px 近大投影 + 投影落墙 + 槽光涌出洗上墙）→ active 按入槽内
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
  opacity（老内核软降级恒不亮，无害）——与砖墙「光在墙后」同一
  光学语言
- **面材质直接画在本体元素背景上**（插槽外移 frame 后负 z 伪元素层序问题
  消失）：primary = accent 渐变通电砖；secondary = 砖 tile 同栈
  （`--mat-face-base` 实底 + `--mat-face-tint` 受光沉降 + 顶棱/底缘 inset）
- 触屏无 hover：静态齐平嵌墙 + `:active` 按入传达质感（纯 CSS，无 JS 依赖）
- `:focus-visible`：2px accent 外描边 + 3px offset（显式定义，勿删）
- 触达面积 ≥44px — 由类内 `padding: 0.75rem 1.75rem` 锁定；**尺寸不接受
  使用处 utility 覆写**（引擎块在 @tailwind utilities 之后，px-*/py-*/text-*
  会被源序压掉——写了也不生效，别写）
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
