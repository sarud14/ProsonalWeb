import 'dotenv/config'

import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient, type Prisma } from '@prisma/client'
import { Pool } from 'pg'
import fs from 'fs/promises'
import path from 'path'

const connectionString =
  process.env.DIRECT_URL?.trim() ||
  process.env.DATABASE_URL?.trim() ||
  'postgresql://localhost:5432/postgres'

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

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
// 0. Wipe CMS content (keep auth, contact messages, and media assets)
// ---------------------------------------------------------------------------

async function wipeCmsContent(): Promise<void> {
  console.log('Wiping existing CMS content (keeping auth, messages, media)...')

  await prisma.resumeSelectedWork.deleteMany()
  await prisma.resumeExperience.deleteMany()
  await prisma.resumeEducation.deleteMany()
  await prisma.resumeLanguage.deleteMany()
  await prisma.resumeProfile.deleteMany()
  await prisma.workCaseStudy.deleteMany()
  await prisma.journalPost.deleteMany()
  await prisma.engineeringNote.deleteMany()
  await prisma.pageSection.deleteMany()
  await prisma.domain.deleteMany()
  await prisma.contentRevision.deleteMany()
  await prisma.postReaction.deleteMany()

  console.log('  ✓ CMS content wiped\n')
}

// ---------------------------------------------------------------------------
// 1. Seed Domains (from WORK_DOMAIN_FILTERS, excluding "ALL")
// ---------------------------------------------------------------------------

const DOMAIN_LABELS = ['Booking', 'CMS', 'Architecture', 'Multilingual', 'Performance', 'Platform']

async function seedDomains(): Promise<number> {
  console.log('Seeding domains...')
  for (let i = 0; i < DOMAIN_LABELS.length; i++) {
    await prisma.domain.upsert({
      where: { label: DOMAIN_LABELS[i] },
      update: { sortOrder: i },
      create: { label: DOMAIN_LABELS[i], sortOrder: i },
    })
  }
  console.log(`  ✓ ${DOMAIN_LABELS.length} domains`)
  return DOMAIN_LABELS.length
}

// ---------------------------------------------------------------------------
// 2. Seed Work case studies
// ---------------------------------------------------------------------------

async function seedWork(): Promise<number> {
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
  return files.length
}

// ---------------------------------------------------------------------------
// 3. Seed Journal posts
// ---------------------------------------------------------------------------

async function seedJournal(): Promise<number> {
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
  return files.length
}

// ---------------------------------------------------------------------------
// 4. Seed Engineering notes
// ---------------------------------------------------------------------------

async function seedEngineering(): Promise<number> {
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
  return files.length
}

// ---------------------------------------------------------------------------
// 5. Seed PageSections (landing, focus, stack, site)
//
// Everything here describes the real setup. Anything not actually used in
// practice belongs on /focus under NEXT or LATER, never in the stack list.
// ---------------------------------------------------------------------------

