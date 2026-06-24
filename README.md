# Gedada — AI Lesson Planner (Next.js)

Pixel-perfect Arabic (RTL) implementation of the Gedada Academic Intelligence design,
built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and **shadcn-style** components.

## Screens

| Route             | Screen                              |
| ----------------- | ----------------------------------- |
| `/`               | Dashboard (screen 1)                |
| `/new-generation` | Create new lesson card (screen 2)   |
| `/lesson`         | Lesson card view (screen 3)         |
| `/community`      | Teachers community hub (screen 4)   |

## Run locally

```bash
npm install
npm run dev
# open http://localhost:3000
```

## Stack & conventions

- **App Router** under `app/` — every page is a Server Component (no client JS needed for layout).
- **RTL by default** — `<html lang="ar" dir="rtl">` in `app/layout.tsx`.
- **Sidebar** is a Client Component (uses `usePathname`) and renders on the right side via RTL flex.
- **Design tokens** mirror `DESIGN.md` exactly — defined in `tailwind.config.ts` as Tailwind theme extensions:
  - `primary` `#003466` (Education Blue) · `ai` `#2D9CDB` (Growth Green)
  - `surface` `#f7f9fb` (Paper background) · `paper` `#ffffff` (Card surface)
  - IBM Plex Sans Arabic across the entire app
  - Type scale, radii, shadows, and spacing match the design system
- **shadcn-style primitives** in `components/ui/` — `Button` (with `cva` variants: primary/secondary/ghost/outline/ai), `Card`, `Input`, `Label`, `Badge`. Plug in the full shadcn CLI if you want to extend.
- **Responsive** — sidebar collapses on `<md`, grids reflow from 3→2→1 columns, top bar stays single row on mobile, tables hold their structure with horizontal scrolling where needed.

## File tree

```
gedada-nextjs/
├── app/
│   ├── layout.tsx
│   ├── globals.css
│   ├── page.tsx                  (Dashboard)
│   ├── new-generation/page.tsx
│   ├── lesson/page.tsx
│   └── community/page.tsx
├── components/
│   ├── layout/
│   │   ├── sidebar.tsx
│   │   └── topbar.tsx
│   └── ui/
│       ├── button.tsx
│       ├── card.tsx
│       └── input.tsx
├── lib/utils.ts
├── tailwind.config.ts
├── postcss.config.mjs
├── next.config.mjs
├── tsconfig.json
└── package.json
```
