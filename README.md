# FEOps Kit

A reusable Next.js-based frontend engineering portfolio system. Fork it, fill in your own case studies, deploy it as your own.

---

## Stack

| Layer | Tool | Version |
|---|---|---|
| Framework | Next.js (App Router, Turbopack) | 16.2.9 |
| Runtime | React | 19.2.4 |
| Language | TypeScript (strict mode) | 5.9.3 |
| UI | Tailwind CSS v4 + shadcn/ui (base-nova) | 4.3.1 |
| ORM | Prisma (optional — only for DB features) | 7.8.0 |
| Validation | Zod | 4.4.3 |
| Auth | NextAuth v5 (optional — only for admin panel) | — |
| Content (default) | MDX, Git-driven | — |
| Deployment | Vercel | — |

---

## 1. Quick Start (no database required)

The public site runs entirely on Git-MDX content. Clone and run with **zero external services**.

```bash
git clone <your-fork-url>
cd feops-kit
yarn install
yarn dev
```

This repo uses `yarn` — if you prefer `npm` or `pnpm`, delete `yarn.lock` and run your preferred installer instead. Just don't mix lockfiles within the same clone.

Open `http://localhost:3000` — the site is populated with sample content from `/content`. No `.env`, no database, no signup required.

Edit/add `.mdx` files under `/content/work`, `/content/journal`, `/content/engineering` to replace sample content with your own. Commit and push — that's the entire content workflow if you don't need the admin panel.

---

## 2. Project Structure

```
src/
├── app/
│   ├── (public)/              # public pages — /, /work, /journal, /engineering, etc.
│   ├── (admin)/               # admin panel — /admin/*, /login (auth required)
│   ├── api/                   # route handlers (webhooks, NextAuth, external API)
│   ├── globals.css            # dark-first theme with oklch color tokens
│   └── layout.tsx             # root layout (Geist fonts, dark mode)
├── actions/                   # server actions ("use server") — admin CRUD mutations
├── components/
│   └── ui/                    # shared UI components (Button, Card, Badge, NavBar, etc.)
├── lib/
│   ├── content/               # content abstraction layer
│   │   ├── source.ts          # interface — pages import this, never the implementations
│   │   ├── mdx-source.ts      # Git-MDX implementation (default)
│   │   └── db-source.ts       # DB implementation (swap via CONTENT_SOURCE env var)
│   ├── db/                    # Prisma client (guarded with server-only)
│   └── auth/                  # NextAuth config
├── types/                     # all TypeScript types — never declare inline in components
├── constants/                 # shared constants
├── validators/                # Zod schemas
└── env.ts                     # typed wrapper for process.env

content/                       # Git-MDX source — deliberately OUTSIDE src/
├── work/*.mdx                 # case study content
├── journal/*.mdx              # blog/journal posts
└── engineering/*.mdx          # architecture notes, decision logs
```

### Key design decisions

- **`content/` lives outside `src/`** — MDX content is data, not application code. Forkers can find "where do I put my writing" separately from "where is the app."
- **Route groups split auth boundaries** — `(public)` never imports admin logic, `(admin)` never ships to anonymous visitors.
- **Content abstraction** — all content reads go through `lib/content/source.ts`. Switching from Git-MDX to DB-driven content is a one-line env var change (`CONTENT_SOURCE=db`), not a rewrite of every page.
- **`server-only` guard** — any module touching the database or secrets imports `server-only` at the top, causing a build error if a Client Component accidentally imports it.

---

## 3. Routes

### Public (no auth)

| Route | Page |
|---|---|
| `/` | Home — hero, profile card, system modules, tech stack |
| `/work` | Case study index |
| `/work/[slug]` | Individual case study |
| `/engineering` | Engineering notes hub |
| `/engineering/architecture` | Architecture write-ups |
| `/engineering/decisions` | Decision logs |
| `/engineering/performance` | Performance notes |
| `/journal` | Journal/blog index |
| `/journal/posts/[slug]` | Individual post |
| `/focus` | Current learning roadmap |
| `/stack` | Tools and workflow |
| `/resume` | CV / PDF-ready resume |

### Admin (auth required)

