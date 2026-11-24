import { describe, expect, it } from 'vitest'

import { buildLandingCounts, fillLandingCountTokens } from '../landing-counts'

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
