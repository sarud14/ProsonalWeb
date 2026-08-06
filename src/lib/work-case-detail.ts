import { WORK_CASE_META_LABELS } from '@/constants/work-case-sections'
import type {
  WorkCaseDetail,
  WorkCaseMetaItem,
} from '@/types/work-case-detail.types'
import type { WorkCaseStudy } from '@/types/work.types'

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
  return buildFallbackDetail(work)
}
