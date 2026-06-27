import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { WorkCaseDetailView } from '@/components/public-page/Work/WorkCaseDetailView'
import { getContentSource } from '@/lib/content/source'
import type { WorkDetailPageProps } from '@/types/work-page.types'

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

  return <WorkCaseDetailView work={work} />
}
