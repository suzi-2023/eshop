# eShop

A modern, AI-ready e-commerce storefront built with Next.js 16, TypeScript, Tailwind CSS 4 and Prisma. Designed to run on free tiers (Vercel + Neon/Supabase) while you build.

## What is included

- **Storefront**: home, product listing with search / category filter / sort, product detail with gallery, cart with order summary. Fully responsive.
- **Data layer**: Prisma schema for categories, products, carts and orders, plus a seed script with a 20-product demo catalog.
- **Zero-config dev mode**: without a `DATABASE_URL` the app serves the bundled demo catalog, so the UI runs right after `npm install`.
- **Cart**: client-side, persisted in `localStorage` (server-side cart table is ready for when auth lands).

- **AI features**: natural-language product search and a streaming shopping assistant that recommends only products from the catalog. Built on the Vercel AI SDK, so the provider is a configuration choice: Google Gemini (free tier) or Anthropic Claude. Both features switch on when a provider key is set and degrade gracefully when it is not.

Not yet included (planned next steps): authentication, checkout and payments, admin, and AI-written product descriptions.

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

### Enable the AI features

Pick a provider and add its key to `.env` (locally) and to Vercel's environment variables:

| Provider         | Key                            | Get it from                                                                        | Default models (search / assistant)          |
| ---------------- | ------------------------------ | ---------------------------------------------------------------------------------- | -------------------------------------------- |
| Google Gemini    | `GOOGLE_GENERATIVE_AI_API_KEY` | [Google AI Studio](https://aistudio.google.com/apikey), free tier with rate limits | `gemini-3.5-flash-lite` / `gemini-3.5-flash` |
| Anthropic Claude | `ANTHROPIC_API_KEY`            | [Claude Console](https://platform.claude.com), pay as you go                       | `claude-haiku-5-5` / `claude-sonnet-5-5`     |

If both keys are present Gemini is used; set `AI_PROVIDER=claude` or `AI_PROVIDER=gemini` to force one. Override the models with `AI_SEARCH_MODEL` / `AI_ASSISTANT_MODEL`.

That turns on two features:

- **AI search**: the sparkle toggle in the search box sends the query with `?ai=1`. `src/lib/ai/search.ts` asks the model (structured output) to turn the sentence into catalog filters (keywords, category, price range, sort); the normal catalog query then runs them. The products page shows what was understood and offers an exact-match fallback. If the API is unavailable the page silently falls back to keyword search.
- **Shopping assistant**: the chat panel on the home page streams from `POST /api/assistant`. `src/lib/ai/assistant.ts` runs a small tool-use loop with one tool, `search_catalog`, so the model can only recommend products it actually found, and every link points at a real product page.

Cost controls live in `src/lib/ai/config.ts`: a small model for search interpretation, a mid-tier model for the assistant, a 1,024-token reply cap, at most four model steps per reply and a 12-message history window. On the Gemini free tier a traffic spike hits the rate limit (requests fail gracefully) rather than a bill. There is no per-user rate limiting yet; add one (for example Upstash Ratelimit on the two routes) before launch.

Adding another provider means one more case in `src/lib/ai/provider.ts` and one more key check in `src/lib/ai/config.ts`; nothing else changes.

`GET /api/search?q=...` returns the same AI interpretation as JSON for debugging or a future mobile app.

## Project structure

```
prisma/
  schema.prisma        Database schema (Category, Product, Cart, Order, ...)
  seed.ts              Loads src/data/demo-catalog.ts into the database
src/
  app/                 Routes (App Router)
    page.tsx           Home
    products/          Listing (keyword or AI search) + [slug] detail page
    cart/              Cart page
    api/assistant/     Streaming shopping-assistant endpoint (NDJSON)
    api/search/        JSON endpoint for AI search
  components/
    ui/                Design-system primitives (Button, Badge, Container, ...)
    layout/            Header, footer, mobile menu, search (with AI toggle), cart button
    product/           Product card, grid, gallery, price, rating, add-to-cart
    home/              Hero, category tiles, value props, assistant section
    assistant/         Chat panel and its Markdown-lite renderer
    catalog/           Filter chips and sort control
    cart/              Cart page view
  data/demo-catalog.ts Demo categories and products (seed + fallback source)
  lib/
    ai/                Claude integration: config, client, search, assistant, shared filter schema
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
3. Add `DATABASE_URL` and an AI provider key (`GOOGLE_GENERATIVE_AI_API_KEY` or `ANTHROPIC_API_KEY`) under Project > Settings > Environment Variables.
4. Deploy. Every push to `main` redeploys.

The Hobby plan is for non-commercial use; upgrade before taking real payments.

## Conventions

- Prices are stored as integers in minor units (paise / cents) and formatted with `formatPrice`.
- Pages never import Prisma directly; all reads go through `src/lib/catalog.ts`.
- Server components by default; `"use client"` only where interaction or browser state is needed.
- Styling uses design tokens defined in `src/app/globals.css` (`bg-background`, `text-muted-foreground`, `text-accent`, ...).