async function seedPageSections(): Promise<number> {
  console.log('Seeding page sections...')

  const pages: Array<{ key: string; data: unknown }> = [
    {
      key: 'landing',
      data: {
        hero: {
          eyebrowLabel: 'Engineering System',
          eyebrowVersion: 'v1.0',
          titleLine1: 'Building scalable',
          titleLine2: 'digital products,',
          titleLine3: 'framed as systems.',
          body:
            'Frontend developer working in Next.js, TypeScript, and AI-assisted workflows. Focused on CMS platforms, booking flows, multilingual applications, and reusable frontend patterns.',
          bodyHighlights: ['Next.js', 'TypeScript'],
          primaryCtaLabel: 'View the work',
          primaryCtaHref: '/work',
          secondaryCtaLabel: 'Browse the system',
          secondaryCtaHref: '#modules',
          metaItems: [
            { label: 'Focus', value: 'Frontend Platform Engineering' },
            { label: 'Base', value: 'Bangkok, Thailand — Remote' },
            { label: 'Lang', value: 'EN / TH multilingual' },
          ],
          profileName: 'Sarut Dumrongprechachan',
          profileSubtitle: 'Frontend Developer · BKK / Remote',
          profileStatus: 'Open',
          profileImageUrl: null,
          profileImageAlt: '',
          codeFilename: 'developer.config.ts',
          codeRole: 'Frontend Developer',
          codeStack: ['Next.js', 'TS', 'React'],
          codeDomains: ['cms', 'booking', 'i18n'],
          codeFocus: 'frontend-platform',
          codeStatus: 'available',
        },
        blocks: [
          {
            type: 'stats',
            enabled: true,
            order: 0,
            props: {
              items: [
                { value: '04', label: 'Case Studies' },
                { value: '04', label: 'Problem Domains' },
                { value: '2025', label: 'Shipping Since' },
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
                { num: '01', title: 'Work', desc: 'Case studies — architecture, decisions, and measured impact.', link: '/work', linkLabel: '4 ENTRIES', badge: 'LIVE' },
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
              items: ['Next.js', 'TypeScript', 'React', 'Node.js', 'NestJS', 'Tailwind', 'Prisma', 'i18n', 'AI-assisted'],
            },
          },
        ],
      },
    },
    {
      key: 'focus',
      data: {
        updatedLabel: 'UPDATED 2026 · 08',
        topic: 'Frontend Platform Engineering',
        intro: 'Working toward frontend platform engineering — the shared patterns, tooling, and conventions that let a product team ship the same thing twice without rebuilding it.',
        roadmap: [
          {
            phase: 'NOW',
            tag: 'IN PROGRESS',
            items: [
              { title: 'App Router data flow', note: 'Where the server/client boundary actually belongs.', dot: 'active' },
              { title: 'Reusable form patterns', note: 'Multilingual forms with per-language validation.', dot: 'active' },
              { title: 'Design tokens', note: 'One theme source across projects.', dot: 'active' },
            ],
          },
          {
            phase: 'NEXT',
            tag: 'QUEUED',
            items: [
              { title: 'Payload CMS 3', note: 'Schema-driven content on Postgres.', dot: 'queued' },
              { title: 'Type-safe i18n routing', note: 'Locales the compiler can verify.', dot: 'queued' },
              { title: 'Component testing', note: 'Vitest and Playwright in the pipeline.', dot: 'queued' },
            ],
          },
          {
            phase: 'LATER',
            tag: 'EXPLORING',
            items: [
              { title: 'Turborepo', note: 'Shared packages across projects.', dot: 'exploring' },
              { title: 'Local-first sync', note: 'CRDTs and offline-capable UIs.', dot: 'exploring' },
            ],
          },
        ],
        learning: ['RSC internals', 'Payload CMS', 'NestJS', 'Design tokens', 'Playwright', 'Turborepo', 'Docker'],
        reading: [
          { idx: '01', title: 'Next.js RFCs & the App Router roadmap' },
          { idx: '02', title: 'WAI-ARIA Authoring Practices, end to end' },
          { idx: '03', title: 'Prisma and Postgres schema design in practice' },
        ],
      },
    },
    {
      key: 'stack',
      data: {
        groups: [
          { label: 'EDITOR & SHELL', tools: [{ name: 'VS Code', note: 'daily' }, { name: 'Windows Terminal', note: 'shell' }, { name: 'Git Bash', note: 'unix tools' }, { name: 'Claude Code', note: 'agentic' }] },
          { label: 'LANGUAGES', tools: [{ name: 'TypeScript', note: 'daily' }, { name: 'JavaScript', note: 'daily' }, { name: 'SQL', note: 'postgres' }, { name: 'Python', note: 'scripts' }] },
          { label: 'FRAMEWORK', tools: [{ name: 'Next.js', note: 'app router' }, { name: 'React', note: 'rsc' }, { name: 'NestJS', note: 'api' }, { name: 'Tailwind', note: 'styling' }] },
          { label: 'DATA & INFRA', tools: [{ name: 'PostgreSQL', note: 'primary' }, { name: 'Prisma', note: 'orm' }, { name: 'Vercel', note: 'host' }, { name: 'GitHub Actions', note: 'ci' }] },
          { label: 'FORMS & STATE', tools: [{ name: 'React Hook Form', note: 'forms' }, { name: 'Zod', note: 'schema' }, { name: 'SWR', note: 'fetching' }, { name: 'Zustand', note: 'client state' }] },
          { label: 'DESIGN & AI', tools: [{ name: 'Figma', note: 'design' }, { name: 'Claude', note: 'pair / design' }, { name: 'Copilot', note: 'inline' }, { name: 'Cursor', note: 'refactors' }] },
        ],
      },
    },
    {
      key: 'site',
      data: {
        brand: {
          name: 'Sarut Dumrongprechachan',
          role: 'Frontend Developer',
          isAvailable: true,
        },
        nav: [
          { key: 'work', label: 'Work', href: '/work', enabled: true, order: 0 },
          { key: 'engineering', label: 'Engineering', href: '/engineering', enabled: true, order: 1 },
          { key: 'journal', label: 'Journal', href: '/journal', enabled: true, order: 2 },
          { key: 'focus', label: 'Focus', href: '/focus', enabled: true, order: 3 },
          { key: 'stack', label: 'Stack', href: '/stack', enabled: true, order: 4 },
          { key: 'resume', label: 'Résumé', href: '/resume', enabled: true, order: 5 },
        ],
        theme: {
          primary: 'oklch(0.45 0.13 250)',
          background: 'oklch(0.035 0.005 250)',
          foreground: 'oklch(0.95 0 0)',
          success: 'oklch(0.72 0.19 155)',
          destructive: 'oklch(0.577 0.245 27.325)',
        },
        seo: {
          title: 'FEOps Kit',
          description: 'A reusable Next.js-based frontend engineering portfolio system',
          ogImageUrl: null,
        },
        // LinkedIn is omitted on purpose — an empty link reads worse than none.
        socialLinks: [
          { label: 'GitHub', url: 'https://github.com/sarud14' },
        ],
        // Public page: email only. Phone and home address stay in the PDF.
        contact: {
          email: 'ruj.working@gmail.com',
          location: 'Bangkok, Thailand — Remote',
        },
        footer: {
          copyrightName: 'Sarut Dumrongprechachan',
          tagline: 'Designed as a system, not a page',
          buildLabel: 'Build 2026.08 · All systems nominal',
        },
      },
    },
  ]

  for (const page of pages) {
    await prisma.pageSection.upsert({
      where: { key: page.key },
      update: { data: page.data as Prisma.InputJsonValue },
      create: { key: page.key, data: page.data as Prisma.InputJsonValue },
    })
  }

  console.log(`  ✓ ${pages.length} page sections (landing, focus, stack, site)`)
  return pages.length
}

// ---------------------------------------------------------------------------
// 6. Seed Resume (normalized tables)
//
// PRIVACY: this is a public site — phone number and home address are
// intentionally omitted. Keep those in the PDF sent directly to employers.
// ---------------------------------------------------------------------------

interface ResumeCounts {
  experiences: number
  education: number
  languages: number
  selectedWork: number
}

async function seedResume(): Promise<ResumeCounts> {
  console.log('Seeding resume...')

  const profileId = 'resume-profile-singleton'

  const profileData = {
    name: 'Sarut Dumrongprechachan',
    role: 'FRONTEND DEVELOPER',
    contactLine:
      'ruj.working@gmail.com · github.com/sarud14 · Bangkok, Thailand — Open to Remote · EN / TH',
    skills: [
      'React',
      'Next.js (App Router)',
      'TypeScript',
      'Tailwind CSS',
      'REST API Integration',
      'React Hook Form + Zod',
      'State Management (Zustand / SWR)',
      'Localization (i18n)',
      'Responsive UI',
      'UI/UX & Figma handoff',
    ],
    coreTools: [
      'Next.js',
      'React',
      'TypeScript',
      'Tailwind',
      'Node.js',
      'Prisma',
      'Git / GitHub',
      'Figma',
    ],
  }

  await prisma.resumeProfile.upsert({
    where: { id: profileId },
    update: profileData,
    create: { id: profileId, ...profileData },
  })

  // Experience — delete + recreate for idempotency on array data.
  //
  // The chef entry spans 2015—2023 because kitchen work was continuous
  // through that period. Keeping it as one entry closes the timeline
  // without needing a separate heading.
  await prisma.resumeExperience.deleteMany({ where: { profileId } })
  const experiences = [
    {
      title: 'Frontend Developer',
      org: 'Inter Vision Business Groups Co., Ltd. · Bangkok',
      period: 'Oct 2025 — Present',
      bullets: [
        'Build customer-facing web apps and internal CMS panels with Next.js App Router, TypeScript, and Tailwind CSS.',
        'Integrate REST APIs across booking, exchange-rate, loyalty, and content modules, including presigned S3 uploads for media.',
        'Implement multilingual (TH / EN) forms and pages with next-intl, React Hook Form, and Zod validation scoped per language.',
        'Build data-heavy admin tables with server-side pagination and sorting, plus loading, empty, and error states.',
        'Refactor manual fetch calls into a shared SWR fetcher layer to remove duplicated request logic and stale-cache bugs.',
        'Debug and fix production issues across authentication, session handling, and file upload flows.',
      ],
      sortOrder: 0,
    },
    {
      title: 'Chef',
      org: 'Hospitality industry · Australia & Thailand',
      period: '2015 — 2023',
      bullets: [
        'Eight years of professional kitchen experience, including five years working in Australia.',
        'Built the working English, time-pressure discipline, and team coordination now applied to shipping product.',
      ],
      sortOrder: 1,
    },
  ]
  for (const exp of experiences) {
    await prisma.resumeExperience.create({ data: { profileId, ...exp } })
  }

  // Education — reverse chronological.
  //
  // High school is included because the school carries weight when applying
  // in Thailand. Drop that entry for an international / remote variant.
  await prisma.resumeEducation.deleteMany({ where: { profileId } })
  const education = [
    {
      title: 'Next.js & NestJS',
      note: 'DevNest',
      period: 'Mar — May 2025',
      sortOrder: 0,
    },
    {
      title: 'Full-Stack Development & DevSecOps',
      note: 'CodeCamp Thailand',
      period: '2023 — 2024',
      sortOrder: 1,
    },
    {
      title: 'Grand Diplôme',
      note: 'Le Cordon Bleu Australia',
      period: '2015 — 2018',
      sortOrder: 2,
    },
    {
      title: 'B.A. Art & Design',
      note: 'Rangsit University',
      period: '2010 — 2014',
      sortOrder: 3,
    },
    {
      title: 'High School',
      note: 'Assumption College',
      period: '2005 — 2009',
      sortOrder: 4,
    },
    {
      title: 'Professional Development',
      note: 'TypeScript, React patterns, frontend architecture, AI-assisted development',
      period: 'Ongoing',
      sortOrder: 5,
    },
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

  // Selected Work — link to real WorkCaseStudy rows.
  //
  // First two: company work, generic names only, no internal business logic.
  // Last two: solo personal projects — open repos, fully defensible.
  // Bootcamp group projects are intentionally excluded.
  //
  // Requires a matching content/work/<slug>.mdx or the link is skipped.
  await prisma.resumeSelectedWork.deleteMany({ where: { profileId } })
  const selectedWork = [
    {
      slug: 'currency-exchange-booking',
      noteOverride: 'Booking flow with stock limits and multi-branch pickup scheduling.',
      sortOrder: 0,
    },
    {
      slug: 'multilingual-cms',
      noteOverride: 'Admin CMS with per-language validation and server-sorted tables.',
      sortOrder: 1,
    },
    {
      slug: 'feops-kit',
      noteOverride: 'This site — a content-driven portfolio system on Next.js and Prisma.',
      sortOrder: 2,
    },
    {
      slug: 'herbal-catalogue',
      noteOverride: 'Trilingual product catalogue (TH / EN / ZH) on Payload CMS.',
      sortOrder: 3,
    },
  ]

  let linkedWork = 0
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
      linkedWork++
    } else {
      console.warn(`  ⚠ Work "${sw.slug}" not found — skipping selectedWork link`)
    }
  }

  console.log(
    `  ✓ resume profile + ${experiences.length} experiences + ${education.length} education + ` +
      `${languages.length} languages + ${linkedWork}/${selectedWork.length} selectedWork`
  )

  return {
    experiences: experiences.length,
    education: education.length,
    languages: languages.length,
    selectedWork: linkedWork,
  }
}

