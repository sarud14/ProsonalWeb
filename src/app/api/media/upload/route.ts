import { NextResponse } from 'next/server'
import { handleUpload } from '@vercel/blob/client'
import type { HandleUploadBody } from '@vercel/blob/client'

import { requireAdminSession } from '@/lib/auth/session'
import { isBlobConfigured, ALLOWED_MIME_TYPES, MAX_FILE_SIZE_BYTES } from '@/lib/media/upload'

export async function POST(request: Request): Promise<NextResponse> {
  if (!isBlobConfigured()) {
    return NextResponse.json(
      { error: 'Blob storage is not configured' },
      { status: 503 }
    )
  }

  const body = (await request.json()) as HandleUploadBody

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        await requireAdminSession()

        return {
          allowedContentTypes: [...ALLOWED_MIME_TYPES],
          maximumSizeInBytes: MAX_FILE_SIZE_BYTES,
        }
      },
      onUploadCompleted: async () => {
        // Metadata saved client-side via createMedia action after upload
      },
    })

    return NextResponse.json(jsonResponse)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
