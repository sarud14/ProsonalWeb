import type { LandingCounts, LandingHeroData } from '@/types/landing.types'
import type { LandingBlock } from '@/types/site.types'

import { DEFAULT_LANDING_HERO } from '@/lib/admin/landing-hero'
import { buildLandingCounts } from '@/lib/content/landing-counts'
import { resolveLandingPageData } from '@/lib/content/page-sections'
import { getContentSource } from '@/lib/content/source'

export async function getLandingHeroData(): Promise<LandingHeroData> {
  const data = await resolveLandingPageData()
  return data.hero ?? DEFAULT_LANDING_HERO
}

export async function getVisibleLandingBlocks(): Promise<readonly LandingBlock[]> {
  const data = await resolveLandingPageData()

  return [...data.blocks]
    .filter((block) => block.enabled)
    .sort((a, b) => a.order - b.order)
}

export function getLandingBlockItems<T>(block: LandingBlock): readonly T[] {
  const items = block.props.items
  if (!Array.isArray(items)) return []
  return items as T[]
}

export async function getLandingCounts(): Promise<LandingCounts> {
  const source = await getContentSource()
  return buildLandingCounts(await source.getAllWork())
}
