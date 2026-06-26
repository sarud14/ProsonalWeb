import type { Metadata } from 'next'
import Link from 'next/link'

import { Card } from '@/components/ui/Card'
import { Container } from '@/components/ui/Container'
import { getContentSource } from '@/lib/content/source'

export const metadata: Metadata = {
  title: 'Journal — FEOps Kit',
}

export default async function JournalPage(): Promise<React.JSX.Element> {
  const content = await getContentSource()
  const posts = await content.getAllJournalPosts()

  return (
    <main className="py-16">
      <Container>
        <div className="mb-10 flex flex-col gap-3">
          <span className="font-mono text-xs tracking-[0.14em] text-primary uppercase">
            Journal
          </span>
          <h1 className="text-4xl font-semibold tracking-[-0.02em]">Posts</h1>
          <p className="max-w-2xl text-muted-foreground">
            Working notes on building, learning, and shipping.
          </p>
        </div>

        <div className="grid gap-4">
          {posts.map((post) => (
            <Link key={post.slug} href={`/journal/posts/${post.slug}`}>
              <Card className="p-6 transition-colors hover:bg-white/[0.025]">
                <div className="mb-3 flex items-center justify-between gap-4">
                  <h2 className="text-xl font-semibold tracking-[-0.01em]">{post.title}</h2>
                  {post.publishedAt && (
                    <span className="font-mono text-[11px] tracking-[0.08em] text-muted-foreground uppercase">
                      {post.publishedAt}
                    </span>
                  )}
                </div>
                <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                  {post.content}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </Container>
    </main>
  )
}
