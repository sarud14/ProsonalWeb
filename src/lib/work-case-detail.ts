import { WORK_CASE_META_LABELS } from '@/constants/work-case-sections'
import type {
  WorkCaseDetail,
  WorkCaseMetaItem,
} from '@/types/work-case-detail.types'
import type { WorkCaseStudy } from '@/types/work.types'

const ATLAS_DETAIL = {
  contextHeadline:
    'A travel operator selling the same trips in four different markets.',
  contextParagraphs: [
    'Atlas began as a server-rendered monolith where every market was a hard fork. Content, availability logic, and checkout were duplicated per locale, and the four codebases had quietly drifted apart over three years of independent fixes.',
    'Each market had its own currency, payment rules, and editorial team — but they were all selling from the same underlying inventory. The duplication was the product\'s biggest liability, not a feature.',
  ],
  contextAside: [
    { label: 'MARKETS', value: 'TH / EN / JP / KR' },
    { label: 'CODEBASES', value: '4 forks → 1' },
    { label: 'MY ROLE', value: 'Lead frontend' },
  ],
  problemCallout:
    'Adding a fifth market meant forking the entire stack again. Availability lagged real-time by minutes, and editors couldn\'t publish a price change without shipping an engineering release.',
  problemStats: [
    {
      value: '~3 mo',
      label: 'to launch a new market under the old stack',
    },
    {
      value: '4×',
      label: 'duplicated checkout & content logic to maintain',
    },
    {
      value: 'mins',
      label: 'of lag between real availability and what users saw',
    },
  ],
  constraintsHeading: 'What we had to design around.',
  constraints: [
    {
      tag: 'C-01',
      kind: 'TECHNICAL',
      title: 'No API boundary',
      body: 'The monolith read straight from a shared database with no service layer to build against. The boundary had to be introduced without a big-bang rewrite.',
    },
    {
      tag: 'C-02',
      kind: 'TIME',
      title: 'Five-month window',
      body: 'The rebuild had to ship before peak booking season, in parallel with the existing product staying fully live and revenue-generating.',
    },
    {
      tag: 'C-03',
      kind: 'TEAM',
      title: 'Small team, no platform group',
      body: 'Three frontend engineers and one backend, with no dedicated platform or DevOps team to lean on for infrastructure.',
    },
    {
      tag: 'C-04',
      kind: 'COMPLIANCE',
      title: 'Per-market rules',
      body: 'Each locale carried its own currency, payment provider, and data-residency requirements that the routing layer had to honour.',
    },
  ],
  architectureHeadline: 'One codebase, locale resolved at the edge.',
  architectureBody:
    'The monolith was split into three boundaries: a headless content layer, a typed availability service, and a Next.js App Router frontend. Locale, currency, and auth are resolved in edge middleware before a request ever reaches the application tier.',
  tiers: [
    {
      label: 'CLIENT',
      code: 'tier 0',
      connector: 'i18n route resolve',
      nodes: [
        { name: 'Web App', note: '4 locales · RSC' },
        { name: 'Mobile Web', note: 'responsive · PWA' },
      ],
    },
    {
      label: 'EDGE',
      code: 'tier 1',
      connector: 'RSC payload',
      nodes: [
        { name: 'CDN', note: 'static + image opt' },
        { name: 'Middleware', note: 'locale · auth · geo' },
        { name: 'Edge Cache', note: 'SWR revalidate' },
      ],
    },
    {
      label: 'APP',
      code: 'tier 2',
      connector: 'typed contracts',
      nodes: [
        { name: 'App Router', note: 'Next.js · RSC' },
        { name: 'Server Actions', note: 'mutations · booking' },
        { name: 'ISR', note: 'on-demand revalidate' },
      ],
    },
    {
      label: 'SERVICES',
      code: 'tier 3',
      connector: 'query / persist',
      nodes: [
        { name: 'Booking API', note: 'REST · idempotent' },
        { name: 'Availability', note: 'event-driven' },
        { name: 'Auth', note: 'OIDC · sessions' },
      ],
    },
    {
      label: 'DATA',
      code: 'tier 4',
      connector: null,
      nodes: [
        { name: 'Headless CMS', note: 'localized models' },
        { name: 'PostgreSQL', note: 'inventory · orders' },
        { name: 'Redis', note: 'availability cache' },
      ],
    },
  ],
  decisionsHeading: 'Decision log — the choices that shaped it.',
  decisions: [
    {
      id: 'DEC-001',
      title: 'App Router + RSC over a client SPA',
      context:
        'Four locales needed first-class SEO, fast TTFB, and server-resolved currency without shipping a translation bundle to every client.',
      tradeoff:
        'A newer paradigm with a real team ramp-up cost, in exchange for streaming server rendering and a much smaller client.',
    },
    {
      id: 'DEC-002',
      title: 'Server-driven availability via Server Actions',
      context:
        'Booking state is authoritative on the server; optimistic client state had previously caused oversells during high traffic.',
      tradeoff:
        'Tighter client/server coupling, traded for far fewer client states to reason about and no double-booking class of bug.',
    },
    {
      id: 'DEC-003',
      title: 'Headless CMS with a localized content model',
      context:
        'Editorial teams in each market needed to publish copy and pricing without waiting on an engineering release cycle.',
      tradeoff:
        'A content migration and modelling cost up front, traded for editors shipping independently from then on.',
    },
    {
      id: 'DEC-004',
      title: 'i18n + auth resolved in edge middleware',
      context:
        'Locale, currency, and session had to be known before the app tier rendered, or every page paid a redirect penalty.',
      tradeoff:
        'More logic living at the edge to test and observe, traded for a faster first byte and clean app-tier code.',
    },
  ],
  impactHeading: 'What changed after launch.',
  impact: [
    {
      value: '+38%',
      label: 'conversion across the four markets post-launch',
    },
    {
      value: '−63%',
      label: 'P75 Largest Contentful Paint',
    },
    {
      value: '2 wk',
      label: 'to launch a 5th market — down from ~3 months',
    },
    {
      value: '0',
      label: 'eng releases needed for editorial changes',
    },
  ],
  outcomes: [
    'Four forked codebases collapsed into one, cutting maintenance surface and ending locale drift.',
    'Editorial teams now publish copy and pricing independently, removing engineering from the content loop entirely.',
    'A fifth market launched in two weeks as a configuration change, validating the platform investment.',
  ],
} as const satisfies WorkCaseDetail

