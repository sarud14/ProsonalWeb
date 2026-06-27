import type { JournalFrontmatter } from '@/validators/journal.schema'

export interface JournalPost extends JournalFrontmatter {
  readonly slug: string
  readonly content: string
}

export interface JournalPostListProps {
  readonly posts: readonly JournalPost[]
}
