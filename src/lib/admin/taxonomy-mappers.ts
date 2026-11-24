import type { AdminDomainItem } from '@/types/admin-taxonomy.types'
import type { DomainRow } from '@/types/admin-taxonomy.types'

export function mapDomainItems(domains: readonly DomainRow[]): AdminDomainItem[] {
  return domains.map((domain) => ({
    id: domain.id,
    label: domain.label,
    sortOrder: domain.sortOrder,
    referenceCount: domain._count.works,
  }))
}
