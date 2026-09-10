import ContactSection from '@/features/landing/ContactSection'
import ExploreStackSection from '@/features/landing/ExploreStackSection'
import ModulesSection from '@/features/landing/ModulesSection'
import StatsSection from '@/features/landing/StatsSection'
import {
  parseLandingContact,
  parseLandingModules,
  visibleLandingModules,
} from '@/lib/admin/landing-block-props'
import {
  getLandingBlockItems,
  getVisibleLandingBlocks,
} from '@/lib/content/landing-page'
import type { LandingBlocksProps, LandingStat } from '@/types/landing.types'

export async function LandingBlocks({
  renderContactForm,
}: LandingBlocksProps): Promise<React.JSX.Element> {
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
                items={visibleLandingModules(parseLandingModules(block.props))}
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
                form={renderContactForm({
                  successMessage: contact.successMessage,
                })}
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
