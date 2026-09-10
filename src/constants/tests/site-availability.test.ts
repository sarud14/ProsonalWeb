import { describe, expect, it } from 'vitest'

import {
  getSiteAvailabilityDisplay,
  SITE_AVAILABILITY_LABEL,
} from '@/constants/site-availability'
import { parseSiteBrand } from '@/lib/admin/parse-site-config'

describe('getSiteAvailabilityDisplay', () => {
  it('returns green Available when open', () => {
    const display = getSiteAvailabilityDisplay(true)
    expect(display.label).toBe(SITE_AVAILABILITY_LABEL.AVAILABLE)
    expect(display.dotClassName).toContain('bg-success')
    expect(display.textClassName).toBe('text-success')
  })

  it('returns red Unavailable when closed', () => {
    const display = getSiteAvailabilityDisplay(false)
    expect(display.label).toBe(SITE_AVAILABILITY_LABEL.UNAVAILABLE)
    expect(display.dotClassName).toContain('bg-destructive')
    expect(display.textClassName).toBe('text-destructive')
  })
})

describe('parseSiteBrand', () => {
  it('migrates legacy showAvailability to isAvailable', () => {
    const brand = parseSiteBrand({ showAvailability: false })
    expect(brand.isAvailable).toBe(false)
  })
})
