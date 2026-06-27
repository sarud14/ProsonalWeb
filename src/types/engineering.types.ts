import type { EngineeringFrontmatter } from '@/validators/engineering.schema'

export interface EngineeringNote extends EngineeringFrontmatter {
  readonly slug: string
}

export interface EngineeringListSectionProps {
  readonly items: readonly EngineeringNote[]
}

export type EngineeringTypeFilter =
  | 'ALL'
  | import('@/constants/engineering').EngineeringNoteType
