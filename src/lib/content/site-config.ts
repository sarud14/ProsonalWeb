import 'server-only'

import { env } from '@/env'
import { DEFAULT_SITE_CONFIG } from '@/lib/admin/page-section-defaults'
import { loadSiteConfig } from '@/lib/admin/load-page-section'
import { getVisibleNavItems } from '@/lib/content/nav-items'
import type { NavItem } from '@/types/site.types'
import type { SiteBrand } from '@/types/site-brand.types'
import type {
  SiteContactSettings,
  SiteFooterSettings,
  SiteSeoSettings,
  SiteSocialLink,
} from '@/types/site-settings.types'

import type { SiteThemeSettings } from '@/types/site-settings.types'

async function resolveSiteConfig() {
  if (env.contentSource === 'db') {
    return loadSiteConfig()
  }
  return DEFAULT_SITE_CONFIG
}

export async function getSiteBrand(): Promise<SiteBrand> {
  const site = await resolveSiteConfig()
  return site.brand
}

export async function getSiteSeo(): Promise<SiteSeoSettings> {
  const site = await resolveSiteConfig()
  return site.seo
}

export async function getSiteTheme(): Promise<SiteThemeSettings> {
  const site = await resolveSiteConfig()
  return site.theme
}

export async function getSiteFooter(): Promise<SiteFooterSettings> {
  const site = await resolveSiteConfig()
  return site.footer
}

export async function getSiteSocialLinks(): Promise<readonly SiteSocialLink[]> {
  const site = await resolveSiteConfig()
  return site.socialLinks.filter((link) => link.url.trim().length > 0)
}

export async function getNavItems(): Promise<readonly NavItem[]> {
  const site = await resolveSiteConfig()
  return getVisibleNavItems(site.nav)
}