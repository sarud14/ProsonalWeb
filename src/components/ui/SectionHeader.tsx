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
    <div className={cn('flex items-baseline justify-between', className)}>
      <div className="flex items-baseline gap-3">
        <span className="text-sm font-medium text-success">{number}</span>
        <h2 className="text-2xl font-semibold">{title}</h2>
      </div>
      {trailing && (
        <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
          {trailing}
        </span>
      )}
    </div>
  )
}
