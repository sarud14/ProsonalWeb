import { describe, expect, it } from 'vitest'

import { DEFAULT_LANDING_HERO, parseLandingPageData } from '@/lib/admin/landing-hero'
import { buildEngineerCodeLines } from '@/lib/landing/engineer-code-lines'

describe('parseLandingPageData', () => {
  it('migrates legacy focusItems block into hero.metaItems', () => {
    const result = parseLandingPageData({
      blocks: [
        {
          type: 'focusItems',
          enabled: true,
          order: 0,
          props: {
            items: [{ label: 'Focus', value: 'Platform' }],
          },
        },
      ],
    })

    expect(result.hero.metaItems).toEqual([{ label: 'Focus', value: 'Platform' }])
    expect(result.blocks).toHaveLength(0)
  })

  it('prefers explicit hero over legacy focusItems', () => {
    const result = parseLandingPageData({
      hero: { ...DEFAULT_LANDING_HERO, profileName: 'From hero field' },
      blocks: [
        {
          type: 'focusItems',
          enabled: true,
          order: 0,
          props: { items: [{ label: 'X', value: 'Y' }] },
        },
      ],
    })

    expect(result.hero.profileName).toBe('From hero field')
  })
})

describe('buildEngineerCodeLines', () => {
  it('includes configured stack and domains in output', () => {
    const lines = buildEngineerCodeLines({
      codeRole: 'Frontend Engineer',
      codeStack: ['Next.js', 'TS'],
      codeDomains: ['cms'],
      codeFocus: 'platform-eng',
      codeStatus: 'available',
    })

    const flat = lines.map((line) => line.map((token) => token.text).join('')).join('\n')
    expect(flat).toContain('"Next.js"')
    expect(flat).toContain('"cms"')
    expect(flat).toContain('"platform-eng"')
  })
})
