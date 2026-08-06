import ContactSection from '@/components/public-page/Landing/ContactSection'
import ExploreStackSection from '@/components/public-page/Landing/ExploreStackSection'
import ModulesSection from '@/components/public-page/Landing/ModulesSection'
import StatsSection from '@/components/public-page/Landing/StatsSection'
import { parseLandingContact } from '@/lib/admin/landing-block-props'
import {
  getLandingBlockItems,
  getVisibleLandingBlocks,
} from '@/lib/content/landing-page'
import type { LandingModule, LandingStat } from '@/types/landing.types'

export async function LandingBlocks(): Promise<React.JSX.Element> {
  const blocks = await getVisibleLandingBlocks()

  return (
    <>
      {blocks.map((block) => {
        const key = `${block.type}-${block.order}`

        switch (block.type) {
          case 'stats':
            return (
              <StatsSection
                key={key}
                items={getLandingBlockItems<LandingStat>(block)}
              />
            )
          case 'modules':
            return (
              <ModulesSection
                key={key}
                items={getLandingBlockItems<LandingModule>(block)}
              />
            )
          case 'techStack':
            return (
              <ExploreStackSection
                key={key}
                items={getLandingBlockItems<string>(block)}
              />
            )
          case 'contact': {
            const contact = parseLandingContact(block.props)
            return (
              <ContactSection
                key={key}
                headline={contact.headline}
                body={contact.body}
                successMessage={contact.successMessage}
              />
            )
          }
          default:
            return null
        }
      })}
    </>
  )
}
