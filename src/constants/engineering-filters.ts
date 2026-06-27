import type { EngineeringNoteType } from '@/constants/engineering'

export const ENGINEERING_FILTER_ALL = 'ALL' as const

export const ENGINEERING_TYPE_FILTERS = [
  ENGINEERING_FILTER_ALL,
  'Architecture',
  'Decisions',
  'Performance',
] as const satisfies readonly (EngineeringNoteType | typeof ENGINEERING_FILTER_ALL)[]
