import { ENGINEERING_NOTE_STATUS, ENGINEERING_NOTE_TYPE } from '@/constants/engineering'
import { z } from 'zod'

export const engineeringFrontmatterSchema = z.object({
  title: z.string().min(1),
  status: z.enum([
    ENGINEERING_NOTE_STATUS.DRAFT,
    ENGINEERING_NOTE_STATUS.PUBLISHED,
  ]),
  listId: z.string().min(1),
  type: z.enum([
    ENGINEERING_NOTE_TYPE.ARCHITECTURE,
    ENGINEERING_NOTE_TYPE.DECISIONS,
    ENGINEERING_NOTE_TYPE.PERFORMANCE,
  ]),
  summary: z.string().min(1),
  noteDate: z.string().min(1),
  readTime: z.string().min(1),
})

export type EngineeringFrontmatter = z.infer<typeof engineeringFrontmatterSchema>
