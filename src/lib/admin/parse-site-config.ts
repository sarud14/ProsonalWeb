import type { SiteBrand } from '@/types/site-brand.types'
import type { NavItem, SiteConfig } from '@/types/site.types'

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
      theme: {},
      seo: {},
      socialLinks: {},
      contact: {},
    }
  }

  const nav = Array.isArray(value.nav) ? value.nav.filter(isNavItem) : []

  return {
    brand: parseSiteBrand(value.brand),
    nav,
    theme: isRecord(value.theme) ? value.theme : {},
    seo: isRecord(value.seo) ? value.seo : {},
    socialLinks: isRecord(value.socialLinks) ? value.socialLinks : {},
    contact: isRecord(value.contact) ? value.contact : {},
  }
}
