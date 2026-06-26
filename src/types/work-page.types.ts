export interface WorkDetailPageProps {
  readonly params: Promise<{ slug: string }>
}

export interface WorkPageProps {
  readonly params?: Promise<Record<string, never>>
}
