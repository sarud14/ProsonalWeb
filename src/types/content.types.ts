import type { WorkCaseStudy } from '@/types/work.types'
import type { JournalPost } from '@/types/journal.types'

export interface ContentSource {
  getAllWork(): Promise<readonly WorkCaseStudy[]>
  getWorkBySlug(slug: string): Promise<WorkCaseStudy | null>
  getAllJournalPosts(): Promise<readonly JournalPost[]>
  getJournalPostBySlug(slug: string): Promise<JournalPost | null>
}
