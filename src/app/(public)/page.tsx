import { ContactForm } from '@/features/contact/ContactForm'
import HeroSection from '@/features/landing/HeroSection'
import { LandingBlocks } from '@/features/landing/LandingBlocks'
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
      <LandingBlocks
        renderContactForm={({ successMessage }) => (
          <ContactForm successMessage={successMessage} />
        )}
      />
    </>
  )
}
