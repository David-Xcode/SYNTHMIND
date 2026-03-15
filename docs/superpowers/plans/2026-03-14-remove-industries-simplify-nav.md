# Remove Industries & Rename Case Studies → Products

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Completely remove the "Industries" concept and rename "Case Studies" to "Products", resulting in a flat 3-link navigation: About | Products | Contact.

**Architecture:** This is a deletion-heavy refactoring. We remove industry routes, components, data, and filters. We rename the case-studies route to products and update all internal links. The SiteHeader simplifies from dropdown nav to flat links.

**Tech Stack:** Next.js 14, React 18, TypeScript, Tailwind CSS 3

---

## File Structure

### Files to DELETE
- `src/data/industries.ts`
- `src/components/industry/IndustryHero.tsx`
- `src/components/industry/PainPoints.tsx`
- `src/components/industry/CaseStudyGrid.tsx`
- `src/components/shared/IndustryIcons.tsx`
- `src/components/home/IndustryCards.tsx`
- `src/app/(public)/case-studies/CaseStudyFilter.tsx`
- `src/app/(public)/industries/` (entire directory)

### Files to MODIFY
- `src/data/navigation.ts` — flat nav, rename to Products
- `src/data/case-studies.ts` — remove industry fields & functions
- `src/components/layout/SiteHeader.tsx` — remove dropdown logic
- `src/components/layout/SiteFooter.tsx` — remove Industries column, rename Projects→Products
- `src/components/home/FeaturedCaseStudies.tsx` — update links & remove industry badge
- `src/components/case-study/RelatedCaseStudies.tsx` — remove industryLabel, update links
- `src/app/(public)/page.tsx` — update metadata
- `src/app/(public)/about/page.tsx` — update metadata
- `src/app/sitemap.ts` — remove industry entries, update paths
- `src/lib/chatConstants.ts` — update system prompt
- `tailwind.config.js` — remove industry color tokens

### Files to MOVE (directory rename)
- `src/app/(public)/case-studies/` → `src/app/(public)/products/`
- Update `[slug]/page.tsx` inside: canonical URLs, breadcrumb hrefs, JSON-LD URLs

---

## Chunk 1: Data Layer & Navigation

### Task 1: Clean up case-studies data

**Files:**
- Modify: `src/data/case-studies.ts`

- [ ] **Step 1: Remove industry type, fields, and filter function**

Remove `IndustrySlug` type (lines 4-8), remove `industry` and `industryLabel` from `CaseStudy` interface (lines 14-15), remove those fields from all 6 entries, remove `getCaseStudiesByIndustry` function (lines 243-244). Update file header comment.

```typescript
// ─── 产品数据层 ───
// 6 个真实客户项目，供模板页使用

export interface CaseStudy {
  slug: string;
  title: string;
  tagline: string;
  url: string;
  logo: string;
  challenge: string[];
  solution: string[];
  results: string[];
  techStack: string[];
  featured: boolean;
}
```

Remove from each entry: `industry: '...'` and `industryLabel: '...'` lines.
Remove the comment on easy-sign about "跨行业产品".
Remove `getCaseStudiesByIndustry` function entirely.
Rename `getCaseStudyBySlug` → keep as is (still needed).

- [ ] **Step 2: Verify no compile errors**

Run: `npx tsc --noEmit 2>&1 | head -30`
Expected: Errors in files that still import removed types (will fix in later tasks)

- [ ] **Step 3: Commit**

```bash
git add src/data/case-studies.ts
git commit -m "refactor: remove industry fields from case studies data"
```

### Task 2: Delete industries data file

**Files:**
- Delete: `src/data/industries.ts`

- [ ] **Step 1: Delete file**

```bash
rm src/data/industries.ts
```

- [ ] **Step 2: Commit**

```bash
git add src/data/industries.ts
git commit -m "refactor: delete industries data file"
```

### Task 3: Simplify navigation data

**Files:**
- Modify: `src/data/navigation.ts`

- [ ] **Step 1: Rewrite to flat nav + rename Products**

```typescript
// ─── 导航结构常量 ───
// SiteHeader 和 SiteFooter 共用，单一来源

export interface NavItem {
  label: string;
  href: string;
}

export const mainNav: NavItem[] = [
  { label: 'About', href: '/about' },
  { label: 'Products', href: '/products' },
  { label: 'Contact', href: '/contact' },
];

export const footerNav = {
  company: [
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Products', href: '/products' },
  ],
  products: [
    { label: 'Easy-Sign', href: '/products/easy-sign' },
    { label: 'T-ONE Submit', href: '/products/t-one-submit' },
    { label: 'Onest Insurance', href: '/products/onest-insurance' },
    { label: 'BrokerTool.ai', href: '/products/brokertool-ai' },
    { label: 'UnionGlens', href: '/products/unionglens' },
    { label: 'GetAX', href: '/products/getax' },
  ],
};
```

