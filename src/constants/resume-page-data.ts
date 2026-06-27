import type { ResumePageData } from '@/types/resume.types'

export const RESUME_PAGE_DATA = {
  name: 'Sarut Dumrongprechachan',
  role: 'FRONTEND ENGINEER · PLATFORM & PRODUCT',
  contactLine:
    'hello@sarut.dev · sarut.dev · Australia / Remote · EN / TH',
  experience: [
    {
      title: 'Lead Frontend Engineer',
      org: 'Booking & travel platform · contract',
      period: '2024 — 2025',
      bullets: [
        'Led the rebuild of a four-market booking platform from per-locale forks into one headless, edge-routed system.',
        'Introduced React Server Components and Server Actions, lifting conversion 38% and cutting P75 LCP by 63%.',
        'Mentored three frontend engineers and set the architecture and review standards for the rebuild.',
      ],
    },
    {
      title: 'Frontend Engineer',
      org: 'Headless CMS & publishing',
      period: '2022 — 2024',
      bullets: [
        'Migrated an editorial team off a legacy monolith onto a headless CMS with an on-demand revalidation pipeline.',
        'Cut build times 71% with cache-aware CI and a task graph across a growing monorepo.',
        'Shipped a schema-driven form engine that removed engineering from most content changes.',
      ],
    },
    {
      title: 'Frontend Developer',
      org: 'Multi-client product & agency work',
      period: '2020 — 2022',
      bullets: [
        'Built multilingual, accessible interfaces across booking, CMS, and dashboard products.',
        'Established the shared component patterns several later projects were forked from.',
      ],
    },
  ],
  selectedWork: [
    { name: 'Atlas', note: 'Booking · +38% conv.' },
    { name: 'Ledger', note: 'CMS · −71% build' },
    { name: 'Prism', note: 'Design system · 6→11 teams' },
    { name: 'Beacon', note: 'Realtime · −63% LCP' },
  ],
  skills: [
    'Frontend architecture',
    'React / RSC',
    'TypeScript',
    'Performance',
    'Design systems',
    'i18n / localization',
    'Accessibility',
    'Mentoring',
  ],
  coreTools: [
    'Next.js',
    'Node.js',
    'Tailwind',
    'PostgreSQL',
    'GraphQL',
    'Playwright',
    'Vercel',
    'Figma',
  ],
  education: [
    {
      title: 'B.Sc. Computer Science',
      note: 'Studied & worked in Australia',
      period: '2016 — 2020',
    },
    {
      title: 'Ongoing',
      note: 'Frontend Platform Engineering',
      period: '2025 — now',
    },
  ],
  languages: [
    { name: 'Thai', level: 'NATIVE' },
    { name: 'English', level: 'FLUENT' },
  ],
} as const satisfies ResumePageData
