export type LandingRevealVariant = 'fade-up' | 'fade-in' | 'fade-right' | 'line-grow'

export type LandingRevealTrigger = 'mount' | 'inView'

export interface LandingRevealProps {
  readonly children: React.ReactNode
  readonly className?: string
  readonly delay?: number
  readonly trigger?: LandingRevealTrigger
  readonly variant?: LandingRevealVariant
}
