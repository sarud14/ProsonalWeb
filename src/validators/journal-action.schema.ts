import { z } from 'zod'

export const createJournalSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  excerpt: z.string().min(1),
  body: z.string(),
  tag: z.string().min(1),
  readTime: z.string().min(1),
  pull: z.string().nullable().optional(),
  sortOrder: z.number().int().min(0).optional(),
  coverImageId: z.string().nullable().optional(),
})

export const updateJournalSchema = createJournalSchema.partial().extend({
  id: z.string().min(1),
})

export type CreateJournalInput = z.infer<typeof createJournalSchema>
export type UpdateJournalInput = z.infer<typeof updateJournalSchema>
