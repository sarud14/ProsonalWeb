import type { WorkFormState } from '@/types/admin-content.types'
import type { CreateWorkInput } from '@/validators/work-action.schema'

export function buildWorkMutationPayload(values: WorkFormState): CreateWorkInput {
  return {
    slug: values.slug,
    title: values.title,
    role: values.role,
    tagline: values.tagline,
    metric: values.metric,
    metricLabel: values.metricLabel,
    year: values.year,
    stack: [...values.stack],
    domains: [...values.domains],
    context: values.context,
    problem: values.problem,
    constraints: values.constraints,
    architecture: values.architecture,
    decisions: values.decisions,
    impact: values.impact,
    body: values.body,
    sortOrder: values.sortOrder,
    coverImageId: values.coverImageId,
  }
}
