export const WORK_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
} as const

export const JOURNAL_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
} as const

export type WorkStatus = (typeof WORK_STATUS)[keyof typeof WORK_STATUS]

export type JournalStatus = (typeof JOURNAL_STATUS)[keyof typeof JOURNAL_STATUS]
