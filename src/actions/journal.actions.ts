'use server'

import { revalidatePath } from 'next/cache'

import { journalData } from '@/lib/data/journal.data'
import { createRevision, requireAdminSession } from '@/lib/actions/helpers'
import type { ActionResult } from '@/types/action.types'
import { createJournalSchema, updateJournalSchema } from '@/validators/journal-action.schema'

export async function createJournal(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  await requireAdminSession()

  const parsed = createJournalSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.message }

  const post = await journalData.create(parsed.data)

  revalidatePath('/journal')
  return { success: true, data: { id: post.id } }
}

export async function updateJournal(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  await requireAdminSession()

  const parsed = updateJournalSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.message }

  const { id, ...data } = parsed.data

  const existing = await journalData.getById(id)
  if (!existing) return { success: false, error: 'Journal post not found' }

  await createRevision('journal', id, existing)

  const post = await journalData.update(id, data)

  revalidatePath('/journal')
  revalidatePath(`/journal/posts/${post.slug}`)
  return { success: true, data: { id: post.id } }
}

export async function deleteJournal(id: string): Promise<ActionResult> {
  await requireAdminSession()

  const existing = await journalData.getById(id)
  if (!existing) return { success: false, error: 'Journal post not found' }

  await createRevision('journal', id, existing)
  await journalData.delete(id)

  revalidatePath('/journal')
  return { success: true, data: null }
}

export async function publishJournal(id: string): Promise<ActionResult> {
  await requireAdminSession()

  await journalData.publish(id)

  revalidatePath('/journal')
  return { success: true, data: null }
}

export async function unpublishJournal(id: string): Promise<ActionResult> {
  await requireAdminSession()

  await journalData.unpublish(id)

  revalidatePath('/journal')
  return { success: true, data: null }
}
