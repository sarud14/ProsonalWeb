'use server'

import { revalidatePath } from 'next/cache'

import { pageData } from '@/lib/data/page.data'
import { createRevision, requireAdminSession } from '@/lib/actions/helpers'
import type { ActionResult } from '@/types/action.types'
import { updatePageSchema } from '@/validators/page-action.schema'

const PAGE_KEY_TO_PATH: Record<string, string[]> = {
  landing: ['/'],
  focus: ['/focus'],
  stack: ['/stack'],
  site: ['/', '/work', '/engineering', '/journal', '/focus', '/stack', '/resume'],
}

export async function updatePage(
  input: unknown
): Promise<ActionResult<{ key: string }>> {
  await requireAdminSession()

  const parsed = updatePageSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.message }

  const { key, data } = parsed.data

  const existing = await pageData.getByKey(key)
  if (existing) {
    await createRevision('page', key, existing.data)
  }

  await pageData.upsert(key, data as object)

  const paths = PAGE_KEY_TO_PATH[key] ?? ['/']
  for (const p of paths) revalidatePath(p)

  return { success: true, data: { key } }
}
