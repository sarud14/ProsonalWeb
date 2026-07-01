import type { LandingHeroData } from '@/types/landing.types'
import type { LandingBlock } from '@/types/site.types'

import { DEFAULT_LANDING_HERO } from '@/lib/admin/landing-hero'
import { resolveLandingPageData } from '@/lib/content/page-sections'

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
