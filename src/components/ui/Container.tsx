import { cn } from '@/lib/utils'
import type { ContainerProps } from '@/types/container.types'

export function Container({
  children,
  className,
}: ContainerProps): React.JSX.Element {
  return (
    <div className={cn('mx-auto w-full max-w-6xl px-6', className)}>
      {children}
    </div>
  )
}
