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