// ---------------------------------------------------------------------------
// 7. Verify counts
//
// Expected values are derived from what was actually seeded rather than
// hardcoded, so adding or removing an MDX file doesn't break the check.
// This verifies the write reached the database, not that a magic number
// still matches.
// ---------------------------------------------------------------------------

interface SeedResult {
  domains: number
  work: number
  journal: number
  engineering: number
  pageSections: number
  resume: ResumeCounts
}

async function verifyCounts(seeded: SeedResult): Promise<void> {
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
    domains: seeded.domains,
    work: seeded.work,
    journal: seeded.journal,
    engineering: seeded.engineering,
    pageSections: seeded.pageSections,
    resumeProfiles: 1,
    resumeExperience: seeded.resume.experiences,
    resumeEducation: seeded.resume.education,
    resumeLanguages: seeded.resume.languages,
    resumeSelectedWork: seeded.resume.selectedWork,
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
    console.log('  A mismatch on work/journal/engineering usually means stale rows')
    console.log('  from a removed MDX file are still in the database.')
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  console.log('Starting seed...\n')

  await wipeCmsContent()

  const domains = await seedDomains()
  const work = await seedWork()
  const journal = await seedJournal()
  const engineering = await seedEngineering()
  const pageSections = await seedPageSections()
  const resume = await seedResume()

  await verifyCounts({ domains, work, journal, engineering, pageSections, resume })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
