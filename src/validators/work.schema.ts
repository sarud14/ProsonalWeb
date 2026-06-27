import { WORK_STATUS } from '@/constants/content'
import { z } from 'zod'

export const workFrontmatterSchema = z.object({
  title: z.string().min(1),
  status: z.enum([WORK_STATUS.DRAFT, WORK_STATUS.PUBLISHED]),
  listId: z.string().min(1),
  role: z.string().min(1),
  tagline: z.string().min(1),
  domains: z.array(z.string().min(1)).min(1),
  stack: z.array(z.string().min(1)).min(1),
  metric: z.string().min(1),
  metricLabel: z.string().min(1),
  year: z.string().min(1),
  context: z.string().min(1),
  problem: z.string().min(1),
  constraints: z.string().min(1),
  architecture: z.string().min(1),
  decisions: z.string().min(1),
  impact: z.string().min(1),
})

export type WorkFrontmatter = z.infer<typeof workFrontmatterSchema>
