export interface NavItem {
  readonly key: string
  readonly label: string
  readonly href: string
  readonly enabled: boolean
  readonly order: number
}

export interface LandingBlock {
  readonly type: string
  readonly enabled: boolean
  readonly order: number
  readonly props: Record<string, unknown>
}

export interface LandingPageData {
  readonly blocks: readonly LandingBlock[]
}

export interface SiteConfig {
  readonly nav: readonly NavItem[]
  readonly theme: Record<string, unknown>
  readonly seo: Record<string, unknown>
  readonly socialLinks: Record<string, unknown>
  readonly contact: Record<string, unknown>
}
