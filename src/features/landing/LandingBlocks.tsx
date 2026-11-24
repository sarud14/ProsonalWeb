import ContactSection from './ContactSection'
import ExploreStackSection from './ExploreStackSection'
import ModulesSection from './ModulesSection'
import StatsSection from './StatsSection'
import {
  parseLandingContact,
  parseLandingModules,
  visibleLandingModules,
} from '@/lib/admin/landing-block-props'
import { fillLandingCountTokens } from '@/lib/content/landing-counts'
import {
  getLandingBlockItems,
  getLandingCounts,
  getVisibleLandingBlocks,
} from '@/lib/content/landing-page'
import type { LandingBlocksProps, LandingStat } from '@/types/landing.types'

export async function LandingBlocks({
  renderContactForm,
}: LandingBlocksProps): Promise<React.JSX.Element> {
  const [blocks, counts] = await Promise.all([
    getVisibleLandingBlocks(),
    getLandingCounts(),
  ])

  return (
    <>
      {blocks.map((block) => {
        const key = `${block.type}-${block.order}`

        switch (block.type) {
          case 'stats':
            return (
              <StatsSection
                key={key}
                items={getLandingBlockItems<LandingStat>(block).map((stat) => ({
                  ...stat,
                  value: fillLandingCountTokens(stat.value, counts),
                }))}
              />
            )
          case 'modules':
            return (
              <ModulesSection
                key={key}
                items={visibleLandingModules(parseLandingModules(block.props)).map(
                  (module) => ({
                    ...module,
                    linkLabel: fillLandingCountTokens(module.linkLabel, counts),
                  }),
                )}
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
