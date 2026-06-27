'use server'

import { revalidatePath } from 'next/cache'

import { taxonomyData } from '@/lib/data/taxonomy.data'
import { requireAdminSession } from '@/lib/actions/helpers'
import type { ActionResult } from '@/types/action.types'
import { z } from 'zod'

const createDomainSchema = z.object({
  label: z.string().min(1),
  sortOrder: z.number().int().min(0).optional(),
})

const updateDomainSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1).optional(),
  sortOrder: z.number().int().min(0).optional(),
})

export async function createDomain(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  await requireAdminSession()

  const parsed = createDomainSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.message }

  const domain = await taxonomyData.create(parsed.data)

  revalidatePath('/work')
  return { success: true, data: { id: domain.id } }
}

export async function updateDomain(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  await requireAdminSession()

  const parsed = updateDomainSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.message }

  const { id, ...data } = parsed.data

  const domain = await taxonomyData.update(id, data)

  revalidatePath('/work')
  return { success: true, data: { id: domain.id } }
}

export async function deleteDomain(id: string): Promise<ActionResult> {
  await requireAdminSession()

  const domain = await taxonomyData.getByIdWithWorks(id)

  if (!domain) return { success: false, error: 'Domain not found' }

  if (domain.works.length > 0) {
    return { success: false, error: 'Cannot delete — domain is still used by work case studies' }
  }

  await taxonomyData.delete(id)
  revalidatePath('/work')
  return { success: true, data: null }
}
