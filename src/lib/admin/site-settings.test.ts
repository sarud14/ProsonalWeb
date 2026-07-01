import { describe, expect, it } from 'vitest'

import { parseSiteFooter, parseSiteSeo, parseSiteSocialLinks } from '@/lib/admin/site-settings'

describe('parseSiteSeo', () => {
  it('fills defaults for empty object', () => {
    const seo = parseSiteSeo({})
    expect(seo.title).toBe('FEOps Kit')
    expect(seo.description.length).toBeGreaterThan(0)
  })
})

describe('parseSiteSocialLinks', () => {
  it('reads links array from legacy object shape', () => {
    const links = parseSiteSocialLinks({
      links: [{ label: 'GitHub', url: 'https://github.com/example' }],
    })
    expect(links).toEqual([{ label: 'GitHub', url: 'https://github.com/example' }])
  })
})

describe('parseSiteFooter', () => {
  it('migrates footer fields from legacy contact object', () => {
    const footer = parseSiteFooter({}, {
      footerCopyright: 'Test User',
      footerTagline: 'Hello',
      footerBuildLabel: 'Build 1',
    })
    expect(footer.copyrightName).toBe('Test User')
    expect(footer.tagline).toBe('Hello')
    expect(footer.buildLabel).toBe('Build 1')
  })
})
