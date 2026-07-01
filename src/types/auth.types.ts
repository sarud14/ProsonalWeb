export interface AdminSessionUser {
  readonly name: string
  readonly email: string | null
  readonly image: string | null
  readonly initials: string
}
