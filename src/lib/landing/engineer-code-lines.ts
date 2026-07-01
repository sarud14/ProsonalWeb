import type { CodeLine } from '@/types/code-typing.types'
import type { LandingHeroData } from '@/types/landing.types'

function quotedStrings(values: readonly string[]): CodeLine {
  const tokens: CodeLine[number][] = []
  values.forEach((value, index) => {
    if (index > 0) {
      tokens.push({ text: ', ', className: 'text-muted-foreground' })
    }
    tokens.push({ text: `"${value}"`, className: 'text-foreground' })
  })
  return tokens
}

export function buildEngineerCodeLines(hero: Pick<
  LandingHeroData,
  'codeRole' | 'codeStack' | 'codeDomains' | 'codeFocus' | 'codeStatus'
>): readonly CodeLine[] {
  const stackTokens = quotedStrings(hero.codeStack)
  const domainTokens = quotedStrings(hero.codeDomains)
  const statusClass =
    hero.codeStatus === 'available' ? 'text-success' : 'text-foreground'

  return [
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
      { text: `"${hero.codeRole}"`, className: 'text-foreground' },
      { text: ',', className: 'text-muted-foreground' },
    ],
    [
      { text: '  stack', className: 'text-muted-foreground/80' },
      { text: ': [', className: 'text-muted-foreground' },
      ...stackTokens,
      { text: '],', className: 'text-muted-foreground' },
    ],
    [
      { text: '  domains', className: 'text-muted-foreground/80' },
      { text: ': [', className: 'text-muted-foreground' },
      ...domainTokens,
      { text: '],', className: 'text-muted-foreground' },
    ],
    [
      { text: '  focus', className: 'text-muted-foreground/80' },
      { text: ': ', className: 'text-muted-foreground' },
      { text: `"${hero.codeFocus}"`, className: 'text-primary' },
      { text: ',', className: 'text-muted-foreground' },
    ],
    [
      { text: '  status', className: 'text-muted-foreground/80' },
      { text: ': ', className: 'text-muted-foreground' },
      { text: `"${hero.codeStatus}"`, className: statusClass },
      { text: ',', className: 'text-muted-foreground' },
    ],
    [
      { text: '}', className: 'text-muted-foreground' },
      { text: ' satisfies ', className: 'text-muted-foreground' },
      { text: 'Engineer', className: 'text-secondary-foreground' },
      { text: ';', className: 'text-muted-foreground' },
    ],
  ]
}
