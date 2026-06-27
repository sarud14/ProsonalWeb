'use server'

import { mediaData } from '@/lib/data/media.data'
import { requireAdminSession } from '@/lib/actions/helpers'
import type { ActionResult } from '@/types/action.types'
import { z } from 'zod'

const createMediaSchema = z.object({
  url: z.string().url(),
  pathname: z.string().min(1),
  alt: z.string(),
  mimeType: z.string().min(1),
  width: z.number().int().positive().nullable().optional(),
  height: z.number().int().positive().nullable().optional(),
  sizeBytes: z.number().int().positive().nullable().optional(),
  folder: z.string().optional(),
})

const updateMediaAltSchema = z.object({
  id: z.string().min(1),
  alt: z.string(),
})

export async function createMedia(
  input: unknown
): Promise<ActionResult<{ id: string; url: string }>> {
  await requireAdminSession()

  const parsed = createMediaSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.message }

  const asset = await mediaData.create(parsed.data)

  return { success: true, data: { id: asset.id, url: asset.url } }
}

export async function updateMediaAlt(
  input: unknown
): Promise<ActionResult> {
  await requireAdminSession()

  const parsed = updateMediaAltSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.message }

  await mediaData.updateAlt(parsed.data.id, parsed.data.alt)

  return { success: true, data: null }
}

export async function deleteMedia(id: string): Promise<ActionResult> {
  await requireAdminSession()

  const asset = await mediaData.getByIdWithReferences(id)

  if (!asset) return { success: false, error: 'Media not found' }

  const inUse =
    asset.workCovers.length > 0 ||
    asset.journalCovers.length > 0 ||
    asset.engineeringCovers.length > 0

  if (inUse) {
    return { success: false, error: 'Cannot delete — image is still referenced by content' }
  }

  await mediaData.delete(id)
  return { success: true, data: null }
}
