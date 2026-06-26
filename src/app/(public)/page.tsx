import ExploreStackSection from '@/components/public-page/Landing/ExploreStackSection'
import HeroSection from '@/components/public-page/Landing/HeroSection'
import ModulesSection from '@/components/public-page/Landing/ModulesSection'
import StatsSection from '@/components/public-page/Landing/StatsSection'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FEOps Kit — Home',
}

export default function HomePage(): React.JSX.Element {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <ModulesSection />
      <ExploreStackSection />
    </>
  )
}
