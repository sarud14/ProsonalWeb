import HeroSection from '@/components/public-page/Landing/HeroSection'
import { LandingBlocks } from '@/components/public-page/Landing/LandingBlocks'
import { getLandingHeroData } from '@/lib/content/landing-page'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FEOps Kit — Home',
}

export default async function HomePage(): Promise<React.JSX.Element> {
  const hero = await getLandingHeroData()

  return (
    <>
      <HeroSection hero={hero} />
      <LandingBlocks />
    </>
  )
}
