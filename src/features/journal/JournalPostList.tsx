import Link from 'next/link'

import type { JournalPostListProps } from '@/types/journal.types'

export function JournalPostList({
  posts,
}: JournalPostListProps): React.JSX.Element {
  return (
    <section className="my-3.5 mb-20 border-b border-white/[0.07]">
      {posts.map((post) => (
        <Link
          key={post.slug}
          href={`/journal/posts/${post.slug}`}
          className="grid grid-cols-1 items-center gap-6 border-t border-white/[0.07] px-4 py-[30px] text-inherit no-underline transition-colors hover:bg-white/[0.025] md:grid-cols-[128px_minmax(0,1fr)_34px] md:gap-6"
        >
          <span className="flex flex-col gap-[5px]">
            <span className="font-mono text-xs text-secondary-foreground">
              {post.publishedAt}
            </span>
            <span className="font-mono text-[10px] text-muted-foreground">
              {post.readTime}
            </span>
          </span>

          <span className="flex min-w-0 flex-col gap-2">
            <span className="font-mono text-[10px] tracking-[0.1em] text-primary uppercase">
              {post.tag}
            </span>
            <span className="text-[22px] font-semibold leading-[1.2] tracking-[-0.015em]">
              {post.title}
            </span>
            <span className="max-w-[640px] text-sm leading-[1.55] text-muted-foreground">
              {post.excerpt}
            </span>
          </span>

          <span className="hidden text-right font-mono text-[15px] text-muted-foreground md:block">
            →
          </span>
        </Link>
      ))}
    </section>
  )
}
