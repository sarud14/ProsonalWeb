'use client'

import { useMemo, useState } from 'react'

import {
  ENGINEERING_FILTER_ALL,
  ENGINEERING_TYPE_FILTERS,
} from '@/constants/engineering-filters'
import { cn } from '@/lib/utils'
import type {
  EngineeringListSectionProps,
  EngineeringNote,
  EngineeringTypeFilter,
} from '@/types/engineering.types'

function matchesTypeFilter(
  item: EngineeringNote,
  filter: EngineeringTypeFilter
): boolean {
  if (filter === ENGINEERING_FILTER_ALL) return true
  return item.type === filter
}

export function EngineeringListSection({
  items,
}: EngineeringListSectionProps): React.JSX.Element {
  const [activeFilter, setActiveFilter] = useState<EngineeringTypeFilter>(
    ENGINEERING_FILTER_ALL
  )

  const shownItems = useMemo(
    () => items.filter((item) => matchesTypeFilter(item, activeFilter)),
    [activeFilter, items]
  )

  const countLabel = `${shownItems.length} / ${items.length} SHOWN`

  return (
    <>
      <section className="flex flex-wrap items-center justify-between gap-4 border-b border-border py-6">
        <div className="flex flex-wrap gap-2">
          {ENGINEERING_TYPE_FILTERS.map((filter) => {
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
        <div className="min-w-[760px]">
          <div className="grid grid-cols-[46px_minmax(0,1fr)_168px_96px] items-center gap-[18px] border-b border-border px-4 py-3.5">
            {(['ID', 'NOTE', 'TYPE', 'WHEN'] as const).map((label) => (
              <span
                key={label}
                className={cn(
                  'font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase',
                  label === 'WHEN' && 'text-right'
                )}
              >
                {label}
              </span>
            ))}
          </div>

          {shownItems.map((item, index) => (
            <div
              key={item.slug}
              className="grid grid-cols-[46px_minmax(0,1fr)_168px_96px] items-center gap-[18px] border-b border-white/[0.07] px-4 py-6 transition-colors hover:bg-white/[0.025]"
            >
              <span className="font-mono text-xs text-muted-foreground">
                {String(index + 1).padStart(2, '0')}
              </span>

              <span className="flex min-w-0 flex-col gap-1.5">
                <span className="text-[17px] font-semibold tracking-[-0.01em]">
                  {item.title}
                </span>
                <span className="max-w-[600px] text-[13.5px] leading-[1.55] text-muted-foreground">
                  {item.summary}
                </span>
              </span>

              <span className="justify-self-start">
                <span className="border border-white/[0.16] px-[9px] py-1 font-mono text-[10px] tracking-[0.08em] text-primary uppercase">
                  {item.type}
                </span>
              </span>

              <span className="flex flex-col gap-[3px] text-right">
                <span className="font-mono text-xs text-secondary-foreground">
                  {item.noteDate}
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {item.readTime}
                </span>
              </span>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
