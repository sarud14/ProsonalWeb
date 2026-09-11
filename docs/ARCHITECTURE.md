# FEOps Kit — Architecture

> Public engineering-portfolio site plus an admin CMS. Forkers fill in case studies and ship their own site. Content reads come from Git-MDX by default (`CONTENT_SOURCE=mdx`) or Postgres (`CONTENT_SOURCE=db`) through one abstraction — pages never import a source implementation. Admin (`/admin`) is optional until NextAuth + OAuth env vars are set.

- **Source of truth for stack/version decisions:** `requirement/feops-kit-requirements.md` (local) and the locked versions in `README.md`
- **Source of truth for the rules this doc instantiates:** `AGENTS.md`
- **Design tokens + UI inventory:** [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md)

---

## Stack

| Concern | Choice |
|---|---|
| Build / dev | Next.js 16.2.9 App Router (`yarn dev` / `yarn build` use webpack) |
| UI framework | React 19.2.4 |
| Language | TypeScript 5.9.3, `strict: true` |
| Routing | Next.js App Router — route groups `(public)` and `(admin)` |
| Styling | Tailwind CSS 4.3.1 + shadcn/ui (base-nova), tokens in `src/components/ui/tokens/` (no `tailwind.config.*`) |
| Data / ORM | Prisma 7.8.0 + PostgreSQL (`@prisma/adapter-pg`); MDX under `content/` when `CONTENT_SOURCE=mdx` |
| Auth | NextAuth v5 (`5.0.0-beta.30`) — GitHub + Google; production email/GitHub-ID allowlist |
| Validation | Zod 4.4.3 |
| Media | `@vercel/blob` 2.5.0 (presigned upload) |
| PDF | `@react-pdf/renderer` 4.5.1 |
| Unit tests | Vitest 3.2.4, node + jsdom (`*.test.tsx`) |
| E2E | Playwright 1.63 (`e2e/`) |
| Lint / format | ESLint 9 + `eslint-config-next` 16.2.9 |
| Package manager | yarn (`yarn.lock`) |
| Deploy | Vercel |

---

## Directory layout

```
src/
├── app/
│   ├── (public)/              # /, /work, /journal, /engineering, /focus, /stack, /resume, /contact
│   ├── (admin)/               # /login, /admin/* (auth required under /admin)
│   ├── api/                   # auth, health, media/upload, og, resume/pdf, site-icon, work
│   ├── globals.css            # imports ui/tokens + page grid + print
│   └── layout.tsx             # root layout, fonts
├── actions/                   # Server Actions — CMS mutations + public contact/reactions
├── features/                  # domain UI — app routes compose these
│   ├── landing/               # UI at root; query/ (codeTypingQuery); tests/
│   ├── work/                  # UI at root; query/ (workQuery); tests/
│   ├── contact/               # UI at root; query/ (contactQuery); tests/
│   ├── journal/ | engineering/ | focus/ | stack/ | resume/
│   ├── admin-shell/           # CMS chrome (AdminShell, nav, breadcrumb)
│   ├── admin-dashboard/ | admin-login/ | admin-work/ | admin-journal/
│   ├── admin-engineering/ | admin-resume/ | admin-pages/ | admin-media/
│   └── admin-taxonomy/ | admin-messages/
├── components/
│   ├── ui/                    # design system (flat folder today); tests/ + tokens/tests/
│   └── admin/                 # shared CMS widgets used by 2+ admin features
├── lib/
│   ├── content/               # content switch + site-config (no component registry)
│   ├── data/                  # DAL — only Prisma import surface
│   ├── db/                    # Prisma client singleton
│   ├── auth/                  # NextAuth config + session helpers
│   ├── actions/               # requireAdminSession, createRevision
│   ├── admin/                 # CMS helpers (theme, landing hero, mappers, client-list)
│   ├── contact/               # anti-abuse / honeypot helpers
│   ├── format/                # pure formatters
│   ├── landing/               # landing helpers
│   ├── media/                 # upload helpers
│   └── resume/                # PDF document + data fetcher
├── providers/                 # AppProvider
├── types/                     # all TypeScript types (`shared/` for cross-domain)
├── constants/
│   └── tests/
├── validators/                # Zod schemas; tests in validators/tests/
└── env.ts

content/                       # Git-MDX — outside src/ by design
├── work/
├── journal/
└── engineering/

prisma/
├── schema.prisma
├── prisma.config.ts
└── seed.ts

docs/
├── ARCHITECTURE.md            # this file
└── DESIGN_SYSTEM.md

e2e/                           # Playwright specs (public routes + CMS publish)

requirement/                   # local-only planning (gitignored)
design/                        # local-only mockups (gitignored)
```

