# Remove Industries Concept & Simplify Navigation

**Date:** 2026-03-14
**Status:** Approved

## Summary

Completely remove the "Industries" concept from the Synthmind website. Rename "Case Studies" to "Products". Simplify navigation to 3 flat links + CTA.

## New Navigation Structure

```
[Logo]          About    Products    Contact    [Book a Call]
```

- No dropdowns, no children — flat nav only
- Header: remove dropdown logic (ChevronIcon, dropdownRef, accordion state)
- Footer: remove "Industries" column, rename "Projects" to "Products", update links
- Mobile: remove accordion logic, simple link list

## Route Changes

| Before | After | Action |
|--------|-------|--------|
| `/case-studies` | `/products` | Rename route directory |
| `/case-studies/[slug]` | `/products/[slug]` | Rename route directory |
| `/industries/[slug]` | — | Delete entirely |

## Data Changes

### `src/data/navigation.ts`
- `mainNav`: Remove Industries dropdown, rename "Our Projects" → "Products" with href `/products`
- `footerNav`: Remove `industries` array, rename `projects` key and update hrefs to `/products/[slug]`

### `src/data/case-studies.ts`
- Remove `IndustrySlug` type
- Remove `industry` and `industryLabel` fields from `CaseStudy` interface and all entries
- Remove `getCaseStudiesByIndustry()` function
- Update any slugs/hrefs if needed

### `src/data/industries.ts`
- Delete entire file

## Component Changes

### Delete (unused after removal)
- `src/components/industry/IndustryHero.tsx`
- `src/components/industry/PainPoints.tsx`
- `src/components/industry/CaseStudyGrid.tsx`
- `src/components/shared/IndustryIcons.tsx`
- `src/components/home/IndustryCards.tsx`
- `src/app/(public)/case-studies/CaseStudyFilter.tsx`

### Modify
- `src/components/layout/SiteHeader.tsx` — Remove dropdown/accordion logic, simplify to flat links
- `src/components/layout/SiteFooter.tsx` — Remove Industries column, rename Projects → Products
- `src/components/case-study/RelatedCaseStudies.tsx` — Remove `industryLabel` reference
- `src/components/home/FeaturedCaseStudies.tsx` — Update links from `/case-studies/` to `/products/`
- `src/app/(public)/page.tsx` — Update metadata (remove industry mentions)
- `src/app/sitemap.ts` — Remove industry entries, update case-study paths to /products/
- `src/lib/chatConstants.ts` — Update route descriptions

### Rename (directory move)
- `src/app/(public)/case-studies/` → `src/app/(public)/products/`
- `src/components/case-study/` → Keep component folder name (internal, low impact) OR rename to `product/`

## Homepage

Keep current minimal structure: HomeHero → SocialProofBar → CTABanner. No new sections added.

## Tailwind Config

Industry color tokens (`industry-insurance`, `industry-realestate`, `industry-accounting`, `industry-construction`) can be removed from `tailwind.config.js`.

## Out of Scope

- No new features or pages
- No design changes to existing components beyond removing industry references
- No changes to About page, Contact page, or Chat module
