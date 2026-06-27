import { PrismaClient } from '@prisma/client'
import fs from 'fs/promises'
import path from 'path'

const prisma = new PrismaClient()

// ---------------------------------------------------------------------------
// Minimal frontmatter parser (can't use @/ aliases in seed context)
// ---------------------------------------------------------------------------

interface ParsedMdx {
  slug: string
  frontmatter: Record<string, unknown>
  body: string
}

function parseFrontmatterValue(rawValue: string): unknown {
  if (rawValue === 'null') return null
  if (rawValue === 'true') return true
  if (rawValue === 'false') return false

  if (rawValue.startsWith('[') || rawValue.startsWith('{')) {
    try {
      return JSON.parse(rawValue) as unknown
    } catch {
      return rawValue
    }
  }

  const quotedMatch =
    rawValue.match(/^"(.*)"$/) ?? rawValue.match(/^'(.*)'$/)
  if (quotedMatch) return quotedMatch[1]

  return rawValue
}

function parseMdx(raw: string, slug: string): ParsedMdx {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!match) return { slug, frontmatter: {}, body: raw.trim() }

  const frontmatter: Record<string, unknown> = {}
  for (const line of match[1].split('\n')) {
    const sep = line.indexOf(':')
    if (sep === -1) continue
    const key = line.slice(0, sep).trim()
    const val = line.slice(sep + 1).trim()
    frontmatter[key] = parseFrontmatterValue(val)
  }

  return { slug, frontmatter, body: match[2].trim() }
}

async function readMdxDir(dir: string): Promise<ParsedMdx[]> {
  const fullPath = path.join(process.cwd(), 'content', dir)
  try {
    const entries = await fs.readdir(fullPath)
    return Promise.all(
      entries
        .filter((e) => e.endsWith('.mdx'))
        .map(async (e) => {
          const slug = e.replace(/\.mdx$/, '')
          const raw = await fs.readFile(path.join(fullPath, e), 'utf8')
          return parseMdx(raw, slug)
        })
    )
  } catch {
    return []
  }
}

function toInt(val: unknown): number {
  const n = parseInt(String(val), 10)
  return isNaN(n) ? 0 : n
}

function toStr(val: unknown): string {
  return String(val ?? '')
}

function toStrArray(val: unknown): string[] {
  if (Array.isArray(val)) return val.map(String)
  return []
}

type ContentStatus = 'DRAFT' | 'PUBLISHED'

function toStatus(val: unknown): ContentStatus {
  return toStr(val).toLowerCase() === 'published' ? 'PUBLISHED' : 'DRAFT'
}

type EngType = 'ARCHITECTURE' | 'DECISIONS' | 'PERFORMANCE'

function toEngType(val: unknown): EngType {
  const map: Record<string, EngType> = {
    architecture: 'ARCHITECTURE',
    decisions: 'DECISIONS',
    performance: 'PERFORMANCE',
  }
  return map[toStr(val).toLowerCase()] ?? 'ARCHITECTURE'
}

// ---------------------------------------------------------------------------
// 1. Seed Domains (from WORK_DOMAIN_FILTERS, excluding "ALL")
// ---------------------------------------------------------------------------

const DOMAIN_LABELS = ['Booking', 'CMS', 'Architecture', 'Multilingual', 'Performance', 'Platform']

async function seedDomains(): Promise<void> {
  console.log('Seeding domains...')
  for (let i = 0; i < DOMAIN_LABELS.length; i++) {
    await prisma.domain.upsert({
      where: { label: DOMAIN_LABELS[i] },
      update: { sortOrder: i },
      create: { label: DOMAIN_LABELS[i], sortOrder: i },
    })
  }
  console.log(`  ✓ ${DOMAIN_LABELS.length} domains`)
}

// ---------------------------------------------------------------------------
// 2. Seed Work case studies
// ---------------------------------------------------------------------------

