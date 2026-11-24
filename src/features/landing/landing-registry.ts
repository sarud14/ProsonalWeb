import type { ComponentType } from 'react'

import ExploreStackSection from './ExploreStackSection'
import ModulesSection from './ModulesSection'
import StatsSection from './StatsSection'

/** Blocks that take only their CMS item props. Contact is composed in `LandingBlocks` so the contact feature can supply the form. */
export const LANDING_BLOCK_REGISTRY: Record<string, ComponentType> = {
  stats: StatsSection,
  modules: ModulesSection,
  techStack: ExploreStackSection,
}
