import { describe, expect, it } from 'vitest'

import { ENGINEERING_NOTE_TYPE } from '@/constants/engineering'
import { resolveEngineeringTypeFromPath } from '@/lib/content/engineering-type-path'

describe('resolveEngineeringTypeFromPath', () => {
  it('maps known engineering sub-routes', () => {
    expect(resolveEngineeringTypeFromPath('architecture')).toBe(
      ENGINEERING_NOTE_TYPE.ARCHITECTURE,
    )
    expect(resolveEngineeringTypeFromPath('decisions')).toBe(
      ENGINEERING_NOTE_TYPE.DECISIONS,
    )
    expect(resolveEngineeringTypeFromPath('performance')).toBe(
      ENGINEERING_NOTE_TYPE.PERFORMANCE,
    )
  })

  it('returns null for unknown segments', () => {
    expect(resolveEngineeringTypeFromPath('unknown')).toBeNull()
  })
})
