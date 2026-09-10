# Design System (`src/components/ui`)

The local, editable design system for FEOps Kit. Primitives (`Button`, `Badge`, `Skeleton`, `dropdown-menu`) come from shadcn/ui **base-nova** on `@base-ui/react`; the rest are project-built public and admin helpers extracted from the site mockups.

> `src/components/ui` is **self-contained** except `Footer`, which still reads site-config (`lib/content`) — that fetch belongs in the public layout. `cn()` lives in `helpers.ts` inside this folder.
>
> CMS widgets shared by two or more admin features (`AdminFormField`, `ContentListClient`, `MediaGrid`, `MediaPickerDialog`) live in **`src/components/admin/`**, not here. That folder may import Server Actions; this one must not.

## Import surface

Presentational and client-safe components are re-exported from `index.ts` — always import those from `@/components/ui`:

```tsx
import { Button, Card, cn } from '@/components/ui'
import type { DataTableRow } from '@/components/ui'
```

Async Server Components that fetch (`Footer` today) live on a second barrel so a client import of `@/components/ui` does not pull `server-only`:

```tsx
import { Footer } from '@/components/ui/server'
```

Do not import a component's own file (`@/components/ui/Button`). Inside `src/components/ui/`, use relative imports (`./Button`, `./helpers`) so the barrels do not import themselves.

`src/lib/utils.ts` re-exports `cn` for the shadcn CLI (`components.json` `aliases.utils`). Application code should still import `cn` from `@/components/ui`.

---

## Folder map

```
src/components/ui/
  index.ts          client-safe barrel — components, cn, DataTable types
  server.ts         server-only barrel — Footer (keeps `server-only` off the client graph)
  helpers.ts        cn() — className merge (clsx + tailwind-merge)
  helpers.test.ts
  tokens/
    colors.css      :root palette + @theme color bridges + .admin-theme
    typography.css  @theme font bridges
    radius.css      --radius + @theme radius scale
    spacing.css     --grid-size
    elevation.css   empty — promote repeated shadows here
    motion.css      landing motion tokens + keyframes
    tokens.test.ts
  Badge.tsx … Toast.tsx, dropdown-menu.tsx   still flat (grouping later)
```

Suggested grouping when a later pass lands: **core** (Button, Card, Badge, Skeleton, Container), **navigation** (NavBar, NavBarLink, Footer, PageRouteHeader, SectionHeader, SectionHeading), **forms** (FormActions, FormSection, TagInput, ImagePicker, InlineEditRow), **data** (DataTable, ChipList, ReorderableList, StatusBadge), **feedback** (ConfirmDialog, Toast, LoadingScreen), **overlays** (dropdown-menu).

---

## Design tokens

Tokens are the source of truth. They are declared as custom properties in `src/components/ui/tokens/*.css` and mapped into Tailwind v4 by `@theme inline` in those same files, so a utility class like `bg-primary` resolves to `var(--primary)`. `src/app/globals.css` only imports Tailwind/shadcn and the token files, then applies app-shell rules (page grid, print). There is no `tailwind.config.*`. PostCSS: `postcss.config.mjs` → `@tailwindcss/postcss`.

CMS `/admin/pages/site` may override a subset (`primary`, `background`, `foreground`, `success`, `destructive`) via `src/lib/admin/site-theme.ts`. Defaults in that file must stay in sync with `tokens/colors.css`.

| File | What it defines |
|---|---|
| `tokens/colors.css` | Raw oklch palette, `@theme` colour bridges, `.admin-theme` light-card overrides |
| `tokens/typography.css` | `@theme` font bridges (`--font-sans` / `--font-mono` from `layout.tsx`) |
| `tokens/radius.css` | `--radius` and the `--radius-sm` … `--radius-4xl` scale |
| `tokens/spacing.css` | `--grid-size` (page grid overlay) |
| `tokens/elevation.css` | none yet — promote a repeated shadow here |
| `tokens/motion.css` | `--motion-duration-*`, `--motion-ease-out`, landing motion classes, `prefers-reduced-motion` |
| `src/app/globals.css` | `@import` of the token files + `@layer base` grid overlay + print |
| `src/lib/admin/site-theme.ts` | `DEFAULT_SITE_THEME` + picker hex aliases (must match `colors.css`) |
| `src/app/layout.tsx` | Next font CSS variables (`--font-sans` Poppins, `--font-geist-mono`) |

