export const FOCUS_UPDATED_LABEL = 'UPDATED 2026 · 06' as const

export const FOCUS_TOPIC = 'Frontend Platform Engineering' as const

export const FOCUS_INTRO =
  'Currently going deep on Frontend Platform Engineering — the tooling, design systems, and infrastructure that let product teams ship faster with less friction.' as const

export const FOCUS_ROADMAP_DOT = {
  ACTIVE: 'active',
  QUEUED: 'queued',
  EXPLORING: 'exploring',
} as const

export type FocusRoadmapDot =
  (typeof FOCUS_ROADMAP_DOT)[keyof typeof FOCUS_ROADMAP_DOT]
