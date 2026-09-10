import { describe, expect, it } from 'vitest'

import {
  assignLandingBlockOrders,
  normalizeLandingBlockOrders,
} from '@/constants/admin-pages'
import type { LandingBlock } from '@/types/site.types'

function block(type: LandingBlock['type'], order: number): LandingBlock {
  return { type, enabled: true, order, props: { items: [] } }
}

describe('assignLandingBlockOrders', () => {
  it('preserves array order when assigning order indices', () => {
    const shuffled = [block('modules', 1), block('stats', 0), block('techStack', 2)]

    const result = assignLandingBlockOrders(shuffled)

    expect(result.map((b) => b.type)).toEqual(['modules', 'stats', 'techStack'])
    expect(result.map((b) => b.order)).toEqual([0, 1, 2])
  })
})

describe('normalizeLandingBlockOrders', () => {
  it('sorts by stored order then re-indexes', () => {
    const shuffled = [block('modules', 1), block('stats', 0), block('techStack', 2)]

    const result = normalizeLandingBlockOrders(shuffled)

    expect(result.map((b) => b.type)).toEqual(['stats', 'modules', 'techStack'])
    expect(result.map((b) => b.order)).toEqual([0, 1, 2])
  })
})
