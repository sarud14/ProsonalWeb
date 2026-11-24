import { type DataTableRow } from '@/components/ui'

export type AdminContentSection = 'work' | 'journal' | 'engineering'

export interface AdminMediaOption {
  readonly id: string
  readonly url: string
  readonly alt: string
}

export interface AdminContentListConfig {
  readonly section: AdminContentSection
  readonly kicker: string
  readonly title: string
  readonly newLabel: string
  readonly listHref: string
  readonly newHref: string
  readonly editHrefTemplate: string
  readonly gridTemplate: string
}

export interface AdminContentListProps {
  readonly config: AdminContentListConfig
  readonly rows: readonly DataTableRow[]
}

export interface WorkFormState {
  readonly id?: string
  readonly slug: string
  readonly title: string
  readonly role: string
  readonly tagline: string
  readonly metric: string
  readonly metricLabel: string
  readonly year: string
  readonly stack: readonly string[]
  readonly domains: readonly string[]
  readonly context: string
  readonly problem: string
  readonly constraints: string
  readonly architecture: string
  readonly decisions: string
  readonly impact: string
  readonly body: string
  readonly sortOrder: number
  readonly coverImageId: string | null
  readonly status: 'PUBLISHED' | 'DRAFT'
}

export interface JournalFormState {
  readonly id?: string
  readonly slug: string
  readonly title: string
  readonly excerpt: string
  readonly body: string
  readonly tag: string
  readonly readTime: string
  readonly pull: string
  readonly sortOrder: number
  readonly coverImageId: string | null
  readonly status: 'PUBLISHED' | 'DRAFT'
}

export interface EngineeringFormState {
  readonly id?: string
  readonly slug: string
  readonly title: string
  readonly type: 'ARCHITECTURE' | 'DECISIONS' | 'PERFORMANCE'
  readonly summary: string
  readonly noteDate: string
  readonly readTime: string
  readonly body: string
  readonly sortOrder: number
  readonly coverImageId: string | null
  readonly status: 'PUBLISHED' | 'DRAFT'
}

export interface EngineeringFormProps {
  readonly initialValues: EngineeringFormState
  readonly media: readonly AdminMediaOption[]
  readonly listHref: string
}

export interface JournalFormProps {
  readonly initialValues: JournalFormState
  readonly media: readonly AdminMediaOption[]
  readonly listHref: string
}

export interface WorkFormProps {
  readonly initialValues: WorkFormState
  readonly media: readonly AdminMediaOption[]
  readonly listHref: string
}

export interface WorkRecord {
  readonly id: string
  readonly slug: string
  readonly title: string
  readonly role: string
  readonly tagline: string
  readonly metric: string
  readonly metricLabel: string
  readonly year: string
  readonly stack: readonly string[]
  readonly context: string
  readonly problem: string
  readonly constraints: string
  readonly architecture: string
  readonly decisions: string
  readonly impact: string
  readonly body: string
  readonly sortOrder: number
  readonly coverImageId: string | null
  readonly status: 'PUBLISHED' | 'DRAFT'
  readonly domains: readonly { readonly label: string }[]
}

export interface JournalRecord {
  readonly id: string
  readonly slug: string
  readonly title: string
  readonly excerpt: string
  readonly body: string
  readonly tag: string
  readonly readTime: string
  readonly pull: string | null
  readonly sortOrder: number
  readonly coverImageId: string | null
  readonly status: 'PUBLISHED' | 'DRAFT'
}

export interface EngineeringRecord {
  readonly id: string
  readonly slug: string
  readonly title: string
  readonly type: 'ARCHITECTURE' | 'DECISIONS' | 'PERFORMANCE'
  readonly summary: string
  readonly noteDate: string
  readonly readTime: string
  readonly body: string
  readonly sortOrder: number
  readonly coverImageId: string | null
  readonly status: 'PUBLISHED' | 'DRAFT'
}

export interface WorkListItem {
  readonly id: string
  readonly title: string
  readonly status: 'PUBLISHED' | 'DRAFT'
  readonly year: string
  readonly sortOrder: number
  readonly domains: readonly { readonly label: string }[]
}

export interface JournalListItem {
  readonly id: string
  readonly title: string
  readonly status: 'PUBLISHED' | 'DRAFT'
  readonly tag: string
  readonly publishedAt: Date | null
  readonly sortOrder: number
}

export interface EngineeringListItem {
  readonly id: string
  readonly title: string
  readonly status: 'PUBLISHED' | 'DRAFT'
  readonly type: 'ARCHITECTURE' | 'DECISIONS' | 'PERFORMANCE'
  readonly noteDate: string
  readonly sortOrder: number
}
