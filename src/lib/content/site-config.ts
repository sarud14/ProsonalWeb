import 'server-only'

import type { NavItem } from '@/types/site.types'

const DEFAULT_NAV_ITEMS: readonly NavItem[] = [
  { key: 'work', label: 'Work', href: '/work', enabled: true, order: 0 },
  { key: 'engineering', label: 'Engineering', href: '/engineering', enabled: true, order: 1 },
  { key: 'journal', label: 'Journal', href: '/journal', enabled: true, order: 2 },
  { key: 'focus', label: 'Focus', href: '/focus', enabled: true, order: 3 },
  { key: 'stack', label: 'Stack', href: '/stack', enabled: true, order: 4 },
  { key: 'resume', label: 'Résumé', href: '/resume', enabled: true, order: 5 },
]

export async function getNavItems(): Promise<readonly NavItem[]> {
  // Phase 2: read from DB when CONTENT_SOURCE=db (PageSection key="site" → data.nav)
  // For now, return the default constant-driven list
  // Phase 3: filter by `enabled` and sort by `order` from CMS
  return DEFAULT_NAV_ITEMS.filter((item) => item.enabled).sort(
    (a, b) => a.order - b.order
  )
}
