import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { JournalPostDetailView } from '@/components/public-page/Journal/JournalPostDetailView'
import { getContentSource } from '@/lib/content/source'
import type { JournalPostPageProps } from '@/types/journal-page.types'

export async function generateMetadata({
  params,
}: JournalPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const content = await getContentSource()
  const post = await content.getJournalPostBySlug(slug)

  return {
    title: post ? `${post.title} — Journal — FEOps Kit` : `${slug} — Journal — FEOps Kit`,
  }
}

export default async function JournalPostPage({
  params,
}: JournalPostPageProps): Promise<React.JSX.Element> {
  const { slug } = await params
  const content = await getContentSource()
  const [post, allPosts] = await Promise.all([
    content.getJournalPostBySlug(slug),
    content.getAllJournalPosts(),
  ])

  if (!post) {
    notFound()
  }

  return <JournalPostDetailView post={post} postCount={allPosts.length} />
}
