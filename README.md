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
│   ├── ui/                    # shared UI (Button, Card, Badge, NavBar, Footer, ImagePicker, etc.)
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
│   ├── media/                 # upload helpers (mime validation, path builder, client upload)
│   ├── admin/                 # CMS helpers (site theme, landing hero, page-section defaults)
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
| `/` | Home — hero (CMS when `CONTENT_SOURCE=db`), profile card, landing blocks |
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
| `/admin/pages/landing` | Landing page — hero (profile image, code snippet), reorderable blocks |
| `/admin/pages/focus` | Edit focus page |
| `/admin/pages/stack` | Edit stack page |
| `/admin/pages/site` | Site settings — brand, nav, SEO, social, contact, footer, theme colors |
| `/admin/media` | Media library (uploads via Vercel Blob when configured) |
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
- **Singleton pages** (Landing, Focus, Stack, Site) use a single `PageSection` table with a JSON blob — landing holds hero + ordered blocks; `site` holds brand, nav, SEO, social, contact, footer, and theme.
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

### 5.6 Vercel Blob (media uploads)

Media uploads in the admin panel (`/admin/media`, cover images, site OG image, landing hero profile image) use **Vercel Blob** via a presigned client upload to `POST /api/media/upload`.

1. In the [Vercel dashboard](https://vercel.com), open your project → **Storage** → create a **Blob** store.
2. Use a **Public** store — the upload client requests `access: 'public'`. A private store causes upload failures.
3. Copy the **read/write token** into `.env` as `BLOB_READ_WRITE_TOKEN`.
4. Restart `yarn dev` after changing env vars.

Uploads are session-gated (admin login required). After upload, the client saves metadata via the `createMedia` server action. Images are organized by folder (`site`, `landing`, work/journal covers, etc.) in the blob path.

> **Local dev:** the upload route does not use Vercel's `onUploadCompleted` callback, so you do not need to configure a public callback URL for localhost.

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
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | Only if using Google login | Google OAuth credentials |
| `CONTENT_SOURCE` | No (defaults to `mdx`) | `mdx` or `db` |
| `BLOB_READ_WRITE_TOKEN` | Only if using media uploads | Vercel Blob read/write token — store must be **Public** |

---

## 7. Scripts

| Command | Description |
|---|---|
| `yarn dev` | Start dev server (webpack — required for Prisma 7) |
| `yarn build` | Production build |
| `yarn lint` | Run ESLint |
| `yarn type-check` | Run `tsc --noEmit` |
| `yarn test` | Run Vitest (11 files, 35 tests) |
| `npx prisma generate` | Generate Prisma client types |
| `npx prisma migrate dev` | Run database migrations |
| `yarn prisma:migrate:deploy` | Apply migrations to production DB |
| `npx prisma db seed` | Seed database from MDX + constants |
| `yarn smoke:web` | Smoke-test public routes + `/api/health` (pass base URL as arg) |
| `npx prisma studio` | Open Prisma data browser |
| `npx tsx scripts/export-to-mdx.ts` | Export DB → MDX/JSON backup |

---

## 8. Deploy to Vercel + CMS integration flow

### 8.1 One-time Vercel setup

1. Push your repo to GitHub (your branch or merge to `main`).
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. Add env vars from `.env` into **Project Settings → Environment Variables** (Production + Preview):

| Variable | Production value |
|---|---|
| `DATABASE_URL` | Supabase pooler `6543` + `?pgbouncer=true` |
| `DIRECT_URL` | Supabase session/direct `5432` |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `https://your-domain.vercel.app` (no trailing slash) |
| `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` | GitHub OAuth app |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | Google OAuth client |
| `CONTENT_SOURCE` | `db` |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob → Storage → **Public** store → read/write token |

4. **Blob store:** create a **Public** Blob store in Vercel Storage. Private stores reject client uploads.

5. **OAuth callback URLs** (add every domain you deploy to):

| Provider | Callback |
|---|---|
| GitHub | `https://your-domain.vercel.app/api/auth/callback/github` |
| Google | `https://your-domain.vercel.app/api/auth/callback/google` |

6. Provision the production database (run locally against prod `DIRECT_URL`):

```bash
yarn prisma:migrate:deploy
yarn prisma:seed
```

> Migrations are local-only in this repo — apply per environment with `yarn prisma:migrate:deploy`, not via git.

7. Deploy. After deploy, verify:

```bash
yarn smoke:web https://your-domain.vercel.app
```

`GET /api/health` should return `"ok": true`, `"contentSource": "db"`, `"database": "connected"`.

### 8.2 End-to-end CMS flow (manual browser check)

| Step | Admin | Public verify |
|---|---|---|
| **Login** | `/login` → GitHub or Google | — |
| **CRUD** | `/admin/work` → New → Save → **Publish** | `/work` shows item |
| **Journal / Engineering** | Same pattern under `/admin/journal`, `/admin/engineering` | `/journal`, `/engineering` |
| **Resume** | `/admin/resume` → edit profile → Save | `/resume` + `/api/resume/pdf` |
| **Site settings** | `/admin/pages/site` → brand, nav, SEO, social, contact, footer, theme → Save | Navbar brand, availability dot, theme colors on all pages |
| **Landing hero** | `/admin/pages/landing` → Hero → profile image (upload or pick from media) → **Save hero** | `/` hero profile image + code snippet |
| **Media** | `/admin/media` → upload (needs `BLOB_READ_WRITE_TOKEN`) | Reuse in covers, site OG image, landing hero |
| **Publish** | Toggle Publish in content list or form | Draft hidden on public site |

Draft content stays admin-only; only `PUBLISHED` rows appear on public pages when `CONTENT_SOURCE=db`.

#### Site settings (`/admin/pages/site`)

Structured forms (not raw JSON) for:

- **Brand** — site name, initials fallback, availability status
- **Navigation** — reorderable nav items (label, href, enabled)
- **SEO** — title, description, OG image (`ImagePicker`: upload or choose from media library)
- **Social links** — label + URL list
- **Contact** — email, location, response-time copy
- **Footer** — copyright, tagline
- **Theme** — native color pickers for primary, background, foreground, success, destructive (`src/lib/admin/site-theme.ts`)

When theme colors match the design defaults, the app skips injecting custom CSS variables so `globals.css` tokens apply as-is.

#### Landing page (`/admin/pages/landing`)

- **Hero** — headline, subtitles, status label, profile image (`ImagePicker`), code-snippet fields
- **Blocks** — reorderable landing sections (system modules, tech stack, etc.)

Save hero and block order separately; each persists to the `PageSection` key `landing`.

### 8.3 Local smoke test (before deploy)

```bash
yarn dev
# in another terminal:
yarn smoke:web http://localhost:3000
```

Adjust the port if Next.js picks another (e.g. `3001`).

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

**Media upload returns `400` / `Invalid token`**
→ Check `BLOB_READ_WRITE_TOKEN` matches the Blob store on the same Vercel project. Regenerate the token if it was rotated or copied incorrectly.

**Media upload fails with access / private store errors**
→ The Blob store must be **Public**. Create a new public store or change access in Vercel Storage, then update the token in `.env` / Vercel env vars.

**`Blob storage is not configured` (503) on upload**
→ `BLOB_READ_WRITE_TOKEN` is empty. Set it in `.env` and restart the dev server.

**Theme colors change but the grid disappears**
→ The grid overlay (`--grid-line`) is always defined in `globals.css`, not the CMS. Only page background / accent colors come from site theme settings. If the grid is missing, check `globals.css` `html::before` layering — not the theme pickers.

---

## 10. Customizing

### Content

Replace the `.mdx` files in `/content` with your own case studies, journal posts, and engineering notes. Each file uses frontmatter for metadata — check existing samples for the expected shape.

If using the DB, seed your content and manage it via the admin panel instead.

### Theme

**Default (no CMS):** colors are oklch tokens in `src/app/globals.css`. The site is dark-first with a subtle grid overlay on `html::before`.

**With CMS (`CONTENT_SOURCE=db`):** edit theme colors under `/admin/pages/site` → Theme. Pickers write hex values into the `site` `PageSection`; `src/lib/admin/site-theme.ts` maps them to CSS variables on the root layout. The **grid lines stay in `globals.css`** — only canvas background and accent colors are CMS-controlled.

To change the grid itself or base typography, edit `globals.css` and shared UI in `src/components/ui/`.

### Components

Shared UI lives in `src/components/ui/` — restyle `Card`, `Badge`, `Button`, `NavBar`, `Footer`, `ImagePicker`, `Skeleton` etc. to change the look across the entire site. Page-specific components live in `src/components/public-page/<Domain>/` (e.g. `Landing/`, `Work/`, `Journal/`) — edit these to change the layout of individual sections.

### Backup

Export all DB content back to MDX/JSON files:

```bash
npx tsx scripts/export-to-mdx.ts --out ./backup
```

This creates MDX files (with frontmatter) for work/journal/engineering, plus JSON files for resume and page sections.

---

## License

MIT
