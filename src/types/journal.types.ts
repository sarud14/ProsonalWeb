import type { JournalFrontmatter } from '@/validators/journal.schema'

export interface JournalPost extends JournalFrontmatter {
  readonly slug: string
  readonly content: string
  readonly publishedAt: string | null
}
