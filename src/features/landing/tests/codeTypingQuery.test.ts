import { describe, expect, it } from 'vitest'

import {
  CODE_TYPING_CHAR_DELAY_MS,
  CODE_TYPING_LINE_DELAY_MS,
  flattenCodeLines,
  typingDelayMs,
  visibleTypingLines,
} from '../query/codeTypingQuery'

describe('flattenCodeLines', () => {
  it('joins tokens then lines', () => {
    expect(
      flattenCodeLines([
        [
          { text: 'const', className: 'kw' },
          { text: ' x', className: 'id' },
        ],
        [{ text: 'done', className: 'id' }],
      ])
    ).toBe('const x\ndone')
  })

  it('returns an empty string for no lines', () => {
    expect(flattenCodeLines([])).toBe('')
  })
})

describe('typingDelayMs', () => {
  it('uses the line delay on a newline', () => {
    expect(typingDelayMs('\n')).toBe(CODE_TYPING_LINE_DELAY_MS)
  })

  it('uses the character delay otherwise', () => {
    expect(typingDelayMs('a')).toBe(CODE_TYPING_CHAR_DELAY_MS)
    expect(typingDelayMs(undefined)).toBe(CODE_TYPING_CHAR_DELAY_MS)
  })
})

describe('visibleTypingLines', () => {
  it('slices the typed prefix into lines', () => {
    expect(visibleTypingLines('ab\ncd', 3)).toEqual(['ab', ''])
  })
})
