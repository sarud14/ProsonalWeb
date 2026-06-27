import { cn } from '@/lib/utils'
import type { WorkCaseSectionHeaderProps } from '@/types/work-case-detail.types'

export function WorkCaseSectionHeader({
  num,
  label,
}: WorkCaseSectionHeaderProps): React.JSX.Element {
  return (
    <div className="mb-7 flex items-center gap-3.5">
      <span className="font-mono text-[13px] text-primary">{num}</span>
      <span className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
        {label}
      </span>
      <span className="h-px flex-1 bg-white/[0.08]" aria-hidden />
    </div>
  )
}

export function WorkCaseSectionBlock({
  id,
  num,
  label,
  className,
  children,
}: WorkCaseSectionHeaderProps & {
  readonly id: string
  readonly className?: string
  readonly children: React.ReactNode
}): React.JSX.Element {
  return (
    <section
      id={id}
      data-sec=""
      className={cn('scroll-mt-24 border-b border-white/[0.08] pb-16', className)}
    >
      <WorkCaseSectionHeader num={num} label={label} />
      {children}
    </section>
  )
}
