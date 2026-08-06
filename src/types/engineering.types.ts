import type { EngineeringFrontmatter } from '@/validators/engineering.schema'
import type { EngineeringNoteType } from '@/constants/engineering'

export interface EngineeringNote extends EngineeringFrontmatter {
  readonly slug: string
}

export interface EngineeringListSectionProps {
  readonly items: readonly EngineeringNote[]
  readonly showFilters?: boolean
  readonly initialFilter?: EngineeringTypeFilter
}

export type EngineeringTypeFilter =
  | 'ALL'
  | EngineeringNoteType
