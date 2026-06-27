import { cn } from '@/lib/utils'
import type { PageRouteHeaderProps } from '@/types/page-route-header.types'

export function PageRouteHeader({
  path,
  trailing,
  title,
  description,
  className,
}: PageRouteHeaderProps): React.JSX.Element {
  return (
    <section
      className={cn('border-b border-border pb-9 pt-[70px]', className)}
    >
      <div className="mb-[22px] flex items-center gap-3">
        <span className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground">
          {path}
        </span>
        <span className="h-px flex-1 bg-white/10" aria-hidden />
        {trailing && (
          <span className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
            {trailing}
          </span>
        )}
      </div>
      <h1 className="text-[clamp(2.125rem,4.4vw,3.5rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
        {title}
      </h1>
      {description && (
        <p className="mt-5 max-w-[600px] text-base leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
    </section>
  )
}
