export interface JournalPostPageProps {
  readonly params: Promise<{ slug: string }>
}

export interface JournalPageProps {
  readonly params?: Promise<Record<string, never>>
}
