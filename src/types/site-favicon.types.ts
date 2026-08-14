export interface FaviconProxyResult {
  readonly status: 200 | 404
  readonly body: ArrayBuffer | null
  readonly contentType: string | null
}

export type FaviconFetch = (
  input: string,
  init?: RequestInit,
) => Promise<Response>
