import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Container } from '@/components/ui/Container'
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
  const post = await content.getJournalPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <main className="py-16">
      <Container className="max-w-3xl">
        <article>
          <header className="mb-10 flex flex-col gap-3 border-b border-border pb-8">
            <span className="font-mono text-xs tracking-[0.14em] text-primary uppercase">
              Journal
            </span>
            <h1 className="text-4xl font-semibold tracking-[-0.02em]">{post.title}</h1>
            {post.publishedAt && (
              <time className="font-mono text-[11px] tracking-[0.08em] text-muted-foreground uppercase">
                {post.publishedAt}
              </time>
            )}
          </header>
          <div className="whitespace-pre-wrap leading-relaxed text-secondary-foreground">
            {post.content}
          </div>
        </article>
      </Container>
    </main>
  )
}
