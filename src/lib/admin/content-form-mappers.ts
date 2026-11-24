import type {
  EngineeringFormState,
  JournalFormState,
  WorkFormState,
} from '@/types/admin-content.types'
import type { WorkRecord, JournalRecord, EngineeringRecord } from '@/types/admin-content.types'

export function emptyWorkFormState(): WorkFormState {
  return {
    slug: '',
    title: '',
    role: '',
    tagline: '',
    metric: '',
    metricLabel: '',
    year: new Date().getFullYear().toString(),
    stack: [],
    domains: [],
    context: '',
    problem: '',
    constraints: '',
    architecture: '',
    decisions: '',
    impact: '',
    body: '',
    sortOrder: 0,
    coverImageId: null,
    status: 'DRAFT',
  }
}

export function workRecordToFormState(record: WorkRecord): WorkFormState {
  return {
    id: record.id,
    slug: record.slug,
    title: record.title,
    role: record.role,
    tagline: record.tagline,
    metric: record.metric,
    metricLabel: record.metricLabel,
    year: record.year,
    stack: [...record.stack],
    domains: record.domains.map((domain) => domain.label),
    context: record.context,
    problem: record.problem,
    constraints: record.constraints,
    architecture: record.architecture,
    decisions: record.decisions,
    impact: record.impact,
    body: record.body,
    sortOrder: record.sortOrder,
    coverImageId: record.coverImageId,
    status: record.status,
  }
}

export function emptyJournalFormState(): JournalFormState {
  return {
    slug: '',
    title: '',
    excerpt: '',
    body: '',
    tag: '',
    readTime: '',
    pull: '',
    sortOrder: 0,
    coverImageId: null,
    status: 'DRAFT',
  }
}

export function journalRecordToFormState(record: JournalRecord): JournalFormState {
  return {
    id: record.id,
    slug: record.slug,
    title: record.title,
    excerpt: record.excerpt,
    body: record.body,
    tag: record.tag,
    readTime: record.readTime,
    pull: record.pull ?? '',
    sortOrder: record.sortOrder,
    coverImageId: record.coverImageId,
    status: record.status,
  }
}

export function emptyEngineeringFormState(): EngineeringFormState {
  return {
    slug: '',
    title: '',
    type: 'ARCHITECTURE',
    summary: '',
    noteDate: new Date().toISOString().slice(0, 10),
    readTime: '',
    body: '',
    sortOrder: 0,
    coverImageId: null,
    status: 'DRAFT',
  }
}

export function engineeringRecordToFormState(
  record: EngineeringRecord
): EngineeringFormState {
  return {
    id: record.id,
    slug: record.slug,
    title: record.title,
    type: record.type,
    summary: record.summary,
    noteDate: record.noteDate,
    readTime: record.readTime,
    body: record.body,
    sortOrder: record.sortOrder,
    coverImageId: record.coverImageId,
    status: record.status,
  }
}

export function getPublicPreviewPath(
  section: 'work' | 'journal' | 'engineering',
  values: { readonly slug: string; readonly type?: EngineeringFormState['type'] }
): string | null {
  if (!values.slug) return null

  switch (section) {
    case 'work':
      return `/work/${values.slug}`
    case 'journal':
      return `/journal/posts/${values.slug}`
    case 'engineering':
      return `/engineering/${values.type?.toLowerCase() ?? 'architecture'}`
  }
}
