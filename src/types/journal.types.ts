export interface JournalPost {
  readonly slug: string
  title: string
  status: 'draft' | 'published'
  content: string
  publishedAt: string | null
}
