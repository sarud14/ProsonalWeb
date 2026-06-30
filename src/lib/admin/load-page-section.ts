import type { FocusPageData } from '@/types/focus.types'
import type { LandingPageData, SiteConfig } from '@/types/site.types'
import type { StackPageData } from '@/types/stack.types'

import {
  DEFAULT_FOCUS_PAGE_DATA,
  DEFAULT_LANDING_PAGE_DATA,
  DEFAULT_SITE_CONFIG,
  DEFAULT_STACK_PAGE_DATA,
} from '@/lib/admin/page-section-defaults'
import { pageData } from '@/lib/data/page.data'

export async function loadLandingPageData(): Promise<LandingPageData> {
  const row = await pageData.getByKey('landing')
  if (!row?.data || typeof row.data !== 'object') return DEFAULT_LANDING_PAGE_DATA
  return row.data as unknown as LandingPageData
}

export async function loadFocusPageData(): Promise<FocusPageData> {
  const row = await pageData.getByKey('focus')
  if (!row?.data || typeof row.data !== 'object') return DEFAULT_FOCUS_PAGE_DATA
  return row.data as unknown as FocusPageData
}

export async function loadStackPageData(): Promise<StackPageData> {
  const row = await pageData.getByKey('stack')
  if (!row?.data || typeof row.data !== 'object') return DEFAULT_STACK_PAGE_DATA
  return row.data as unknown as StackPageData
}

export async function loadSiteConfig(): Promise<SiteConfig> {
  const row = await pageData.getByKey('site')
  if (!row?.data || typeof row.data !== 'object') return DEFAULT_SITE_CONFIG
  return row.data as unknown as SiteConfig
}
