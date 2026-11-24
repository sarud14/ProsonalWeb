import { describe, expect, it } from 'vitest'

import { WORK_STATUS } from '@/constants/content'
import type { WorkCaseStudy } from '@/types/work.types'

import { buildWorkCaseMeta, getWorkCaseDetail } from '../query/workCaseDetail'

const WORK: WorkCaseStudy = {
  slug: 'cms',
  title: 'CMS rebuild',
  status: WORK_STATUS.PUBLISHED,
  listId: '01',
  role: 'Lead FE',
  tagline: 'Tagline',
  domains: ['Platform', 'Content'],
  stack: ['Next.js', 'Prisma'],
  metric: '40%',
  metricLabel: 'Faster Publishing',
  year: '2025',
  context: 'First sentence. Second sentence! Third?',
  problem: 'Problem text',
  constraints: 'Constraint text',
  architecture: 'Architecture text',
  decisions: 'Decision text',
  impact: 'Impact one. Impact two.',
}

describe('buildWorkCaseMeta', () => {
  it('joins stack and domains and formats status and impact', () => {
    expect(buildWorkCaseMeta(WORK)).toEqual([
      { label: 'ROLE', value: 'Lead FE' },
      { label: 'STACK', value: 'Next.js · Prisma' },
      { label: 'STATUS', value: 'Shipped 2025' },
      { label: 'IMPACT', value: '40% Faster Publishing' },
      { label: 'DOMAINS', value: 'Platform · Content' },
    ])
  })
})

describe('getWorkCaseDetail', () => {
  it('splits context into a headline and remaining paragraphs', () => {
    const detail = getWorkCaseDetail(WORK)
    expect(detail.contextHeadline).toBe('First sentence.')
    expect(detail.contextParagraphs).toEqual(['Second sentence!', 'Third?'])
    expect(detail.outcomes).toEqual(['Impact one.', 'Impact two.'])
  })

  it('keeps the whole context as a paragraph when it is a single sentence', () => {
    const detail = getWorkCaseDetail({ ...WORK, context: 'Only one' })
    expect(detail.contextHeadline).toBe('Only one')
    expect(detail.contextParagraphs).toEqual(['Only one'])
  })

  it('lowercases the metric label and falls back to Platform without domains', () => {
    const detail = getWorkCaseDetail({ ...WORK, domains: [] })
    expect(detail.problemStats[0]).toEqual({ value: '40%', label: 'faster publishing' })
    expect(detail.problemStats[2]?.value).toBe('Platform')
  })
})
