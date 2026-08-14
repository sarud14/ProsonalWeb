'use server'

import { revalidatePath } from 'next/cache'

import { pageData } from '@/lib/data/page.data'
import { createRevision, requireAdminSession } from '@/lib/actions/helpers'
import type { ActionResult } from '@/types/action.types'
import { PUBLIC_REVALIDATE_PATHS } from '@/constants/public-routes'
import { SITE_FAVICON_PATH, SITE_ICON_API_PATH } from '@/constants/site-favicon'
import { updatePageSchema } from '@/validators/page-action.schema'

const PAGE_KEY_TO_PATH: Record<string, readonly string[]> = {
  landing: ['/'],
  focus: ['/focus'],
  stack: ['/stack'],
  site: PUBLIC_REVALIDATE_PATHS,
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
  if (key === 'site') {
    revalidatePath('/', 'layout')
    revalidatePath(SITE_FAVICON_PATH)
    revalidatePath(SITE_ICON_API_PATH)
  }

  return { success: true, data: { key } }
}
