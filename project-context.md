# GBP AI Optimizer — Project Context

> Last updated: March 15, 2026
> Owner: Dillon Jonker (Paint & Profits)
> Live URL: https://gbp-ai-optimizer-git-main-dillonjonkerrs-projects.vercel.app/
> Repo: https://github.com/dillonjonkerr/gbp-ai-optimizer

---

## 1. Product Overview

A SaaS tool that scans Google Business Profiles and shows local painting contractors (and eventually other home service businesses) exactly where their competitors outperform them in local search. It identifies keyword gaps, review gaps, missing optimizations, and calculates estimated lost revenue — then offers a fix plan.

**Brand:** Paint & Profits — AI-Powered Marketing for Painters
**Primary color:** Sky Blue `#5BC0EB` (HSL 197 79% 63%)
**Target user:** Local painting contractors in the US who rely on Google for leads
**Traffic source:** Cold paid ad traffic (Facebook/Google ads) → mobile-first funnel

---

## 2. Goals of the Software

1. **Acquire leads** by offering a free AI scan that reveals competitive gaps
2. **Convert** those leads into either DIY PDF buyers ($9.99) or AI Optimization users (free during early access)
3. **Retain** connected users with an ongoing dashboard experience (keyword tracking, competitor monitoring, AI writer, optimization tasks)
4. **Demonstrate value** before asking for anything — the free scan IS the product demo

---

## 3. Core Features

### Free Scan (Funnel)
- Google Places autocomplete for business lookup
- Business preview card (photo, rating, reviews, address, phone)
- Full AI-powered market scan (keywords, SERP rankings, competitor detection)
- Visibility score (0-100) with grade label
- Head-to-head competitor comparison (rating, reviews, photos)
- Dollar value of missed revenue calculation
- AI-generated assessment and recommendations
- Keyword gap analysis with traffic opportunity estimates

### Paid / Connected Features
- DIY Fix Plan PDF ($9.99 via Stripe Checkout)
- AI Optimization dashboard (free during early access)
- AI Writer for GBP posts, descriptions, services, Q&A
- Keyword rankings tracking
- Competitor monitoring
- Optimization task list
- Performance reports

---

## 4. Funnel Structure (4 Steps)

The main funnel lives at `/` (also mirrored at `/optimizer`). It's a single-page client-side wizard managed by `src/app/page.tsx`.

### Step 1 — Business Info (`step-business-scan.tsx`)
**What the user sees:**
- Problem-first headline: "Homeowners are searching for painters in your area. They're hiring your competitors instead."
- Agitation badge: "Your competitors are outranking you on Google"
- Sub-copy explaining 50+ leads lost per month
- Rotating carousel of what the scan reveals
- Social proof: "2,847 profiles scanned this month"
- Form: Business Name (with Google Places autocomplete), City, Website (optional)
- CTA: "See Who's Outranking You"
- Trust badges: Takes 60 seconds, No signup, No credit card, Built for painters
- Facebook reviews widget (Elfsight)

**What happens on submit:**
- Passes `{ businessName, city, website }` to Step 2

### Step 2 — AI Market Scan (`step-market-scan.tsx`)
**What the user sees:**
- Pulsing search animation
- "AI investigating your market" headline
- Progress bar (0-100%)
- Progressive discovery feed (7 steps that reveal one by one):
  1. Business profile located (neutral/blue)
  2. Scanning local competitors (neutral/blue)
  3. Rating gap detected (warning/amber)
  4. Keyword opportunities found (danger/red)
  5. Visibility zones mapped (neutral/blue)
  6. Ranking gaps identified (danger/red)
  7. Building your fix plan (neutral/blue)
- Business card showing what's being scanned

**What happens behind the scenes:**
- Calls `POST /api/gbp-audit` with `{ businessName, city, industry: "Painter" }`
- Progress bar runs independently; caps at 90% until API returns
- When API returns, progress completes to 100% and auto-advances

### Step 3 — Opportunity Reveal (`step-results.tsx`)
**What the user sees:**
- "Ranking Gaps Found" badge
- Shock headline: "You're invisible for X of Y keywords homeowners search to find painters"
- Dollar value card: "Estimated monthly revenue you're losing: $X/mo"
- Visibility score gauge (circular SVG, color-coded)
- Head-to-head competitor comparison grid (Rating, Reviews, Photos)
- Top keyword opportunity card
- AI Assessment paragraph
- CTA: "Show Me How to Fix This"
- Urgency line: "Every day you wait, your competitor gets these leads instead"

