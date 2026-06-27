import { describe, expect, it } from 'vitest'

import { ENGINEERING_NOTE_STATUS, ENGINEERING_NOTE_TYPE } from '@/constants/engineering'
import { engineeringFrontmatterSchema } from '@/validators/engineering.schema'

describe('engineeringFrontmatterSchema', () => {
  it('accepts a valid published engineering note frontmatter', () => {
    const result = engineeringFrontmatterSchema.safeParse({
      title: 'Boundaries before frameworks',
      status: ENGINEERING_NOTE_STATUS.PUBLISHED,
      listId: '01',
      type: ENGINEERING_NOTE_TYPE.ARCHITECTURE,
      summary: 'Splitting a per-locale monolith into clear tiers.',
      noteDate: '2026 · 05',
      readTime: '8 MIN',
    })

    expect(result.success).toBe(true)
  })

  it('rejects missing required fields', () => {
    const result = engineeringFrontmatterSchema.safeParse({
      title: 'Incomplete',
      status: ENGINEERING_NOTE_STATUS.PUBLISHED,
    })

    expect(result.success).toBe(false)
  })
})
