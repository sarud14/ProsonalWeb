import type { EngineeringFormState } from '@/types/admin-content.types'
import type { CreateEngineeringInput } from '@/validators/engineering-action.schema'

export function buildEngineeringMutationPayload(
  values: EngineeringFormState
): CreateEngineeringInput {
  return {
    slug: values.slug,
    title: values.title,
    type: values.type,
    summary: values.summary,
    noteDate: values.noteDate,
    readTime: values.readTime,
    body: values.body,
    sortOrder: values.sortOrder,
    coverImageId: values.coverImageId,
  }
}
