import type { JournalContentBlock } from '@/types/journal-post-detail.types'

export function parseJournalBlocks(body: string): readonly JournalContentBlock[] {
  const sections = body.trim().split(/\n(?=## )/)

  return sections
    .filter((section) => section.startsWith('## '))
    .map((section) => {
      const newlineIndex = section.indexOf('\n')
      const heading =
        newlineIndex === -1
          ? section.slice(3).trim()
          : section.slice(3, newlineIndex).trim()
      const paragraph =
        newlineIndex === -1 ? '' : section.slice(newlineIndex + 1).trim()

      return { heading, paragraph }
    })
}
