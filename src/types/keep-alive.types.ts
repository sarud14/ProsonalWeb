export interface KeepAliveSuccessResponse {
  readonly ok: true
  readonly at: string
}

export interface KeepAliveFailureResponse {
  readonly ok: false
}

export interface KeepAliveMisconfiguredResponse {
  readonly error: string
}

export type KeepAliveJsonResponse =
  | KeepAliveSuccessResponse
  | KeepAliveFailureResponse
  | KeepAliveMisconfiguredResponse

export interface KeepAliveResult {
  readonly status: 200 | 401 | 500 | 503
  readonly body: KeepAliveJsonResponse | string
}

export interface KeepAliveDeps {
  readonly cronSecret: string
  readonly pingDatabase: () => Promise<void>
  readonly now: () => Date
}
