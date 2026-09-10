import { describe, expect, it } from 'vitest'

import { WORK_STATUS } from '@/constants/content'
import { workFrontmatterSchema } from '@/validators/work.schema'

describe('workFrontmatterSchema', () => {
  it('accepts a valid published case study frontmatter', () => {
    const result = workFrontmatterSchema.safeParse({
      title: 'Modular CMS Rebuild',
      status: WORK_STATUS.PUBLISHED,
      listId: '01',
      role: 'LEAD FE',
      tagline: 'Headless CMS and publishing pipeline for an editorial team.',
      domains: ['CMS', 'Architecture'],
      stack: ['Next.js', 'GraphQL', 'Node'],
      metric: '-71%',
      metricLabel: 'BUILD TIME',
      year: '2025',
      context: 'Legacy editorial stack.',
      problem: 'Unreliable publishing.',
      constraints: 'No downtime.',
      architecture: 'Next.js App Router.',
      decisions: 'Git-MDX default.',
      impact: 'Reduced release risk.',
    })

    expect(result.success).toBe(true)
  })

  it('rejects missing required fields', () => {
    const result = workFrontmatterSchema.safeParse({
      title: 'Incomplete',
      status: WORK_STATUS.PUBLISHED,
    })

    expect(result.success).toBe(false)
  })
})
