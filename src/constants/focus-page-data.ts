import { FOCUS_INTRO, FOCUS_ROADMAP_DOT, FOCUS_TOPIC, FOCUS_UPDATED_LABEL } from '@/constants/focus'
import type { FocusPageData } from '@/types/focus.types'

export const FOCUS_PAGE_DATA = {
  updatedLabel: FOCUS_UPDATED_LABEL,
  topic: FOCUS_TOPIC,
  intro: FOCUS_INTRO,
  roadmap: [
    {
      phase: 'NOW',
      tag: 'IN PROGRESS',
      items: [
        {
          title: 'Platform engineering',
          note: 'Internal tooling and DX for product teams.',
          dot: FOCUS_ROADMAP_DOT.ACTIVE,
        },
        {
          title: 'Design tokens at scale',
          note: 'Multi-brand theming from one source.',
          dot: FOCUS_ROADMAP_DOT.ACTIVE,
        },
        {
          title: 'RSC mental models',
          note: 'Documenting patterns for the team.',
          dot: FOCUS_ROADMAP_DOT.ACTIVE,
        },
      ],
    },
    {
      phase: 'NEXT',
      tag: 'QUEUED',
      items: [
        {
          title: 'Edge-first data patterns',
          note: 'Fetching and caching at the boundary.',
          dot: FOCUS_ROADMAP_DOT.QUEUED,
        },
        {
          title: 'Type-safe i18n routing',
          note: 'Locales the compiler can verify.',
          dot: FOCUS_ROADMAP_DOT.QUEUED,
        },
        {
          title: 'Component testing',
          note: 'Playwright CT in the pipeline.',
          dot: FOCUS_ROADMAP_DOT.QUEUED,
        },
      ],
    },
    {
      phase: 'LATER',
      tag: 'EXPLORING',
      items: [
        {
          title: 'Rust for build tooling',
          note: 'Faster local and CI builds.',
          dot: FOCUS_ROADMAP_DOT.EXPLORING,
        },
        {
          title: 'Local-first sync',
          note: 'CRDTs and offline-capable UIs.',
          dot: FOCUS_ROADMAP_DOT.EXPLORING,
        },
      ],
    },
  ],
  learning: [
    'RSC internals',
    'Turborepo',
    'Design tokens',
    'Edge runtimes',
    'Playwright CT',
    'OpenTelemetry',
    'Rust',
    'CRDTs',
  ],
  reading: [
    { idx: '01', title: 'Next.js RFCs & the App Router roadmap' },
    { idx: '02', title: 'WAI-ARIA Authoring Practices, end to end' },
    { idx: '03', title: 'Papers on CRDTs and local-first software' },
  ],
} as const satisfies FocusPageData
