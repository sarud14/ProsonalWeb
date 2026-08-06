import type { WorkCaseStudy } from '@/types/work.types'

export interface WorkListSectionProps {
  readonly items: readonly WorkCaseStudy[]
  readonly domainFilters: readonly string[]
}

export type WorkDomainFilter = string
