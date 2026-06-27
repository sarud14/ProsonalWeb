'use server'

import { revalidatePath } from 'next/cache'

import { engineeringData } from '@/lib/data/engineering.data'
import { createRevision, requireAdminSession } from '@/lib/actions/helpers'
import type { ActionResult } from '@/types/action.types'
import { createEngineeringSchema, updateEngineeringSchema } from '@/validators/engineering-action.schema'

export async function createEngineering(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  await requireAdminSession()

  const parsed = createEngineeringSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.message }

  const note = await engineeringData.create(parsed.data)

  revalidatePath('/engineering')
  return { success: true, data: { id: note.id } }
}

export async function updateEngineering(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  await requireAdminSession()

  const parsed = updateEngineeringSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.message }

  const { id, ...data } = parsed.data

  const existing = await engineeringData.getById(id)
  if (!existing) return { success: false, error: 'Engineering note not found' }

  await createRevision('engineering', id, existing)

  const note = await engineeringData.update(id, data)

  revalidatePath('/engineering')
  revalidatePath(`/engineering/${note.slug}`)
  return { success: true, data: { id: note.id } }
}

export async function deleteEngineering(id: string): Promise<ActionResult> {
  await requireAdminSession()

  const existing = await engineeringData.getById(id)
  if (!existing) return { success: false, error: 'Engineering note not found' }

  await createRevision('engineering', id, existing)
  await engineeringData.delete(id)

  revalidatePath('/engineering')
  return { success: true, data: null }
}

export async function publishEngineering(id: string): Promise<ActionResult> {
  await requireAdminSession()

  await engineeringData.publish(id)

  revalidatePath('/engineering')
  return { success: true, data: null }
}

export async function unpublishEngineering(id: string): Promise<ActionResult> {
  await requireAdminSession()

  await engineeringData.unpublish(id)

  revalidatePath('/engineering')
  return { success: true, data: null }
}
