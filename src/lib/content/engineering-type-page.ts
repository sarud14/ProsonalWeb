import 'server-only'

import { notFound } from 'next/navigation'

import { resolveEngineeringTypeFromPath } from '@/lib/content/engineering-type-path'
import { getContentSource } from '@/lib/content/source'
import type { EngineeringTypePageModel } from '@/types/engineering.types'

export async function loadEngineeringTypePage(
  pathSegment: string,
): Promise<EngineeringTypePageModel> {
  const noteType = resolveEngineeringTypeFromPath(pathSegment)
  if (!noteType) notFound()

  const content = await getContentSource()
  const notes = (await content.getAllEngineeringNotes())
    .filter((note) => note.type === noteType)
    .sort((a, b) => a.listId.localeCompare(b.listId))

  return { pathSegment, noteType, notes }
}
