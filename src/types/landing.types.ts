export interface LandingStat {
  readonly value: string
  readonly label: string
}

export interface LandingModule {
  readonly num: string
  readonly title: string
  readonly desc: string
  readonly link: string
  readonly linkLabel: string
  readonly badge?: string
}

export interface LandingFocusItem {
  readonly label: string
  readonly value: string
}

export interface LandingHeroData {
  readonly eyebrowLabel: string
  readonly eyebrowVersion: string
  readonly titleLine1: string
  readonly titleLine2: string
  readonly titleLine3: string
  readonly body: string
  readonly bodyHighlights: readonly string[]
  readonly primaryCtaLabel: string
  readonly primaryCtaHref: string
  readonly secondaryCtaLabel: string
  readonly secondaryCtaHref: string
  readonly metaItems: readonly LandingFocusItem[]
  readonly profileName: string
  readonly profileSubtitle: string
  readonly profileStatus: string
  readonly profileImageUrl: string | null
  readonly profileImageAlt: string
  readonly codeFilename: string
  readonly codeRole: string
  readonly codeStack: readonly string[]
  readonly codeDomains: readonly string[]
  readonly codeFocus: string
  readonly codeStatus: string
}