### Step 4 — Choose Option (`step-choose-option.tsx`)
**What the user sees:**
- "You now know exactly what's wrong. Here's how to fix it." headline
- Value anchor: "Fixing these gaps could recover up to $X/mo in lost painting jobs"
- Option A: DIY Fix Plan ($9.99, crossed out $49, 80% off badge)
  - Full audit report PDF, step-by-step fix guide, keyword gap list, competitor breakdown
- Option B: AI Optimization (Free, crossed out $197/mo, "Recommended" badge)
  - Everything in DIY + AI descriptions, AI posts, keyword tracking, competitor monitoring, optimization tasks, review templates, priority support
  - Trust signals: Secure connection, Cancel anytime, 2-min setup
- Cost of inaction warning: "What happens if you do nothing?"

---

## 5. Dashboard Structure

The dashboard lives at `/dashboard` with a sidebar layout (`src/app/dashboard/layout.tsx`).

| Page | Path | Status |
|------|------|--------|
| Overview | `/dashboard` | Built with mock data |
| AI Writer | `/dashboard/ai-writer` | Built with simulated generation |
| Profiles | `/dashboard/profiles` | Placeholder |
| Competitors | `/dashboard/competitors` | Built with mock data |
| Keywords | `/dashboard/keywords` | Built with mock data |
| Reports | `/dashboard/reports` | Built with mock data |
| Tasks | `/dashboard/tasks` | Built with mock data |
| Insights | `/dashboard/insights` | Placeholder |
| Settings | `/dashboard/settings` | Built (UI only) |
| Posts | `/dashboard/posts` | Placeholder |

**Note:** All dashboard pages currently use mock/hardcoded data. They are not connected to real APIs yet. This is a priority for future development.

---

## 6. API Integrations

### Google Places API
- **Autocomplete:** `GET /api/places-autocomplete?q=...` — proxies Google Places Autocomplete for business name suggestions
- **Text Search:** Used in `/api/gbp-audit` to find the business by name + city
- **Place Details:** Used in `/api/gbp-audit` and `/api/business-preview` to get rating, reviews, photos, address, phone, website, category
- **Key:** `GOOGLE_PLACES_API_KEY`

### OpenAI API (GPT-4o-mini)
- **AI Analysis:** Generates visibility score, competitor score, AI summary, missed opportunities, keyword gaps, recommendations, suggested posts, suggested Q&A
- **Local Keyword Generation:** Generates 20 high-intent local keywords for the market scan
- **Key:** `OPENAI_API_KEY`

### DataForSEO API
- **Search Volume:** `keywords_data/google_ads/search_volume/live` — gets real search volumes for AI-generated keywords. Tries city-level first, falls back to state-level.
- **SERP Rankings:** `serp/google/organic/live/advanced` — checks actual Google rankings for each keyword to find where the business ranks vs competitors
- **Keys:** `DATAFORSEO_LOGIN`, `DATAFORSEO_PASSWORD`

### Stripe
- **Checkout:** `POST /api/create-checkout` — creates a $9.99 checkout session for the DIY PDF
- **Key:** `STRIPE_SECRET_KEY` (not currently in .env.local — needs to be added)

### Elfsight
- **Facebook Reviews Widget:** Embedded via script tag, app ID `0b3b9fe3-d5a0-4940-abf5-357dabaab9e2`
- No API key needed; loads client-side

---

## 7. Architecture & Important Files

### Tech Stack
- **Framework:** Next.js 14.2.18 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v3 + shadcn/ui components + CSS variables (HSL)
- **Icons:** lucide-react
- **Font:** Inter (Google Fonts)
- **Deployment:** Vercel (auto-deploys from `main` branch)
- **Version Control:** Git → GitHub (`dillonjonkerr/gbp-ai-optimizer`)

### Complete File Directory (Every File, What It Does, Where It's Used)

#### App Pages

