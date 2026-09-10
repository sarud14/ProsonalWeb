import { describe, expect, it } from 'vitest'

import type { LandingBlock } from '@/types/site.types'

import { toClientBlocks, toPersistableBlocks } from '../query/landingPageQuery'

const blocks: readonly LandingBlock[] = [
  { type: 'contact', enabled: true, order: 1, props: { headline: 'Hi' } },
  { type: 'stats', enabled: true, order: 0, props: { items: [] } },
]

describe('toClientBlocks', () => {
  it('sorts by stored order then stamps clientId', () => {
    const client = toClientBlocks(blocks)
    expect(client.map((block) => block.type)).toEqual(['stats', 'contact'])
    expect(client[0]?.clientId).toBe('stats-0-0')
    expect(client[1]?.clientId).toBe('contact-1-1')
  })
})

describe('toPersistableBlocks', () => {
  it('strips clientId and assigns order from position', () => {
    expect(toPersistableBlocks(toClientBlocks(blocks))).toEqual([
      { type: 'stats', enabled: true, order: 0, props: { items: [] } },
      { type: 'contact', enabled: true, order: 1, props: { headline: 'Hi' } },
    ])
  })
})