- [ ] **Step 2: Commit**

```bash
git add src/data/navigation.ts
git commit -m "refactor: simplify navigation to flat structure, rename to Products"
```

---

## Chunk 2: Component Updates

### Task 4: Simplify SiteHeader — remove dropdown

**Files:**
- Modify: `src/components/layout/SiteHeader.tsx`

- [ ] **Step 1: Remove all dropdown/accordion logic**

Remove:
- `ChevronIcon` component (lines 14-31)
- `dropdownOpen` state (line 37)
- `mobileAccordion` state (line 38)
- `dropdownRef` (line 40)
- Click-outside effect (lines 57-69)
- Escape key effect (lines 73-79)
- `children` check in `isActive` (lines 86-88)
- Entire dropdown branch in desktop nav (lines 117-161) — replace with same Link pattern as simple items
- Entire accordion branch in mobile nav (lines 229-267) — replace with same Link pattern

The `NavItem` interface no longer has `children`, so no conditional rendering needed. All items render as plain `<Link>`.

- [ ] **Step 2: Verify header renders correctly**

Run: `npx tsc --noEmit 2>&1 | grep -i header`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/SiteHeader.tsx
git commit -m "refactor: simplify SiteHeader to flat navigation without dropdowns"
```

### Task 5: Update SiteFooter — remove Industries column

**Files:**
- Modify: `src/components/layout/SiteFooter.tsx`

- [ ] **Step 1: Remove Industries column, rename Projects → Products**

Remove the entire Industries `<div>` block (lines 57-75).
Change grid from `md:grid-cols-4` to `md:grid-cols-3`.
Rename "Projects" heading to "Products" (line 80).
Change `footerNav.projects` to `footerNav.products` (line 83).

- [ ] **Step 2: Commit**

```bash
git add src/components/layout/SiteFooter.tsx
git commit -m "refactor: remove Industries column from footer, rename to Products"
```

### Task 6: Update FeaturedCaseStudies — remove industry badge, update links

**Files:**
- Modify: `src/components/home/FeaturedCaseStudies.tsx`

- [ ] **Step 1: Update links and remove industry badge**

- Change eyebrow from "Case Studies" to "Products" (line 24)
- Change SectionTitle bold from "Projects" to "Products" (line 26)
- Change all `href={/case-studies/${cs.slug}}` to `href={/products/${cs.slug}}` (line 35)
- Remove the industry badge span (lines 60-63): `<span className="inline-block...">...</span>`
- Change "View case study" to "View product" (line 68)
- Change "View All Projects" link href from `/case-studies` to `/products` (line 94)

- [ ] **Step 2: Commit**

```bash
git add src/components/home/FeaturedCaseStudies.tsx
git commit -m "refactor: update FeaturedCaseStudies links to /products, remove industry badge"
```

### Task 7: Update RelatedCaseStudies — remove industryLabel, update links

**Files:**
- Modify: `src/components/case-study/RelatedCaseStudies.tsx`

- [ ] **Step 1: Update link and remove industryLabel**

- Change `href={/case-studies/${cs.slug}}` to `href={/products/${cs.slug}}` (line 35)
- Remove the industryLabel paragraph (lines 53-55): `<p className="text-txt-quaternary text-xs mb-2">{cs.industryLabel || 'Small Business'}</p>`

- [ ] **Step 2: Commit**

```bash
git add src/components/case-study/RelatedCaseStudies.tsx
git commit -m "refactor: update RelatedCaseStudies links, remove industry label"
```

---

## Chunk 3: Route Changes & Deletions

### Task 8: Delete industry routes and components

**Files:**
- Delete: `src/app/(public)/industries/` (entire directory)
- Delete: `src/components/industry/IndustryHero.tsx`
- Delete: `src/components/industry/PainPoints.tsx`
- Delete: `src/components/industry/CaseStudyGrid.tsx`
- Delete: `src/components/shared/IndustryIcons.tsx`
- Delete: `src/components/home/IndustryCards.tsx`
- Delete: `src/app/(public)/case-studies/CaseStudyFilter.tsx`

- [ ] **Step 1: Delete all files**

```bash
rm -rf src/app/\(public\)/industries/
rm src/components/industry/IndustryHero.tsx
rm src/components/industry/PainPoints.tsx
rm src/components/industry/CaseStudyGrid.tsx
rm src/components/shared/IndustryIcons.tsx
rm src/components/home/IndustryCards.tsx
rm src/app/\(public\)/case-studies/CaseStudyFilter.tsx
```

- [ ] **Step 2: Remove empty directories if any**

```bash
rmdir src/components/industry/ 2>/dev/null || true
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "refactor: delete industry routes, components, and filter"
```

### Task 9: Rename case-studies route to products

**Files:**
- Move: `src/app/(public)/case-studies/` → `src/app/(public)/products/`
- Modify: `src/app/(public)/products/page.tsx` (the overview page)
- Modify: `src/app/(public)/products/[slug]/page.tsx` (the detail page)

- [ ] **Step 1: Rename directory**

```bash
mv src/app/\(public\)/case-studies/ src/app/\(public\)/products/
```

- [ ] **Step 2: Update overview page**

In `src/app/(public)/products/page.tsx`:
- Remove CaseStudyFilter import and usage
- Update metadata: title to "Products | Synthmind", canonical to `/products`
- Update description to remove industry references
- Replace filter section with simple product grid (inline, no separate filter component)
- Render all products directly in a grid using GlassCard, linking to `/products/[slug]`
- Remove industry badge (`industryLabel || 'Small Business'`) from cards

- [ ] **Step 3: Update detail page**

In `src/app/(public)/products/[slug]/page.tsx`:
- Update canonical URL from `/case-studies/${slug}` to `/products/${slug}`
- Update breadcrumb: `{ label: 'Products', href: '/products' }`
- Update JSON-LD URL to `/products/${slug}`

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "refactor: rename case-studies route to products, remove industry filter"
```

