import type { WorkCaseStudy } from '@/types/work.types'

export interface WorkListSectionProps {
  readonly items: readonly WorkCaseStudy[]
}

export type WorkDomainFilter =
  | 'ALL'
  | 'Booking'
  | 'CMS'
  | 'Architecture'
  | 'Multilingual'
  | 'Performance'
