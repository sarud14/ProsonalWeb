export const ENGINEERING_NOTE_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
} as const

export const ENGINEERING_NOTE_TYPE = {
  ARCHITECTURE: 'Architecture',
  DECISIONS: 'Decisions',
  PERFORMANCE: 'Performance',
} as const

export type EngineeringNoteStatus =
  (typeof ENGINEERING_NOTE_STATUS)[keyof typeof ENGINEERING_NOTE_STATUS]

export type EngineeringNoteType =
  (typeof ENGINEERING_NOTE_TYPE)[keyof typeof ENGINEERING_NOTE_TYPE]