| File | What it does | Used by |
|------|-------------|---------|
| `src/app/page.tsx` | Main funnel orchestrator. Holds `currentStep`, `businessData`, `auditResult` state. Routes between the 4 funnel steps. Has QA debug toggle. | **Main funnel** |
| `src/app/layout.tsx` | Root HTML layout. Sets Inter font, page metadata, imports `globals.css`. Wraps all pages. | **Everything** |
| `src/app/globals.css` | CSS variables (brand colors, HSL tokens), custom keyframe animations (`pulse-glow`, `fade-in-up`, `scale-in`, `bar-fill`, `urgency`), animation delay utilities, QA debug overlay styles. | **Everything** |
| `src/app/optimizer/page.tsx` | Alternate funnel entry at `/optimizer`. Same 4-step flow as `/` without QA toggle. | **Main funnel** |
| `src/app/audit/page.tsx` | Older 3-step audit flow (Business Info → Gap Analysis → Fix It). Separate from the main funnel. Uses components from `src/components/audit/`. | **Legacy audit flow** |

#### Dashboard Pages

| File | What it does | Used by |
|------|-------------|---------|
| `src/app/dashboard/layout.tsx` | Dashboard shell layout. Renders `SidebarNav` sidebar + main content area. | **Dashboard** |
| `src/app/dashboard/page.tsx` | Overview page. Shows visibility score, keywords ranked, competitor gap, missed traffic, optimization tasks, top keywords, profile completeness. All mock data. | **Dashboard** |
| `src/app/dashboard/ai-writer/page.tsx` | AI content generator. Lets users create GBP posts, descriptions, services, Q&A. Has keyword selection, tone/type options, simulated AI generation with copy/regenerate. | **Dashboard** |
| `src/app/dashboard/competitors/page.tsx` | Competitor comparison page. Shows your position vs top competitors (rating, reviews, photos, keyword overlap, visibility score). Mock data. | **Dashboard** |
| `src/app/dashboard/keywords/page.tsx` | Keyword rankings table. Shows volume, your rank, competitor rank, trend for each keyword. Has filters, search, download. Mock data. | **Dashboard** |
| `src/app/dashboard/reports/page.tsx` | Performance reports list. Shows report cards with download/share, scheduled reports section. Mock data. | **Dashboard** |
| `src/app/dashboard/tasks/page.tsx` | Optimization task list. Categorized tasks with impact level, estimated time, toggle completion, progress bar. Mock data. | **Dashboard** |
| `src/app/dashboard/settings/page.tsx` | Settings page. Profile info, connected business, notification preferences, billing, danger zone (disconnect, delete account). UI only — not functional. | **Dashboard** |
| `src/app/dashboard/insights/page.tsx` | Placeholder page. Shows "Connect a profile to see AI insights." | **Dashboard** |
| `src/app/dashboard/posts/page.tsx` | Placeholder page. Shows "No posts yet." | **Dashboard** |
| `src/app/dashboard/profiles/page.tsx` | Placeholder page. Shows "Connect your first Google Business Profile." | **Dashboard** |

#### API Routes

| File | What it does | Used by |
|------|-------------|---------|
| `src/app/api/gbp-audit/route.ts` | **Main audit engine.** POST endpoint. Pipeline: (1) Rate limit check, (2) Google Places text search → place_id, (3) Place details, (4) Build profile snapshot, (5) OpenAI analysis + DataForSEO market scan in parallel, (6) Competitor lookup via Places, (7) Assemble `AuditResult`. Rate limit: 3 req/hour. | **Main funnel** (Step 2) |
| `src/app/api/business-preview/route.ts` | POST endpoint. Takes `businessName` + `city`. Returns business details (name, rating, reviews, photos, address, phone, website, category) from Google Places. Rate limit: 10 req/hour. | **Main funnel** (Step 1 preview card) |
| `src/app/api/places-autocomplete/route.ts` | GET endpoint. Query param `q`. Proxies Google Places Autocomplete API filtered to US establishments. Returns `predictions[]` with `placeId`, `description`, `mainText`, `secondaryText`. Rate limit: 60 req/hour. | **Main funnel** (Step 1 autocomplete) |
| `src/app/api/audit-pdf/route.ts` | POST endpoint. Takes `result` (AuditResult) + `businessInfo`. Generates a styled HTML audit report with keyword gaps, recommendations, posts, Q&A. Returns as downloadable HTML file. | **Audit flow** (DIY PDF) |
| `src/app/api/create-checkout/route.ts` | POST endpoint. Creates a Stripe Checkout session for "GBP Optimization Report" at $9.99. Returns `{ url }` for redirect. Rate limit: 10 req/hour. | **Audit flow** (payment) |

