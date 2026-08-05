import type { ResumePageData } from '@/types/resume.types'

export const RESUME_PAGE_DATA = {
  name: 'Sarut Dumrongprechachan',
  role: 'FRONTEND DEVELOPER',
  contactLine:
    'ruj.working@gmail.com · github.com/sarud14 · Bangkok, Thailand — Open to Remote · EN / TH',
  experience: [
    {
      title: 'Frontend Developer',
      org: 'Inter Vision Business Groups Co., Ltd. · Bangkok',
      period: 'Oct 2025 — Present',
      bullets: [
        'Build customer-facing web apps and internal CMS panels with Next.js App Router, TypeScript, and Tailwind CSS.',
        'Integrate REST APIs across booking, exchange-rate, loyalty, and content modules, including presigned S3 uploads for media.',
        'Implement multilingual (TH / EN) forms and pages with next-intl, React Hook Form, and Zod validation scoped per language.',
        'Build data-heavy admin tables with server-side pagination and sorting, plus loading, empty, and error states.',
        'Refactor manual fetch calls into a shared SWR fetcher layer to remove duplicated request logic and stale-cache bugs.',
        'Debug and fix production issues across authentication, session handling, and file upload flows.',
      ],
    },
    {
      title: 'Chef',
      org: 'Hospitality industry · Australia & Thailand',
      period: '2015 — 2023',
      bullets: [
        'Eight years of professional kitchen experience, including five years working in Australia.',
        'Built the working English, time-pressure discipline, and team coordination now applied to shipping product.',
      ],
    },
  ],
  selectedWork: [
    {
      name: 'Currency Exchange Booking',
      note: 'Booking flow with stock limits and multi-branch pickup scheduling.',
    },
    {
      name: 'Multilingual CMS',
      note: 'Admin CMS with per-language validation and server-sorted tables.',
    },
    {
      name: 'FEOps Kit',
      note: 'This site — a content-driven portfolio system on Next.js and Prisma.',
    },
    {
      name: 'Herbal Catalogue',
      note: 'Trilingual product catalogue (TH / EN / ZH) on Payload CMS.',
    },
  ],
  skills: [
    'React',
    'Next.js (App Router)',
    'TypeScript',
    'Tailwind CSS',
    'REST API Integration',
    'React Hook Form + Zod',
    'State Management (Zustand / SWR)',
    'Localization (i18n)',
    'Responsive UI',
    'UI/UX & Figma handoff',
  ],
  coreTools: [
    'Next.js',
    'React',
    'TypeScript',
    'Tailwind',
    'Node.js',
    'Prisma',
    'Git / GitHub',
    'Figma',
  ],
  education: [
    {
      title: 'Next.js & NestJS',
      note: 'DevNest',
      period: 'Mar — May 2025',
    },
    {
      title: 'Full-Stack Development & DevSecOps',
      note: 'CodeCamp Thailand',
      period: '2023 — 2024',
    },
    {
      title: 'Grand Diplôme',
      note: 'Le Cordon Bleu Australia',
      period: '2015 — 2018',
    },
    {
      title: 'B.A. Art & Design',
      note: 'Rangsit University',
      period: '2010 — 2014',
    },
    {
      title: 'High School',
      note: 'Assumption College',
      period: '2005 — 2009',
    },
    {
      title: 'Professional Development',
      note: 'TypeScript, React patterns, frontend architecture, AI-assisted development',
      period: 'Ongoing',
    },
  ],
  languages: [
    { name: 'Thai', level: 'NATIVE' },
    { name: 'English', level: 'FLUENT' },
  ],
} as const satisfies ResumePageData
