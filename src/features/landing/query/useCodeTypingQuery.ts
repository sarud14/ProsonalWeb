import { useEffect, useState } from 'react'

import type { CodeLine, CodeTypingQueryResult } from '@/types/code-typing.types'

import { flattenCodeLines, typingDelayMs, visibleTypingLines } from './codeTypingQuery'

export function useCodeTypingQuery(codeLines: readonly CodeLine[]): CodeTypingQueryResult {
  const fullText = flattenCodeLines(codeLines)
  const [charCount, setCharCount] = useState(0)
  const isDone = charCount >= fullText.length

  useEffect(() => {
    if (isDone) return

    const timer = setTimeout(() => {
      setCharCount((prev) => prev + 1)
    }, typingDelayMs(fullText[charCount]))

    return (): void => {
      clearTimeout(timer)
    }
  }, [charCount, fullText, isDone])

  return {
    visibleLines: visibleTypingLines(fullText, charCount),
    isDone,
  }
}
