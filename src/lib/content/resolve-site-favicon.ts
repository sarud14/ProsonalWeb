import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

import {
  FALLBACK_FAVICON_CONTENT_TYPE,
  FALLBACK_FAVICON_RELATIVE_PATH,
  FAVICON_ALLOWED_MIME_TYPES,
  FAVICON_FETCH_TIMEOUT_MS,
  FAVICON_MAX_BYTES,
  SITE_FAVICON_PATH,
  VERCEL_BLOB_HOST_SUFFIX,
} from '@/constants/site-favicon'
import type { FaviconFetch, FaviconProxyResult } from '@/types/site-favicon.types'

const NOT_FOUND: FaviconProxyResult = {
  status: 404,
  body: null,
  contentType: null,
}

export function isAllowedFaviconSourceUrl(value: string): boolean {
  try {
    const url = new URL(value)
    if (url.protocol !== 'https:') return false
    return url.hostname.endsWith(VERCEL_BLOB_HOST_SUFFIX)
  } catch {
    return false
  }
}

export function buildSiteFaviconHref(faviconUrl: string | null): string {
  if (!faviconUrl) return SITE_FAVICON_PATH

  try {
    const filename = new URL(faviconUrl).pathname.split('/').filter(Boolean).pop()
    if (!filename) return SITE_FAVICON_PATH
    return `${SITE_FAVICON_PATH}?v=${encodeURIComponent(filename)}`
  } catch {
    return SITE_FAVICON_PATH
  }
}

function normalizeContentType(value: string | null): string | null {
  if (!value) return null
  const mime = value.split(';')[0]?.trim().toLowerCase()
  if (!mime) return null
  if (!(FAVICON_ALLOWED_MIME_TYPES as readonly string[]).includes(mime)) return null
  return mime
}

export async function loadFaviconFromSourceUrl(
  sourceUrl: string | null,
  fetchImpl: FaviconFetch = fetch,
): Promise<FaviconProxyResult> {
  if (!sourceUrl || !isAllowedFaviconSourceUrl(sourceUrl)) return NOT_FOUND

  try {
    const response = await fetchImpl(sourceUrl, {
      method: 'GET',
      redirect: 'error',
      signal: AbortSignal.timeout(FAVICON_FETCH_TIMEOUT_MS),
    })

    if (!response.ok) return NOT_FOUND

    const contentLength = response.headers.get('Content-Length')
    if (contentLength !== null) {
      const size = Number(contentLength)
      if (!Number.isFinite(size) || size > FAVICON_MAX_BYTES) return NOT_FOUND
    }

    const contentType = normalizeContentType(response.headers.get('Content-Type'))
    if (!contentType) return NOT_FOUND

    const body = await response.arrayBuffer()
    if (body.byteLength === 0 || body.byteLength > FAVICON_MAX_BYTES) return NOT_FOUND

    return { status: 200, body, contentType }
  } catch {
    return NOT_FOUND
  }
}

export function withFaviconFallback(
  cmsResult: FaviconProxyResult,
  fallback: FaviconProxyResult,
): FaviconProxyResult {
  if (cmsResult.status === 200 && cmsResult.body !== null && cmsResult.contentType !== null) {
    return cmsResult
  }
  return fallback
}

export async function loadFallbackFavicon(): Promise<FaviconProxyResult> {
  try {
    const buffer = await readFile(join(process.cwd(), FALLBACK_FAVICON_RELATIVE_PATH))
    if (buffer.byteLength === 0) return NOT_FOUND

    const bytes = new Uint8Array(buffer.byteLength)
    bytes.set(buffer)

    return {
      status: 200,
      body: bytes.buffer,
      contentType: FALLBACK_FAVICON_CONTENT_TYPE,
    }
  } catch {
    return NOT_FOUND
  }
}