**Colour tokens** (`:root`):

| Token | Typical utility | Role |
|---|---|---|
| `--background` | `bg-background` | Page canvas (dark-first) |
| `--foreground` | `text-foreground` | Body / heading text |
| `--card` / `--card-foreground` | `bg-card` `text-card-foreground` | Cards, popovers |
| `--popover` / `--popover-foreground` | `bg-popover` | Menus |
| `--primary` / `--primary-foreground` | `bg-primary` `text-primary` | Accent, buttons, links |
| `--secondary` / `--secondary-foreground` | `bg-secondary` | Secondary fills |
| `--muted` / `--muted-foreground` | `bg-muted` `text-muted-foreground` | Quiet text, skeletons |
| `--accent` / `--accent-foreground` | `bg-accent` | Hover/accent fills |
| `--destructive` | `text-destructive` `bg-destructive/10` | Errors, unavailable |
| `--success` / `--success-foreground` | `text-success` `bg-success/10` | Published, available |
| `--warning` / `--warning-foreground` | `text-warning` | Draft status |
| `--border` `--input` `--ring` | `border-border` `ring-ring` | Chrome + focus |
| `--chart-1` … `--chart-5` | `bg-chart-1` … | Charts (reserved) |
| `--sidebar*` | `bg-sidebar` … | Sidebar (shadcn map; public site uses the page background) |
| `--grid-line` | (base `html::before`) | Fixed page grid overlay |

**Radius:** `--radius: 0.5rem`. `@theme` derives `--radius-sm` … `--radius-4xl`. Utilities: `rounded-sm` … `rounded-4xl`, `rounded-lg` on cards.

**Fonts:** `--font-sans` (Poppins), `--font-mono` / `--font-geist-mono` (Geist Mono), `--font-heading` (same as sans). Utilities: `font-sans`, `font-mono`.

**Spacing / elevation / motion files:** none. Spacing is Tailwind defaults plus one-off arbitrary values (`pt-[70px]`, `gap-[18px]`). Shadows are ad hoc (`shadow-lg`, `rgba(0,0,0,0.25)` on ConfirmDialog). Motion: landing classes `landing-motion-fade-up` / `fade-in` / `fade-right` / `line-grow` with `--landing-motion-delay`; durations 0.95s–1.2s in `globals.css`.

**Utility-class aliases** you'll use most:

- Colour: `bg-background`, `bg-card`, `bg-primary`, `text-foreground`, `text-muted-foreground`, `text-primary`, `text-success`, `text-warning`, `border-border`
- Radius: `rounded-lg`, `rounded-xl`, `rounded-md`
- Font: `font-sans`, `font-mono`
- Motion: `landing-motion-fade-up` + `landing-motion-run`

Adjust a design value by editing `globals.css` (and `site-theme.ts` if it is a CMS-overridable colour). **Do not** add a new global or per-component CSS file — see AGENTS.md's Design Tokens rule.

---

## Shared types

Target: one `src/components/ui/types.ts`. Today, some prop types live in `src/types/` (`BadgeProps`, `NavBarProps`, `ContainerProps`, `PageRouteHeaderProps`, `SectionHeaderProps`, `NavBarLinkProps`); others are still inline in the component file.

There is no shared `Size` / `Tone` union across the library. Closest existing unions:

```ts
type BadgeVariant = 'default' | 'outline' | 'success' | 'domain'
type ButtonVariant = 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive' | 'link'
type ButtonSize = 'default' | 'xs' | 'sm' | 'lg' | 'icon' | 'icon-xs' | 'icon-sm' | 'icon-lg'
type PublishStatus = 'PUBLISHED' | 'DRAFT'
```