async function seedWork(): Promise<void> {
  console.log('Seeding work case studies...')
  const files = await readMdxDir('work')

  for (const file of files) {
    const fm = file.frontmatter
    const domainLabels = toStrArray(fm.domains)

    await prisma.workCaseStudy.upsert({
      where: { slug: file.slug },
      update: {
        title: toStr(fm.title),
        status: toStatus(fm.status),
        sortOrder: toInt(fm.listId),
        role: toStr(fm.role),
        tagline: toStr(fm.tagline),
        metric: toStr(fm.metric),
        metricLabel: toStr(fm.metricLabel),
        year: toStr(fm.year),
        stack: toStrArray(fm.stack),
        context: toStr(fm.context),
        problem: toStr(fm.problem),
        constraints: toStr(fm.constraints),
        architecture: toStr(fm.architecture),
        decisions: toStr(fm.decisions),
        impact: toStr(fm.impact),
        body: file.body,
        publishedAt: toStatus(fm.status) === 'PUBLISHED' ? new Date() : null,
        domains: {
          set: domainLabels.map((label) => ({ label })),
        },
      },
      create: {
        slug: file.slug,
        title: toStr(fm.title),
        status: toStatus(fm.status),
        sortOrder: toInt(fm.listId),
        role: toStr(fm.role),
        tagline: toStr(fm.tagline),
        metric: toStr(fm.metric),
        metricLabel: toStr(fm.metricLabel),
        year: toStr(fm.year),
        stack: toStrArray(fm.stack),
        context: toStr(fm.context),
        problem: toStr(fm.problem),
        constraints: toStr(fm.constraints),
        architecture: toStr(fm.architecture),
        decisions: toStr(fm.decisions),
        impact: toStr(fm.impact),
        body: file.body,
        publishedAt: toStatus(fm.status) === 'PUBLISHED' ? new Date() : null,
        domains: {
          connect: domainLabels.map((label) => ({ label })),
        },
      },
    })
  }

  console.log(`  ✓ ${files.length} work case studies`)
}

// ---------------------------------------------------------------------------
// 3. Seed Journal posts
// ---------------------------------------------------------------------------

async function seedJournal(): Promise<void> {
  console.log('Seeding journal posts...')
  const files = await readMdxDir('journal')

  for (const file of files) {
    const fm = file.frontmatter

    const pull = fm.pull ? toStr(fm.pull) : null

    await prisma.journalPost.upsert({
      where: { slug: file.slug },
      update: {
        title: toStr(fm.title),
        status: toStatus(fm.status),
        sortOrder: 0,
        excerpt: toStr(fm.excerpt),
        body: file.body,
        tag: toStr(fm.tag),
        readTime: toStr(fm.readTime),
        pull,
        publishedAt: toStatus(fm.status) === 'PUBLISHED' ? new Date() : null,
      },
      create: {
        slug: file.slug,
        title: toStr(fm.title),
        status: toStatus(fm.status),
        sortOrder: 0,
        excerpt: toStr(fm.excerpt),
        body: file.body,
        tag: toStr(fm.tag),
        readTime: toStr(fm.readTime),
        pull,
        publishedAt: toStatus(fm.status) === 'PUBLISHED' ? new Date() : null,
      },
    })
  }

  console.log(`  ✓ ${files.length} journal posts`)
}

// ---------------------------------------------------------------------------
// 4. Seed Engineering notes
// ---------------------------------------------------------------------------

async function seedEngineering(): Promise<void> {
  console.log('Seeding engineering notes...')
  const files = await readMdxDir('engineering')

  for (const file of files) {
    const fm = file.frontmatter

    await prisma.engineeringNote.upsert({
      where: { slug: file.slug },
      update: {
        title: toStr(fm.title),
        status: toStatus(fm.status),
        sortOrder: toInt(fm.listId),
        type: toEngType(fm.type),
        summary: toStr(fm.summary),
        noteDate: toStr(fm.noteDate),
        readTime: toStr(fm.readTime),
        body: file.body,
        publishedAt: toStatus(fm.status) === 'PUBLISHED' ? new Date() : null,
      },
      create: {
        slug: file.slug,
        title: toStr(fm.title),
        status: toStatus(fm.status),
        sortOrder: toInt(fm.listId),
        type: toEngType(fm.type),
        summary: toStr(fm.summary),
        noteDate: toStr(fm.noteDate),
        readTime: toStr(fm.readTime),
        body: file.body,
        publishedAt: toStatus(fm.status) === 'PUBLISHED' ? new Date() : null,
      },
    })
  }

  console.log(`  ✓ ${files.length} engineering notes`)
}

// ---------------------------------------------------------------------------
// 5. Seed PageSections (landing, focus, stack, site)
// ---------------------------------------------------------------------------

