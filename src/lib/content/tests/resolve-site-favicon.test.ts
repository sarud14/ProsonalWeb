import type { FaviconProxyResult } from '@/types/site-favicon.types'
import { describe, expect, it } from 'vitest'

import {
  FAVICON_MAX_BYTES,
  SITE_FAVICON_PATH,
} from '@/constants/site-favicon'
import {
  buildSiteFaviconHref,
  isAllowedFaviconSourceUrl,
  loadFaviconFromSourceUrl,
  withFaviconFallback,
} from '@/lib/content/resolve-site-favicon'

describe('isAllowedFaviconSourceUrl', () => {
  it('allows Vercel Blob HTTPS URLs', () => {
    expect(
      isAllowedFaviconSourceUrl(
        'https://pf1l5fcsj9gnxay1.public.blob.vercel-storage.com/favicon-sd.png',
      ),
    ).toBe(true)
  })

  it('rejects non-HTTPS, private, and loopback URLs', () => {
    expect(isAllowedFaviconSourceUrl('http://example.com/icon.png')).toBe(false)
    expect(isAllowedFaviconSourceUrl('https://example.com/icon.png')).toBe(false)
    expect(isAllowedFaviconSourceUrl('https://127.0.0.1/icon.png')).toBe(false)
    expect(isAllowedFaviconSourceUrl('https://169.254.169.254/latest/meta-data')).toBe(
      false,
    )
    expect(isAllowedFaviconSourceUrl('/favicon.ico')).toBe(false)
    expect(isAllowedFaviconSourceUrl('/icon.png')).toBe(false)
  })
})

describe('buildSiteFaviconHref', () => {
  it('always serves the same-origin favicon path so CMS uploads replace Next.js default', () => {
    expect(buildSiteFaviconHref(null)).toBe(SITE_FAVICON_PATH)
    expect(
      buildSiteFaviconHref(
        'https://pf1l5fcsj9gnxay1.public.blob.vercel-storage.com/favicon-sd.png',
      ),
    ).toBe(`${SITE_FAVICON_PATH}?v=favicon-sd.png`)
  })
})

describe('loadFaviconFromSourceUrl', () => {
  it('returns 404 when the source is missing or not a trusted blob URL', async () => {
    const missing = await loadFaviconFromSourceUrl(null)
    expect(missing.status).toBe(404)
    expect(missing.body).toBeNull()

    const untrusted = await loadFaviconFromSourceUrl('https://evil.example/icon.png')
    expect(untrusted.status).toBe(404)
  })

  it('returns the upstream bytes and content type for a trusted image', async () => {
    const bytes = new Uint8Array([137, 80, 78, 71]).buffer
    const result = await loadFaviconFromSourceUrl(
      'https://store.public.blob.vercel-storage.com/logo.png',
      async () =>
        new Response(bytes, {
          status: 200,
          headers: { 'Content-Type': 'image/png', 'Content-Length': '4' },
        }),
    )

    expect(result.status).toBe(200)
    expect(result.contentType).toBe('image/png')
    expect(result.body).toEqual(bytes)
  })

  it('returns 404 when the upstream image is too large', async () => {
    const result = await loadFaviconFromSourceUrl(
      'https://store.public.blob.vercel-storage.com/huge.png',
      async () =>
        new Response(new Uint8Array([1]), {
          status: 200,
          headers: {
            'Content-Type': 'image/png',
            'Content-Length': String(FAVICON_MAX_BYTES + 1),
          },
        }),
    )

    expect(result.status).toBe(404)
  })
})

describe('withFaviconFallback', () => {
  const fallback: FaviconProxyResult = {
    status: 200,
    body: new Uint8Array([0, 1, 2]).buffer,
    contentType: 'image/x-icon',
  }

  it('keeps the CMS icon when the proxy succeeds', () => {
    const cms: FaviconProxyResult = {
      status: 200,
      body: new Uint8Array([137, 80, 78, 71]).buffer,
      contentType: 'image/png',
    }

    expect(withFaviconFallback(cms, fallback)).toEqual(cms)
  })

  it('uses the Next.js default icon when CMS has none', () => {
    const missing: FaviconProxyResult = {
      status: 404,
      body: null,
      contentType: null,
    }

    expect(withFaviconFallback(missing, fallback)).toEqual(fallback)
  })
})
