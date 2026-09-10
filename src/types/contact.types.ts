import type { LandingContactProps } from '@/types/landing.types'

export interface ContactFormProps {
  readonly successMessage?: string
}

export interface ContactPageViewProps {
  readonly email: string
  readonly location: string
}

export interface ContactSubmitFields {
  readonly name: string
  readonly email: string
  readonly message: string
  readonly website: string
}

export interface ContactSubmitInput {
  readonly name: string
  readonly email: string
  readonly message: string
  readonly website: string
}

export type { LandingContactProps }
