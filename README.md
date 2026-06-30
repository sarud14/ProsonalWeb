# FEOps Kit

A reusable Next.js-based frontend engineering portfolio system with a full CMS. Fork it, fill in your own case studies, deploy it as your own.

---

## Stack

| Layer | Tool | Version |
|---|---|---|
| Framework | Next.js (App Router, webpack in dev/build) | 16.2.9 |
| Runtime | React | 19.2.4 |
| Language | TypeScript (strict mode) | 5.9.3 |
| UI | Tailwind CSS v4 + shadcn/ui (base-nova) | 4.3.1 |
| ORM | Prisma | 7.8.0 |
| Validation | Zod | 4.4.3 |
| Auth | NextAuth v5 (optional — only for admin panel) | 5.0.0-beta.30 |
| Media | Vercel Blob (presigned upload) | 2.5.0 |
| PDF | @react-pdf/renderer (live resume PDF) | 4.5.1 |
| Content (default) | MDX, Git-driven | — |
| Content (CMS) | PostgreSQL via Prisma | — |
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

> **Admin panel (`/admin`)** requires Postgres + env setup — see [§5 Setting up the database](#5-setting-up-the-database).

Edit/add `.mdx` files under `/content/work`, `/content/journal`, `/content/engineering` to replace sample content with your own. Commit and push — that's the entire content workflow if you don't need the admin panel.

---

## 2. Project Structure

```
src/
├── app/
│   ├── (public)/              # public pages — /, /work, /journal, /engineering, etc.
│   ├── (admin)/               # admin panel — /admin/* (auth required)
│   ├── api/
│   │   ├── media/upload/      # Vercel Blob presigned upload (session-gated)
│   │   └── resume/pdf/        # live PDF generation from DB/constants
│   ├── globals.css            # dark-first theme with oklch color tokens
│   └── layout.tsx             # root layout (Geist fonts, dark mode)
├── actions/                   # server actions ("use server") — all CMS mutations
│   ├── work.actions.ts        # work CRUD + publish/unpublish
│   ├── journal.actions.ts     # journal CRUD + publish/unpublish
│   ├── engineering.actions.ts # engineering CRUD + publish/unpublish
│   ├── resume.actions.ts      # profile + experience/education/language/selectedWork
│   ├── page.actions.ts        # singleton page upsert
│   ├── media.actions.ts       # media CRUD (blocks delete if referenced)
│   ├── taxonomy.actions.ts    # domain CRUD (blocks delete if used)
│   ├── contact.actions.ts     # public submit + admin read/archive/delete
│   └── reaction.actions.ts    # public add + get reactions
├── components/
│   ├── ui/                    # shared UI (Button, Card, Badge, NavBar, Footer, etc.)
│   ├── public-page/           # page-specific components, grouped by domain
│   └── admin-page/            # admin CMS UI (dashboard, CRUD, pages, media, etc.)
├── lib/
│   ├── content/               # content abstraction layer
│   │   ├── source.ts          # interface — pages import this, never the implementations
│   │   ├── mdx-source.ts      # Git-MDX implementation (default)
│   │   ├── db-source.ts       # DB implementation (via DAL)
│   │   ├── site-config.ts     # navbar items from data (Phase 3 seam)
│   │   └── landing-registry.ts # landing block type → component map (Phase 3 seam)
│   ├── data/                  # DAL — all Prisma queries centralized here
│   │   ├── work.data.ts       # WorkCaseStudy + Domain relations
│   │   ├── journal.data.ts    # JournalPost
│   │   ├── engineering.data.ts # EngineeringNote
│   │   ├── resume.data.ts     # Profile + Experience/Education/Language/SelectedWork
│   │   ├── page.data.ts       # PageSection (getByKey, upsert)
│   │   ├── media.data.ts      # MediaAsset + reference check
│   │   ├── taxonomy.data.ts   # Domain + works reference check
│   │   ├── contact.data.ts    # ContactMessage
│   │   └── reaction.data.ts   # PostReaction (upsert + increment)
│   ├── db/                    # Prisma client singleton (server-only)
│   ├── auth/                  # NextAuth config + session helpers
│   ├── actions/               # shared action helpers (requireAdminSession, createRevision)
│   ├── media/                 # upload helpers (mime validation, path builder)
│   └── resume/                # PDF document component + data fetcher
├── types/                     # all TypeScript types — never declare inline
├── constants/                 # shared constants (landing data, page data, filters)
├── validators/                # Zod schemas (content forms, contact, reactions, frontmatter)
└── env.ts                     # typed wrapper for process.env

prisma/
├── schema.prisma              # 20+ models (auth, content, resume, media, interactions)
├── prisma.config.ts           # Prisma 7 config
└── seed.ts                    # idempotent seed — reads MDX + constants into DB

scripts/
└── export-to-mdx.ts           # DB → MDX/JSON backup

content/                       # Git-MDX source — deliberately OUTSIDE src/
├── work/*.mdx
├── journal/*.mdx
└── engineering/*.mdx
```

### Key design decisions

- **`content/` lives outside `src/`** — MDX content is data, not application code. Forkers can find "where do I put my writing" separately from "where is the app."
- **Route groups split auth boundaries** — `(public)` never imports admin logic, `(admin)` never ships to anonymous visitors.
- **Content abstraction** — all content reads go through `lib/content/source.ts`. Switching from Git-MDX to DB-driven content is a one-line env var change (`CONTENT_SOURCE=db`), not a rewrite of every page.
- **DAL pattern** — all Prisma queries live in `src/lib/data/*.data.ts`. Actions, db-source, and get-resume-data call through the DAL — never import `prisma` directly outside `src/lib/data/`.
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
| `/admin/journal` | Manage journal posts |
| `/admin/engineering` | Manage engineering notes |
| `/admin/resume` | Edit resume (structured form) |
| `/admin/pages/landing` | Edit landing page |
| `/admin/pages/focus` | Edit focus page |
| `/admin/pages/stack` | Edit stack page |
| `/admin/pages/site` | Site config (nav, SEO, theme) |
| `/admin/media` | Media library |
| `/admin/taxonomy` | Domain management |
| `/admin/messages` | Contact messages |

### API

| Route | Method | Purpose |
|---|---|---|
| `/api/media/upload` | POST | Vercel Blob presigned upload (session-gated) |
| `/api/resume/pdf` | GET | Live PDF generation from resume data |

---

## 4. Database Schema

The project uses **20+ Prisma models** organized into groups:

```
Auth:         User, Account, Session, VerificationToken
Content:      WorkCaseStudy, JournalPost, EngineeringNote
Taxonomy:     Domain (many-to-many with Work)
Pages:        PageSection (singleton JSON blobs — landing, focus, stack, site)
Resume:       ResumeProfile, ResumeExperience, ResumeEducation,
              ResumeLanguage, ResumeSelectedWork (links to Work)
Media:        MediaAsset (referenced by content cover images)
History:      ContentRevision (snapshot on every edit)
Interactions: ContactMessage, PostReaction
```

The full schema lives at `prisma/schema.prisma`. Config (Prisma 7 format) is at `prisma.config.ts`.

### Design choices

- **Content articles** (Work, Journal, Engineering) are normalized tables with per-item CRUD, draft/publish status, and sortOrder.
- **Singleton pages** (Landing, Focus, Stack, Site) use a single `PageSection` table with a JSON blob — edited rarely, no cross-relations.
- **Resume is normalized** (not JSON) — edited often, needs add/remove/reorder per item, `selectedWork` links to Work as a single source for the PDF.
- **Work domains** are a `Domain` table (editable from CMS). Engineering type is a Prisma `enum` (fixed at 3 values).
- **ContentRevision** snapshots every edit to compensate for losing Git diff history.

---

## 5. Setting up the database

### 5.1 Choose a provider

Pick one (all have a free tier):

- **Supabase** — https://supabase.com *(recommended if you want a hosted Postgres + dashboard)*
- **Neon** — https://neon.tech
- **Vercel Postgres** — via Vercel dashboard

All are Postgres.

#### Supabase connection strings

From **Project Settings → Database → Connection string**:

| Env var | Supabase setting | Notes |
|---|---|---|
| `DATABASE_URL` | **Transaction pooler** (port `6543`) | Add `?pgbouncer=true` for Prisma runtime queries |
| `DIRECT_URL` | **Session pooler** (port `5432`) or direct | Used by `prisma migrate` |

### 5.2 Create your `.env` file

```bash
cp .env.example .env
```

Fill in the values:

```env
# Dev server — Next.js reads PORT; NEXTAUTH_URL defaults to APP_HOST:PORT
PORT="3000"
APP_HOST="http://localhost"

DATABASE_URL="postgresql://USER:PASSWORD@HOST:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://USER:PASSWORD@HOST:5432/postgres"
NEXTAUTH_SECRET=""             # generate with: openssl rand -base64 32
# Optional — leave empty to auto-derive from APP_HOST + PORT
NEXTAUTH_URL=""
AUTH_GITHUB_ID=""              # GitHub OAuth app credentials
AUTH_GITHUB_SECRET=""
CONTENT_SOURCE="mdx"           # "mdx" (default) or "db"
BLOB_READ_WRITE_TOKEN=""       # Vercel Blob token (for media uploads)
```

**Never commit `.env`.** It's already in `.gitignore`.

For GitHub OAuth, set the callback URL to:

`http://localhost:<PORT>/api/auth/callback/github`

(e.g. `http://localhost:3000/...` when `PORT=3000`)

### 5.3 Generate Prisma client + run migrations

```bash
npx prisma generate
npx prisma migrate dev
```

### 5.4 Seed the database

```bash
npx prisma db seed
```

This reads all existing MDX files + TS constants and inserts them into the database. The seed is idempotent — safe to run multiple times.

To inspect data visually: `npx prisma studio` (opens at `http://localhost:5555`).

### 5.5 Switch content source to DB

Set `CONTENT_SOURCE="db"` in `.env` — this swaps the implementation behind `lib/content/source.ts` from `mdx-source.ts` to `db-source.ts`. No page code changes needed.

---

## 6. Environment Variable Reference

| Variable | Required? | Description |
|---|---|---|
| `PORT` | No (defaults to `3000`) | Dev server port — Next.js reads this automatically |
| `APP_HOST` | No (defaults to `http://localhost`) | Base URL host for deriving `NEXTAUTH_URL` in dev |
| `DATABASE_URL` | Only if using DB / admin panel | Postgres connection string (pooled for runtime) |
| `DIRECT_URL` | Only if provider requires pooling | Non-pooled / session connection for Prisma Migrate |
| `NEXTAUTH_SECRET` | Only if using `/admin` auth | Session encryption secret |
| `NEXTAUTH_URL` | Optional in dev | Override base app URL; if empty, derived as `APP_HOST:PORT` via `src/env.ts` |
| `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` | Only if using GitHub login | GitHub OAuth credentials |
| `CONTENT_SOURCE` | No (defaults to `mdx`) | `mdx` or `db` |
| `BLOB_READ_WRITE_TOKEN` | Only if using media uploads | Vercel Blob storage token |

---

## 7. Scripts

| Command | Description |
|---|---|
| `yarn dev` | Start dev server (webpack — required for Prisma 7) |
| `yarn build` | Production build |
| `yarn lint` | Run ESLint |
| `yarn type-check` | Run `tsc --noEmit` |
| `yarn test` | Run Vitest tests |
| `npx prisma generate` | Generate Prisma client types |
| `npx prisma migrate dev` | Run database migrations |
| `npx prisma db seed` | Seed database from MDX + constants |
| `npx prisma studio` | Open Prisma data browser |
| `npx tsx scripts/export-to-mdx.ts` | Export DB → MDX/JSON backup |

---

## 8. Deploy to Vercel

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

## 9. Common Issues

**`TypeError: (void 0) is not a constructor` at `new PrismaClient()` in dev**
→ Dev must use webpack, not Turbopack. This repo's `yarn dev` runs `next dev --webpack`. Restart the dev server after pulling.

**"Can't reach database server" / `ECONNREFUSED` on `/admin`**
→ Postgres is not reachable. Check `DATABASE_URL`, run `npx prisma migrate dev` and `npx prisma db seed`, and confirm Supabase project is running.

**`MissingSecret` from Auth.js on `/admin`**
→ Set `NEXTAUTH_SECRET` in `.env`. Ensure `NEXTAUTH_URL` matches the running port (or leave it empty and set `PORT` + `APP_HOST`).

**"Can't reach database server" on Vercel but works locally**
→ Serverless functions need the pooled connection string. On Supabase, use port `6543` with `pgbouncer=true` for `DATABASE_URL`, and the direct string for `DIRECT_URL`.

**Prisma Client not found / out of sync after pulling changes**
→ Run `npx prisma generate` after any `schema.prisma` change or fresh install.

**Admin panel redirects to login in a loop**
→ Check `NEXTAUTH_URL` matches the actual URL (including port, `http` vs `https`) and that `NEXTAUTH_SECRET` is set. GitHub OAuth callback must use the same port as `PORT`.

**Type errors about `@prisma/client`**
→ Run `npx prisma generate` — the client types are generated, not shipped in the repo.

---

## 10. Customizing

### Content

Replace the `.mdx` files in `/content` with your own case studies, journal posts, and engineering notes. Each file uses frontmatter for metadata — check existing samples for the expected shape.

If using the DB, seed your content and manage it via the admin panel instead.

### Theme

Colors are defined as oklch tokens in `src/app/globals.css`. The site is dark-first by default. Edit the CSS custom properties to match your brand.

### Components

Shared UI lives in `src/components/ui/` — restyle `Card`, `Badge`, `Button`, `NavBar`, `Footer`, `Skeleton` etc. to change the look across the entire site. Page-specific components live in `src/components/public-page/<Domain>/` (e.g. `Landing/`, `Work/`, `Journal/`) — edit these to change the layout of individual sections.

### Backup

Export all DB content back to MDX/JSON files:

```bash
npx tsx scripts/export-to-mdx.ts --out ./backup
```

This creates MDX files (with frontmatter) for work/journal/engineering, plus JSON files for resume and page sections.

---

## License

MIT