**Deviations from the AGENTS.md default folder structure:**

- `src/features/` — **present.** Public domains are unprefixed (`landing`, `work`, …). Admin CMS screens use an `admin-*` prefix so they do not sit in the same folder as the public page for that domain (different routes, different chrome). `app/` stays thin: fetch + compose. Inside a feature: **UI at the root**, **`query/`** for pure modules + hooks, **`tests/`** for every `*.test.ts(x)`. Do not mix tests or query files into the screen listing.
- `src/components/admin/` — extra vs default. Shared CMS widgets (`AdminFormField`, `ContentListClient`, `MediaGrid`, `MediaPickerDialog`) used by two or more admin features. Not the design system: they may import Server Actions. Do not add public-site UI here.
- `src/components/ui/` — **barrel + tokens present.** Components still sit in a flat folder (no `core/` groups). Tests live in `ui/tests/`; token CSS tests in `ui/tokens/tests/`. No `ui/types.ts` yet — prop types live in `src/types/` or inline. See [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md).
- `docs/` — committed inspectable docs only (`ARCHITECTURE.md`, `DESIGN_SYSTEM.md`). Do not add reference `.md` next to source. Local planning: `requirement/`. Skills: `.claude/skills/`.
- `e2e/` — Playwright. Public-route spec always runs; CMS publish spec needs `CONTENT_SOURCE=db` + `DATABASE_URL` (CI e2e job provides Postgres).
- Extra vs default: `src/providers/`, `src/components/admin/`, `src/lib/{admin,auth,content,data,db,media,resume,landing,contact,format,actions}/`, repo-root `content/`, `prisma/`, `scripts/`.
- `src/lib/utils.ts` re-exports `cn` from `components/ui/helpers.ts` so the shadcn CLI keeps working. Application code imports `cn` from `@/components/ui`.

---

## Layering & import rules

Dependencies flow **downward only** — a layer may import from anything below it, never above.

```
app (route files, layouts, metadata)
  → features | actions
    → components/admin | lib | components/ui | types | constants | validators | env
      → (node / Prisma / Next only inside lib/data, lib/db, lib/auth)
```

- **`app/`** composes pages. It holds routing, metadata, and data fetching that calls `getContentSource()` / DAL / site-config. It may import any feature. It must not grow new business logic that belongs in `lib/` or a feature folder. Cross-feature UI is composed here (e.g. home page passes `ContactForm` into `LandingBlocks`).
- **`features/`** — one folder per domain screen. May import `lib/`, `components/ui/`, `components/admin/`, `types/`, `constants/`, `validators/`, `actions/`. Must not import `app/` or another feature folder.
- **`components/admin/`** — shared CMS widgets. May import `actions/`, `lib/`, `components/ui/`. Must not import `features/` or `app/`.
- **`actions/`** — Server Actions. Admin actions: session → Zod → DAL → revision → `revalidatePath`. Public: `submitContact`, `addReaction`. Do not import from `app/` or features.
- **`lib/`** — shared logic. `lib/data/*.data.ts` is the **only** allowed Prisma import surface. `lib/content/source.ts` is the **only** content-read entry for pages. `lib/` must not import `app/`, `features/`, or `components/admin/`.
- **`components/ui/`** — design system. Must not import from `app/`, `features/`, or `components/admin/`. Must not import `lib/` except the documented `Footer` → `lib/content` fetch (move when Footer becomes presentational). `cn` lives in `ui/helpers.ts`. Client-safe components export from `index.ts`; `Footer` exports from `server.ts`.
- **`types/`, `constants/`, `validators/`, `env.ts`** — depended on; they import nothing from features, pages, or `components/ui/`.

