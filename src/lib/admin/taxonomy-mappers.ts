import type { AdminDomainItem } from '@/types/admin-taxonomy.types'

type DomainRow = {
  readonly id: string
  readonly label: string
  readonly sortOrder: number
  readonly _count: { readonly works: number }
}

export function mapDomainItems(domains: readonly DomainRow[]): AdminDomainItem[] {
  return domains.map((domain) => ({
    id: domain.id,
    label: domain.label,
    sortOrder: domain.sortOrder,
    referenceCount: domain._count.works,
  }))
}
