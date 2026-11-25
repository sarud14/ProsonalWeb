import type { EngineeringNote } from '@/types/engineering.types'
import type { JournalPost } from '@/types/journal.types'
import type { WorkCaseStudy } from '@/types/work.types'

// Minimal valid content records for component tests; override per test.
export function workFixture(overrides: Partial<WorkCaseStudy> = {}): WorkCaseStudy {
  return {
    slug: 'cms-rebuild',
    title: 'CMS rebuild',
    status: 'published',
    listId: '01',
    role: 'FE',
    tagline: 'A faster CMS',
    domains: ['CMS'],
    stack: ['Next.js', 'Prisma'],
    metric: '40%',
    metricLabel: 'Faster publishing',
    year: '2026',
    context: 'Context one. Context two.',
    problem: 'Problem text',
    constraints: 'Constraint text',
    architecture: 'Architecture text',
    decisions: 'Decision text',
    impact: 'Impact one. Impact two.',
    ...overrides,
  }
}

export function journalFixture(overrides: Partial<JournalPost> = {}): JournalPost {
  return {
    slug: 'first-post',
    title: 'First post',
    status: 'published',
    publishedAt: '2026-11-01',
    tag: 'Notes',
    excerpt: 'An excerpt',
    readTime: '3 min',
    content: '## Heading one\nParagraph one.\n\n## Heading two\nParagraph two.',
    ...overrides,
  }
}

export function engineeringFixture(overrides: Partial<EngineeringNote> = {}): EngineeringNote {
  return {
    slug: 'layering',
    title: 'Layering rules',
    status: 'published',
    listId: '01',
    type: 'Architecture',
    summary: 'How layers depend',
    noteDate: '2026-10',
    readTime: '4 min',
    ...overrides,
  }
}