#### Funnel Components (ACTIVE — used by main funnel)

| File | What it does | Used by |
|------|-------------|---------|
| `src/components/funnel/step-business-scan.tsx` | **Step 1.** Problem-first hero, Google Places autocomplete, business preview card, form (business name + city + website), CTA button, trust badges, Facebook reviews widget. | **Main funnel** |
| `src/components/funnel/step-market-scan.tsx` | **Step 2.** Calls `/api/gbp-audit`, shows pulsing search animation, progress bar (caps at 90% until API returns), 7-step progressive discovery feed with color-coded severity, business card anchor. | **Main funnel** |
| `src/components/funnel/step-results.tsx` | **Step 3.** Shock headline with keyword gap count, dollar value card (estimated lost revenue), visibility score gauge, head-to-head competitor comparison grid, top keyword opportunity, AI assessment, urgency CTA. | **Main funnel** |
| `src/components/funnel/step-choose-option.tsx` | **Step 4.** Value anchor (estimated recoverable revenue), DIY Fix Plan card ($9.99 with price anchor), AI Optimization card (Free with $197/mo anchor, "Recommended" badge), value stacking, trust signals, cost of inaction warning. | **Main funnel** |
| `src/components/funnel/progress-steps.tsx` | Header step indicator showing steps 1-4 with completed/current/pending states. Circular numbered badges connected by lines. | **Main funnel** |

#### Shared Components

| File | What it does | Used by |
|------|-------------|---------|
| `src/components/facebook-reviews-widget.tsx` | Renders Facebook reviews header (icon, stars, "4.9", "200+ Facebook reviews") and Elfsight widget embed via Script tag. App ID: `0b3b9fe3-d5a0-4940-abf5-357dabaab9e2`. | **Main funnel** (Step 1) |
| `src/components/logo.tsx` | Paint & Profits logo. Renders `next/image` with `/images/logo-main.png`. Supports `sm`, `md`, `lg` sizes. | **Main funnel + Dashboard** |
| `src/components/ai-badge.tsx` | Small "AI-Powered Scan" pill badge with Zap icon. | **Audit flow** (not main funnel) |
| `src/components/mascot.tsx` | Mascot image component with optional speech bubble. | **Unused / Legacy** |

#### Dashboard Layout Components

| File | What it does | Used by |
|------|-------------|---------|
| `src/components/v0-dashboard/sidebar-nav.tsx` | Current dashboard sidebar navigation. Links to all dashboard pages with icons, active state highlighting, mobile responsive via Sheet. | **Dashboard** |
| `src/components/v0-dashboard/header.tsx` | Current dashboard header. Page title, mobile menu trigger, notification bell, user avatar dropdown. | **Dashboard** |
| `src/components/v0-dashboard/metric-card.tsx` | Reusable metric card with icon, label, value, and change percentage. | **Dashboard** |
| `src/components/layout/DashboardLayout.tsx` | Old dashboard layout wrapper with Header + Sidebar. | **Legacy / Unused** |
| `src/components/layout/Header.tsx` | Old header with logo and user avatar. | **Legacy / Unused** |
| `src/components/layout/Sidebar.tsx` | Old sidebar with navigation links. | **Legacy / Unused** |
| `src/components/layout/index.ts` | Barrel export for old layout components. | **Legacy / Unused** |

#### Audit Components (used by `/audit` — NOT the main funnel)