---

## Path aliases

Configured in **both** `tsconfig.json` (`compilerOptions.paths`) and `vitest.config.ts` (`resolve.alias`).

| Alias | Resolves to |
|---|---|
| `@/*` | `./src/*` |
| `@prisma/client` | `./node_modules/.prisma/client/index.d.ts` (tsconfig only) |

Prefer aliases over `../../..` relative chains across layers. Relative imports are fine **within** one feature/module folder.

UI imports go through `@/components/ui` (client-safe barrel). Async Server UI (`Footer`) goes through `@/components/ui/server` so client modules do not pull `server-only`. Do not import `@/components/ui/Button`.

---

## Styling model

Concrete instantiation of AGENTS.md's Design Tokens rule. Full inventory: [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md).

1. **Tokens are the source of truth** — CSS custom properties in `src/components/ui/tokens/*.css` (`:root` plus `@theme inline` bridges). Full inventory: [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md).
2. **The utility layer maps the tokens** — Tailwind v4 `@theme inline` in the token files so `bg-primary` resolves to `var(--primary)`. No `tailwind.config.*`; PostCSS is `postcss.config.mjs` → `@tailwindcss/postcss`.
3. **CMS theme** — `/admin/pages/site` can override a subset of tokens via `src/lib/admin/site-theme.ts` (inline styles on `<html>`). Defaults in that file must stay in sync with `tokens/colors.css`.
4. **Arbitrary one-off values** are allowed for genuine one-offs only. Repeated `text-black` / `bg-white` on admin cards should become tokens, not copy-paste.
5. **Inline `style={{}}`** is reserved for values Tailwind cannot emit from a runtime number — `DataTable` / `FormSection` `gridTemplateColumns` is the current case.

Do **not** add a new global CSS file or component-level `.css` file. Extend `src/components/ui/tokens/` or `@theme` instead. `globals.css` stays the import + app-shell file.

---

## Data & content layer

Not fixtures — live MDX and/or Postgres.

- **Read switch:** `src/lib/content/source.ts` → `getContentSource()` picks `mdx-source.ts` or `db-source.ts` from `env.contentSource`.
- **Contract:** `src/types/content.types.ts` (`getAllWork` / `getWorkBySlug`, journal, engineering).
- **Also env-switched (not only `ContentSource`):** `site-config.ts` (brand/SEO/theme/footer/nav), `page-sections.ts` (landing/focus/stack JSON).
- **Landing blocks:** `src/features/landing/landing-registry.ts` maps block `type` → presentational section. `LandingBlocks` still switches on type so the home page can inject `ContactForm` from `features/contact` (features must not import each other).
- **Feature query modules:** filter / payload / list-mapping logic lives in `query/<feature>Query.ts` (no React). A thin `query/use<Feature>Query.ts` is the only React binding. Screens at the feature root import from `./query/…`. Shared list helpers used by more than one admin editor (`omitClientIds`, `moveItemByClientId`, `findMediaOption`) live in `src/lib/admin/`. Tests for those modules live in the same feature's `tests/` folder.
- **Writes:** Server Actions → DAL. Production must not write MDX on Vercel — draft/publish is DB-backed when `CONTENT_SOURCE=db`.
- **DAL:** `src/lib/data/*.data.ts` (see AGENTS.md Project-Specific Overrides for the file → entity table).
- Presentation values derived from data are **pure helpers** in `src/lib/` or `src/constants/`, with tests in that module's `tests/` folder — never duplicated inline in a screen.

---

## Routing

`src/app` is the route table. `(public)/layout.tsx` wraps the public chrome (nav/footer). `(admin)/admin/layout.tsx` gates the CMS.

### Public (`src/app/(public)/`)

