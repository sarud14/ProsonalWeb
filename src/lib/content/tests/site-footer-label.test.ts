import { describe, expect, it } from 'vitest'

import { fillBuildMonthToken, formatBuildMonth } from '../site-footer-label'

describe('formatBuildMonth', () => {
  it('formats as YYYY.MM in UTC', () => {
    expect(formatBuildMonth(new Date('2026-11-24T10:00:00Z'))).toBe('2026.11')
    expect(formatBuildMonth(new Date('2027-01-01T00:00:00Z'))).toBe('2027.01')
  })
})

describe('fillBuildMonthToken', () => {
  const date = new Date('2026-11-24T10:00:00Z')

  it('replaces the token', () => {
    expect(fillBuildMonthToken('Build {buildMonth} · All systems nominal', date)).toBe(
      'Build 2026.11 · All systems nominal',
    )
  })

  it('leaves a label without the token unchanged', () => {
    expect(fillBuildMonthToken('Build 2026.08', date)).toBe('Build 2026.08')
  })
})
