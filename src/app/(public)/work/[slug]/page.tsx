import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Container } from '@/components/ui/Container'
import { getContentSource } from '@/lib/content/source'
import type { WorkDetailPageProps } from '@/types/work-page.types'

const WORK_SECTIONS = [
  { key: 'context', label: 'Context' },
  { key: 'problem', label: 'Problem' },
  { key: 'constraints', label: 'Constraints' },
  { key: 'architecture', label: 'Architecture' },
  { key: 'decisions', label: 'Engineering decisions' },
  { key: 'impact', label: 'Impact' },
] as const

export async function generateMetadata({
  params,
}: WorkDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const content = await getContentSource()
  const work = await content.getWorkBySlug(slug)

  return {
    title: work ? `${work.title} — Work — FEOps Kit` : `${slug} — Work — FEOps Kit`,
  }
}

export default async function WorkDetailPage({
  params,
}: WorkDetailPageProps): Promise<React.JSX.Element> {
  const { slug } = await params
  const content = await getContentSource()
  const work = await content.getWorkBySlug(slug)

  if (!work) {
    notFound()
  }

  return (
    <main className="py-16">
      <Container className="max-w-3xl">
        <div className="mb-10 flex flex-col gap-3 border-b border-border pb-8">
          <span className="font-mono text-xs tracking-[0.14em] text-primary uppercase">
            Case Study
          </span>
          <h1 className="text-4xl font-semibold tracking-[-0.02em]">{work.title}</h1>
        </div>

        <div className="flex flex-col gap-10">
          {WORK_SECTIONS.map((section) => (
            <section key={section.key}>
              <h2 className="mb-3 font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
                {section.label}
              </h2>
              <p className="leading-relaxed text-secondary-foreground">
                {work[section.key]}
              </p>
            </section>
          ))}
        </div>
      </Container>
    </main>
  )
}
