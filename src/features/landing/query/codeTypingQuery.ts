import type { CodeLine } from '@/types/code-typing.types'

export const CODE_TYPING_CHAR_DELAY_MS = 30
export const CODE_TYPING_LINE_DELAY_MS = 200

export function flattenCodeLines(lines: readonly CodeLine[]): string {
  return lines.map((line) => line.map((token) => token.text).join('')).join('\n')
}

export function typingDelayMs(char: string | undefined): number {
  return char === '\n' ? CODE_TYPING_LINE_DELAY_MS : CODE_TYPING_CHAR_DELAY_MS
}

export function visibleTypingLines(fullText: string, charCount: number): readonly string[] {
  return fullText.slice(0, charCount).split('\n')
}