| Route | File |
|---|---|
| `/` | `page.tsx` |
| `/work` | `work/page.tsx` |
| `/work/[slug]` | `work/[slug]/page.tsx` |
| `/journal` | `journal/page.tsx` |
| `/journal/posts/[slug]` | `journal/posts/[slug]/page.tsx` |
| `/engineering` | `engineering/page.tsx` |
| `/engineering/architecture` | `engineering/architecture/page.tsx` |
| `/engineering/decisions` | `engineering/decisions/page.tsx` |
| `/engineering/performance` | `engineering/performance/page.tsx` |
| `/focus` | `focus/page.tsx` |
| `/stack` | `stack/page.tsx` |
| `/resume` | `resume/page.tsx` |
| `/contact` | `contact/page.tsx` |

### Admin (`src/app/(admin)/`)

| Route | File |
|---|---|
| `/login` | `login/page.tsx` |
| `/admin` | `admin/page.tsx` (dashboard) |
| `/admin/work` | list / `new` / `[id]/edit` |
| `/admin/journal` | list / `new` / `[id]/edit` |
| `/admin/engineering` | list / `new` / `[id]/edit` |
| `/admin/resume` | `admin/resume/page.tsx` |
| `/admin/pages` | hub + `landing` / `focus` / `stack` / `site` |
| `/admin/media` | media library |
| `/admin/taxonomy` | domains |
| `/admin/messages` | contact inbox |

### API (`src/app/api/`)

| Route | Role |
|---|---|
| `/api/auth/[...nextauth]` | NextAuth |
| `/api/health` | Keep-alive (Vercel Cron `0 3 * * *` UTC) |
| `/api/media/upload` | Presigned Blob upload (session-gated) |
| `/api/og` | Open Graph image |
| `/api/resume/pdf` | Live resume PDF |
| `/api/site-icon` | CMS favicon proxy (`/favicon.ico` rewrite) |
| `/api/work` | Work listing API |

No `middleware.ts` at the repo root — the admin gate is the `(admin)/admin` layout.

---

## Testing