---

## Chunk 4: Metadata, Sitemap & Config Cleanup

### Task 10: Update sitemap

**Files:**
- Modify: `src/app/sitemap.ts`

- [ ] **Step 1: Remove industry pages, update case-study paths**

Remove `import { getAllIndustrySlugs } from '@/data/industries'` (line 6).
Remove entire `industryPages` block (lines 42-49).
Change static page URL from `/case-studies` to `/products` (line 34).
Change case study URLs from `/case-studies/${slug}` to `/products/${slug}` (line 53).
Remove `...industryPages` from return (line 59).

- [ ] **Step 2: Commit**

```bash
git add src/app/sitemap.ts
git commit -m "refactor: remove industry pages from sitemap, update to /products paths"
```

### Task 11: Update homepage and about page metadata

**Files:**
- Modify: `src/app/(public)/page.tsx`
- Modify: `src/app/(public)/about/page.tsx`

- [ ] **Step 1: Update homepage metadata**

Change title to: `'Synthmind | AI-Powered Software Studio'`
Change description to remove "insurance, real estate, accounting, and construction":
`'Toronto-based AI startup building tools that actually work. Workflow automation, legacy modernization, and custom AI solutions.'`

- [ ] **Step 2: Update about page metadata**

Change title to: `'About Synthmind | AI Software Studio'`
Change description to remove specific industry mentions:
`'Synthmind is a Toronto-based AI startup building software that modernizes traditional businesses. We deliver workflow automation, legacy modernization, and custom AI solutions.'`

- [ ] **Step 3: Commit**

```bash
git add src/app/\(public\)/page.tsx src/app/\(public\)/about/page.tsx
git commit -m "refactor: update metadata to remove industry references"
```

### Task 12: Update chat system prompt

**Files:**
- Modify: `src/lib/chatConstants.ts`

- [ ] **Step 1: Remove industry section and update routes**

In `SYSTEM_PROMPT`:
- Remove entire "### Industries We Serve" section (lines 53-57)
- Update "### Products / Past Projects" URLs from `/case-studies/` to `/products/`
- Update "### Website Pages" section: remove industry routes, change `/case-studies` to `/products`

- [ ] **Step 2: Commit**

```bash
git add src/lib/chatConstants.ts
git commit -m "refactor: update chat system prompt to remove industries"
```

### Task 13: Clean up Tailwind config

**Files:**
- Modify: `tailwind.config.js`

- [ ] **Step 1: Remove industry color tokens**

Remove the `industry` color group from `theme.extend.colors`:
```
industry: {
  insurance: '#7B8EC4',
  realestate: '#5DAE8B',
  accounting: '#E0A85C',
  construction: '#C47A5A',
}
```

- [ ] **Step 2: Commit**

```bash
git add tailwind.config.js
git commit -m "refactor: remove industry color tokens from Tailwind config"
```

### Task 14: Final verification

- [ ] **Step 1: Type check**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 2: Build check**

Run: `npm run build`
Expected: Successful build with no errors

- [ ] **Step 3: Dev server smoke test**

Run: `lsof -ti :3000 | xargs kill -9 2>/dev/null; npm run dev`
Visit: `/`, `/about`, `/products`, `/products/easy-sign`, `/contact`
Verify: No broken links, no industry references in UI

- [ ] **Step 4: Final commit if any fixes needed**