| File | What it does | Used by |
|------|-------------|---------|
| `src/components/audit/StepBusinessInfo.tsx` | Audit Step 1: business name + city + industry select form. | **Audit flow** |
| `src/components/audit/StepMarketScan.tsx` | Audit Step 2: results view with OpportunityCards, CompetitorComparison, KeywordGapTable, AIInsightPanel. | **Audit flow** |
| `src/components/audit/StepConvert.tsx` | Audit Step 3: AI vs DIY choice with Stripe checkout and PDF download. | **Audit flow** |
| `src/components/audit/StepProgress.tsx` | Step progress indicator for the 3-step audit flow. | **Audit flow** |
| `src/components/audit/AuditLoading.tsx` | Loading screen during audit: progress bar, discovery feed, business preview. | **Audit flow** |
| `src/components/audit/AIInsightPanel.tsx` | AI analysis panel showing "Fix First" priorities and missed opportunities list. | **Audit flow** |
| `src/components/audit/CompetitorComparison.tsx` | You vs competitor side-by-side metric comparison. | **Audit flow** |
| `src/components/audit/KeywordGapTable.tsx` | Table of keyword gaps with priority badges and rank columns. | **Audit flow** |
| `src/components/audit/OpportunityCards.tsx` | Cards showing keywords lost, missed searches, and biggest single keyword opportunity. | **Audit flow** |
| `src/components/audit/PlaceAutocomplete.tsx` | Google Places autocomplete input component. | **Audit flow** |
| `src/components/audit/scan/BusinessProfileCard.tsx` | Business profile card with photo gallery. | **Audit flow** |
| `src/components/audit/scan/MarketScanProgress.tsx` | Progress bar and step checklist during scan. | **Audit flow** |
| `src/components/audit/scan/ScanDiscoveriesFeed.tsx` | Discovery messages feed during loading. | **Audit flow** |
| `src/components/audit/scan/ScanInsightPanel.tsx` | AI insight panel with typewriter text effect. | **Audit flow** |
| `src/components/audit/scan/TopCompetitorHighlight.tsx` | Top competitor highlight card during scan. | **Audit flow** |

#### UI Components (shadcn/Radix primitives)

| File | What it does | Used by |
|------|-------------|---------|
| `src/components/ui/button.tsx` | Button with variants: default, destructive, outline, secondary, ghost, link. Supports `asChild`. | **Both** |
| `src/components/ui/card.tsx` | Card container with CardHeader, CardTitle, CardDescription, CardContent, CardFooter. | **Both** |
| `src/components/ui/input.tsx` | Styled text input. | **Both** |
| `src/components/ui/badge.tsx` | Badge/tag with variants: default, secondary, destructive, outline. | **Both** |
| `src/components/ui/progress.tsx` | Progress bar (Radix). | **Both** |
| `src/components/ui/avatar.tsx` | Avatar with image + fallback (Radix). | **Dashboard** |
| `src/components/ui/checkbox.tsx` | Checkbox (Radix). | **Dashboard** |
| `src/components/ui/dialog.tsx` | Modal dialog (Radix). | **Unused** |
| `src/components/ui/dropdown-menu.tsx` | Dropdown menu (Radix). | **Dashboard** |
| `src/components/ui/field.tsx` | Form field wrapper with label and group. | **Unused** |
| `src/components/ui/label.tsx` | Form label (Radix). | **Dashboard** |
| `src/components/ui/scroll-area.tsx` | Scrollable area (Radix). | **Dashboard** |
| `src/components/ui/select.tsx` | Select dropdown (Radix). | **Dashboard** |
| `src/components/ui/separator.tsx` | Horizontal/vertical separator (Radix). | **Dashboard** |
| `src/components/ui/sheet.tsx` | Slide-out panel for mobile menu (Radix). | **Dashboard** |
| `src/components/ui/switch.tsx` | Toggle switch (Radix). | **Dashboard** |
| `src/components/ui/table.tsx` | Table with Header, Body, Row, Head, Cell, Caption, Footer. | **Dashboard** |
| `src/components/ui/tabs.tsx` | Tabs with TabsList, TabsTrigger, TabsContent (Radix). | **Dashboard** |
| `src/components/ui/textarea.tsx` | Styled textarea. | **Dashboard** |

#### Library / Utilities

| File | What it does | Used by |
|------|-------------|---------|
| `src/lib/types.ts` | All shared TypeScript types: `BusinessInfo`, `KeywordGap`, `BusinessProfile`, `MarketScan`, `ComparisonReport`, `AuditResult`, `OptimizationPhase`, `INDUSTRIES` list. | **Everything** |
| `src/lib/dataforseo.ts` | DataForSEO integration. Functions: `generateLocalKeywords()` (AI keyword gen), `getSearchVolumes()` (volume lookup with city→state fallback), `getKeywordSerp()` (SERP rank check), `findPrimaryCompetitor()` (cross-keyword competitor detection), `runMarketScan()` (full pipeline). Also has CTR curve, state abbreviation map, domain blocklist. | **gbp-audit API** |
| `src/lib/apiError.ts` | Consistent API error handling. `apiErrorResponse()` returns user-facing messages for known errors, generic message for unknown. `isUserFacingError()` checks against pattern list. | **All API routes** |
| `src/lib/rateLimit.ts` | IP-based in-memory rate limiter. `rateLimit()` returns `null` (allowed) or `429 NextResponse` (blocked). Per-route stores with configurable `maxRequests` and `windowMs`. | **All API routes** |
| `src/lib/utils.ts` | Single utility: `cn()` — merges Tailwind classes using `clsx` + `tailwind-merge`. | **Everything** |

