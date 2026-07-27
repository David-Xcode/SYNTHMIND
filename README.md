# Synthmind

Marketing site for Synthmind — a Toronto-based studio building AI-powered software
for insurance, real estate, accounting, and construction businesses.
Production: **https://www.synthmind.ca** (apex `synthmind.ca` 308-redirects to `www`).

Static marketing site: 7 page templates, no database, no CMS, no auth. The only
server-side code is one contact-form API route.

## Tech stack

| | |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) · React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3.4 + `src/app/globals.css` (design-system engines) |
| Lint / format | Biome 2.4 (**not** ESLint / Prettier) |
| Email | Resend (contact form only) |
| Hosting | Vercel |

Zero animation/3D dependencies by design — everything is CSS + a small amount of
hand-written rAF. Do not add Motion / Lenis / three.js.

## Getting started

```bash
npm install
cp .env.example .env     # then fill in RESEND_API_KEY
npm run dev              # http://localhost:3000
```

`RESEND_API_KEY` is the only environment variable. Without it, every page still
renders; only the contact form returns a 503.

⚠️ Port 3000 is often occupied by another local project. Check before starting:

```bash
lsof -nP -iTCP:3000 -sTCP:LISTEN     # empty → safe to run npm run dev
npm run dev -- -p 3001               # otherwise pick another port
```

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build (must pass before any deploy) |
| `npm start` | Serve the production build locally |
| `npm run lint` | `biome check ./src` |
| `npm run lint:fix` | Biome check + autofix |
| `npm run format` | Biome format |
| `npx tsc --noEmit` | Type check |

There is no test suite. `npm run lint` + `npx tsc --noEmit` + `npm run build` are
the gates.

## Routes

```
/                              Home
/about
/contact
/products                      "Our Work" (nav label; route stays /products)
/products/[slug]               Case-study detail pages (generated from data layer)
/products/brokerage-platform   AI-native BMS platform page
/products/real-estate          Real-estate launch sites (aggregate page)
```

## Editing content

Content lives in TypeScript constants, not a CMS:

| File | Contents |
|---|---|
| `src/data/case-studies.ts` | Software products — **add an entry and the detail page generates itself** |
| `src/data/real-estate.ts` | Real-estate launch sites (only sites already live) |
| `src/data/process.ts` | Delivery process — consumed by both `/about` and the home page |
| `src/data/navigation.ts` | Header + footer navigation |
| `src/lib/constants.ts` | Site URL, contact email, brand hex for emails, external links |

Never hardcode the site URL or contact email — import them from
`src/lib/constants.ts`.

## Before you touch the UI

🚨 **Read [`CLAUDE.md`](./CLAUDE.md) first.** It is the single source of truth for
this repo: the Blueprint design system (typography, color tokens, card system,
button system, the animation whitelist), the component-reuse rules, and the
public-copy fact boundaries. There is no second canon — `AGENTS.md` is just a
pointer to it.

Design decision history lives in `docs/superpowers/specs/` (and task orders in
`docs/superpowers/briefs/`). **Superseded documents carry a 🛑 / 📕 banner at the
top of the file — the banner wins over the body text.** Do not implement from a
document with a retirement banner.

## Copy rules (non-negotiable)

The site describes real client work and an in-progress industry certification.
Before editing any customer-facing copy, read the fact boundaries in `CLAUDE.md`
§1 — clients are never named, the CSIO certification is described as *in
progress* (never "certified"), and signed partners are brokerages, not carriers.

## Deploy

Vercel, on push to `main`. Build config in `vercel.json`; redirects and security
response headers (CSP, HSTS, `nosniff`, `Permissions-Policy`, …) both live in
`next.config.js` — the site is fully static, so headers are attached at the edge
rather than by middleware.
