/**
 * Export DB content back to MDX files as a backup.
 *
 * Usage: npx tsx scripts/export-to-mdx.ts [--out <dir>]
 * Default output: ./export/
 */

import { PrismaClient } from '@prisma/client'
import { writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const prisma = new PrismaClient()

function ensureDir(dir: string): void {
  mkdirSync(dir, { recursive: true })
}

function toFrontmatter(fields: Record<string, unknown>): string {
  const lines = Object.entries(fields).map(([key, value]) => {
    if (Array.isArray(value)) {
      return `${key}: ${JSON.stringify(value)}`
    }
    if (typeof value === 'string' && value.includes('\n')) {
      return `${key}: |\n  ${value.replace(/\n/g, '\n  ')}`
    }
    return `${key}: "${String(value ?? '')}"`
  })
  return `---\n${lines.join('\n')}\n---`
}

async function exportWork(outDir: string): Promise<number> {
  const dir = join(outDir, 'work')
  ensureDir(dir)

  const rows = await prisma.workCaseStudy.findMany({
    include: { domains: true },
    orderBy: { sortOrder: 'asc' },
  })

  for (const row of rows) {
    const frontmatter = toFrontmatter({
      title: row.title,
      status: row.status === 'PUBLISHED' ? 'published' : 'draft',
      listId: String(row.sortOrder).padStart(2, '0'),
      role: row.role,
      tagline: row.tagline,
      domains: row.domains.map((d) => d.label),
      stack: row.stack,
      metric: row.metric,
      metricLabel: row.metricLabel,
      year: row.year,
      context: row.context,
      problem: row.problem,
      constraints: row.constraints,
      architecture: row.architecture,
      decisions: row.decisions,
      impact: row.impact,
    })
    writeFileSync(join(dir, `${row.slug}.mdx`), `${frontmatter}\n\n${row.body}\n`)
  }

  return rows.length
}

async function exportJournal(outDir: string): Promise<number> {
  const dir = join(outDir, 'journal')
  ensureDir(dir)

  const rows = await prisma.journalPost.findMany({
    orderBy: { sortOrder: 'asc' },
  })

  for (const row of rows) {
    const fields: Record<string, unknown> = {
      title: row.title,
      status: row.status === 'PUBLISHED' ? 'published' : 'draft',
      tag: row.tag,
      excerpt: row.excerpt,
      readTime: row.readTime,
    }
    if (row.pull) fields.pull = row.pull
    if (row.publishedAt) {
      const y = row.publishedAt.getFullYear()
      const m = String(row.publishedAt.getMonth() + 1).padStart(2, '0')
      fields.publishedAt = `${y} · ${m}`
    }

    const frontmatter = toFrontmatter(fields)
    writeFileSync(join(dir, `${row.slug}.mdx`), `${frontmatter}\n\n${row.body}\n`)
  }

  return rows.length
}

async function exportEngineering(outDir: string): Promise<number> {
  const dir = join(outDir, 'engineering')
  ensureDir(dir)

  const rows = await prisma.engineeringNote.findMany({
    orderBy: { sortOrder: 'asc' },
  })

  for (const row of rows) {
    const typeMap: Record<string, string> = {
      ARCHITECTURE: 'Architecture',
      DECISIONS: 'Decisions',
      PERFORMANCE: 'Performance',
    }

    const frontmatter = toFrontmatter({
      title: row.title,
      status: row.status === 'PUBLISHED' ? 'published' : 'draft',
      listId: String(row.sortOrder).padStart(2, '0'),
      type: typeMap[row.type] ?? row.type,
      summary: row.summary,
      noteDate: row.noteDate,
      readTime: row.readTime,
    })
    writeFileSync(join(dir, `${row.slug}.mdx`), `${frontmatter}\n\n${row.body}\n`)
  }

  return rows.length
}

async function exportResume(outDir: string): Promise<void> {
  const dir = join(outDir, 'resume')
  ensureDir(dir)

  const profile = await prisma.resumeProfile.findFirst({
    include: {
      experiences: { orderBy: { sortOrder: 'asc' } },
      education: { orderBy: { sortOrder: 'asc' } },
      languages: { orderBy: { sortOrder: 'asc' } },
      selectedWork: {
        orderBy: { sortOrder: 'asc' },
        include: { work: { select: { title: true } } },
      },
    },
  })

  if (!profile) return

  const data = {
    name: profile.name,
    role: profile.role,
    contactLine: profile.contactLine,
    skills: profile.skills,
    coreTools: profile.coreTools,
    experience: profile.experiences.map((e) => ({
      title: e.title,
      org: e.org,
      period: e.period,
      bullets: e.bullets,
    })),
    education: profile.education.map((e) => ({
      title: e.title,
      note: e.note,
      period: e.period,
    })),
    languages: profile.languages.map((l) => ({
      name: l.name,
      level: l.level,
    })),
    selectedWork: profile.selectedWork.map((sw) => ({
      workTitle: sw.work.title,
      noteOverride: sw.noteOverride,
    })),
  }

  writeFileSync(join(dir, 'profile.json'), JSON.stringify(data, null, 2) + '\n')
}

async function exportPages(outDir: string): Promise<number> {
  const dir = join(outDir, 'pages')
  ensureDir(dir)

  const rows = await prisma.pageSection.findMany()

  for (const row of rows) {
    writeFileSync(
      join(dir, `${row.key}.json`),
      JSON.stringify(row.data, null, 2) + '\n'
    )
  }

  return rows.length
}

async function main(): Promise<void> {
  const args = process.argv.slice(2)
  const outIdx = args.indexOf('--out')
  const outDir = outIdx !== -1 && args[outIdx + 1] ? args[outIdx + 1] : './export'

  ensureDir(outDir)

  const workCount = await exportWork(outDir)
  const journalCount = await exportJournal(outDir)
  const engineeringCount = await exportEngineering(outDir)
  await exportResume(outDir)
  const pageCount = await exportPages(outDir)

  console.log(`Exported to ${outDir}:`)
  console.log(`  Work:        ${workCount}`)
  console.log(`  Journal:     ${journalCount}`)
  console.log(`  Engineering: ${engineeringCount}`)
  console.log(`  Resume:      1 profile`)
  console.log(`  Pages:       ${pageCount}`)

  await prisma.$disconnect()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
