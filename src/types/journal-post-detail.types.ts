export interface JournalContentBlock {
  readonly heading: string
  readonly paragraph: string
}

export interface JournalPostDetailViewProps {
  readonly post: import('@/types/journal.types').JournalPost
  readonly postCount: number
}
