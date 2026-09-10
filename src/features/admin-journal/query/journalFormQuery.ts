import type { JournalFormState } from '@/types/admin-content.types'
import type { CreateJournalInput } from '@/validators/journal-action.schema'

export function buildJournalMutationPayload(values: JournalFormState): CreateJournalInput {
  return {
    slug: values.slug,
    title: values.title,
    excerpt: values.excerpt,
    body: values.body,
    tag: values.tag,
    readTime: values.readTime,
    pull: values.pull || null,
    sortOrder: values.sortOrder,
    coverImageId: values.coverImageId,
  }
}
