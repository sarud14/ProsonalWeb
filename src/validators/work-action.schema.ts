import { z } from 'zod'

export const createWorkSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  role: z.string().min(1),
  tagline: z.string().min(1),
  metric: z.string().min(1),
  metricLabel: z.string().min(1),
  year: z.string().min(1),
  stack: z.array(z.string().min(1)).min(1),
  domains: z.array(z.string().min(1)),
  context: z.string().min(1),
  problem: z.string().min(1),
  constraints: z.string().min(1),
  architecture: z.string().min(1),
  decisions: z.string().min(1),
  impact: z.string().min(1),
  body: z.string(),
  sortOrder: z.number().int().min(0).optional(),
  coverImageId: z.string().nullable().optional(),
})

export const updateWorkSchema = createWorkSchema.partial().extend({
  id: z.string().min(1),
})

export type CreateWorkInput = z.infer<typeof createWorkSchema>
export type UpdateWorkInput = z.infer<typeof updateWorkSchema>
