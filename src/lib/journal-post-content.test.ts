import { describe, expect, it } from 'vitest'

import { parseJournalBlocks } from '@/lib/journal-post-content'

describe('parseJournalBlocks', () => {
  it('parses markdown sections into heading and paragraph blocks', () => {
    const blocks = parseJournalBlocks(`## The reframe

First paragraph here.

## What it changed

Second paragraph here.`)

    expect(blocks).toEqual([
      { heading: 'The reframe', paragraph: 'First paragraph here.' },
      { heading: 'What it changed', paragraph: 'Second paragraph here.' },
    ])
  })

  it('returns an empty array when no sections exist', () => {
    expect(parseJournalBlocks('Plain intro without headings.')).toEqual([])
  })
})
