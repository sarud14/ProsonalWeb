import 'server-only'

import { env } from '@/env'
import {
  DEFAULT_FOCUS_PAGE_DATA,
  DEFAULT_LANDING_PAGE_DATA,
  DEFAULT_STACK_PAGE_DATA,
} from '@/lib/admin/page-section-defaults'
import {
  loadFocusPageData,
  loadLandingPageData,
  loadStackPageData,
} from '@/lib/admin/load-page-section'
import type { FocusPageData } from '@/types/focus.types'
import type { LandingPageData } from '@/types/site.types'
import type { StackPageData } from '@/types/stack.types'

export async function resolveLandingPageData(): Promise<LandingPageData> {
  if (env.contentSource === 'db') {
    return loadLandingPageData()
  }
  return DEFAULT_LANDING_PAGE_DATA
}

export async function resolveFocusPageData(): Promise<FocusPageData> {
  if (env.contentSource === 'db') {
    return loadFocusPageData()
  }
  return DEFAULT_FOCUS_PAGE_DATA
}

export async function resolveStackPageData(): Promise<StackPageData> {
  if (env.contentSource === 'db') {
    return loadStackPageData()
  }
  return DEFAULT_STACK_PAGE_DATA
}
