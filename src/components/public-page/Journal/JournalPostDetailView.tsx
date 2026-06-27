import Link from 'next/link'

import { parseJournalBlocks } from '@/lib/journal-post-content'
import type { JournalPostDetailViewProps } from '@/types/journal-post-detail.types'

export function JournalPostDetailView({
  post,
  postCount,
}: JournalPostDetailViewProps): React.JSX.Element {
  const blocks = parseJournalBlocks(post.content)
  const postCountLabel = `${String(postCount).padStart(2, '0')} POSTS`

  return (
    <>
      <article className="mx-auto max-w-[760px] px-7 pt-[52px] pb-10">
        <Link
          href="/journal"
          className="mb-[34px] inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.1em] text-muted-foreground uppercase no-underline transition-colors hover:text-foreground"
        >
          ← Journal
        </Link>

        <div className="mb-[22px] flex flex-wrap items-center gap-3.5">
          <span className="font-mono text-[10px] tracking-[0.1em] text-primary uppercase">
            {post.tag}
          </span>
          <span className="size-1 rounded-full bg-muted-foreground" aria-hidden />
          <span className="font-mono text-[10px] tracking-[0.06em] text-muted-foreground">
            {post.publishedAt}
          </span>
          <span className="size-1 rounded-full bg-muted-foreground" aria-hidden />
          <span className="font-mono text-[10px] tracking-[0.06em] text-muted-foreground">
            {post.readTime}
          </span>
        </div>

        <h1 className="text-[clamp(2rem,4.4vw,3rem)] font-semibold leading-[1.08] tracking-[-0.025em]">
          {post.title}
        </h1>
        <p className="mt-6 text-[19px] leading-[1.6] font-normal text-secondary-foreground">
          {post.excerpt}
        </p>

        <div className="my-10 h-px bg-white/10" aria-hidden />

        <div>
          {blocks.map((block) => (
            <div key={block.heading}>
              <h3 className="mt-9 mb-4 text-[19px] font-semibold tracking-[-0.01em] text-foreground first:mt-0">
                {block.heading}
              </h3>
              <p className="mb-5 text-[16.5px] leading-[1.8] text-secondary-foreground">
                {block.paragraph}
              </p>
            </div>
          ))}

          {post.pull && (
            <blockquote className="my-9 border-l-2 border-primary py-1.5 pl-6 text-[21px] leading-[1.45] font-medium tracking-[-0.01em] text-foreground">
              {post.pull}
            </blockquote>
          )}
        </div>
      </article>

      <section className="border-t border-border">
        <Link
          href="/journal"
          className="mx-auto flex max-w-[760px] items-center justify-between px-7 py-8 text-inherit no-underline transition-colors hover:bg-white/[0.025]"
        >
          <span className="font-mono text-[11px] tracking-[0.1em] text-muted-foreground uppercase">
            ← Back to journal
          </span>
          <span className="font-mono text-[11px] tracking-[0.1em] text-muted-foreground uppercase">
            {postCountLabel}
          </span>
        </Link>
      </section>
    </>
  )
}
