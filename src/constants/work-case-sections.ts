import type { WorkCaseSectionLink } from '@/types/work-case-detail.types'

export const WORK_CASE_SECTIONS = [
  { id: 'sec-context', num: '01', label: 'Context' },
  { id: 'sec-problem', num: '02', label: 'Problem' },
  { id: 'sec-constraints', num: '03', label: 'Constraints' },
  { id: 'sec-architecture', num: '04', label: 'Architecture' },
  { id: 'sec-decisions', num: '05', label: 'Engineering decisions' },
  { id: 'sec-impact', num: '06', label: 'Impact' },
] as const satisfies readonly WorkCaseSectionLink[]

export const WORK_CASE_META_LABELS = {
  ROLE: 'ROLE',
  TIMELINE: 'TIMELINE',
  TEAM: 'TEAM',
  STACK: 'STACK',
  STATUS: 'STATUS',
} as const