#### Config Files

| File | What it does |
|------|-------------|
| `tailwind.config.ts` | Tailwind configuration. Extends theme with HSL color tokens, brand colors (sky blue `#5BC0EB`), border radius from CSS vars, accordion animations. Uses `tailwindcss-animate` plugin. |
| `next.config.js` | Next.js configuration. Currently empty (default settings). |
| `package.json` | Dependencies: Next.js 14.2.18, React 18, OpenAI, Stripe, Radix UI, lucide-react, tailwindcss, tailwindcss-animate. |
| `tsconfig.json` | TypeScript config with `@/` path alias pointing to `./src/`. |

#### Static Assets

| File | What it does |
|------|-------------|
| `public/images/logo-main.png` | Paint & Profits main logo (used in header) |
| `public/images/brandmark.png` | Brand mark icon |
| `public/images/logo-text.png` | Text-only logo variant |
| `public/images/mascot.png` | Mascot image |
| `public/images/wordmark.png` | Wordmark logo variant |

### Data Flow Through the Funnel

```
Step 1 collects: { businessName, city, website }
    ↓
Step 2 calls: POST /api/gbp-audit → returns AuditResult
    ↓
Step 3 displays: AuditResult (marketScan, comparison, recommendations)
    ↓
Step 4 receives: missedSearches (from AuditResult) for value anchoring
```

State is held in `page.tsx`: `currentStep`, `businessData`, `auditResult`

### API Pipeline (/api/gbp-audit)

```
1. Rate limit check (3 req/hour per IP)
2. Google Places text search → find business → get place_id
3. Google Places details → rating, reviews, photos, website, phone, address
4. Build profile snapshot
5. In parallel:
   a. OpenAI analysis → score, aiSummary, recommendations, posts, Q&A
   b. DataForSEO market scan:
      i.   AI generates 20 local keywords
      ii.  DataForSEO gets search volumes (city-level, fallback to state)
      iii. DataForSEO SERP check for each keyword (batches of 5)
      iv.  Find primary competitor (most consistent top-ranker)
      v.   Build gap keywords (where competitor outranks you)
      vi.  Calculate missed traffic using CTR curve
6. Look up top competitor in Google Places for real comparison data
7. Assemble full AuditResult and return
```

---

## 8. UX Decisions

- **Mobile-first design:** All funnel steps are optimized for mobile viewport
- **Problem-first copy:** Headlines lead with the problem (Schwartz awareness Level 2), not the solution
- **Progressive disclosure:** Step 2 reveals discoveries one by one to build curiosity (Growth.design Zeigarnik effect)
- **Dollar value anchoring:** Step 3 shows estimated lost revenue to make the gap tangible (Hormozi value equation)
- **Color-coded severity:** Neutral=blue, Warning=amber, Danger=red throughout the scan and results
- **Hormozi offer stack:** Step 4 stacks value for both options, with price anchoring ($49 crossed out → $9.99; $197/mo crossed out → Free)
- **Cost of inaction:** Step 4 ends with "What happens if you do nothing?" warning (Dan Kennedy)
- **QA debug mode:** Toggle button (bottom-right) shows `data-id` labels on all elements for testing
- **Trust signals:** Static row (not animated) — easier to scan on mobile
- **Facebook reviews:** Elfsight widget for real social proof from Paint & Profits Facebook page
- **Auto-fill:** Selecting a business from autocomplete auto-fills city and website

---

## 9. Data Sources

