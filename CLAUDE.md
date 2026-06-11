# Synthmind — Neural Design System Rules

> These rules encode the "Neural" design system. All AI agents MUST follow them when implementing UI components, translating Figma designs, or modifying frontend code.

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
│   │                      #   ContactForm, PageHero, Eyebrow, ArrowRightIcon, AnimatedStat,
│   │                      #   TextReveal, LineDrawDivider, ErrorBoundary, JsonLd
│   ├── layout/            # 布局: SiteHeader, SiteFooter, Breadcrumb
│   ├── home/              # 首页: HomeHero, HomeHeroVideo, SocialProofBar
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

## 2. Typography — Sora + Manrope + JetBrains Mono

Three fonts loaded via `next/font/google` in root layout. Tailwind classes:

| Font | Class | Usage | RESTRICTION |
|------|-------|-------|-------------|
| Sora | `font-display` | Page titles, hero headlines, bold words in SectionTitle | **NEVER for body text** |
| Manrope | `font-sans` | Everything else (default body font) | Default — no class needed on body |
| JetBrains Mono | `font-mono` | Eyebrow labels, stat numbers, process step numbers | **NEVER for paragraphs or headings** |

### Typography Patterns

**Eyebrow labels** — ALWAYS use the shared component (never inline the class string):
```jsx
import Eyebrow from '@/components/shared/Eyebrow';
<Eyebrow>LABEL TEXT</Eyebrow>
```

**Section headings (via SectionTitle):**
```jsx
// Light word = font-sans font-light | Bold word = font-display font-semibold
<span className="font-sans font-light">Our</span>{' '}
<span className="font-display font-semibold">Approach</span>
```

**Page heroes** — about/products 风格的页头统一用 `<PageHero eyebrow light bold subtitle />`。

**Responsive font sizes** (use Tailwind tokens, NOT arbitrary values):
- `text-display` — hero titles (clamp 2.5rem → 4.5rem)
- `text-headline` — section titles (clamp 2rem → 3.5rem)
- `text-title` — subsection titles (clamp 1.5rem → 2.25rem)
- `text-subtitle` — large body text (clamp 1.125rem → 1.5rem)

---

## 3. Color System — NEVER Hardcode Hex

**CRITICAL:** Always use Tailwind tokens from `tailwind.config.js`. Never write raw hex values.

**唯一豁免：** 第三方技术品牌色（React 蓝、AWS 橙等）集中在 `src/lib/tech-brand-colors.ts`，组件不得内联 hex。

### Accent Scale (Synth Blue)
| Token | Hex | Usage |
|-------|-----|-------|
| `accent` | #4A9FE5 | Primary accent, buttons, links |
| `accent-400` | #5DAAE9 | Hover states |
| `accent-700` | #2870AB | Dark accent |

> 色阶只保留这三档。需要透明度用 opacity modifier：`bg-accent/10`、`border-accent/30`、`text-accent/50`。

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

### Border CSS Variables (use in inline styles or globals.css)
```css
--border-subtle:  rgba(74, 159, 229, 0.06)   /* 最轻 */
--border-default: rgba(74, 159, 229, 0.10)   /* 默认 */
--border-strong:  rgba(74, 159, 229, 0.18)   /* hover */
--border-heavy:   rgba(74, 159, 229, 0.25)   /* 强调 */
```

### Radial Glow
页头/CTA 的径向光晕用 globals.css 的 `.hero-glow` class（`--glow-y` 控制垂直位置），不要内联 radial-gradient。

---

## 4. Card System — GlassCard Component

**ALWAYS** use `<GlassCard>` from `src/components/shared/GlassCard.tsx`.

```tsx
import GlassCard from '@/components/shared/GlassCard';

<GlassCard variant="surface">...</GlassCard>   // 最轻量 — 半透明 + 微妙模糊
<GlassCard variant="elevated">...</GlassCard>  // 默认 — 实色背景 + hover 上浮 + 蓝色光晕
<GlassCard variant="spotlight">...</GlassCard>  // 特色 — 左侧蓝色渐变竖线
```

Props: `variant`, `className`。内边距固定 `p-6` — 需要自定义 padding 时直接用 `.card-surface` / `.card-elevated` CSS 类（如 AnimatedStat、FAQAccordion）。

