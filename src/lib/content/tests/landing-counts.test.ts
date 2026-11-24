import { describe, expect, it } from 'vitest'

import { buildLandingCounts, fillLandingCountTokens, padLandingNumber } from '../landing-counts'

describe('buildLandingCounts', () => {
  it('counts works and distinct trimmed domains', () => {
    expect(
      buildLandingCounts([
        { domains: ['CMS', 'Booking'] },
        { domains: ['CMS ', 'Events'] },
        { domains: [''] },
      ]),
    ).toEqual({ workCount: 3, domainCount: 3 })
  })

  it('returns zeros for no published work', () => {
    expect(buildLandingCounts([])).toEqual({ workCount: 0, domainCount: 0 })
  })
})

describe('fillLandingCountTokens', () => {
  const counts = { workCount: 9, domainCount: 12 }

  it('replaces tokens with zero-padded counts', () => {
    expect(fillLandingCountTokens('{workCount}', counts)).toBe('09')
    expect(fillLandingCountTokens('{domainCount}', counts)).toBe('12')
    expect(fillLandingCountTokens('{workCount} ENTRIES', counts)).toBe('09 ENTRIES')
  })

  it('leaves text without tokens unchanged', () => {
    expect(fillLandingCountTokens('2025', counts)).toBe('2025')
  })
})

describe('padLandingNumber', () => {
  it('pads to two digits', () => {
    expect(padLandingNumber(3)).toBe('03')
    expect(padLandingNumber(12)).toBe('12')
  })
})
