import { NextResponse } from 'next/server'

import { FAVICON_CACHE_CONTROL } from '@/constants/site-favicon'
import { getSiteSeo } from '@/lib/content/site-config'
import {
  loadFallbackFavicon,
  loadFaviconFromSourceUrl,
  withFaviconFallback,
} from '@/lib/content/resolve-site-favicon'

export const dynamic = 'force-dynamic'

export async function GET(): Promise<NextResponse> {
  const seo = await getSiteSeo()
  const result = withFaviconFallback(
    await loadFaviconFromSourceUrl(seo.faviconUrl),
    await loadFallbackFavicon(),
  )

  if (result.status !== 200 || result.body === null || result.contentType === null) {
    return new NextResponse(null, { status: 404 })
  }

  return new NextResponse(result.body, {
    status: 200,
    headers: {
      'Content-Type': result.contentType,
      'Cache-Control': FAVICON_CACHE_CONTROL,
    },
  })
}
