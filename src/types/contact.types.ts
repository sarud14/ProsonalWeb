import type { LandingContactProps } from '@/types/landing.types'

export interface ContactFormProps {
  readonly successMessage?: string
}

export interface ContactPageViewProps {
  readonly email: string
  readonly location: string
}

export type { LandingContactProps }
