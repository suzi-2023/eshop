# eShop

A modern, AI-ready e-commerce storefront built with Next.js 16, TypeScript, Tailwind CSS 4 and Prisma. Designed to run on free tiers (Vercel + Neon/Supabase) while you build.

## What is included

- **Storefront**: home, product listing with search / category filter / sort, product detail with gallery, cart with order summary. Fully responsive.
- **Data layer**: Prisma schema for categories, products, carts and orders, plus a seed script with a 20-product demo catalog.
- **Zero-config dev mode**: without a `DATABASE_URL` the app serves the bundled demo catalog, so the UI runs right after `npm install`.
- **Cart**: client-side, persisted in `localStorage` (server-side cart table is ready for when auth lands).

Not yet included (planned next steps): authentication, checkout and payments, admin, and the AI features (natural-language search, shopping assistant, description generation).

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000. You are now browsing the demo catalog.

### Connect a database

1. Create a free Postgres database on [Neon](https://neon.tech) or [Supabase](https://supabase.com).
2. Copy `.env.example` to `.env` and set `DATABASE_URL` (use the pooled connection string on Neon).
3. Push the schema and load the demo data:

```bash
npm run db:push
```

```bash
npm run db:seed
```

Restart `npm run dev`; the app now reads from Postgres. `npm run db:studio` opens a data browser.

## Project structure

```
prisma/
  schema.prisma        Database schema (Category, Product, Cart, Order, ...)
  seed.ts              Loads src/data/demo-catalog.ts into the database
src/
  app/                 Routes (App Router)
    page.tsx           Home
    products/          Listing + [slug] detail page
    cart/              Cart page
  components/
    ui/                Design-system primitives (Button, Badge, Container, ...)
    layout/            Header, footer, mobile menu, search, cart button
    product/           Product card, grid, gallery, price, rating, add-to-cart
    home/              Hero, category tiles, value props, AI banner
    catalog/           Filter chips and sort control
    cart/              Cart page view
  data/demo-catalog.ts Demo categories and products (seed + fallback source)
  lib/
    catalog.ts         All catalog reads (Prisma or demo fallback)
    prisma.ts          Prisma client singleton
    config.ts          Site name, currency, nav, shipping thresholds
    types.ts           Domain types shared by UI and data layer
    urls.ts            URL builders / search param parsing
    utils.ts           cn(), formatPrice(), ...
  store/cart.ts        Zustand cart store (persisted)
```

## Scripts

| Command                              | What it does                                     |
| ------------------------------------ | ------------------------------------------------ |
| `npm run dev`                        | Start the dev server                             |
| `npm run build` / `npm start`        | Production build and serve                       |
| `npm run lint` / `npm run typecheck` | ESLint and TypeScript checks                     |
| `npm run db:push`                    | Sync the Prisma schema to the database           |
| `npm run db:migrate`                 | Create a migration (use once the schema settles) |
| `npm run db:seed`                    | Load the demo catalog                            |
| `npm run db:studio`                  | Browse data in Prisma Studio                     |

## Deploying to Vercel (free)

1. Push this repository to GitHub.
2. Import it at https://vercel.com/new. Vercel detects Next.js automatically.
3. Add `DATABASE_URL` (and later `ANTHROPIC_API_KEY`) under Project > Settings > Environment Variables.
4. Deploy. Every push to `main` redeploys.

The Hobby plan is for non-commercial use; upgrade before taking real payments.

## Conventions

- Prices are stored as integers in minor units (paise / cents) and formatted with `formatPrice`.
- Pages never import Prisma directly; all reads go through `src/lib/catalog.ts`.
- Server components by default; `"use client"` only where interaction or browser state is needed.
- Styling uses design tokens defined in `src/app/globals.css` (`bg-background`, `text-muted-foreground`, `text-accent`, ...).
