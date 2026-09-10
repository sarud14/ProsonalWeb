'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useId, useState } from 'react'

import { getSiteAvailabilityDisplay } from '@/constants/site-availability'
import { NavBarLink } from './NavBarLink'
import { getInitialsFromName } from '@/lib/format/get-initials-from-name'
import { cn } from './helpers'
import type { NavBarProps } from '@/types/nav-bar.types'

export function NavBar({ items, brand, className }: NavBarProps): React.JSX.Element {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [menuPathname, setMenuPathname] = useState(pathname)
  const menuId = useId()
  const initials = getInitialsFromName(brand.name)
  const availability = getSiteAvailabilityDisplay(brand.isAvailable)

  if (pathname !== menuPathname) {
    setMenuPathname(pathname)
    setIsMenuOpen(false)
  }

  useEffect(() => {
    if (!isMenuOpen) return

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') setIsMenuOpen(false)
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isMenuOpen])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b border-border bg-background/75 backdrop-blur-[14px]',
        className
      )}
    >
      <div className="flex items-center justify-between gap-4 px-4 py-3.5 sm:px-7">
        <Link
          href="/"
          className="flex min-w-0 flex-1 items-center gap-3 overflow-hidden"
          onClick={() => setIsMenuOpen(false)}
        >
          <div className="grid size-[30px] shrink-0 place-items-center border border-primary font-mono text-xs font-semibold tracking-[0.02em]">
            {initials}
          </div>
          <div className="min-w-0 flex-1 leading-[1.15]">
            <p className="truncate text-[13.5px] font-semibold tracking-[-0.01em]">{brand.name}</p>
            <p className="hidden truncate font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase sm:block">
              {brand.role}
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 xl:flex" aria-label="Primary">
          {items.map((item) => (
            <NavBarLink key={item.href} href={item.href} label={item.label} />
          ))}
          <span className="mx-2 h-[18px] w-px bg-white/12" aria-hidden />
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

        <button
          type="button"
          className="inline-flex size-10 shrink-0 items-center justify-center border border-border text-foreground xl:hidden"
          aria-expanded={isMenuOpen}
          aria-controls={menuId}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
          <span className="relative block size-4" aria-hidden>
            <span
              className={cn(
                'absolute left-0 block h-px w-4 bg-current transition-transform',
                isMenuOpen ? 'top-[7.5px] rotate-45' : 'top-1'
              )}
            />
            <span
              className={cn(
                'absolute top-[7.5px] left-0 block h-px w-4 bg-current transition-opacity',
                isMenuOpen ? 'opacity-0' : 'opacity-100'
              )}
            />
            <span
              className={cn(
                'absolute left-0 block h-px w-4 bg-current transition-transform',
                isMenuOpen ? 'top-[7.5px] -rotate-45' : 'top-3.5'
              )}
            />
          </span>
        </button>
      </div>

      {isMenuOpen ? (
        <div id={menuId} className="border-t border-border xl:hidden">
          <nav
            className="flex max-h-[min(70vh,calc(100dvh-4.5rem))] flex-col gap-1 overflow-y-auto px-4 py-3 sm:px-7"
            aria-label="Mobile"
          >
            {items.map((item) => (
              <NavBarLink
                key={item.href}
                href={item.href}
                label={item.label}
                className="w-full"
              />
            ))}
            <div className="mt-2 flex items-center gap-1.5 border-t border-border pt-3">
              <span
                className={cn(
                  'flex items-center gap-1.5 font-mono text-[10px] tracking-[0.1em] uppercase',
                  availability.textClassName
                )}
              >
                <span className={cn('size-1.5 rounded-full', availability.dotClassName)} />
                {availability.label}
              </span>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
