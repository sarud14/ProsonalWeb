import type { ComponentType } from 'react'

import ExploreStackSection from '@/features/landing/ExploreStackSection'
import ModulesSection from '@/features/landing/ModulesSection'
import StatsSection from '@/features/landing/StatsSection'

/** Blocks that take only their CMS item props. Contact is composed in `LandingBlocks` so the contact feature can supply the form. */
export const LANDING_BLOCK_REGISTRY: Record<string, ComponentType> = {
  stats: StatsSection,
  modules: ModulesSection,
  techStack: ExploreStackSection,
}
