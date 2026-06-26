import { WORK_STATUS } from '@/constants/content'
import { z } from 'zod'

export const workFrontmatterSchema = z.object({
  title: z.string().min(1),
  status: z.enum([WORK_STATUS.DRAFT, WORK_STATUS.PUBLISHED]),
  context: z.string().min(1),
  problem: z.string().min(1),
  constraints: z.string().min(1),
  architecture: z.string().min(1),
  decisions: z.string().min(1),
  impact: z.string().min(1),
})

export type WorkFrontmatter = z.infer<typeof workFrontmatterSchema>
