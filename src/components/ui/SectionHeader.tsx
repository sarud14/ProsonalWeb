import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  number: string
  title: string
  trailing?: string
  className?: string
}

export function SectionHeader({
  number,
  title,
  trailing,
  className,
}: SectionHeaderProps): React.JSX.Element {
  return (
    <div
      className={cn(
        'mb-9 flex items-baseline justify-between gap-4',
        className
      )}
    >
      <div className="flex items-baseline gap-3.5">
        <span className="font-mono text-xs tracking-[0.14em] text-primary">
          {number}
        </span>
        <h2 className="text-[26px] font-semibold tracking-[-0.02em]">{title}</h2>
      </div>
      {trailing && (
        <span className="font-mono text-[11px] tracking-[0.1em] text-muted-foreground uppercase">
          {trailing}
        </span>
      )}
    </div>
  )
}
