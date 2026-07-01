import type { LandingBlock } from '@/types/site.types'

export const ADMIN_PAGE_TABS = [
  { key: 'landing', label: 'Landing', href: '/admin/pages/landing' },
  { key: 'focus', label: 'Focus', href: '/admin/pages/focus' },
  { key: 'stack', label: 'Stack', href: '/admin/pages/stack' },
  { key: 'site', label: 'Site', href: '/admin/pages/site' },
] as const

export type AdminPageTabKey = (typeof ADMIN_PAGE_TABS)[number]['key']

export const LANDING_BLOCK_TYPES = [
  { value: 'stats', label: 'Stats', defaultProps: { items: [] } },
  { value: 'modules', label: 'Modules', defaultProps: { items: [] } },
  { value: 'techStack', label: 'Tech stack', defaultProps: { items: [] } },
] as const

export function createLandingBlockId(): string {
  return `block-${Date.now()}`
}

export function sortLandingBlocks(blocks: readonly LandingBlock[]): LandingBlock[] {
  return [...blocks].sort((a, b) => a.order - b.order)
}

/** Assign `order` from current array position — does not re-sort (use after drag/reorder). */
export function assignLandingBlockOrders(blocks: readonly LandingBlock[]): LandingBlock[] {
  return blocks.map((block, index) => ({
    ...block,
    order: index,
  }))
}

/** Sort by stored `order`, then re-index — use when loading from DB or seed. */
export function normalizeLandingBlockOrders(blocks: readonly LandingBlock[]): LandingBlock[] {
  return assignLandingBlockOrders(sortLandingBlocks(blocks))
}
