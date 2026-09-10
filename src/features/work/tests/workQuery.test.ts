import { describe, expect, it } from 'vitest'

import { WORK_FILTER_ALL } from '@/constants/work'
import type { WorkCaseStudy } from '@/types/work.types'

import { articleReadProgressPercent, queryWorkList } from '../query/workQuery'

function study(
  slug: string,
  domains: readonly string[]
): WorkCaseStudy {
  return {
    slug,
    title: slug,
    status: 'published',
    listId: '01',
    role: 'FE',
    tagline: 'Tagline',
    domains: [...domains],
    stack: ['Next.js'],
    metric: '1',
    metricLabel: 'TEST',
    year: '2026',
    context: 'Context',
    problem: 'Problem',
    constraints: 'Constraints',
    architecture: 'Architecture',
    decisions: 'Decisions',
    impact: 'Impact',
  }
}

describe('queryWorkList', () => {
  const items = [study('cms-rebuild', ['CMS']), study('booking', ['Booking'])]

  it('shows every item and a count label on ALL', () => {
    const result = queryWorkList(items, ['CMS', 'Booking'], WORK_FILTER_ALL)

    expect(result.filters).toEqual([WORK_FILTER_ALL, 'CMS', 'Booking'])
    expect(result.shownItems.map((item) => item.slug)).toEqual(['cms-rebuild', 'booking'])
    expect(result.countLabel).toBe('SHOWING 2 OF 2')
  })

  it('narrows the list to one domain', () => {
    const result = queryWorkList(items, ['CMS', 'Booking'], 'CMS')

    expect(result.shownItems.map((item) => item.slug)).toEqual(['cms-rebuild'])
    expect(result.countLabel).toBe('SHOWING 1 OF 2')
  })

  it('returns an empty list and a zero count for no items', () => {
    const result = queryWorkList([], ['CMS'], WORK_FILTER_ALL)

    expect(result.shownItems).toEqual([])
    expect(result.countLabel).toBe('SHOWING 0 OF 0')
  })
})

describe('articleReadProgressPercent', () => {
  it('returns 0 when the article does not overflow the viewport', () => {
    expect(articleReadProgressPercent(0, 400, 800)).toBe(0)
  })

  it('returns 50 when half of the overflow has scrolled past', () => {
    expect(articleReadProgressPercent(-50, 200, 100)).toBe(50)
  })
})