async function seedPageSections(): Promise<void> {
  console.log('Seeding page sections...')

  const pages: Array<{ key: string; data: unknown }> = [
    {
      key: 'landing',
      data: {
        blocks: [
          {
            type: 'stats',
            enabled: true,
            order: 0,
            props: {
              items: [
                { value: '06', label: 'Case Studies' },
                { value: '04', label: 'Problem Domains' },
                { value: '5y', label: 'Shipping Products' },
                { value: '2', label: 'Languages — EN / TH' },
              ],
            },
          },
          {
            type: 'modules',
            enabled: true,
            order: 1,
            props: {
              items: [
                { num: '01', title: 'Work', desc: 'Case studies — architecture, decisions, and measured impact.', link: '/work', linkLabel: '6 ENTRIES', badge: 'LIVE' },
                { num: '02', title: 'Engineering', desc: 'Architecture notes, decision logs, and performance write-ups.', link: '/engineering', linkLabel: 'Notes' },
                { num: '03', title: 'Journal', desc: 'Working notes on building, learning, and shipping.', link: '/journal', linkLabel: 'Posts' },
                { num: '04', title: 'Focus', desc: 'What I am learning and building right now — the roadmap.', link: '/focus', linkLabel: 'Roadmap' },
                { num: '05', title: 'Stack', desc: 'Tools, workflow, and the setup behind the work.', link: '/stack', linkLabel: 'Tooling' },
                { num: '06', title: 'Résumé', desc: 'Experience and capabilities — print and PDF ready.', link: '/resume', linkLabel: 'CV / PDF' },
              ],
            },
          },
          {
            type: 'techStack',
            enabled: true,
            order: 2,
            props: {
              items: ['Next.js', 'TypeScript', 'React', 'Node.js', 'Tailwind', 'PostgreSQL', 'GraphQL', 'i18n', 'Playwright', 'AI-assisted'],
            },
          },
          {
            type: 'focusItems',
            enabled: true,
            order: 3,
            props: {
              items: [
                { label: 'Focus', value: 'Frontend Platform Engineering' },
                { label: 'Base', value: 'Australia — Remote' },
                { label: 'Lang', value: 'EN / TH multilingual' },
              ],
            },
          },
        ],
      },
    },
    {
      key: 'focus',
      data: {
        updatedLabel: 'UPDATED 2026 · 06',
        topic: 'Frontend Platform Engineering',
        intro: 'Currently going deep on Frontend Platform Engineering — the tooling, design systems, and infrastructure that let product teams ship faster with less friction.',
        roadmap: [
          {
            phase: 'NOW',
            tag: 'IN PROGRESS',
            items: [
              { title: 'Platform engineering', note: 'Internal tooling and DX for product teams.', dot: 'active' },
              { title: 'Design tokens at scale', note: 'Multi-brand theming from one source.', dot: 'active' },
              { title: 'RSC mental models', note: 'Documenting patterns for the team.', dot: 'active' },
            ],
          },
          {
            phase: 'NEXT',
            tag: 'QUEUED',
            items: [
              { title: 'Edge-first data patterns', note: 'Fetching and caching at the boundary.', dot: 'queued' },
              { title: 'Type-safe i18n routing', note: 'Locales the compiler can verify.', dot: 'queued' },
              { title: 'Component testing', note: 'Playwright CT in the pipeline.', dot: 'queued' },
            ],
          },
          {
            phase: 'LATER',
            tag: 'EXPLORING',
            items: [
              { title: 'Rust for build tooling', note: 'Faster local and CI builds.', dot: 'exploring' },
              { title: 'Local-first sync', note: 'CRDTs and offline-capable UIs.', dot: 'exploring' },
            ],
          },
        ],
        learning: ['RSC internals', 'Turborepo', 'Design tokens', 'Edge runtimes', 'Playwright CT', 'OpenTelemetry', 'Rust', 'CRDTs'],
        reading: [
          { idx: '01', title: 'Next.js RFCs & the App Router roadmap' },
          { idx: '02', title: 'WAI-ARIA Authoring Practices, end to end' },
          { idx: '03', title: 'Papers on CRDTs and local-first software' },
        ],
      },
    },
    {
      key: 'stack',
      data: {
        groups: [
          { label: 'EDITOR & SHELL', tools: [{ name: 'VS Code', note: 'vim mode' }, { name: 'Ghostty', note: 'terminal' }, { name: 'Zsh + Starship', note: 'shell' }, { name: 'Raycast', note: 'launcher' }] },
          { label: 'LANGUAGES', tools: [{ name: 'TypeScript', note: 'daily' }, { name: 'JavaScript', note: 'daily' }, { name: 'SQL', note: 'postgres' }, { name: 'Go', note: 'tooling' }] },
          { label: 'FRAMEWORK', tools: [{ name: 'Next.js', note: 'app router' }, { name: 'React', note: 'rsc' }, { name: 'Tailwind', note: 'styling' }, { name: 'Zod', note: 'schema' }] },
          { label: 'DATA & INFRA', tools: [{ name: 'PostgreSQL', note: 'primary' }, { name: 'Redis', note: 'cache' }, { name: 'Vercel', note: 'edge / host' }, { name: 'GitHub Actions', note: 'ci' }] },
          { label: 'DESIGN & QA', tools: [{ name: 'Figma', note: 'design' }, { name: 'Storybook', note: 'components' }, { name: 'Playwright', note: 'e2e' }, { name: 'Vitest', note: 'unit' }] },
          { label: 'AI-ASSISTED', tools: [{ name: 'Claude', note: 'pair / design' }, { name: 'Copilot', note: 'inline' }, { name: 'Cursor', note: 'refactors' }] },
        ],
      },
    },
    {
      key: 'site',
      data: {
        nav: [
          { key: 'work', label: 'Work', href: '/work', enabled: true, order: 0 },
          { key: 'engineering', label: 'Engineering', href: '/engineering', enabled: true, order: 1 },
          { key: 'journal', label: 'Journal', href: '/journal', enabled: true, order: 2 },
          { key: 'focus', label: 'Focus', href: '/focus', enabled: true, order: 3 },
          { key: 'stack', label: 'Stack', href: '/stack', enabled: true, order: 4 },
          { key: 'resume', label: 'Résumé', href: '/resume', enabled: true, order: 5 },
        ],
        theme: {},
        seo: {},
        socialLinks: {},
        contact: {},
      },
    },
  ]

  for (const page of pages) {
    await prisma.pageSection.upsert({
      where: { key: page.key },
      update: { data: page.data as object },
      create: { key: page.key, data: page.data as object },
    })
  }

  console.log(`  ✓ ${pages.length} page sections (landing, focus, stack, site)`)
}

