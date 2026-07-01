import type { FocusPageData } from '@/types/focus.types'
import type { LandingBlock, LandingPageData, SiteConfig } from '@/types/site.types'
import type { StackPageData } from '@/types/stack.types'

import { FOCUS_PAGE_DATA } from '@/constants/focus-page-data'
import { LANDING_MODULES, LANDING_STATS, LANDING_TECH_STACK } from '@/constants/landing'
import { DEFAULT_LANDING_HERO } from '@/lib/admin/landing-hero'
import { STACK_PAGE_DATA } from '@/constants/stack-page-data'
import { DEFAULT_SITE_BRAND } from '@/lib/admin/parse-site-config'
import {
  DEFAULT_SITE_CONTACT,
  DEFAULT_SITE_FOOTER,
  DEFAULT_SITE_SEO,
  DEFAULT_SITE_SOCIAL_LINKS,
} from '@/lib/admin/site-settings'
import { DEFAULT_SITE_THEME } from '@/lib/admin/site-theme'

export const DEFAULT_LANDING_PAGE_DATA: LandingPageData = {
  hero: DEFAULT_LANDING_HERO,
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
  ],
}

export const DEFAULT_FOCUS_PAGE_DATA: FocusPageData = FOCUS_PAGE_DATA

export const DEFAULT_STACK_PAGE_DATA: StackPageData = STACK_PAGE_DATA

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  brand: DEFAULT_SITE_BRAND,
  nav: [
    { key: 'work', label: 'Work', href: '/work', enabled: true, order: 0 },
    { key: 'engineering', label: 'Engineering', href: '/engineering', enabled: true, order: 1 },
    { key: 'journal', label: 'Journal', href: '/journal', enabled: true, order: 2 },
    { key: 'focus', label: 'Focus', href: '/focus', enabled: true, order: 3 },
    { key: 'stack', label: 'Stack', href: '/stack', enabled: true, order: 4 },
    { key: 'resume', label: 'Résumé', href: '/resume', enabled: true, order: 5 },
  ],
  theme: DEFAULT_SITE_THEME,
  seo: DEFAULT_SITE_SEO,
  socialLinks: DEFAULT_SITE_SOCIAL_LINKS,
  contact: DEFAULT_SITE_CONTACT,
  footer: DEFAULT_SITE_FOOTER,
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
    default:
      return block.type
  }
}

export function getLandingBlockSubline(block: LandingBlock): string {
  if (!block.enabled) return 'Disabled'
  const count = Array.isArray(block.props.items) ? block.props.items.length : 0
  return `${count} item${count === 1 ? '' : 's'}`
}
