'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

import { WORK_DOMAIN_FILTERS, WORK_FILTER_ALL } from '@/constants/work'
import { cn } from '@/lib/utils'
import type { WorkListSectionProps, WorkDomainFilter } from '@/types/work-list.types'
import type { WorkCaseStudy } from '@/types/work.types'

function matchesDomainFilter(
  item: WorkCaseStudy,
  filter: WorkDomainFilter
): boolean {
  if (filter === WORK_FILTER_ALL) return true
  return item.domains.includes(filter)
}

export function WorkListSection({
  items,
}: WorkListSectionProps): React.JSX.Element {
  const [activeFilter, setActiveFilter] = useState<WorkDomainFilter>(
    WORK_FILTER_ALL
  )

  const shownItems = useMemo(
    () => items.filter((item) => matchesDomainFilter(item, activeFilter)),
    [activeFilter, items]
  )

  const countLabel = `SHOWING ${shownItems.length} OF ${items.length}`

  return (
    <>
      <section className="flex flex-wrap items-center justify-between gap-4 border-b border-border py-6">
        <div className="flex flex-wrap gap-2">
          {WORK_DOMAIN_FILTERS.map((filter) => {
            const isActive = activeFilter === filter

            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  'cursor-pointer border px-3.5 py-2 font-mono text-[11px] tracking-[0.08em] uppercase transition-[border-color,background,color] duration-150',
                  isActive
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-white/10 bg-transparent text-muted-foreground hover:border-white/30'
                )}
              >
                {filter}
              </button>
            )
          })}
        </div>
        <span className="font-mono text-[11px] tracking-[0.1em] text-muted-foreground uppercase">
          {countLabel}
        </span>
      </section>

      <section className="mb-20 overflow-x-auto">
        <div className="min-w-[920px]">
          <div className="grid grid-cols-[54px_minmax(0,1fr)_188px_158px_70px_34px] items-center gap-[18px] border-b border-border px-4 py-3.5">
            {(['ID', 'PROJECT', 'DOMAIN', 'IMPACT', 'YEAR'] as const).map(
              (label) => (
                <span
                  key={label}
                  className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase"
                >
                  {label}
                </span>
              )
            )}
            <span aria-hidden />
          </div>

          {shownItems.map((item) => (
            <Link
              key={item.slug}
              href={`/work/${item.slug}`}
              className="grid grid-cols-[54px_minmax(0,1fr)_188px_158px_70px_34px] items-center gap-[18px] border-b border-white/[0.07] px-4 py-[26px] text-inherit no-underline transition-colors hover:bg-white/[0.025]"
            >
              <span className="font-mono text-xs text-muted-foreground">
                {item.listId}
              </span>

              <span className="flex min-w-0 flex-col gap-[7px]">
                <span className="flex items-baseline gap-3">
                  <span className="text-[21px] font-semibold tracking-[-0.01em]">
                    {item.title}
                  </span>
                  <span className="font-mono text-[11px] tracking-[0.04em] text-muted-foreground">
                    {item.role}
                  </span>
                </span>
                <span className="max-w-[560px] text-[13.5px] leading-normal text-muted-foreground">
                  {item.tagline}
                </span>
                <span className="mt-[3px] flex flex-wrap gap-[7px]">
                  {item.stack.map((tech) => (
                    <span
                      key={tech}
                      className="border border-white/10 px-[7px] py-0.5 font-mono text-[10.5px] text-muted-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </span>
              </span>

              <span className="flex flex-wrap content-start gap-1.5">
                {item.domains.map((domain) => (
                  <span
                    key={domain}
                    className="bg-white/5 px-2 py-1 font-mono text-[10px] tracking-[0.08em] text-secondary-foreground"
                  >
                    {domain}
                  </span>
                ))}
              </span>

              <span className="flex flex-col gap-[3px]">
                <span className="font-mono text-xl font-medium tracking-[-0.02em] text-foreground">
                  {item.metric}
                </span>
                <span className="font-mono text-[10px] tracking-[0.08em] text-muted-foreground uppercase">
                  {item.metricLabel}
                </span>
              </span>

              <span className="font-mono text-xs text-muted-foreground">
                {item.year}
              </span>

              <span className="text-right font-mono text-[15px] text-muted-foreground">
                →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
