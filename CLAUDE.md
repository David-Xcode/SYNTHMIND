# Synthmind — Blueprint Design System Rules

> These rules encode the "Blueprint" design system（静默精密 / Quiet Precision — 蓝图制图语言）. All AI agents MUST follow them when implementing UI components, translating Figma designs, or modifying frontend code.
> 设计定案与路线图正本：`docs/superpowers/specs/2026-07-25-frontend-redesign-design.md`

## Code Language Policy

- **Code** (variables, functions, files): English
- **Comments**: Chinese (内部使用)
- **UI copy**: English (面向英文用户)

---

## 1. Project Structure

```
src/
├── app/
│   ├── (public)/          # 所有公共页面 (layout: SiteHeader + SiteFooter)
│   │   ├── about/
│   │   ├── contact/
│   │   └── products/
│   │       └── [slug]/    # 软件产品详情页 (地产盘无详情页，见 Real Estate 模块)
│   ├── api/               # API routes (仅 contact)
│   ├── sitemap.ts / robots.ts
│   └── layout.tsx         # 根 layout: html/body/globals.css/metadata ONLY
├── components/
│   ├── shared/            # 可复用 UI: SectionTitle, GlassCard, AnimateOnScroll, CTABanner,
│   │                      #   ContactForm, PageHero, Eyebrow, SheetLabel, BlueprintGrid,
│   │                      #   CropMarks, ArrowRightIcon, AnimatedStat, TextReveal,
│   │                      #   ErrorBoundary, JsonLd
│   ├── layout/            # 布局: SiteHeader, SiteFooter, Breadcrumb
│   ├── home/              # 首页: HomeHero, BlueprintObject, HeroObjectPhysics,
│   │                      #   SocialProofBar, CapabilitiesSection, FeaturedWork, ProcessSection
│   ├── products/          # 产品页: RealEstateShowcase (地产营销站统一模块)
│   └── case-study/        # 产品详情页: CaseStudyHero, ChallengeSection, SolutionSection,
│                          #   TextListSection, TechStackBadges, ResultsSection
├── data/                  # TS 常量 (非 CMS): case-studies.ts (5 软件产品),
│                          #   real-estate.ts (4 地产营销站), navigation.ts
├── hooks/                 # useCountUp, useIntersectionVisible
├── lib/                   # constants.ts (SITE_URL/CONTACT_EMAIL), csrf.ts,
│                          #   tech-brand-colors.ts (品牌色 hex 唯一豁免区)
└── proxy.ts               # Next 16 middleware 约定 (安全 header)
```

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

- 科技感做**底色**而非主角；高级藏在细节里（基准网格、图签、hairline、crop marks——注意到才看见）
- 排版精度 > 空间/材质 > 动效 > 色彩数量
- 编号只用于**真实序列**（图纸页码、流程步骤）；能力/价值等非序列内容禁止装饰性编号
- 标注预算：**自由文本** mono 测量标注（如坐标、尺寸）每屏 ≤2 处；图签（SheetLabel）与卡片图纸编号（S.NN）属结构性编号，不计入预算
- 蓝图网格只出现在 Hero 与关键 section，不满屏铺

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

