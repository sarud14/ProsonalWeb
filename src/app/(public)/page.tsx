import HeroSection from '@/components/public-page/Landing/HeroSection'
import { LandingBlocks } from '@/components/public-page/Landing/LandingBlocks'
import { getLandingHeroData } from '@/lib/content/landing-page'
import { getSiteSeo } from '@/lib/content/site-config'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSiteSeo()

  return {
    title: {
      absolute: seo.title,
    },
  }
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
