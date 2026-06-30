'use server'

import { revalidatePath } from 'next/cache'

import { contactData } from '@/lib/data/contact.data'
import { requireAdminSession } from '@/lib/actions/helpers'
import type { ActionResult } from '@/types/action.types'
import { submitContactSchema } from '@/validators/contact-action.schema'

function revalidateInbox(): void {
  revalidatePath('/admin')
  revalidatePath('/admin/messages')
}

export async function submitContact(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  const parsed = submitContactSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.message }

  const msg = await contactData.create(parsed.data)
  return { success: true, data: { id: msg.id } }
}

export async function markContactRead(
  id: string
): Promise<ActionResult> {
  await requireAdminSession()
  await contactData.markRead(id)
  revalidateInbox()
  return { success: true, data: null }
}

export async function archiveContact(
  id: string
): Promise<ActionResult> {
  await requireAdminSession()
  await contactData.archive(id)
  revalidateInbox()
  return { success: true, data: null }
}

export async function deleteContact(
  id: string
): Promise<ActionResult> {
  await requireAdminSession()
  await contactData.delete(id)
  revalidateInbox()
  return { success: true, data: null }
}
