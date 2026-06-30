import type { FocusPageData } from '@/types/focus.types'
import type { LandingBlock, LandingPageData, SiteConfig } from '@/types/site.types'
import type { StackPageData } from '@/types/stack.types'

import { FOCUS_PAGE_DATA } from '@/constants/focus-page-data'
import { LANDING_FOCUS_ITEMS, LANDING_MODULES, LANDING_STATS, LANDING_TECH_STACK } from '@/constants/landing'
import { STACK_PAGE_DATA } from '@/constants/stack-page-data'

export const DEFAULT_LANDING_PAGE_DATA: LandingPageData = {
  blocks: [
    {
      type: 'stats',
      enabled: true,
      order: 0,
      props: { items: [...LANDING_STATS] },
    },
    {
      type: 'modules',
      enabled: true,
      order: 1,
      props: { items: [...LANDING_MODULES] },
    },
    {
      type: 'techStack',
      enabled: true,
      order: 2,
      props: { items: [...LANDING_TECH_STACK] },
    },
    {
      type: 'focusItems',
      enabled: true,
      order: 3,
      props: { items: [...LANDING_FOCUS_ITEMS] },
    },
  ],
}

export const DEFAULT_FOCUS_PAGE_DATA: FocusPageData = FOCUS_PAGE_DATA

export const DEFAULT_STACK_PAGE_DATA: StackPageData = STACK_PAGE_DATA

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  nav: [
    { key: 'work', label: 'Work', href: '/work', enabled: true, order: 0 },
    { key: 'engineering', label: 'Engineering', href: '/engineering', enabled: true, order: 1 },
    { key: 'journal', label: 'Journal', href: '/journal', enabled: true, order: 2 },
    { key: 'focus', label: 'Focus', href: '/focus', enabled: true, order: 3 },
    { key: 'stack', label: 'Stack', href: '/stack', enabled: true, order: 4 },
    { key: 'resume', label: 'Résumé', href: '/resume', enabled: true, order: 5 },
  ],
  theme: {},
  seo: {},
  socialLinks: {},
  contact: {},
}

export function getLandingBlockHeadline(block: LandingBlock): string {
  const items = block.props.items

  switch (block.type) {
    case 'stats':
      return Array.isArray(items) && items[0] && typeof items[0] === 'object' && 'label' in items[0]
        ? String((items[0] as { label: string }).label)
        : 'Stats'
    case 'modules':
      return Array.isArray(items) && items[0] && typeof items[0] === 'object' && 'title' in items[0]
        ? String((items[0] as { title: string }).title)
        : 'Modules'
    case 'techStack':
      return Array.isArray(items) && typeof items[0] === 'string'
        ? `${items.slice(0, 2).join(', ')}…`
        : 'Tech stack'
    case 'focusItems':
      return Array.isArray(items) && items[0] && typeof items[0] === 'object' && 'value' in items[0]
        ? String((items[0] as { value: string }).value)
        : 'Focus items'
    default:
      return block.type
  }
}

export function getLandingBlockSubline(block: LandingBlock): string {
  if (!block.enabled) return 'Disabled'
  const count = Array.isArray(block.props.items) ? block.props.items.length : 0
  return `${count} item${count === 1 ? '' : 's'}`
}