- **Unit:** `src/**/tests/*.test.ts`. Vitest node env. Feature query modules (`work/query/workQuery`, `admin-messages/query/messagesQuery`, `landing/query/codeTypingQuery`, `*FormQuery`, `admin-pages/query/{site,landing,stack}PageQuery`, `contact/query/contactQuery`) and shared admin list helpers (`client-list`, `map-media-options`) are covered here.
- **Hook:** `src/**/tests/use*Query.test.tsx` (jsdom). Proves the hook binds React state to the pure module — it does not re-test filter/payload math. Current: `useWorkQuery`, `useMessagesQuery`, `useCodeTypingQuery`.
- **Component:** `src/**/tests/*.test.tsx`, jsdom + Testing Library. Current set: `Button`, `StatusBadge`, `ConfirmDialog`, `Toast`, `PageRouteHeader`, `FormActions`, `LoadingScreen`, `TagInput`, `NavBar`, `LoginPanel`, `WorkListSection`. Remaining feature screens are still a gap.
- **E2E:** Playwright in `e2e/`. `e2e/public-content.spec.ts` covers primary-nav → `/work` → open a case study, domain filter `aria-pressed`, `/login` heading, and contact submit (skipped without `DATABASE_URL`). Hydration wait on `/` is the hero code filename (`/\.config\.ts/i`) — MDX default is `engineer.config.ts`, DB seed is `developer.config.ts`. `e2e/cms-publish-work.spec.ts` is the critical CMS flow: ungated `/admin/work/new` → Publish → public `/work/[slug]` 200, and Save draft → public slug shows Next's not-found UI (HTTP status may be 200). The spec skips unless `CONTENT_SOURCE=db` and `DATABASE_URL` are set, and skips if `/admin` redirects to OAuth login. Required work-form fields use `getByRole('textbox', { name: '<Label> *', exact: true })`; stack uses `getByRole('textbox', { name: 'Stack' })` from `TagInput` `ariaLabel`. CI e2e seeds from MDX after `prisma db push`.
- Config: `vitest.config.ts` uses two projects — unit (`*.test.ts`, node) and component (`*.test.tsx`, jsdom). Playwright: `playwright.config.ts` (Chromium 1440×900 so `NavBar` Primary is `xl:flex`), run `yarn test:e2e`. `PORT` overrides the local webServer port.
- Run: `yarn` · `yarn test` · `yarn test:e2e` · `yarn build` · `yarn lint` · `yarn type-check`
- CI: `.github/workflows/ci.yml` graph is `First-Notify-Discord` ∥ `Run-Node-Tests` → `E2E-Tests` → `Deploy-Notify-Discord` → `Vercel-Production` → `Second-Notify-Discord`. Discord posts three embeds via `.github/scripts/notify-discord.sh`: **started** (event, author, branch, commit), **tests passed** (check/e2e + production vs preview target), **done** (live URL or failure; title click opens the deploy URL when present). Notify jobs use `continue-on-error` and do not gate deploy — `Vercel-Production` runs when `check` and `e2e` succeed even if Discord returns 403. `check` is lint/type-check/unit/build; e2e uses Postgres + `prisma db push` + Playwright Chromium (admin stays ungated because `NEXTAUTH_SECRET` is unset). After tests pass, Actions writes `.vercel/project.json` from secrets and runs `vercel deploy --yes` (`--prod` only on push to `main`; preview otherwise). It does **not** use `vercel pull` — that command returns "Could not retrieve Project Settings" for project-scoped tokens. `vercel.json` sets `git.deploymentEnabled: false` so Vercel Git does not also deploy that commit. Required GitHub secrets: `DISCORD_WEBHOOK_URL`, `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.

---

## Accessibility commitments

App-shell guarantees that must not regress:

- Public `NavBar` → `aria-label` / `aria-expanded` / `aria-controls` / Escape-to-close on the mobile menu; decorative rules `aria-hidden`
- `Button` → `data-slot="button"`, `focus-visible` ring, `aria-invalid` styles
- `ConfirmDialog` → `role="dialog"`, `aria-modal`, `aria-labelledby`
- `Toast` → `role="status"`, `aria-live="polite"`
- `StatusBadge` → `data-status`
- Landing motion → `prefers-reduced-motion: reduce` disables animations in `tokens/motion.css`
- Print → `[data-noprint]` hidden (`ResumeSavePdfButton`)

Component-level contracts (and known holes) live in [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) → Accessibility contract.

Full conformance to any accessibility standard cannot be claimed from automated checks alone — assistive-technology testing and expert review are still required before that claim is made.

---

## Known gaps / substitutions / tech debt

- **`src/features/` exists** with `query/` + `tests/` splits on work, messages, landing typing, CMS content forms, site/landing/stack page editors, and contact submit. Remaining screens without a query module: journal/engineering public lists, focus page editor, landing hero meta list, resume forms, media library, taxonomy, dashboard.
- **`tests/*.test.tsx` per remaining screen** is still a gap (RTL is installed; add tests as those screens are touched).
- **No UI `core/` grouping / `ui/types.ts`** — barrel and token files exist; components remain flat. See DESIGN_SYSTEM.md Status.
- **`cn()` lives in `src/components/ui/helpers.ts`** — `src/lib/utils.ts` is a shadcn CLI re-export only.
- **`Footer` fetches CMS data** — a `ui/` component importing `lib/content`. Exported from `@/components/ui/server` so the client barrel stays client-safe. Should become a presentational footer fed by the layout (then it can join `index.ts`).
- **Inline prop interfaces** in several UI files (AGENTS.md Type Rules). New types go in `src/types/`.
- **CMS publish e2e is env-gated** — needs `CONTENT_SOURCE=db` + Postgres; OAuth login is not automated (spec skips if `/admin` redirects to `/login`). Draft-not-public asserts the not-found UI, not HTTP 404 — Next can serve that UI with status 200.
- **Admin light cards** often use `text-black` / `bg-white` instead of semantic tokens; `LoginPanel` uses GitHub/Google brand hex.
- **Elevation token file is empty**; landing motion durations live in `tokens/motion.css`. Arbitrary `text-[13px]` / `gap-[18px]` still appear in admin chrome.
- **Legacy git branch `Ruj`** — retired as the working branch; new work is `feat/`/`fix/`/… from `main` via PR (AGENTS.md Git Workflow).
