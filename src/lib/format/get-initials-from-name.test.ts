import { describe, expect, it } from 'vitest'

import { getInitialsFromName } from '@/lib/format/get-initials-from-name'

describe('getInitialsFromName', () => {
  it('returns first letters of first two words', () => {
    expect(getInitialsFromName('Sarut Dumrongprechachan')).toBe('SD')
  })

  it('returns first two letters for a single word', () => {
    expect(getInitialsFromName('Madonna')).toBe('MA')
  })

  it('returns placeholder for empty input', () => {
    expect(getInitialsFromName('   ')).toBe('??')
  })
})
