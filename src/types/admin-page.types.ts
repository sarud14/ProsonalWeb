export interface EditWorkPageProps {
  readonly params: Promise<{ id: string }>
}

export interface EditJournalPageProps {
  readonly params: Promise<{ id: string }>
}

export interface EditEngineeringPageProps {
  readonly params: Promise<{ id: string }>
}

export type AdminLayoutMode = 'masthead' | 'sidebar' | 'split'

export interface AdminNavItem {
  readonly key: string
  readonly label: string
  readonly icon: string
  readonly meta: string
  readonly href: string
  readonly badge?: number
}

export interface AdminSubNavItem {
  readonly label: string
  readonly href: string
  readonly hint?: string
}
