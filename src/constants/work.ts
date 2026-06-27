import type { WorkDomainFilter } from '@/types/work-list.types'

export const WORK_FILTER_ALL = 'ALL' as const satisfies WorkDomainFilter

export const WORK_DOMAIN_FILTERS = [
  WORK_FILTER_ALL,
  'Booking',
  'CMS',
  'Architecture',
  'Multilingual',
  'Performance',
] as const satisfies readonly WorkDomainFilter[]
