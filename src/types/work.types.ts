import type { WorkFrontmatter } from '@/validators/work.schema'

export interface WorkCaseStudy extends WorkFrontmatter {
  readonly slug: string
}
