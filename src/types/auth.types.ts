export interface AdminSessionUser {
  readonly name: string
  readonly email: string | null
  readonly image: string | null
  readonly initials: string
}

export interface LoginPanelProps {
  readonly hasGithub: boolean
  readonly hasGoogle: boolean
}

export interface ProviderIconBadgeProps {
  readonly variant: 'github' | 'google'
  readonly children: React.ReactNode
}
