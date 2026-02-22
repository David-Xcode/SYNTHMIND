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
│   ├── (public)/          # 所有公共页面 (layout: SiteHeader + SiteFooter + ChatButton)
│   │   ├── about/
│   │   ├── contact/
│   │   ├── case-studies/
│   │   │   └── [slug]/
│   │   └── industries/
│   │       └── [slug]/
│   ├── admin/             # 管理后台 (独立 layout)
│   ├── api/               # API routes (contact, chat)
│   └── layout.tsx         # 根 layout: html/body/globals.css/metadata ONLY
├── components/
│   ├── shared/            # 可复用 UI: SectionTitle, GlassCard, AnimateOnScroll, CTABanner, ContactForm
│   ├── layout/            # 布局: SiteHeader, SiteFooter, Breadcrumb
│   ├── home/              # 首页: HomeHero, IndustryCards, FeaturedCaseStudies, SocialProofBar
│   ├── industry/          # 行业页: IndustryHero, PainPoints, CaseStudyGrid
│   ├── case-study/        # 案例页: CaseStudyHero, ChallengeSection, SolutionSection, TechStackBadges, ResultsSection, RelatedCaseStudies
│   └── chat/              # 聊天模块: ChatButton, ChatPanel, ChatMessage, QuickReplies
├── data/                  # TS 常量 (非 CMS): case-studies.ts, industries.ts, navigation.ts
├── hooks/                 # 自定义 hooks
└── lib/                   # 工具函数 & 常量
```

### Component Reuse Rules
- **ALWAYS** check `src/components/shared/` before creating new UI components
- **ALWAYS** check `src/data/` for existing data constants before hardcoding
- Page-specific components go in their domain folder (`home/`, `industry/`, `case-study/`)
- Generic reusable components go in `shared/`

---

## 2. Typography — Sora + Manrope + JetBrains Mono

Three fonts loaded via `next/font/google` in root layout. Tailwind classes:

| Font | Class | Usage | RESTRICTION |
|------|-------|-------|-------------|
| Sora | `font-display` | Page titles, hero headlines, bold words in SectionTitle | **NEVER for body text** |
| Manrope | `font-sans` | Everything else (default body font) | Default — no class needed on body |
| JetBrains Mono | `font-mono` | Eyebrow labels, stat numbers, process step numbers | **NEVER for paragraphs or headings** |

> **Note:** `font-serif` is aliased to `font-display` in tailwind.config.js for backward compatibility, but prefer `font-display` in new code.

### Typography Patterns

**Eyebrow labels:**
```jsx
<span className="font-mono text-xs font-medium uppercase tracking-eyebrow text-accent">
  LABEL TEXT
</span>
```

**Section headings (via SectionTitle):**
```jsx
// Light word = font-sans font-light | Bold word = font-display font-semibold
<span className="font-sans font-light">Our</span>{' '}
<span className="font-display font-semibold">Approach</span>
```

**Responsive font sizes** (use Tailwind tokens, NOT arbitrary values):
- `text-display` — hero titles (clamp 2.5rem → 4.5rem)
- `text-headline` — section titles (clamp 2rem → 3.5rem)
- `text-title` — subsection titles (clamp 1.5rem → 2.25rem)
- `text-subtitle` — large body text (clamp 1.125rem → 1.5rem)

---

## 3. Color System — NEVER Hardcode Hex

**CRITICAL:** Always use Tailwind tokens from `tailwind.config.js`. Never write raw hex values.

### Accent Scale (Synth Blue)
| Token | Hex | Usage |
|-------|-----|-------|
| `accent` / `accent-500` | #4A9FE5 | Primary accent, buttons, links |
| `accent-400` | #5DAAE9 | Hover states |
| `accent-700` | #2870AB | Dark accent |
| `accent-50` → `accent-900` | Full scale | Available but rarely needed |

### Background Layers (冷色海军黑)
| Token | Hex | Usage |
|-------|-----|-------|
| `bg-bg-base` | #080B10 | Page background |
| `bg-bg-surface` | #0C1017 | Card surface (lightest card) |
| `bg-bg-elevated` | #111620 | Standard card background |
| `bg-bg-muted` | #181E2A | Hover states, subtle fills |

### Text Layers (冷白色调)
| Token | Usage |
|-------|-------|
| `text-txt-primary` | Headings, primary body text (#E8ECF0) |
| `text-txt-secondary` | Subtitles, descriptions (#8E95A0) |
| `text-txt-tertiary` | Captions, metadata (#5C6370) |
| `text-txt-quaternary` | Disabled text, decorative (#3A404D) |

### Industry Colors
| Token | Color |
|-------|-------|
| `industry-insurance` | #7B8EC4 (desaturated lavender-blue) |
| `industry-realestate` | #5DAE8B (desaturated teal-green) |
| `industry-accounting` | #E0A85C (warm amber, unique contrast) |
| `industry-construction` | #C47A5A (terracotta) |

### Border CSS Variables (use in inline styles or globals.css)
```css
--border-subtle:  rgba(74, 159, 229, 0.06)   /* 最轻 */
--border-default: rgba(74, 159, 229, 0.10)   /* 默认 */
--border-strong:  rgba(74, 159, 229, 0.18)   /* hover */
--border-heavy:   rgba(74, 159, 229, 0.25)   /* 强调 */
--border-accent:  rgba(74, 159, 229, 0.40)   /* 高亮 */
```

### Accent Opacity Helpers
For Tailwind opacity modifiers on accent: `bg-accent/10`, `border-accent/30`, `text-accent/50`

---

## 4. Card System — GlassCard Component

**ALWAYS** use `<GlassCard>` from `src/components/shared/GlassCard.tsx`.

```tsx
import GlassCard from '@/components/shared/GlassCard';

<GlassCard variant="surface">...</GlassCard>   // 最轻量 — 半透明 + 微妙模糊
<GlassCard variant="elevated">...</GlassCard>  // 默认 — 实色背景 + hover 上浮 + 蓝色光晕
<GlassCard variant="spotlight">...</GlassCard>  // 特色 — 左侧蓝色渐变竖线
```

Props: `variant`, `className`, `as` ('div' | 'article' | 'section')

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

Props: `delay` (ms), `threshold` (0-1), `duration` (ms, default 700)

### FORBIDDEN Animations
These have been explicitly removed from the design system. **DO NOT** add them back:
- ❌ `shimmer` / shimmer gradients
- ❌ `float` / floating animations
- ❌ `gradient-shift` / `gradientShift`
- ❌ `noise` texture overlays
- ❌ `parallax` scroll effects
- ❌ `particle` effects

### ALLOWED Animations
- ✅ `reveal` — opacity + translateY + blur scroll entrance (via AnimateOnScroll)
- ✅ `marquee` — infinite horizontal scroll (SocialProofBar)
- ✅ `chatPanelIn` — chat panel entrance
- ✅ `typingBounce` — chat typing indicator dots
- ✅ `chatPulse` — chat button pulse ring
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
  align="left"                     // center | left | right
  divider                          // 蓝色短线 (可选)
/>
```

