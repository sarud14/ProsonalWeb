'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import { WORK_CASE_SECTIONS } from '@/constants/work-case-sections'
import { buildWorkCaseMeta } from '@/lib/work-case-detail'
import { cn } from '@/lib/utils'
import type { WorkCaseStudy } from '@/types/work.types'

interface WorkCaseHeroProps {
  readonly work: WorkCaseStudy
}

export function WorkCaseHero({ work }: WorkCaseHeroProps): React.JSX.Element {
  const meta = buildWorkCaseMeta(work)

  return (
    <section className="border-b border-border px-0 pb-11 pt-12">
      <Link
        href="/work"
        className="mb-[30px] inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.1em] text-muted-foreground uppercase no-underline transition-colors hover:text-foreground"
      >
        ← ALL WORK
      </Link>

      <div className="mb-[18px] flex flex-wrap items-center gap-3">
        <span className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground">
          /work/{work.slug}
        </span>
        {work.domains.map((domain) => (
          <span
            key={domain}
            className="bg-white/5 px-2 py-1 font-mono text-[10px] tracking-[0.1em] text-secondary-foreground uppercase"
          >
            {domain}
          </span>
        ))}
      </div>

      <h1 className="text-[clamp(2.5rem,5.6vw,4.5rem)] font-semibold leading-none tracking-[-0.03em]">
        {work.title}
      </h1>
      <p className="mt-[22px] max-w-[660px] text-lg leading-[1.55] text-muted-foreground">
        {work.tagline}
      </p>

      <div className="mt-10 grid grid-cols-1 border border-border sm:grid-cols-2 lg:grid-cols-5">
        {meta.map((item, index) => (
          <div
            key={item.label}
            className={cn(
              'flex flex-col gap-2 px-[22px] py-5',
              index < meta.length - 1 && 'border-b border-white/[0.07] lg:border-r lg:border-b-0'
            )}
          >
            <span className="font-mono text-[10px] tracking-[0.13em] text-muted-foreground uppercase">
              {item.label}
            </span>
            <span className="text-sm font-medium text-foreground">{item.value}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

interface WorkCaseContentsRailProps {
  readonly sectionCount?: number
}

export function WorkCaseContentsRail({
  sectionCount = WORK_CASE_SECTIONS.length,
}: WorkCaseContentsRailProps): React.JSX.Element {
  const [activeIndex, setActiveIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const sections = WORK_CASE_SECTIONS.map((section) =>
      document.getElementById(section.id)
    ).filter((element): element is HTMLElement => element !== null)

    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visible[0]?.target.id) {
          const index = WORK_CASE_SECTIONS.findIndex(
            (section) => section.id === visible[0]?.target.id
          )
          if (index >= 0) setActiveIndex(index)
        }
      },
      { rootMargin: '-20% 0px -55% 0px', threshold: [0, 0.25, 0.5, 1] }
    )

    for (const section of sections) observer.observe(section)

    const onScroll = (): void => {
      const article = document.querySelector('[data-work-article]')
      if (!article) return

      const rect = article.getBoundingClientRect()
      const total = article.scrollHeight - window.innerHeight
      const scrolled = Math.min(Math.max(-rect.top, 0), total)
      setProgress(total > 0 ? (scrolled / total) * 100 : 0)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const progressLabel = `${String(Math.min(activeIndex + 1, sectionCount)).padStart(2, '0')} / ${String(sectionCount).padStart(2, '0')}`

  return (
    <aside className="hidden lg:sticky lg:top-[84px] lg:flex lg:flex-col lg:gap-[22px] lg:self-start lg:py-11">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
            Contents
          </span>
          <span className="font-mono text-[10px] tracking-[0.06em] text-muted-foreground">
            {progressLabel}
          </span>
        </div>
        <div className="h-0.5 bg-white/10">
          <div
            className="h-full bg-primary transition-[width] duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <nav className="flex flex-col">
        {WORK_CASE_SECTIONS.map((section, index) => {
          const isActive = index === activeIndex

          return (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={cn(
                'flex items-center gap-2.5 border-l-2 py-2.5 pl-3 no-underline transition-[color,border-color] duration-150',
                isActive
                  ? 'border-primary text-primary'
                  : 'border-white/10 text-muted-foreground hover:text-foreground'
              )}
            >
              <span className="w-[22px] shrink-0 font-mono text-[11px]">
                {section.num}
              </span>
              <span className="text-[13px] font-medium">{section.label}</span>
            </a>
          )
        })}
      </nav>
    </aside>
  )
}
