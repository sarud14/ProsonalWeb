import { z } from 'zod'

export const VALID_PAGE_KEYS = ['landing', 'focus', 'stack', 'site'] as const

export const updatePageSchema = z.object({
  key: z.enum(VALID_PAGE_KEYS),
  data: z.record(z.string(), z.unknown()),
})

export type UpdatePageInput = z.infer<typeof updatePageSchema>