// ---------------------------------------------------------------------------
// 6. Seed Resume (normalized tables)
// ---------------------------------------------------------------------------

async function seedResume(): Promise<void> {
  console.log('Seeding resume...')

  const profileId = 'resume-profile-singleton'

  await prisma.resumeProfile.upsert({
    where: { id: profileId },
    update: {
      name: 'Sarut Dumrongprechachan',
      role: 'FRONTEND ENGINEER · PLATFORM & PRODUCT',
      contactLine: 'hello@sarut.dev · sarut.dev · Australia / Remote · EN / TH',
      skills: [
        'Frontend architecture', 'React / RSC', 'TypeScript', 'Performance',
        'Design systems', 'i18n / localization', 'Accessibility', 'Mentoring',
      ],
      coreTools: [
        'Next.js', 'Node.js', 'Tailwind', 'PostgreSQL',
        'GraphQL', 'Playwright', 'Vercel', 'Figma',
      ],
    },
    create: {
      id: profileId,
      name: 'Sarut Dumrongprechachan',
      role: 'FRONTEND ENGINEER · PLATFORM & PRODUCT',
      contactLine: 'hello@sarut.dev · sarut.dev · Australia / Remote · EN / TH',
      skills: [
        'Frontend architecture', 'React / RSC', 'TypeScript', 'Performance',
        'Design systems', 'i18n / localization', 'Accessibility', 'Mentoring',
      ],
      coreTools: [
        'Next.js', 'Node.js', 'Tailwind', 'PostgreSQL',
        'GraphQL', 'Playwright', 'Vercel', 'Figma',
      ],
    },
  })

  // Experience — delete + recreate for idempotency on array data
  await prisma.resumeExperience.deleteMany({ where: { profileId } })
  const experiences = [
    {
      title: 'Lead Frontend Engineer',
      org: 'Booking & travel platform · contract',
      period: '2024 — 2025',
      bullets: [
        'Led the rebuild of a four-market booking platform from per-locale forks into one headless, edge-routed system.',
        'Introduced React Server Components and Server Actions, lifting conversion 38% and cutting P75 LCP by 63%.',
        'Mentored three frontend engineers and set the architecture and review standards for the rebuild.',
      ],
      sortOrder: 0,
    },
    {
      title: 'Frontend Engineer',
      org: 'Headless CMS & publishing',
      period: '2022 — 2024',
      bullets: [
        'Migrated an editorial team off a legacy monolith onto a headless CMS with an on-demand revalidation pipeline.',
        'Cut build times 71% with cache-aware CI and a task graph across a growing monorepo.',
        'Shipped a schema-driven form engine that removed engineering from most content changes.',
      ],
      sortOrder: 1,
    },
    {
      title: 'Frontend Developer',
      org: 'Multi-client product & agency work',
      period: '2020 — 2022',
      bullets: [
        'Built multilingual, accessible interfaces across booking, CMS, and dashboard products.',
        'Established the shared component patterns several later projects were forked from.',
      ],
      sortOrder: 2,
    },
  ]
  for (const exp of experiences) {
    await prisma.resumeExperience.create({ data: { profileId, ...exp } })
  }

  // Education
  await prisma.resumeEducation.deleteMany({ where: { profileId } })
  const education = [
    { title: 'B.Sc. Computer Science', note: 'Studied & worked in Australia', period: '2016 — 2020', sortOrder: 0 },
    { title: 'Ongoing', note: 'Frontend Platform Engineering', period: '2025 — now', sortOrder: 1 },
  ]
  for (const edu of education) {
    await prisma.resumeEducation.create({ data: { profileId, ...edu } })
  }

  // Languages
  await prisma.resumeLanguage.deleteMany({ where: { profileId } })
  const languages = [
    { name: 'Thai', level: 'NATIVE', sortOrder: 0 },
    { name: 'English', level: 'FLUENT', sortOrder: 1 },
  ]
  for (const lang of languages) {
    await prisma.resumeLanguage.create({ data: { profileId, ...lang } })
  }

  // Selected Work — link to real WorkCaseStudy rows
  await prisma.resumeSelectedWork.deleteMany({ where: { profileId } })
  const selectedWork = [
    { slug: 'atlas', noteOverride: null, sortOrder: 0 },
    { slug: 'ledger', noteOverride: null, sortOrder: 1 },
    { slug: 'prism', noteOverride: null, sortOrder: 2 },
    { slug: 'beacon', noteOverride: null, sortOrder: 3 },
  ]
  for (const sw of selectedWork) {
    const work = await prisma.workCaseStudy.findUnique({ where: { slug: sw.slug } })
    if (work) {
      await prisma.resumeSelectedWork.create({
        data: {
          profileId,
          workId: work.id,
          noteOverride: sw.noteOverride,
          sortOrder: sw.sortOrder,
        },
      })
    } else {
      console.warn(`  ⚠ Work "${sw.slug}" not found — skipping selectedWork link`)
    }
  }

  console.log('  ✓ resume profile + 3 experiences + 2 education + 2 languages + 4 selectedWork')
}