### Card Rules — IMPORTANT
- **Surface** cards use `backdrop-filter: blur(8px)` with semi-transparent background
- **Elevated** cards use solid `bg-bg-elevated` background
- Hover: `translateY(-2px)` + `box-shadow: 0 4px 16px rgba(74, 159, 229, 0.08)` + `border-color` change
- **NO** `mouseGlow` or mouse-tracking effects
- Card corner radius is always `12px` (`rounded-xl` equivalent)

### Underlying CSS Classes (in globals.css)
- `.card-surface` — semi-transparent bg + blur(8px) + border-subtle
- `.card-elevated` — bg-elevated + border-default + hover translateY + blue glow
- `.card-spotlight` — bg-elevated + border-default + left blue gradient line (::before)

---

## 5. Animation Rules

### The ONE Scroll Animation
All scroll-triggered animations use `<AnimateOnScroll>` from `src/components/shared/AnimateOnScroll.tsx`.
It applies `opacity + translateY(12px) + blur(4px)` reveal effect ("digital emergence").

```tsx
import AnimateOnScroll from '@/components/shared/AnimateOnScroll';

// 基本用法
<AnimateOnScroll>
  <div>Content revealed on scroll</div>
</AnimateOnScroll>

// 交错入场 (卡片列表)
{items.map((item, index) => (
  <AnimateOnScroll key={item.id} delay={index * 80 + 100}>
    <GlassCard>...</GlassCard>
  </AnimateOnScroll>
))}
```

Props: `delay` (ms), `className`。触发阈值与时长为固定值（threshold 0.1 / 700ms）。

可见性触发逻辑统一走 `useIntersectionVisible` hook（`src/hooks/`）— 不要在组件里手写 IntersectionObserver。

### FORBIDDEN Animations
These have been explicitly removed from the design system. **DO NOT** add them back:
- ❌ `shimmer` / shimmer gradients
- ❌ `float` / floating animations
- ❌ `gradient-shift` / `gradientShift`
- ❌ `noise` texture overlays
- ❌ `parallax` scroll effects
- ❌ `particle` effects

### ALLOWED Animations
- ✅ `reveal` — opacity + translateY + blur scroll entrance (via AnimateOnScroll / `animate-reveal` utility)
- ✅ `marquee` — infinite horizontal scroll (SocialProofBar)
- ✅ `scaleIn` — 表单成功态缩放弹入
- ✅ `scroll-pulse` / `scale-in-dot` — 滚动指示器
- ✅ `translateY(-2px)` on card hover
- ✅ `box-shadow` subtle blue glow on card/button hover
- ✅ `border-color` transitions on card/button hover
- ✅ `transform: scale(0.98)` on button `:active`

---

## 6. Button System

Two button styles defined in `globals.css`. Use CSS classes directly:

```jsx
// 主要按钮: 蓝色渐变背景 + 白色文字 + hover 蓝色光晕
<button className="btn-primary">Get Started</button>

// 次要按钮: 透明 + 蓝色边框 + hover 微填充
<button className="btn-secondary">Learn More</button>
```

### Button Rules — IMPORTANT
- Primary: `linear-gradient(135deg, #4A9FE5, #3488CC)` background
- Primary hover: `box-shadow: 0 4px 12px rgba(74, 159, 229, 0.25)`
- Secondary hover: `background: rgba(74, 159, 229, 0.08)` + border highlights
- Active: `transform: scale(0.98)` only
- Border radius: `10px` (`rounded-[10px]` equivalent)
- Font: `text-sm font-semibold` (primary) / `text-sm font-medium` (secondary)
- 按钮内右箭头用 `<ArrowRightIcon />` 共享组件，不要内联 SVG

---

## 7. Section Dividers

Use `.ruled-line` class for horizontal gradient dividers between page sections:

```jsx
<hr className="ruled-line" />
```

The line fades from transparent at edges to `--border-strong` in the center, creating a subtle blue gradient effect.

---

## 8. SectionTitle Component

**ALWAYS** use `<SectionTitle>` from `src/components/shared/SectionTitle.tsx` for section headers.

```tsx
import SectionTitle from '@/components/shared/SectionTitle';

<SectionTitle
  eyebrow="OUR PROCESS"           // JetBrains Mono 小标签 (可选)
  light="How We"                   // Manrope font-light
  bold="Deliver"                   // Sora font-semibold
  subtitle="Description text..."   // 副标题 (可选)
  size="lg"                        // lg | md | sm
  align="left"                     // center | left
/>
```
