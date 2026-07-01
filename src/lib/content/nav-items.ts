import type { NavItem } from '@/types/site.types'

export function getVisibleNavItems(items: readonly NavItem[]): readonly NavItem[] {
  return [...items]
    .filter((item) => item.enabled)
    .sort((a, b) => a.order - b.order)
}