| Route | Page |
|---|---|
| `/login` | Auth login |
| `/admin` | Dashboard |
| `/admin/work` | Manage case studies |
| `/admin/work/[id]/edit` | Edit case study |
| `/admin/journal` | Manage journal posts |
| `/admin/journal/[id]/edit` | Edit journal post |
| `/admin/settings` | Site settings |

### API

| Route | Purpose |
|---|---|
| `/api/work` | Work data endpoint (external clients) |
| `/api/og` | Open Graph image generation |

---

## 4. When you need the database

Only required for:
- The `/admin` panel (login + CRUD UI instead of editing `.mdx` files directly)
- Interaction features (contact form submissions, reactions, analytics)
- Auth (NextAuth) for admin login

If you only want the static portfolio, **skip to Section 6 (Deploy)** — you don't need any of the steps below.

---

## 5. Setting up the database

### 5.1 Choose a provider

Pick one (both have a free tier):

- **Supabase** — https://supabase.com → New Project
- **Neon** — https://neon.tech → New Project

Either works — both are Postgres.

### 5.2 Get your connection string

- **Supabase:** Project Settings → Database → Connection string (URI). Use the **pooled** connection string (port `6543`, `pgbouncer=true`) for `DATABASE_URL` on serverless deploys, and the **direct** string for `DIRECT_URL` (used by Prisma Migrate).
- **Neon:** Dashboard → Connection Details → copy the `postgres://...` string.

### 5.3 Create your `.env` file

```bash
cp .env.example .env
```

Fill in the values:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DBNAME?sslmode=require"
DIRECT_URL=""
NEXTAUTH_SECRET=""        # generate with: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"
AUTH_GITHUB_ID=""
AUTH_GITHUB_SECRET=""
CONTENT_SOURCE="mdx"
```

**Never commit `.env`.** It's already in `.gitignore`.

### 5.4 Run the migration

```bash
npx prisma migrate dev
```

To inspect data visually: `npx prisma studio` (opens at `http://localhost:5555`).

### 5.5 Switch content source to DB-driven

Set `CONTENT_SOURCE="db"` in `.env` — this swaps the implementation behind `lib/content/source.ts` from `mdx-source.ts` to `db-source.ts`. No page code changes needed.

---

## 6. Environment Variable Reference

| Variable | Required? | Description |
|---|---|---|
| `DATABASE_URL` | Only if using DB features | Postgres connection string from Supabase/Neon |
| `DIRECT_URL` | Only if provider requires pooling | Non-pooled connection string for Prisma Migrate |
| `NEXTAUTH_SECRET` | Only if using `/admin` | Session encryption secret (`openssl rand -base64 32`) |
| `NEXTAUTH_URL` | Only if using `/admin` | Base app URL — `http://localhost:3000` in dev, real domain in prod |
| `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` | Optional | Only if GitHub OAuth login is enabled for admin |
| `CONTENT_SOURCE` | No (defaults to `mdx`) | `mdx` or `db` — controls which content implementation is used |

---

## 7. Deploy to Vercel

1. Push your repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. If using the database, add the same env vars from `.env` into **Project Settings → Environment Variables**.
4. Set `NEXTAUTH_URL` to your production URL (e.g. `https://yourname.vercel.app`).
5. Deploy.

If using a database, run the migration against production once:

```bash
npx prisma migrate deploy
```

---

## 8. Common Issues

**"Can't reach database server" on Vercel but works locally**
→ Serverless functions need the pooled connection string. On Supabase, use port `6543` with `pgbouncer=true` for `DATABASE_URL`, and the direct string for `DIRECT_URL`.

**Prisma Client not found / out of sync after pulling changes**
→ Run `npx prisma generate` after any `schema.prisma` change or fresh install.

**Admin panel redirects to login in a loop**
→ Check `NEXTAUTH_URL` matches the actual URL (including `http` vs `https`) and that `NEXTAUTH_SECRET` is set.

---

## 9. Customizing

### Content

Replace the `.mdx` files in `/content` with your own case studies, journal posts, and engineering notes. Each file uses frontmatter for metadata — check existing samples for the expected shape.

### Theme

Colors are defined as oklch tokens in `src/app/globals.css`. The site is dark-first by default. Edit the CSS custom properties to match your brand.

### Components

Shared UI lives in `src/components/ui/`. Restyle `Card`, `Badge`, `Button`, `NavBar`, `Footer` etc. to change the look across the entire site without touching individual pages.

---

## License

MIT
