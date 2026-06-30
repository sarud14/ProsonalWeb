export interface AdminDomainItem {
  readonly id: string
  readonly label: string
  readonly sortOrder: number
  readonly referenceCount: number
}

export interface TaxonomyPageViewProps {
  readonly initialDomains: readonly AdminDomainItem[]
}
