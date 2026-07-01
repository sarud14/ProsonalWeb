export type HealthDatabaseStatus = 'connected' | 'skipped' | 'error'

export interface HealthCheckResponse {
  readonly ok: boolean
  readonly contentSource: 'mdx' | 'db'
  readonly database: HealthDatabaseStatus
  readonly auth: boolean
  readonly oauth: {
    readonly github: boolean
    readonly google: boolean
  }
  readonly blob: boolean
}
