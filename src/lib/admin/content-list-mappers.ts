import type { DataTableRow } from '@/components/ui/DataTable'
import { ENGINEERING_TYPE_LABELS } from '@/constants/admin-content-list'
import { formatAdminDate } from '@/lib/admin/format-admin-date'

interface WorkListItem {
  readonly id: string
  readonly title: string
  readonly status: 'PUBLISHED' | 'DRAFT'
  readonly year: string
  readonly sortOrder: number
  readonly domains: readonly { readonly label: string }[]
}

interface JournalListItem {
  readonly id: string
  readonly title: string
  readonly status: 'PUBLISHED' | 'DRAFT'
  readonly tag: string
  readonly publishedAt: Date | null
  readonly sortOrder: number
}

interface EngineeringListItem {
  readonly id: string
  readonly title: string
  readonly status: 'PUBLISHED' | 'DRAFT'
  readonly type: 'ARCHITECTURE' | 'DECISIONS' | 'PERFORMANCE'
  readonly noteDate: string
  readonly sortOrder: number
}

export function mapWorkToTableRows(items: readonly WorkListItem[]): DataTableRow[] {
  return items.map((item) => ({
    id: item.id,
    status: item.status,
    cells: [
      { kind: 'title', text: item.title },
      { kind: 'badge', status: item.status },
      { kind: 'chips', items: item.domains.map((domain) => domain.label) },
      { kind: 'text', text: item.year, mono: true },
      { kind: 'text', text: String(item.sortOrder), mono: true },
    ],
  }))
}

export function mapJournalToTableRows(items: readonly JournalListItem[]): DataTableRow[] {
  return items.map((item) => ({
    id: item.id,
    status: item.status,
    cells: [
      { kind: 'title', text: item.title },
      { kind: 'badge', status: item.status },
      { kind: 'text', text: item.tag },
      { kind: 'text', text: formatAdminDate(item.publishedAt), mono: true },
      { kind: 'text', text: String(item.sortOrder), mono: true },
    ],
  }))
}

export function mapEngineeringToTableRows(
  items: readonly EngineeringListItem[]
): DataTableRow[] {
  return items.map((item) => ({
    id: item.id,
    status: item.status,
    cells: [
      { kind: 'title', text: item.title },
      { kind: 'badge', status: item.status },
      { kind: 'text', text: ENGINEERING_TYPE_LABELS[item.type] },
      { kind: 'text', text: item.noteDate, mono: true },
      { kind: 'text', text: String(item.sortOrder), mono: true },
    ],
  }))
}
