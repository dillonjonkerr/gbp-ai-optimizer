# GBP AI Optimizer

A SaaS starter for **GBP AI Optimizer**—helping home improvement businesses optimize their Google Business Profiles with AI-powered insights.

## Tech stack

- **Next.js 14** (App Router)
- **TypeScript**
- **TailwindCSS**
- **React 18**

## Project structure

```
src/
├── app/                    # App Router
│   ├── dashboard/          # Dashboard routes (sidebar + header layout)
│   │   ├── layout.tsx      # Dashboard layout (Sidebar + Header)
│   │   ├── page.tsx        # Dashboard home
│   │   ├── profiles/
│   │   ├── insights/
│   │   ├── posts/
│   │   └── settings/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Landing page
│   └── globals.css
├── components/
│   └── layout/             # Layout components
│       ├── Sidebar.tsx
│       ├── Header.tsx
│       ├── DashboardLayout.tsx
│       └── index.ts
```

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run the dev server:

   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) for the landing page, or [http://localhost:3000/dashboard](http://localhost:3000/dashboard) for the dashboard.

## Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run start` — Start production server
- `npm run lint` — Run ESLint

## Features

- **Landing page** — Hero, features, and CTAs for home improvement businesses
- **Dashboard** — Sidebar navigation, header, and overview with placeholder stats
- **Placeholder routes** — Profiles, Insights, Posts, Settings (ready for implementation)
