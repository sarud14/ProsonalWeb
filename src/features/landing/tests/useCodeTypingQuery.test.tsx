import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { CODE_TYPING_CHAR_DELAY_MS } from '../query/codeTypingQuery'
import { useCodeTypingQuery } from '../query/useCodeTypingQuery'

describe('useCodeTypingQuery', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('reveals one character per delay until done', () => {
    const { result } = renderHook(() =>
      useCodeTypingQuery([[{ text: 'ab', className: 'id' }]])
    )

    expect(result.current.visibleLines).toEqual([''])
    expect(result.current.isDone).toBe(false)

    act(() => {
      vi.advanceTimersByTime(CODE_TYPING_CHAR_DELAY_MS)
    })
    expect(result.current.visibleLines).toEqual(['a'])

    act(() => {
      vi.advanceTimersByTime(CODE_TYPING_CHAR_DELAY_MS)
    })
    expect(result.current.visibleLines).toEqual(['ab'])
    expect(result.current.isDone).toBe(true)
  })
})