Do not invent a parallel `Tone` type in a one-off PR — introduce it when grouping `ui/` if several components need the same set.

---

## Component reference

Import from `@/components/ui` (or `@/components/ui/server` for `Footer`).

### Core

#### Button

shadcn/Base UI button. `data-slot="button"`.

- `variant` (`default`) · `outline` · `secondary` · `ghost` · `destructive` · `link`
- `size` (`default`) · `xs` · `sm` · `lg` · `icon` · `icon-xs` · `icon-sm` · `icon-lg`
- Also accepts Base UI `Button` props. `focus-visible` ring + `aria-invalid` styles are part of the a11y contract.

```tsx
<Button variant="outline" size="sm">Save draft</Button>
```

#### Card

Bordered card shell. `bg-card border-border rounded-lg p-5`. Extra HTML div attributes via spread.

```tsx
<Card>…</Card>
```

#### Badge

Small uppercase chip.

- `variant` (`default`) · `outline` · `success` · `domain`
- Spreads `HTMLSpanElement` attrs (`className`, …)

```tsx
<Badge variant="domain">Product</Badge>
```

#### Skeleton

Pulse placeholder (`bg-muted`). Pass `className` for size.

```tsx
<Skeleton className="h-4 w-32" />
```

#### Container

Public page width wrapper: `max-w-6xl px-6`.

- `children` · `className`

```tsx
<Container>…</Container>
```

#### LoadingScreen

Full-viewport spinner + “Loading” label. No props.

```tsx
<LoadingScreen />
```

### Navigation

#### NavBar

Public sticky header: brand, availability, desktop links, mobile menu.

- `items` (`readonly NavItem[]`) · `brand` (`SiteBrand`) · `className`
- Client component. Mobile menu: `aria-expanded` / `aria-controls` / Escape closes.

```tsx
<NavBar items={navItems} brand={brand} />
```

#### NavBarLink

Active-path-aware mono nav link (`pathname === href` or prefix).

- `href` · `label` · `className`

```tsx
<NavBarLink href="/work" label="Work" />
```

#### Footer

Async server component. Import from `@/components/ui/server`, not the client barrel. Reads copyright, contact, social from `getSiteFooter` / `getSiteContact` / `getSiteSocialLinks`. No props. **Layering debt:** a `ui/` primitive should not fetch — feed data from the public layout in a later pass.

```tsx
import { Footer } from '@/components/ui/server'
<Footer />
```

#### PageRouteHeader

Public route hero: mono path, title, optional description / trailing.

- `path` · `title` · `description` · `trailing` · `className`

```tsx
<PageRouteHeader path="/work" title="Selected work" description="…" />
```

#### SectionHeader

Public section title with a mono number.

- `number` · `title` · `trailing` · `className`

```tsx
<SectionHeader number="01" title="Case studies" trailing="2024–26" />
```

#### SectionHeading

Admin page heading.

- `kicker` · `title` · `action` (optional node)

```tsx
<SectionHeading kicker="CMS" title="Work" action={<Button>New</Button>} />
```

### Forms

#### FormActions

Admin Publish / Save draft / optional Preview / Cancel row.

- `onPublish` · `onSaveDraft` · `onCancel` · `onPreview` · `isSubmitting` (`false`)

```tsx
<FormActions onPublish={…} onSaveDraft={…} onCancel={…} />
```

#### FormSection

Admin form card with mono label + CSS grid.

- `label` · `columns` (`1fr 1fr`) · `children`
- `columns` is applied as inline `gridTemplateColumns` (runtime grid — allowed inline style).

```tsx
<FormSection label="Metadata">{/* fields */}</FormSection>
```

#### TagInput

Enter-to-add chips; each chip has a remove control labelled `Remove {tag}`.

- `tags` · `onChange` · `placeholder` (`Type and press Enter…`)

```tsx
<TagInput tags={tags} onChange={setTags} />
```

#### ImagePicker

Cover image: preview, optional upload, pick-from-library, remove.

- `imageUrl` · `altText` · `uploadEnabled` (`false`) · `isUploading` (`false`) · `onUpload` · `onPickFromMedia` · `onRemove` · `className`

