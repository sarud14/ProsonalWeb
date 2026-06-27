import { z } from 'zod'

export const createEngineeringSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  type: z.enum(['ARCHITECTURE', 'DECISIONS', 'PERFORMANCE']),
  summary: z.string().min(1),
  noteDate: z.string().min(1),
  readTime: z.string().min(1),
  body: z.string(),
  sortOrder: z.number().int().min(0).optional(),
  coverImageId: z.string().nullable().optional(),
})

export const updateEngineeringSchema = createEngineeringSchema.partial().extend({
  id: z.string().min(1),
})

export type CreateEngineeringInput = z.infer<typeof createEngineeringSchema>
export type UpdateEngineeringInput = z.infer<typeof updateEngineeringSchema>
