import { Container } from '@/components/ui/Container'
import { FOCUS_PAGE_DATA } from '@/constants/focus-page-data'
import { FOCUS_ROADMAP_DOT } from '@/constants/focus'
import { cn } from '@/lib/utils'
import type { FocusRoadmapDot } from '@/constants/focus'

const ROADMAP_DOT_CLASS: Record<FocusRoadmapDot, string> = {
  [FOCUS_ROADMAP_DOT.ACTIVE]: 'bg-primary',
  [FOCUS_ROADMAP_DOT.QUEUED]: 'bg-muted-foreground',
  [FOCUS_ROADMAP_DOT.EXPLORING]: 'bg-white/[0.22]',
}

export function FocusPageView(): React.JSX.Element {
  const { updatedLabel, topic, intro, roadmap, learning, reading } =
    FOCUS_PAGE_DATA

  const introBefore = intro.split(topic)[0] ?? ''
  const introAfter = intro.split(topic)[1] ?? ''

  return (
    <Container className="max-w-[1240px] px-7">
      <section className="border-b border-border pb-11 pt-[70px]">
        <div className="mb-[22px] flex items-center gap-3">
          <span className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground">
            /focus
          </span>
          <span className="h-px flex-1 bg-white/10" aria-hidden />
          <span className="flex items-center gap-[7px] font-mono text-[11px] tracking-[0.12em] text-muted-foreground uppercase">
            <span className="size-1.5 rounded-full bg-primary" aria-hidden />
            {updatedLabel}
          </span>
        </div>

        <h1 className="text-[clamp(2.125rem,4.4vw,3.5rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
          Right now
        </h1>
        <p className="mt-[22px] max-w-[660px] text-lg leading-relaxed text-muted-foreground">
          {introBefore}
          <span className="text-foreground">{topic}</span>
          {introAfter}
        </p>
      </section>

      <section className="grid grid-cols-1 border border-border border-t-0 md:grid-cols-3">
        {roadmap.map((column, columnIndex) => (
          <div
            key={column.phase}
            className={cn(
              'flex flex-col border-white/[0.07] md:border-r',
              columnIndex === roadmap.length - 1 && 'md:border-r-0'
            )}
          >
            <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-5">
              <span className="font-mono text-xs tracking-[0.14em] text-foreground">
                {column.phase}
              </span>
              <span className="font-mono text-[10px] tracking-[0.08em] text-muted-foreground uppercase">
                {column.tag}
              </span>
            </div>

            {column.items.map((item) => (
              <div
                key={item.title}
                className="flex gap-3 border-b border-white/[0.05] px-6 py-5 last:border-b-0"
              >
                <span
                  className={cn(
                    'mt-1.5 size-[7px] shrink-0 rounded-full',
                    ROADMAP_DOT_CLASS[item.dot]
                  )}
                  aria-hidden
                />
                <span className="flex flex-col gap-[5px]">
                  <span className="text-[15px] font-semibold tracking-[-0.01em]">
                    {item.title}
                  </span>
                  <span className="text-[13px] leading-normal text-muted-foreground">
                    {item.note}
                  </span>
                </span>
              </div>
            ))}
          </div>
        ))}
      </section>

      <section className="mb-[88px] grid grid-cols-1 border border-t-0 border-border md:grid-cols-2">
        <div className="border-b border-white/[0.07] p-[30px] md:border-r md:border-b-0">
          <span className="font-mono text-[10.5px] tracking-[0.14em] text-muted-foreground uppercase">
            Learning
          </span>
          <div className="mt-[18px] flex flex-wrap gap-2">
            {learning.map((topicLabel) => (
              <span
                key={topicLabel}
                className="border border-white/[0.12] px-3 py-[7px] font-mono text-xs text-secondary-foreground"
              >
                {topicLabel}
              </span>
            ))}
          </div>
        </div>

        <div className="p-[30px]">
          <span className="font-mono text-[10.5px] tracking-[0.14em] text-muted-foreground uppercase">
            In the queue
          </span>
          <div className="mt-[18px] flex flex-col gap-3.5">
            {reading.map((item) => (
              <div key={item.idx} className="flex items-baseline gap-3">
                <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
                  {item.idx}
                </span>
                <span className="text-[14.5px] leading-normal text-secondary-foreground">
                  {item.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Container>
  )
}
