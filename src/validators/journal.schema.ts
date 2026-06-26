import { JOURNAL_STATUS } from '@/constants/content'
import { z } from 'zod'

export const journalFrontmatterSchema = z.object({
  title: z.string().min(1),
  status: z.enum([JOURNAL_STATUS.DRAFT, JOURNAL_STATUS.PUBLISHED]),
  publishedAt: z.string().nullable().optional(),
})

export type JournalFrontmatter = z.infer<typeof journalFrontmatterSchema>