// ---------------------------------------------------------------------------
// 7. Verify counts
// ---------------------------------------------------------------------------

async function verifyCounts(): Promise<void> {
  console.log('\nVerifying counts...')
  const counts = {
    domains: await prisma.domain.count(),
    work: await prisma.workCaseStudy.count(),
    journal: await prisma.journalPost.count(),
    engineering: await prisma.engineeringNote.count(),
    pageSections: await prisma.pageSection.count(),
    resumeProfiles: await prisma.resumeProfile.count(),
    resumeExperience: await prisma.resumeExperience.count(),
    resumeEducation: await prisma.resumeEducation.count(),
    resumeLanguages: await prisma.resumeLanguage.count(),
    resumeSelectedWork: await prisma.resumeSelectedWork.count(),
  }

  const expected = {
    domains: 6,
    work: 6,
    journal: 6,
    engineering: 9,
    pageSections: 4,
    resumeProfiles: 1,
    resumeExperience: 3,
    resumeEducation: 2,
    resumeLanguages: 2,
    resumeSelectedWork: 4,
  }

  let allMatch = true
  for (const [key, expectedCount] of Object.entries(expected)) {
    const actual = counts[key as keyof typeof counts]
    const status = actual === expectedCount ? '✓' : '✗'
    if (actual !== expectedCount) allMatch = false
    console.log(`  ${status} ${key}: ${actual} (expected ${expectedCount})`)
  }

  if (allMatch) {
    console.log('\n✓ All counts match — seed complete.')
  } else {
    console.log('\n✗ Some counts do not match — check warnings above.')
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  console.log('Starting seed...\n')

  await seedDomains()
  await seedWork()
  await seedJournal()
  await seedEngineering()
  await seedPageSections()
  await seedResume()
  await verifyCounts()
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
