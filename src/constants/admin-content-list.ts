import type { DataTableColumn } from '@/components/ui/DataTable'
import type { AdminContentListConfig } from '@/types/admin-content.types'

export const WORK_LIST_COLUMNS: readonly DataTableColumn[] = [
  { key: 'title', label: 'Title', align: 'left' },
  { key: 'status', label: 'Status', align: 'left' },
  { key: 'domains', label: 'Domains', align: 'left' },
  { key: 'year', label: 'Year', align: 'right' },
  { key: 'sortOrder', label: 'Sort', align: 'right' },
] as const

export const JOURNAL_LIST_COLUMNS: readonly DataTableColumn[] = [
  { key: 'title', label: 'Title', align: 'left' },
  { key: 'status', label: 'Status', align: 'left' },
  { key: 'tag', label: 'Tag', align: 'left' },
  { key: 'publishedAt', label: 'Date', align: 'right' },
  { key: 'sortOrder', label: 'Sort', align: 'right' },
] as const

export const ENGINEERING_LIST_COLUMNS: readonly DataTableColumn[] = [
  { key: 'title', label: 'Title', align: 'left' },
  { key: 'status', label: 'Status', align: 'left' },
  { key: 'type', label: 'Type', align: 'left' },
  { key: 'noteDate', label: 'Date', align: 'right' },
  { key: 'sortOrder', label: 'Sort', align: 'right' },
] as const

export const WORK_LIST_GRID = '2fr 100px 1.4fr 70px 60px 132px'
export const JOURNAL_LIST_GRID = '2fr 100px 1fr 110px 60px 132px'
export const ENGINEERING_LIST_GRID = '2fr 100px 1.3fr 120px 60px 132px'

export const WORK_LIST_CONFIG: AdminContentListConfig = {
  section: 'work',
  kicker: 'Case studies',
  title: 'Work',
  newLabel: 'New Work',
  listHref: '/admin/work',
  newHref: '/admin/work/new',
  editHrefTemplate: '/admin/work/{id}/edit',
  gridTemplate: WORK_LIST_GRID,
}

export const JOURNAL_LIST_CONFIG: AdminContentListConfig = {
  section: 'journal',
  kicker: 'Writing',
  title: 'Journal',
  newLabel: 'New Journal',
  listHref: '/admin/journal',
  newHref: '/admin/journal/new',
  editHrefTemplate: '/admin/journal/{id}/edit',
  gridTemplate: JOURNAL_LIST_GRID,
}

export const ENGINEERING_LIST_CONFIG: AdminContentListConfig = {
  section: 'engineering',
  kicker: 'Notes',
  title: 'Engineering',
  newLabel: 'New Note',
  listHref: '/admin/engineering',
  newHref: '/admin/engineering/new',
  editHrefTemplate: '/admin/engineering/{id}/edit',
  gridTemplate: ENGINEERING_LIST_GRID,
}

export const ENGINEERING_TYPE_OPTIONS = [
  { value: 'ARCHITECTURE', label: 'Architecture' },
  { value: 'DECISIONS', label: 'Decisions' },
  { value: 'PERFORMANCE', label: 'Performance' },
] as const

export const ENGINEERING_TYPE_LABELS: Readonly<
  Record<'ARCHITECTURE' | 'DECISIONS' | 'PERFORMANCE', string>
> = {
  ARCHITECTURE: 'Architecture',
  DECISIONS: 'Decisions',
  PERFORMANCE: 'Performance',
}
