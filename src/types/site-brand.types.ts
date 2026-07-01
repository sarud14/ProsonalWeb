export interface SiteBrand {
  readonly name: string
  readonly role: string
  /** Site-wide availability shown in the public navbar. */
  readonly isAvailable: boolean
}
