import type { ComponentType } from 'react'

import ContactSection from '@/components/public-page/Landing/ContactSection'
import ExploreStackSection from '@/components/public-page/Landing/ExploreStackSection'
import ModulesSection from '@/components/public-page/Landing/ModulesSection'
import StatsSection from '@/components/public-page/Landing/StatsSection'

export const LANDING_BLOCK_REGISTRY: Record<string, ComponentType> = {
  stats: StatsSection,
  modules: ModulesSection,
  techStack: ExploreStackSection,
  contact: ContactSection,
}
