export interface WorkCaseStudy {
  readonly slug: string
  title: string
  status: 'draft' | 'published'
  context: string
  problem: string
  constraints: string
  architecture: string
  decisions: string
  impact: string
}
