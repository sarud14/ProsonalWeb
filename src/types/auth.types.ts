import type { Session } from 'next-auth'

export interface AuthSession extends Session {
  readonly user: {
    readonly name?: string | null
    readonly email?: string | null
    readonly image?: string | null
  }
}
