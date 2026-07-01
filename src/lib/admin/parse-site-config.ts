import type { SiteBrand } from '@/types/site-brand.types'
import type { NavItem, SiteConfig } from '@/types/site.types'

import {
  DEFAULT_SITE_CONTACT,
  DEFAULT_SITE_FOOTER,
  DEFAULT_SITE_SEO,
  DEFAULT_SITE_SOCIAL_LINKS,
  parseSiteContact,
  parseSiteFooter,
  parseSiteSeo,
  parseSiteSocialLinks,
} from '@/lib/admin/site-settings'
import { DEFAULT_SITE_THEME, parseSiteTheme } from '@/lib/admin/site-theme'

export const DEFAULT_SITE_BRAND: SiteBrand = {
  name: 'Sarut Dumrongprechachan',
  role: 'Frontend Engineer',
  isAvailable: true,
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isNavItem(value: unknown): value is NavItem {
  return (
    isRecord(value) &&
    typeof value.key === 'string' &&
    typeof value.label === 'string' &&
    typeof value.href === 'string' &&
    typeof value.enabled === 'boolean' &&
    typeof value.order === 'number'
  )
}

export function parseSiteBrand(value: unknown): SiteBrand {
  if (!isRecord(value)) return DEFAULT_SITE_BRAND

  const isAvailable =
    typeof value.isAvailable === 'boolean'
      ? value.isAvailable
      : typeof value.showAvailability === 'boolean'
        ? value.showAvailability
        : DEFAULT_SITE_BRAND.isAvailable

  return {
    name: typeof value.name === 'string' ? value.name : DEFAULT_SITE_BRAND.name,
    role: typeof value.role === 'string' ? value.role : DEFAULT_SITE_BRAND.role,
    isAvailable,
  }
}

export function parseSiteConfig(value: unknown): SiteConfig {
  if (!isRecord(value)) {
    return {
      brand: DEFAULT_SITE_BRAND,
      nav: [],
      seo: DEFAULT_SITE_SEO,
      socialLinks: DEFAULT_SITE_SOCIAL_LINKS,
      contact: DEFAULT_SITE_CONTACT,
      footer: DEFAULT_SITE_FOOTER,
      theme: DEFAULT_SITE_THEME,
    }
  }

  const nav = Array.isArray(value.nav) ? value.nav.filter(isNavItem) : []
  const contact = parseSiteContact(value.contact)

  return {
    brand: parseSiteBrand(value.brand),
    nav,
    seo: parseSiteSeo(value.seo),
    socialLinks: parseSiteSocialLinks(value.socialLinks),
    contact,
    footer: parseSiteFooter(value.footer, value.contact),
    theme: parseSiteTheme(value.theme),
  }
}
