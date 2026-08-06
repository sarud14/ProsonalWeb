export const WORK_FILTER_ALL = 'ALL' as const

/** MDX / offline fallback domain chips — production reads Domain rows from the DB. */
export const WORK_DOMAIN_FILTERS = [
  WORK_FILTER_ALL,
  'Booking',
  'CMS',
  'Architecture',
  'Multilingual',
  'Performance',
  'Platform',
] as const