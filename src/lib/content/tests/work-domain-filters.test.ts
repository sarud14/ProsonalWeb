import { describe, expect, it } from 'vitest'

import { WORK_FILTER_ALL } from '@/constants/work'
import {
  buildWorkDomainFilterOptions,
  matchesWorkDomainFilter,
} from '@/lib/content/work-domain-filters'

describe('buildWorkDomainFilterOptions', () => {
  it('prefixes ALL and preserves domain order', () => {
    expect(buildWorkDomainFilterOptions(['Booking', 'Platform'])).toEqual([
      WORK_FILTER_ALL,
      'Booking',
      'Platform',
    ])
  })

  it('drops blanks and duplicates', () => {
    expect(buildWorkDomainFilterOptions(['CMS', '', 'CMS', '  Multilingual  '])).toEqual([
      WORK_FILTER_ALL,
      'CMS',
      'Multilingual',
    ])
  })
})

describe('matchesWorkDomainFilter', () => {
  it('matches ALL against any domains', () => {
    expect(matchesWorkDomainFilter(['Booking'], WORK_FILTER_ALL)).toBe(true)
  })

  it('matches an exact domain label', () => {
    expect(matchesWorkDomainFilter(['Booking', 'CMS'], 'CMS')).toBe(true)
    expect(matchesWorkDomainFilter(['Booking'], 'Platform')).toBe(false)
  })
})
