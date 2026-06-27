'use server'

import { revalidatePath } from 'next/cache'

import { workData } from '@/lib/data/work.data'
import { createRevision, requireAdminSession } from '@/lib/actions/helpers'
import type { ActionResult } from '@/types/action.types'
import { createWorkSchema, updateWorkSchema } from '@/validators/work-action.schema'

export async function createWork(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  await requireAdminSession()

  const parsed = createWorkSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.message }

  const { domains, ...data } = parsed.data

  const work = await workData.create({ ...data, domainLabels: domains })

  revalidatePath('/work')
  revalidatePath('/')
  return { success: true, data: { id: work.id } }
}

export async function updateWork(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  await requireAdminSession()

  const parsed = updateWorkSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.message }

  const { id, domains, ...data } = parsed.data

  const existing = await workData.getById(id)
  if (!existing) return { success: false, error: 'Work not found' }

  await createRevision('work', id, existing)

  const work = await workData.update(id, { ...data, domainLabels: domains })

  revalidatePath('/work')
  revalidatePath(`/work/${work.slug}`)
  revalidatePath('/')
  return { success: true, data: { id: work.id } }
}

export async function deleteWork(id: string): Promise<ActionResult> {
  await requireAdminSession()

  const existing = await workData.getById(id)
  if (!existing) return { success: false, error: 'Work not found' }

  await createRevision('work', id, existing)
  await workData.delete(id)

  revalidatePath('/work')
  revalidatePath('/')
  return { success: true, data: null }
}

export async function publishWork(id: string): Promise<ActionResult> {
  await requireAdminSession()

  await workData.publish(id)

  revalidatePath('/work')
  revalidatePath('/')
  return { success: true, data: null }
}

export async function unpublishWork(id: string): Promise<ActionResult> {
  await requireAdminSession()

  await workData.unpublish(id)

  revalidatePath('/work')
  revalidatePath('/')
  return { success: true, data: null }
}
