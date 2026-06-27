import { JOURNAL_STATUS } from '@/constants/content'
import { z } from 'zod'

export const journalFrontmatterSchema = z.object({
  title: z.string().min(1),
  status: z.enum([JOURNAL_STATUS.DRAFT, JOURNAL_STATUS.PUBLISHED]),
  publishedAt: z.string().min(1),
  tag: z.string().min(1),
  excerpt: z.string().min(1),
  readTime: z.string().min(1),
  pull: z.string().min(1).optional(),
})

export type JournalFrontmatter = z.infer<typeof journalFrontmatterSchema>
