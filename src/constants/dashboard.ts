import type { DashboardContentKind } from '@/types/dashboard.types'

export const DASHBOARD_RECENT_LIMIT = 5

export const DASHBOARD_KIND_LABELS: Readonly<Record<DashboardContentKind, string>> = {
  work: 'Work',
  journal: 'Journal',
  engineering: 'Engineering',
}

export const DASHBOARD_QUICK_ACTIONS = [
  { label: 'New Work', href: '/admin/work/new', primary: true },
  { label: 'New Journal', href: '/admin/journal/new', primary: false },
  { label: 'New Engineering Note', href: '/admin/engineering/new', primary: false },
] as const

export const DASHBOARD_MESSAGES_HREF = '/admin/messages'
