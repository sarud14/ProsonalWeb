import Link from 'next/link'

import { getSiteAvailabilityDisplay } from '@/constants/site-availability'
import { NavBarLink } from '@/components/ui/NavBarLink'
import { getInitialsFromName } from '@/lib/format/get-initials-from-name'
import { cn } from '@/lib/utils'
import type { NavBarProps } from '@/types/nav-bar.types'

export function NavBar({ items, brand, className }: NavBarProps): React.JSX.Element {
  const initials = getInitialsFromName(brand.name)
  const availability = getSiteAvailabilityDisplay(brand.isAvailable)

  return (
    <header
      className={cn(
        'sticky top-0 z-50 flex items-center justify-between gap-6 border-b border-border bg-background/75 px-7 py-3.5 backdrop-blur-[14px]',
        className
      )}
    >
      <Link href="/" className="flex items-center gap-3">
        <div className="grid size-[30px] place-items-center border border-primary font-mono text-xs font-semibold tracking-[0.02em]">
          {initials}
        </div>
        <div className="leading-[1.15]">
          <p className="text-[13.5px] font-semibold tracking-[-0.01em]">{brand.name}</p>
          <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
            {brand.role}
          </p>
        </div>
      </Link>

      <nav className="flex items-center gap-1">
        {items.map((item) => (
          <NavBarLink key={item.href} href={item.href} label={item.label} />
        ))}
        <span className="mx-2 h-[18px] w-px bg-white/12" />
        <span
          className={cn(
            'flex items-center gap-1.5 font-mono text-[10px] tracking-[0.1em] uppercase',
            availability.textClassName
          )}
        >
          <span className={cn('size-1.5 rounded-full', availability.dotClassName)} />
          {availability.label}
        </span>
      </nav>
    </header>
  )
}