```tsx
<ImagePicker imageUrl={url} onPickFromMedia={openLibrary} onRemove={clear} />
```

#### InlineEditRow

Taxonomy-style row: blur-to-save label, sort order, reference count, delete (disabled when `referenceCount > 0`).

- `id` · `label` · `sortOrder` · `referenceCount` · `onLabelChange` · `onDelete`

```tsx
<InlineEditRow id={id} label="Product" sortOrder={1} referenceCount={0} onLabelChange={…} onDelete={…} />
```

### Data

#### DataTable

Admin content table: title/text/badge/chips/custom cells + Edit / Publish|Unpublish / Delete.

- `columns` · `rows` · `gridTemplate` (inline grid) · `onEdit` · `onTogglePublish` · `onDelete`
- Row `status`: `PUBLISHED` | `DRAFT`

```tsx
<DataTable columns={cols} rows={rows} gridTemplate="2fr 1fr 1fr 140px" onEdit={…} onTogglePublish={…} onDelete={…} />
```

#### ChipList

Renders string chips (used inside DataTable cells).

- `items` (`readonly string[]`)

```tsx
<ChipList items={['Next.js', 'Prisma']} />
```

#### StatusBadge

Published / Draft pill. `data-status` is `"published"` or `"draft"`.

- `status`: `'PUBLISHED' | 'DRAFT'`

```tsx
<StatusBadge status="PUBLISHED" />
```

#### ReorderableList

Ordered admin list with up / down / remove / add.

- `label` · `items` · `onMoveUp` · `onMoveDown` · `onRemove` · `onAdd` · `renderExtra`

```tsx
<ReorderableList label="Experience" items={items} onMoveUp={…} onMoveDown={…} onRemove={…} onAdd={…} />
```

### Feedback / overlays

#### ConfirmDialog

Modal confirm. Overlay click and Escape cancel. Panel is `role="dialog"` with `aria-modal` and `aria-labelledby` pointing at the title.

- `open` · `title` · `body` · `confirmLabel` (`Confirm`) · `onConfirm` · `onCancel`

```tsx
<ConfirmDialog open={open} title="Delete?" body="This cannot be undone." onConfirm={…} onCancel={…} />
```

#### Toast

Auto-dismiss bottom toast. `role="status"` and `aria-live="polite"`.

- `message` · `open` · `onClose` · `duration` (`3000`)

```tsx
<Toast message="Saved" open={open} onClose={…} />
```

#### DropdownMenu

shadcn-style menu on `@base-ui/react/menu`. Exports: `DropdownMenu`, `DropdownMenuPortal`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuGroup`, `DropdownMenuLabel`, `DropdownMenuItem`, `DropdownMenuCheckboxItem`, `DropdownMenuRadioGroup`, `DropdownMenuRadioItem`, `DropdownMenuSeparator`, `DropdownMenuShortcut`, `DropdownMenuSub`, `DropdownMenuSubTrigger`, `DropdownMenuSubContent`.

Uses `data-slot`, `data-open` / `data-closed`, `data-variant`, `data-inset`. Import the named exports from `@/components/ui` (the source file is kebab-case `dropdown-menu.tsx`).

```tsx
<DropdownMenu>
  <DropdownMenuTrigger render={<Button variant="ghost" />}>Open</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Edit</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

---

## Class-string / derivation helpers

| Helper | Returns | Use |
|---|---|---|
| `cn(...inputs)` | merged class string | All className composition — `src/components/ui/helpers.ts`, re-exported from the barrel |
| `buttonVariants({ variant, size, className })` | class string | Button CVA — exported from the barrel |
| `badgeVariants({ variant })` | class string | Badge CVA — exported from the barrel |
| `getSiteAvailabilityDisplay(isAvailable)` | label + tone for the nav availability chip | `src/constants/site-availability.ts` (not inside `ui/`) |
| `toThemePickerHex(value, fallback)` | hex string | Native `<input type="color">` when stored value is oklch — `site-theme.ts` |