| Data Point | Source | Real/Mock |
|------------|--------|-----------|
| Business name, rating, reviews, photos, address, phone | Google Places API | Real |
| Business preview card | Google Places API | Real |
| Autocomplete suggestions | Google Places API | Real |
| AI visibility score | OpenAI GPT-4o-mini | Real |
| AI summary & recommendations | OpenAI GPT-4o-mini | Real |
| Local keywords | OpenAI GPT-4o-mini | Real |
| Search volumes | DataForSEO | Real |
| SERP rankings | DataForSEO | Real |
| Competitor detection | DataForSEO SERP analysis | Real |
| Competitor profile (rating, reviews, photos) | Google Places API | Real |
| Missed traffic calculation | CTR curve × volume × rank gap | Calculated |
| Lost revenue estimate | Missed traffic × 8% conversion × $3,500 avg job | Calculated |
| Dashboard data (all pages) | Hardcoded mock data | Mock |
| Facebook reviews | Elfsight widget | Real |

---

## 10. Current Problems

### Critical
1. **Vercel deployment returns empty market scan data** — DataForSEO works locally but returns 0 keywords on the live Vercel deployment. Env vars appear to be set correctly in Vercel. Needs investigation into whether Vercel is actually reading the env vars at runtime. May need a full redeploy without build cache.

### Known Issues
2. **Competitor profile sometimes null** — If Google Places can't find the competitor by name, `competitorProfile` is null and the comparison grid doesn't render on Step 3
3. **Low keyword count** — DataForSEO often returns volumes for only 2-5 of the 20 AI-generated keywords (city-level volumes are sparse for small cities)
4. **Rate limiting is in-memory** — Resets on every deployment/cold start on Vercel serverless functions. Not persistent.
5. **Dashboard is entirely mock data** — No real data flows to any dashboard page
6. **Stripe checkout not fully wired** — `STRIPE_SECRET_KEY` is not in `.env.local`. The DIY button shows an alert instead of redirecting to Stripe.
7. **No authentication** — No user accounts, login, or session management
8. **No Google Business Profile OAuth** — "Connect My Account" button just redirects to `/dashboard` without actually connecting anything
9. **Old/unused components** — `src/components/audit/` folder contains legacy components from an earlier version of the funnel that are no longer used by the main funnel

---

## 11. Next Development Priorities

### Immediate (Fix What's Broken)
1. Fix DataForSEO on Vercel — ensure env vars are read at runtime, not just build time
2. Wire up Stripe checkout so DIY PDF actually works end-to-end
3. Handle null competitor profile gracefully in Step 3 (show fallback UI)

### Short Term (Complete the Product)
4. Implement Google Business Profile OAuth (connect account flow)
5. Connect dashboard pages to real data from the audit API
6. Implement persistent rate limiting (Redis/KV store)
7. Add user authentication (NextAuth or Clerk)
8. Clean up unused legacy components in `src/components/audit/`

### Medium Term (Growth)
9. Expand beyond painters — support all industries in the `INDUSTRIES` list
10. Add email capture before showing results (lead generation)
11. Implement the full AI optimization pipeline (auto-post, auto-respond to reviews)
12. Add recurring scan scheduling
13. Payment/subscription for premium features
14. Performance tracking over time (before/after optimization)

---

## Environment Variables Required

```
OPENAI_API_KEY=           # OpenAI API key for GPT-4o-mini
GOOGLE_PLACES_API_KEY=    # Google Cloud API key with Places API enabled
DATAFORSEO_LOGIN=         # DataForSEO account email
DATAFORSEO_PASSWORD=      # DataForSEO API password
STRIPE_SECRET_KEY=        # Stripe secret key (for checkout)
```

All must be set in both `.env.local` (local dev) and Vercel Environment Variables (production).

---

## Git History (Key Commits)

| Commit | Description |
|--------|-------------|
| `f8c9520` | trigger redeploy with updated env vars |
| `e822d55` | Add website field, reorganize all funnel code for readability |
| `358c755` | Conversion-optimized funnel rewrite (Hormozi, Schwartz, Kennedy, Cialdini) |
| `8c0efcc` | trigger clean redeploy |
| `3344c0f` | Replace reviewer placeholder initials with real profile photos |
| `589c66e` | QA v1: Redesign Step 1 per QA document |
| `f22300d` | Add visible QA overlay toggle for data-id labels |
| `8c16220` | Add data-id QA tags to all funnel containers and elements |
| `7f1bd7f` | Wire funnel to real API data — no more mock/hardcoded results |

**To revert to pre-conversion-rewrite:** `git reset --hard 8c0efcc`
