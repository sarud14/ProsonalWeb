import type { LandingHeroData } from '@/types/landing.types'
import type { SiteBrand } from '@/types/site-brand.types'
import type {
  SiteContactSettings,
  SiteFooterSettings,
  SiteSeoSettings,
  SiteSocialLink,
  SiteThemeSettings,
} from '@/types/site-settings.types'

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
  readonly hero: LandingHeroData
  readonly blocks: readonly LandingBlock[]
}

export interface SiteConfig {
  readonly brand: SiteBrand
  readonly nav: readonly NavItem[]
  readonly seo: SiteSeoSettings
  readonly socialLinks: readonly SiteSocialLink[]
  readonly contact: SiteContactSettings
  readonly footer: SiteFooterSettings
  readonly theme: SiteThemeSettings
}
