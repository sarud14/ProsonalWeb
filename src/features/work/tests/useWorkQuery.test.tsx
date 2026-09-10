import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { WORK_FILTER_ALL } from '@/constants/work'
import type { WorkCaseStudy } from '@/types/work.types'

import { useWorkQuery } from '../query/useWorkQuery'

function study(slug: string, domains: readonly string[]): WorkCaseStudy {
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

describe('useWorkQuery', () => {
  const items = [study('cms-rebuild', ['CMS']), study('booking', ['Booking'])]

  it('binds ALL as the default filter and applies a domain change', () => {
    const { result } = renderHook(() => useWorkQuery(items, ['CMS', 'Booking']))

    expect(result.current.activeFilter).toBe(WORK_FILTER_ALL)
    expect(result.current.shownItems).toHaveLength(2)

    act(() => {
      result.current.setActiveFilter('CMS')
    })

    expect(result.current.activeFilter).toBe('CMS')
    expect(result.current.shownItems.map((item) => item.slug)).toEqual(['cms-rebuild'])
  })
})