const WORK_CASE_DETAIL_BY_SLUG: Readonly<Record<string, WorkCaseDetail>> = {
  atlas: ATLAS_DETAIL,
}

function splitParagraphs(text: string): readonly string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter(Boolean)
}

function buildFallbackDetail(work: WorkCaseStudy): WorkCaseDetail {
  const contextParagraphs = splitParagraphs(work.context)
  const [contextHeadline = work.context, ...restContext] = contextParagraphs

  return {
    contextHeadline,
    contextParagraphs:
      restContext.length > 0 ? restContext : [work.context],
    contextAside: [
      { label: 'ROLE', value: work.role },
      { label: 'STACK', value: work.stack.join(' · ') },
      { label: 'DOMAINS', value: work.domains.join(' · ') },
    ],
    problemCallout: work.problem,
    problemStats: [
      { value: work.metric, label: work.metricLabel.toLowerCase() },
      { value: work.year, label: 'year shipped' },
      {
        value: work.domains[0] ?? 'Platform',
        label: 'primary problem domain',
      },
    ],
    constraintsHeading: 'What we had to design around.',
    constraints: [
      {
        tag: 'C-01',
        kind: 'SCOPE',
        title: 'Delivery constraints',
        body: work.constraints,
      },
    ],
    architectureHeadline: work.title,
    architectureBody: work.architecture,
    tiers: [
      {
        label: 'APP',
        code: 'tier 0',
        connector: null,
        nodes: work.stack.map((item) => ({ name: item, note: 'core stack' })),
      },
    ],
    decisionsHeading: 'Decision log — the choices that shaped it.',
    decisions: [
      {
        id: 'DEC-001',
        title: 'Primary engineering decision',
        context: work.decisions,
        tradeoff: 'Documented trade-offs live in the full write-up.',
      },
    ],
    impactHeading: 'What changed after launch.',
    impact: [
      {
        value: work.metric,
        label: work.metricLabel.toLowerCase(),
      },
    ],
    outcomes: splitParagraphs(work.impact),
  }
}

export function buildWorkCaseMeta(work: WorkCaseStudy): readonly WorkCaseMetaItem[] {
  if (work.slug === 'atlas') {
    return [
      { label: WORK_CASE_META_LABELS.ROLE, value: 'Lead Frontend' },
      { label: WORK_CASE_META_LABELS.TIMELINE, value: '5 months' },
      { label: WORK_CASE_META_LABELS.TEAM, value: '3 FE · 1 BE · 1 PD' },
      { label: WORK_CASE_META_LABELS.STACK, value: 'Next.js · TS' },
      { label: WORK_CASE_META_LABELS.STATUS, value: `Shipped ${work.year}` },
    ]
  }

  return [
    { label: WORK_CASE_META_LABELS.ROLE, value: work.role },
    { label: WORK_CASE_META_LABELS.STACK, value: work.stack.join(' · ') },
    {
      label: WORK_CASE_META_LABELS.STATUS,
      value: `Shipped ${work.year}`,
    },
    {
      label: 'IMPACT',
      value: `${work.metric} ${work.metricLabel}`,
    },
    {
      label: 'DOMAINS',
      value: work.domains.join(' · '),
    },
  ]
}

export function getWorkCaseDetail(work: WorkCaseStudy): WorkCaseDetail {
  return WORK_CASE_DETAIL_BY_SLUG[work.slug] ?? buildFallbackDetail(work)
}