**Page heroes** — about/products/contact 页头统一用 `<PageHero eyebrow light bold subtitle />`（内置 BlueprintGrid + depth-drift）。

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
| `text-txt-tertiary` | Captions, metadata (#868E9C) |
| `text-txt-quaternary` | Disabled text, decorative (#606876) |

### Border & Grid CSS Variables (use in inline styles or globals.css)
```css
--border-subtle:  rgba(74, 159, 229, 0.06)   /* 最轻 */
--border-default: rgba(74, 159, 229, 0.10)   /* 默认 */
--border-strong:  rgba(74, 159, 229, 0.18)   /* hover */
--border-heavy:   rgba(74, 159, 229, 0.25)   /* 强调 / crop marks */
--grid-line-major: rgba(74, 159, 229, 0.04)  /* 蓝图主网格 96px */
--grid-line-minor: rgba(74, 159, 229, 0.02)  /* 蓝图细分格 24px */
```

### Radial Glow / Grid
- 页头/CTA 的径向光晕用 globals.css 的 `.hero-glow` class（`--glow-y` 控制垂直位置），不要内联 radial-gradient。
- 蓝图网格用 `<BlueprintGrid />` 组件（内部 `.blueprint-grid` + 径向 mask），父容器需 `relative`。

---

## 5. Card System — Sheet 材质（GlassCard 组件）

**ALWAYS** use `<GlassCard>` from `src/components/shared/GlassCard.tsx`（组件名沿用，材质已从玻璃换为图纸片）。

```tsx
import GlassCard from '@/components/shared/GlassCard';

<GlassCard variant="surface">...</GlassCard>   // 最轻量 — 半透明实底（无模糊）
<GlassCard variant="elevated">...</GlassCard>  // 默认 — 实色背景 + hover 上浮 + 蓝色光晕
<GlassCard variant="spotlight">...</GlassCard> // 特色 — 左侧蓝色渐变竖线
```

Props: `variant`, `className`。内边距固定 `p-6` — 需要自定义 padding 时直接用 `.card-surface` / `.card-elevated` CSS 类（如 AnimatedStat、FAQAccordion）。

### Card Rules — IMPORTANT
- **图纸不是玻璃**：禁止 `backdrop-filter` / blur 玻璃拟态
- Card corner radius is always **8px**（制图方正感；按钮同 8px，全站圆角只有 8px 和 rounded-full 两种）
- Hover: `translateY(-2px)` + `box-shadow: 0 4px 16px rgba(74, 159, 229, 0.08)` + `border-color` change（**保持 2D** — 3D 预算全花在滚动入场）
- **NO** `mouseGlow` or mouse-tracking effects
- 关键卡片可加 `<CropMarks />` 四角裁切标记（需 `relative` 父容器；克制使用）
- 产品卡带图纸编号 annotation（`S.01`…），编号即图纸集页码

### Underlying CSS Classes (in globals.css)
- `.card-surface` — semi-transparent solid bg + border-subtle（无 blur）
- `.card-elevated` — bg-elevated + border-default + hover translateY + blue glow
- `.card-spotlight` — bg-elevated + border-default + left blue gradient line (::before)

---

## 6. Animation Rules — 滚动 3D（零依赖 CSS）

技术基座：`animation-timeline: view()/scroll()`（scrub 式滚动联动）+ CSS 3D transform；不支持的浏览器由 `AnimateOnScroll` 的 IntersectionObserver 内联样式路径接管（CSS 动画级联高于内联样式，双路径共存）。

### 三条踩过坑的硬规则 — IMPORTANT
1. **禁止 `overflow-hidden` 包住任何含 `.sheet-reveal` / `.depth-drift-back` 的子树**：hidden 会创建 scroll container，劫持 `view()` 时间轴的滚动器查找，整个子树的滚动动画**静默失效**（不报错、不掉 lint）。需要裁切时一律用 globals.css 的 `.overflow-clip-safe`（clip 不建 scroll container；老内核回落 hidden）。
2. **`.bp-draw` 只能用在 `<path>` 上**：`pathLength` 在 `<rect>`/`<circle>` 上 WebKit 不支持，dasharray 归一化会碎成 1px 点线。矩形/圆都用等价 path 命令改写（见 BlueprintObject）。
3. **`prefers-reduced-motion` 三件套**：scroll-driven 动画必须显式 `animation: none`（时长重置对其无效）；`animation-delay`/`transition-delay` 必须通配归零（否则分段 delay 变成逐个"闪现"）；infinite 动画（marquee / scroll-pulse 类）必须显式关闭（0.01ms 周期 = 每帧乱跳）。三者都已在 globals.css 的 reduced-motion 块落实，新增动画时对号入座。

### The ONE Scroll Entrance
所有滚动入场动画用 `<AnimateOnScroll>`（内部 = `.sheet-reveal` 图纸沉降：rotateX 5° + translateY + blur 随滚动沉降平整）。

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

可见性触发逻辑统一走 `useIntersectionVisible` hook（`src/hooks/`）— 不要在组件里手写 IntersectionObserver。

### ALLOWED Animations（白名单，全站只允许这些）
- ✅ `sheet-settle` — 图纸沉降入场（AnimateOnScroll；rotateX ≤5°）
- ✅ `depth-drift` — 背景装饰层异速位移（`.depth-drift-back`；幅度 ≤ ±16px，仅背景层）
- ✅ `bp-draw` / `bp-fade` — SVG 逐笔绘制 + 标注淡入（Hero 物件、hairline 图标）
- ✅ `hero-tilt` — Hero 物件滚动倾斜（scroll(root) scrub，前 600px；≥lg 专属——<lg 物件缩放静态显示不倾斜）
- ✅ `bpSolidify` — Hero 物件面板实体化淡入（挂载于 `.bp-face-fill` / backglow，入场叙事 Build 阶段）
- ✅ `objFloat` / `objSway` / `objShadow` — Hero 物件常态呼吸/摇曳/投影（`.obj-float` ≤±6px、`.obj-sway` ≤±3°、`.bp-object-shadow`；周期 ≥7s，仅 Hero 物件 BlueprintObject / HeroObjectPhysics）
- ✅ Hero 物件弹簧物理 — HeroObjectPhysics 的 rAF 欠阻尼弹簧（指针阻尼跟随 + 回摆 + hover scale ≈1.03；只写 transform / opacity / CSS 变量；全站唯一 mouse-tracking 豁免）
- ✅ `modAssemble` / `modDrift` — Hero 物件模块装配入场 + 错位-停驻-归位无限循环（幅度 ≤14px，周期 ≥10s 错峰；仅 BlueprintObject 模块层）
- ✅ `seamIn` / `seamPulse` / `coreIn` / `corePulse` — Hero 物件缝隙发光条与核心环微光呼吸（opacity only，低 alpha 禁强 bloom）
- ✅ Hero 物件单模块 `:hover` 偏移 — transition ≤10px 沿签名轴 + 描边增亮（`@media (hover: hover)` 限定防触屏粘滞；仅 `.bp-module`，卡片一律不做）
- ✅ `reveal` — 页面加载入场（`animate-reveal` utility，仅 Hero 非 LCP 元素）
- ✅ `marquee` — infinite horizontal scroll (SocialProofBar)
- ✅ `scaleIn` — 表单成功态缩放弹入
- ✅ `scroll-pulse` / `scale-in-dot` — 滚动指示器
- ✅ `translateY(-2px)` on card hover / `box-shadow` blue glow / `border-color` transitions
- ✅ `transform: scale(0.98)` on button `:active`
- ✅ count-up 数字滚动（useCountUp）

### FORBIDDEN Animations
- ❌ `shimmer` / shimmer gradients
- ❌ `float` / floating animations（唯一豁免：Hero 物件的 `objFloat`，见白名单）
- ❌ `gradient-shift` / `gradientShift`
- ❌ `noise` texture overlays
- ❌ 满屏 parallax（深度暗示只允许白名单里 ≤ ±16px 的 depth-drift）
- ❌ `particle` effects
- ❌ mouse-tracking tilt / mouseGlow（唯一豁免：Hero 物件的 HeroObjectPhysics 阻尼弹簧跟随——rAF lerp 有惯性，非 1:1 硬跟；卡片一律不做）
- ❌ 动画属性超出 transform / opacity / filter / stroke-dashoffset

### 性能纪律
- LCP 元素（各页 h1）**不加入场动画**
- 不引入动效 JS 库（Motion/Lenis/three.js 均被否决过——用户已选零依赖路线）

---

## 7. Button System

Two button styles defined in `globals.css`. Use CSS classes directly:

```jsx
<button className="btn-primary">Get Started</button>
<button className="btn-secondary">Learn More</button>
```

### Button Rules — IMPORTANT
- Primary: `linear-gradient(135deg, #4A9FE5, #3488CC)` background
- Primary hover: `box-shadow: 0 4px 12px rgba(74, 159, 229, 0.25)`
- Secondary hover: `background: rgba(74, 159, 229, 0.08)` + border highlights
- Active: `transform: scale(0.98)` only
- Border radius: **8px**（与卡片统一）
- Font: `text-sm font-semibold` (primary) / `text-sm font-medium` (secondary)
- 按钮内右箭头用 `<ArrowRightIcon />` 共享组件，不要内联 SVG

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
