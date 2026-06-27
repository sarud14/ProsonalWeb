import 'server-only'

import { env } from '@/env'

export function isBlobConfigured(): boolean {
  return env.blobReadWriteToken.length > 0
}

export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
  'image/svg+xml',
] as const

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB

export function isAllowedMimeType(mimeType: string): boolean {
  return (ALLOWED_MIME_TYPES as readonly string[]).includes(mimeType)
}

export function buildStoragePath(folder: string, filename: string): string {
  const timestamp = Date.now()
  const sanitized = filename.replace(/[^a-zA-Z0-9._-]/g, '-')
  return `${folder}/${timestamp}-${sanitized}`
}
