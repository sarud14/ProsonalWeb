import { cn } from '@/lib/utils'

export function Container({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}): React.JSX.Element {
  return (
    <div className={cn('mx-auto w-full max-w-6xl px-6', className)}>
      {children}
    </div>
  )
}
