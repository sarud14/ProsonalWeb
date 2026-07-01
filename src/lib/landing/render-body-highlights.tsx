import type { ReactNode } from 'react'

import type { LandingHeroData } from '@/types/landing.types'

export function renderBodyWithHighlights(
  body: string,
  highlights: readonly string[]
): ReactNode {
  if (highlights.length === 0) return body

  const pattern = highlights
    .map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|')
  const regex = new RegExp(`(${pattern})`, 'g')
  const parts = body.split(regex)

  return parts.map((part, index) => {
    const isHighlight = highlights.includes(part)
    if (!isHighlight) return part

    return (
      <span key={`${part}-${index}`} className="text-foreground">
        {part}
      </span>
    )
  })
}

export function pickHeroEngineerConfig(
  hero: LandingHeroData
): Pick<
  LandingHeroData,
  'codeFilename' | 'codeRole' | 'codeStack' | 'codeDomains' | 'codeFocus' | 'codeStatus'
> {
  return {
    codeFilename: hero.codeFilename,
    codeRole: hero.codeRole,
    codeStack: hero.codeStack,
    codeDomains: hero.codeDomains,
    codeFocus: hero.codeFocus,
    codeStatus: hero.codeStatus,
  }
}
