import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  readonly status: 'PUBLISHED' | 'DRAFT'
}

export function StatusBadge({ status }: StatusBadgeProps): React.JSX.Element {
  return (
    <span
      className={cn(
        'inline-block rounded-[5px] px-[9px] py-1 font-mono text-[9.5px] uppercase tracking-[0.1em]',
        status === 'PUBLISHED'
          ? 'bg-success/18 text-success'
          : 'bg-warning/18 text-warning'
      )}
    >
      {status === 'PUBLISHED' ? 'Published' : 'Draft'}
    </span>
  )
}
