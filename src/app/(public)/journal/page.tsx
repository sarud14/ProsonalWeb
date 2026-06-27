import type { Metadata } from 'next'

import { JournalPostList } from '@/components/public-page/Journal/JournalPostList'
import { Container } from '@/components/ui/Container'
import { PageRouteHeader } from '@/components/ui/PageRouteHeader'
import { getContentSource } from '@/lib/content/source'

export const metadata: Metadata = {
  title: 'Journal — FEOps Kit',
}

export default async function JournalPage(): Promise<React.JSX.Element> {
  const content = await getContentSource()
  const posts = await content.getAllJournalPosts()

  const sortedPosts = [...posts].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt)
  )

  const trailingLabel = `${String(sortedPosts.length).padStart(2, '0')} POSTS`

  return (
    <Container className="max-w-[1240px] px-7">
      <PageRouteHeader
        path="/journal"
        trailing={trailingLabel}
        title="Journal"
        description="Working notes on building, learning, and shipping — looser than the case studies, written as I go."
      />
      <JournalPostList posts={sortedPosts} />
    </Container>
  )
}
