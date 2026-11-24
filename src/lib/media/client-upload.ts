'use client'

import { upload } from '@vercel/blob/client'

import { createMedia } from '@/actions/media.actions'
import type { MediaUploadResult } from '@/types/admin-media.types'

export async function uploadMediaFile(
  file: File,
  folder = 'uncategorized'
): Promise<MediaUploadResult> {
  try {
    const blob = await upload(file.name, file, {
      access: 'public',
      handleUploadUrl: '/api/media/upload',
    })

    const result = await createMedia({
      url: blob.url,
      pathname: blob.pathname,
      alt: file.name.replace(/\.[^.]+$/, ''),
      mimeType: file.type || 'application/octet-stream',
      sizeBytes: file.size,
      folder,
    })

    if (!result.success) {
      return { success: false, error: result.error }
    }

    return { success: true, id: result.data.id, url: result.data.url }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed'
    return { success: false, error: message }
  }
}
