import { omitClientIds } from '@/lib/admin/client-list'
import type { ClientStackGroup } from '@/types/admin-pages.types'
import type { StackGroup } from '@/types/stack.types'

export function toClientGroups(groups: readonly StackGroup[]): ClientStackGroup[] {
  return groups.map((group, index) => ({
    ...group,
    clientId: `group-${group.label}-${index}`,
  }))
}

export function toPersistableGroups(groups: readonly ClientStackGroup[]): StackGroup[] {
  return omitClientIds(groups)
}
