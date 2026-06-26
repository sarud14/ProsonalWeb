import { describe, expect, it } from 'vitest'

import { JOURNAL_STATUS } from '@/constants/content'
import { journalFrontmatterSchema } from '@/validators/journal.schema'

describe('journalFrontmatterSchema', () => {
  it('accepts published journal frontmatter', () => {
    const result = journalFrontmatterSchema.safeParse({
      title: 'Shipping notes',
      status: JOURNAL_STATUS.PUBLISHED,
      publishedAt: '2026-06-01',
    })

    expect(result.success).toBe(true)
  })

  it('rejects an invalid status value', () => {
    const result = journalFrontmatterSchema.safeParse({
      title: 'Invalid',
      status: 'archived',
    })

    expect(result.success).toBe(false)
  })
})
