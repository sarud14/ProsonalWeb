import { cn } from '@/lib/utils'

export function Card({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element {
  return (
    <div
      className={cn('rounded-lg border border-border bg-card p-5', className)}
      {...props}
    >
      {children}
    </div>
  )
}
