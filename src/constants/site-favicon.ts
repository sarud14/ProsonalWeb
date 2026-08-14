export const SITE_FAVICON_PATH = '/favicon.ico'
export const SITE_ICON_API_PATH = '/api/site-icon'
export const VERCEL_BLOB_HOST_SUFFIX = '.blob.vercel-storage.com'
export const FAVICON_FETCH_TIMEOUT_MS = 5000
export const FAVICON_MAX_BYTES = 1 * 1024 * 1024
export const FAVICON_CACHE_CONTROL = 'public, max-age=3600, must-revalidate'
export const FALLBACK_FAVICON_RELATIVE_PATH = 'public/fallback-favicon.ico'
export const FALLBACK_FAVICON_CONTENT_TYPE = 'image/x-icon'

export const FAVICON_ALLOWED_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/avif',
  'image/gif',
  'image/svg+xml',
  'image/x-icon',
  'image/vnd.microsoft.icon',
] as const
