# FEOps Kit

A reusable Next.js-based frontend engineering portfolio system. Fork it, fill in your own case studies, deploy it as your own.

This README covers **setup only**. For architecture/design decisions, see `feops-kit-requirements.md`.

---

## 1. Quick Start (no database required)

The public site (`/`, `/work`, `/journal`, `/engineering`, etc.) runs entirely on Git-MDX content. You can clone and run it with **zero external services**.

```bash
git clone <your-fork-url>
cd feops-kit
npm install
npm run dev
```

(Commands above use `npm` as the universal example — if you prefer `yarn` or `pnpm`, use `yarn` / `yarn dev` or `pnpm install` / `pnpm dev` instead. Just don't mix package managers within the same clone — check which lockfile is already present (`package-lock.json`, `yarn.lock`, or `pnpm-lock.yaml`) before running anything.)

Open `http://localhost:3000` — you should see the site populated with the sample content already in `/content`. No `.env`, no database, no signup required for this step.

Edit/add `.mdx` files under `/content/work`, `/content/journal`, `/content/engineering` to replace sample content with your own. Commit and push — that's the entire content workflow if you don't need the admin panel.

---

## 2. When you need the database

You only need a database if you want:
- The `/admin` panel (login + CRUD UI instead of editing `.mdx` files directly)
- Interaction features (contact form submissions, reactions, lightweight analytics)
- Auth (NextAuth) for the admin login

If you only want the static portfolio, **skip to Section 5 (Deploy)** — you don't need any of the steps below.

---

## 3. Setting up the database

### 3.1 Choose a provider

Pick one (both have a free tier):

- **Supabase** — https://supabase.com → New Project
- **Neon** — https://neon.tech → New Project

Either works — both are Postgres. Wait for provisioning to finish (usually 1–2 minutes).

### 3.2 Get your connection string

- **Supabase:** Project Settings → Database → Connection string → choose "URI" → copy the value with `Transaction` mode (or `Session` mode if you hit pooling issues with Prisma).
- **Neon:** Dashboard → Connection Details → copy the `postgres://...` string.

It looks like:
```
postgresql://USER:PASSWORD@HOST:PORT/DBNAME?sslmode=require
```

### 3.3 Create your `.env` file

Copy the example file:

```bash
cp .env.example .env
```

Open `.env` and fill in the values:

```bash
# Database — paste the connection string from Supabase/Neon here
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DBNAME?sslmode=require"

# NextAuth — required only if you're using the admin panel
NEXTAUTH_SECRET=""        # generate with: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"

# OAuth provider (if using GitHub/Google login for admin) — optional
AUTH_GITHUB_ID=""
AUTH_GITHUB_SECRET=""

# Content source switch — "mdx" (default) or "db"
CONTENT_SOURCE="mdx"
```

**Never commit `.env`.** It's already in `.gitignore` — double check before your first push.

### 3.4 Run the migration

```bash
npx prisma migrate dev
```

This creates the tables in your database based on `lib/db/schema.prisma`. You should see output confirming the migration applied successfully.

To inspect your data visually at any time:

```bash
npx prisma studio
```

This opens a GUI at `http://localhost:5555` to browse/edit rows directly.

### 3.5 (Optional) Switch content source to DB-driven

If you want the admin panel to manage content through the database instead of Git-MDX, set in `.env`:

```bash
CONTENT_SOURCE="db"
```

This swaps the implementation behind `lib/content/source.ts` from `mdx-source.ts` to `db-source.ts` — no page code changes needed.

---

## 4. Environment Variable Reference

| Variable | Required? | Description |
|---|---|---|
| `DATABASE_URL` | Only if using DB features | Postgres connection string from Supabase/Neon |
| `NEXTAUTH_SECRET` | Only if using `/admin` | Random secret for session encryption. Generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Only if using `/admin` | Base URL of your app — `http://localhost:3000` in dev, your real domain in production |
| `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` | Optional | Only needed if you enable GitHub OAuth login for the admin panel |
| `CONTENT_SOURCE` | No (defaults to `mdx`) | `mdx` or `db` — controls which content implementation is used |

---

## 5. Deploy to Vercel

1. Push your repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. If you're using the database, add the same environment variables from your `.env` into Vercel's **Project Settings → Environment Variables**. (Vercel never reads your local `.env` file — you must re-enter them there.)
4. Set `NEXTAUTH_URL` to your real production URL (e.g. `https://yourname.vercel.app`).
5. Deploy.

If you're using a database, run the migration against production once after first deploy:

```bash
npx prisma migrate deploy
```

(Run this locally with `DATABASE_URL` pointed at your production database, or wire it into your GitHub Actions pipeline — see `.github/workflows/ci.yml`.)

---

## 6. Common Issues

**"Can't reach database server" on Vercel but works locally**
→ Your DB provider may require connection pooling for serverless. On Supabase, use the pooled connection string (port `6543`, `pgbouncer=true`) for `DATABASE_URL`, and the direct connection string for `DIRECT_URL` if your `schema.prisma` defines one for migrations.

**Prisma Client not found / out of sync after pulling changes**
→ Run `npx prisma generate` after any `schema.prisma` change or after a fresh `npm install`.

**Admin panel redirects to login in a loop**
→ Check `NEXTAUTH_URL` matches the actual URL you're visiting (including `http` vs `https`), and that `NEXTAUTH_SECRET` is set.

---

## 7. Project Structure

See `feops-kit-requirements.md` for the full architecture writeup. Short version:

```
app/(public)/    → public pages, no auth
app/(admin)/     → admin panel, requires login
app/api/         → route handlers (webhooks, mobile-facing API, NextAuth)
app/actions/     → server actions (admin CRUD mutations)
content/         → Git-MDX source files
lib/content/     → content abstraction layer (mdx-source.ts / db-source.ts)
lib/db/          → Prisma schema + client
```