Runtime-numeric derivations (`DataTable.gridTemplate`, `FormSection.columns`) return / apply a `style` object because the utility layer can't emit an arbitrary class from a runtime value — that's the one exception to "no inline style" (see ARCHITECTURE.md's Styling model).

---

## Accessibility contract

The design system carries these guarantees; do not regress them:

- `NavBar` → primary/mobile labelling, `aria-expanded` / `aria-controls`, Escape closes the menu, decorative rules `aria-hidden`
- `Button` → `data-slot="button"`, visible focus ring, `aria-invalid` border/ring
- `ConfirmDialog` → `role="dialog"`, `aria-modal`, `aria-labelledby`
- `Toast` → `role="status"`, `aria-live="polite"`
- `StatusBadge` → `data-status="published" | "draft"`
- `TagInput` → remove buttons labelled `Remove {tag}`
- `dropdown-menu` → Base UI `data-slot` / open-state attrs; keep keyboard behaviour from the primitive
- Landing motion (global, not a component) → `prefers-reduced-motion` disables animation
- Print → `[data-noprint]` hidden

**Known holes (do not claim these work):**

- `ImagePicker`, `DataTable`, `FormActions` → little/no explicit `aria-*`

**Test at the semantic layer** — roles, labels, `aria-*`, and stable `data-*` hooks. Do not assert on utility-class strings in component/screen tests (a helper's own unit test may assert its returned class string, since that string is the helper's actual contract — see AGENTS.md's Testing Conventions). When a component's status matters, expose `data-status` (e.g. `StatusBadge`) rather than inferring from colour.

---

## Adding or changing a component

1. Add the file under `src/components/ui/` (flat until grouping lands). One component per file, PascalCase, except the existing `dropdown-menu.tsx`.
2. Add/extend its prop interface in `src/types/<name>.types.ts` — not inline in a new file. (Existing inline props are debt; don't add more.)
3. Export it from `index.ts` (keep related exports grouped) unless it is an async Server Component that fetches or imports `server-only` — those go on `server.ts`. Consumers import from `@/components/ui` or `@/components/ui/server`, never a component file.
4. Style with token utility classes (`bg-card`, `text-muted-foreground`, `border-border`). Add a token in `src/components/ui/tokens/` first if a value is missing — never hardcode (see AGENTS.md's Design Tokens rule). If the colour is CMS-overridable, update `site-theme.ts` in the same PR.
5. Add a colocated `*.test.tsx` asserting semantics and any `data-*`/ARIA contract (Vitest jsdom + Testing Library).
6. There is no gallery/playground route. Preview on the public or admin screen that uses the component.
7. Update this file's component reference (and token table if tokens changed) in the same PR.
8. Run `yarn test`, `yarn build`, `yarn lint` before declaring done.

---

## Status / gaps

- **Fully styled and in use:** Button, Card, Badge, Skeleton, Container, NavBar, NavBarLink, Footer, PageRouteHeader, SectionHeader, SectionHeading, FormActions, FormSection, TagInput, ImagePicker, InlineEditRow, DataTable, ChipList, StatusBadge, ReorderableList, ConfirmDialog, Toast, LoadingScreen, DropdownMenu
- **Available, not yet used by any screen:** none known — don't add unused primitives "for later"
- **Ported but not yet finished:**
  - Components still sit in a flat folder (`core/` grouping not done)
  - No `ui/types.ts` — prop types live in `src/types/` or inline
  - `Footer` fetches instead of receiving props
  - Several prop interfaces still inline
- **Known substitutions:**
  - Admin light cards often use `text-black` / `bg-white` / `border-black/15` instead of semantic tokens (`.admin-theme` only remaps `--card`)
  - `LoginPanel` GitHub/Google brand hex (`#24292f`, Google SVG fills) — third-party marks, not theme tokens
  - Public lists use `border-white/16`, `hover:bg-white/[0.03]` alphas rather than named tokens
  - Elevation file is empty; arbitrary `text-[13px]` / `gap-[18px]` still appear in admin chrome
