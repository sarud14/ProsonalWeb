'use client'

import { useEffect, useState } from 'react'

import { Card } from '@/components/ui/Card'
import type { CodeLine } from '@/types/code-typing.types'

const CODE_LINES: readonly CodeLine[] = [
  [
    { text: 'const', className: 'text-muted-foreground' },
    { text: ' ', className: '' },
    { text: 'engineer', className: 'text-secondary-foreground' },
    { text: ' ', className: '' },
    { text: '= {', className: 'text-muted-foreground' },
  ],
  [
    { text: '  role', className: 'text-muted-foreground/80' },
    { text: ': ', className: 'text-muted-foreground' },
    { text: '"Frontend Engineer"', className: 'text-foreground' },
    { text: ',', className: 'text-muted-foreground' },
  ],
  [
    { text: '  stack', className: 'text-muted-foreground/80' },
    { text: ': [', className: 'text-muted-foreground' },
    { text: '"Next.js"', className: 'text-foreground' },
    { text: ', ', className: 'text-muted-foreground' },
    { text: '"TS"', className: 'text-foreground' },
    { text: ', ', className: 'text-muted-foreground' },
    { text: '"React"', className: 'text-foreground' },
    { text: '],', className: 'text-muted-foreground' },
  ],
  [
    { text: '  domains', className: 'text-muted-foreground/80' },
    { text: ': [', className: 'text-muted-foreground' },
    { text: '"cms"', className: 'text-foreground' },
    { text: ', ', className: 'text-muted-foreground' },
    { text: '"booking"', className: 'text-foreground' },
    { text: ', ', className: 'text-muted-foreground' },
    { text: '"i18n"', className: 'text-foreground' },
    { text: '],', className: 'text-muted-foreground' },
  ],
  [
    { text: '  focus', className: 'text-muted-foreground/80' },
    { text: ': ', className: 'text-muted-foreground' },
    { text: '"platform-eng"', className: 'text-primary' },
    { text: ',', className: 'text-muted-foreground' },
  ],
  [
    { text: '  status', className: 'text-muted-foreground/80' },
    { text: ': ', className: 'text-muted-foreground' },
    { text: '"available"', className: 'text-success' },
    { text: ',', className: 'text-muted-foreground' },
  ],
  [
    { text: '}', className: 'text-muted-foreground' },
    { text: ' satisfies ', className: 'text-muted-foreground' },
    { text: 'Engineer', className: 'text-secondary-foreground' },
    { text: ';', className: 'text-muted-foreground' },
  ],
]

const CHAR_DELAY = 30
const LINE_DELAY = 200

function flattenLines(lines: readonly CodeLine[]): string {
  return lines.map((line) => line.map((token) => token.text).join('')).join('\n')
}

export function CodeTypingBlock(): React.JSX.Element {
  const fullText = flattenLines(CODE_LINES)
  const [charCount, setCharCount] = useState(0)
  const isDone = charCount >= fullText.length

  useEffect(() => {
    if (isDone) return

    const currentChar = fullText[charCount]
    const delay = currentChar === '\n' ? LINE_DELAY : CHAR_DELAY

    const timer = setTimeout(() => {
      setCharCount((prev) => prev + 1)
    }, delay)

    return (): void => {
      clearTimeout(timer)
    }
  }, [charCount, fullText, isDone])

  const visibleText = fullText.slice(0, charCount)
  const visibleLines = visibleText.split('\n')

  return (
    <Card className="overflow-hidden rounded-none p-0">
      <div className="flex items-center gap-2.5 border-b border-border bg-secondary px-3.5 py-[11px]">
        <span className="flex gap-1.5">
          <span className="size-[9px] rounded-full bg-white/16" />
          <span className="size-[9px] rounded-full bg-white/16" />
          <span className="size-[9px] rounded-full bg-white/16" />
        </span>
        <span className="font-mono text-[11px] tracking-[0.04em] text-muted-foreground">
          engineer.config.ts
        </span>
      </div>
      <div className="px-[22px] py-5 font-mono text-[12.5px] leading-[2.05]">
        {visibleLines.map((lineText, lineIdx) => (
          <div key={lineIdx}>
            {renderLineTokens(lineIdx, lineText)}
            {lineIdx === visibleLines.length - 1 && (
              <span
                className={`ml-0.5 inline-block h-[15px] w-2 align-middle ${isDone ? 'animate-pulse' : ''} bg-primary`}
              />
            )}
          </div>
        ))}
      </div>
    </Card>
  )
}

function renderLineTokens(lineIdx: number, visibleLineText: string): React.JSX.Element {
  if (lineIdx >= CODE_LINES.length) return <></>

  const tokens = CODE_LINES[lineIdx]
  const elements: React.JSX.Element[] = []
  let consumed = 0

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]
    const remaining = visibleLineText.length - consumed

    if (remaining <= 0) break

    const visiblePart = token.text.slice(0, remaining)
    elements.push(
      <span key={i} className={token.className}>
        {visiblePart}
      </span>
    )
    consumed += visiblePart.length
  }

  return <>{elements}</>
}
