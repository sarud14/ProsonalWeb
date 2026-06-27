import 'server-only'

import { workData } from '@/lib/data/work.data'
import { journalData } from '@/lib/data/journal.data'
import { engineeringData } from '@/lib/data/engineering.data'
import type { ContentSource } from '@/types/content.types'
import type { EngineeringNote } from '@/types/engineering.types'
import type { JournalPost } from '@/types/journal.types'
import type { WorkCaseStudy } from '@/types/work.types'

function padSortOrder(n: number): string {
  return String(n).padStart(2, '0')
}

function statusToString(status: string): 'draft' | 'published' {
  return status === 'PUBLISHED' ? 'published' : 'draft'
}

function formatPublishedAt(date: Date | null): string {
  if (!date) return ''
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  return `${y} · ${m}`
}

function engineeringTypeToString(
  type: string
): 'Architecture' | 'Decisions' | 'Performance' {
  const map: Record<string, 'Architecture' | 'Decisions' | 'Performance'> = {
    ARCHITECTURE: 'Architecture',
    DECISIONS: 'Decisions',
    PERFORMANCE: 'Performance',
  }
  return map[type] ?? 'Architecture'
}

export const dbSource: ContentSource = {
  async getAllWork(): Promise<readonly WorkCaseStudy[]> {
    const rows = await workData.getAllPublished()

    return rows.map((row) => ({
      slug: row.slug,
      title: row.title,
      status: statusToString(row.status),
      listId: padSortOrder(row.sortOrder),
      role: row.role,
      tagline: row.tagline,
      domains: row.domains.map((d: { label: string }) => d.label),
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
    }))
  },

  async getWorkBySlug(slug: string): Promise<WorkCaseStudy | null> {
    const row = await workData.getBySlug(slug)

    if (!row || row.status !== 'PUBLISHED') return null

    return {
      slug: row.slug,
      title: row.title,
      status: statusToString(row.status),
      listId: padSortOrder(row.sortOrder),
      role: row.role,
      tagline: row.tagline,
      domains: row.domains.map((d: { label: string }) => d.label),
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
    }
  },

  async getAllJournalPosts(): Promise<readonly JournalPost[]> {
    const rows = await journalData.getAllPublished()

    return rows.map((row) => ({
      slug: row.slug,
      title: row.title,
      status: statusToString(row.status),
      publishedAt: formatPublishedAt(row.publishedAt),
      tag: row.tag,
      excerpt: row.excerpt,
      readTime: row.readTime,
      pull: row.pull ?? undefined,
      content: row.body,
    }))
  },

  async getJournalPostBySlug(slug: string): Promise<JournalPost | null> {
    const row = await journalData.getBySlug(slug)

    if (!row || row.status !== 'PUBLISHED') return null

    return {
      slug: row.slug,
      title: row.title,
      status: statusToString(row.status),
      publishedAt: formatPublishedAt(row.publishedAt),
      tag: row.tag,
      excerpt: row.excerpt,
      readTime: row.readTime,
      pull: row.pull ?? undefined,
      content: row.body,
    }
  },

  async getAllEngineeringNotes(): Promise<readonly EngineeringNote[]> {
    const rows = await engineeringData.getAllPublished()

    return rows.map((row) => ({
      slug: row.slug,
      title: row.title,
      status: statusToString(row.status),
      listId: padSortOrder(row.sortOrder),
      type: engineeringTypeToString(row.type),
      summary: row.summary,
      noteDate: row.noteDate,
      readTime: row.readTime,
    }))
  },

  async getEngineeringNoteBySlug(
    slug: string
  ): Promise<EngineeringNote | null> {
    const row = await engineeringData.getBySlug(slug)

    if (!row || row.status !== 'PUBLISHED') return null

    return {
      slug: row.slug,
      title: row.title,
      status: statusToString(row.status),
      listId: padSortOrder(row.sortOrder),
      type: engineeringTypeToString(row.type),
      summary: row.summary,
      noteDate: row.noteDate,
      readTime: row.readTime,
    }
  },
}
