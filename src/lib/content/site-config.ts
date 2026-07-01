import 'server-only'

import { env } from '@/env'
import { DEFAULT_SITE_CONFIG } from '@/lib/admin/page-section-defaults'
import { loadSiteConfig } from '@/lib/admin/load-page-section'
import { getVisibleNavItems } from '@/lib/content/nav-items'
import type { NavItem } from '@/types/site.types'
import type { SiteBrand } from '@/types/site-brand.types'

export async function getSiteBrand(): Promise<SiteBrand> {
  if (env.contentSource === 'db') {
    const site = await loadSiteConfig()
    return site.brand
  }

  return DEFAULT_SITE_CONFIG.brand
}

export async function getNavItems(): Promise<readonly NavItem[]> {
  if (env.contentSource === 'db') {
    const site = await loadSiteConfig()
    return getVisibleNavItems(site.nav)
  }

  return getVisibleNavItems(DEFAULT_SITE_CONFIG.nav)
}