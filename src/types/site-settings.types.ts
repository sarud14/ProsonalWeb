export interface SiteSeoSettings {
  readonly title: string
  readonly description: string
  readonly ogImageUrl: string | null
}

export interface SiteSocialLink {
  readonly label: string
  readonly url: string
}

export interface SiteContactSettings {
  readonly email: string
  readonly location: string
}

export interface SiteFooterSettings {
  readonly copyrightName: string
  readonly tagline: string
  readonly buildLabel: string
}

/** Theme colors stored in CMS and applied as CSS variables on the public site. Grid overlay stays in `globals.css`. */
export interface SiteThemeSettings {
  readonly primary: string
  readonly background: string
  readonly foreground: string
  readonly success: string
  readonly destructive: string
}

export type SiteThemeColorKey = keyof SiteThemeSettings
