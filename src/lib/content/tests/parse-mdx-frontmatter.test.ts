import { describe, expect, it } from 'vitest'

import { parseMdxFrontmatter } from '@/lib/content/parse-mdx-frontmatter'
import { JOURNAL_STATUS } from '@/constants/content'
import { journalFrontmatterSchema } from '@/validators/journal.schema'

describe('parseMdxFrontmatter', () => {
  it('parses frontmatter and body from MDX content', () => {
    const parsed = parseMdxFrontmatter(
      `---
title: Sample Post
status: published
publishedAt: "2026 · 05"
tag: "SYSTEMS"
excerpt: "Sample excerpt for the journal list."
readTime: "6 MIN"
---

Body content here.`,
      'sample-post'
    )

    expect(parsed.slug).toBe('sample-post')
    expect(parsed.frontmatter.title).toBe('Sample Post')
    expect(parsed.body).toBe('Body content here.')

    const validated = journalFrontmatterSchema.safeParse(parsed.frontmatter)
    expect(validated.success).toBe(true)
    if (validated.success) {
      expect(validated.data.status).toBe(JOURNAL_STATUS.PUBLISHED)
    }
  })

  it('parses JSON array frontmatter values', () => {
    const parsed = parseMdxFrontmatter(
      `---
title: Atlas
domains: ["Booking", "Multilingual"]
stack: ["Next.js", "TS"]
---

Body content here.`,
      'atlas'
    )

    expect(parsed.frontmatter.domains).toEqual(['Booking', 'Multilingual'])
    expect(parsed.frontmatter.stack).toEqual(['Next.js', 'TS'])
  })

  it('returns raw content as body when frontmatter is missing', () => {
    const parsed = parseMdxFrontmatter('Plain content without frontmatter.', 'plain')

    expect(parsed.frontmatter).toEqual({})
    expect(parsed.body).toBe('Plain content without frontmatter.')
  })
})
