import type { WorkCaseStudy } from '@/types/work.types'

export interface WorkListSectionProps {
  readonly items: readonly WorkCaseStudy[]
  readonly domainFilters: readonly string[]
}

export type WorkDomainFilter = string

export interface WorkListQueryResult {
  readonly filters: readonly string[]
  readonly shownItems: readonly WorkCaseStudy[]
  readonly countLabel: string
}

export interface WorkListHookResult extends WorkListQueryResult {
  readonly activeFilter: string
  readonly setActiveFilter: (filter: string) => void
}
