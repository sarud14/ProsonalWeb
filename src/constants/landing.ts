import type {
  LandingFocusItem,
  LandingModule,
  LandingStat,
} from '@/types/landing.types'

export const LANDING_STATS = [
  { value: '06', label: 'Case Studies' },
  { value: '04', label: 'Problem Domains' },
  { value: '5y', label: 'Shipping Products' },
  { value: '2', label: 'Languages — EN / TH' },
] as const satisfies readonly LandingStat[]

export const LANDING_MODULES: readonly LandingModule[] = [
  {
    num: '01',
    title: 'Work',
    desc: 'Case studies — architecture, decisions, and measured impact.',
    link: '/work',
    linkLabel: '6 ENTRIES',
    badge: 'LIVE',
  },
  {
    num: '02',
    title: 'Engineering',
    desc: 'Architecture notes, decision logs, and performance write-ups.',
    link: '/engineering',
    linkLabel: 'Notes',
  },
  {
    num: '03',
    title: 'Journal',
    desc: 'Working notes on building, learning, and shipping.',
    link: '/journal',
    linkLabel: 'Posts',
  },
  {
    num: '04',
    title: 'Focus',
    desc: 'What I am learning and building right now — the roadmap.',
    link: '/focus',
    linkLabel: 'Roadmap',
  },
  {
    num: '05',
    title: 'Stack',
    desc: 'Tools, workflow, and the setup behind the work.',
    link: '/stack',
    linkLabel: 'Tooling',
  },
  {
    num: '06',
    title: 'Résumé',
    desc: 'Experience and capabilities — print and PDF ready.',
    link: '/resume',
    linkLabel: 'CV / PDF',
  },
]

export const LANDING_TECH_STACK = [
  'Next.js',
  'TypeScript',
  'React',
  'Node.js',
  'Tailwind',
  'PostgreSQL',
  'GraphQL',
  'i18n',
  'Playwright',
  'AI-assisted',
] as const

export const LANDING_FOCUS_ITEMS = [
  {
    label: 'Focus',
    value: 'Frontend Platform Engineering',
  },
  {
    label: 'Base',
    value: 'Australia — Remote',
  },
  {
    label: 'Lang',
    value: 'EN / TH multilingual',
  },
] as const satisfies readonly LandingFocusItem[]
