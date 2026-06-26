'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'

interface NavBarLinkProps {
  href: string
  label: string
}

export function NavBarLink({ href, label }: NavBarLinkProps): React.JSX.Element {
  const pathname = usePathname()
  const isActive = pathname === href || pathname.startsWith(`${href}/`)

  return (
    <Link
      href={href}
      className={cn(
        'border px-3 py-2 font-mono text-[11px] tracking-[0.1em] uppercase transition-colors',
        isActive
          ? 'border-primary text-foreground'
          : 'border-transparent text-muted-foreground hover:text-foreground'
      )}
    >
      {label}
    </Link>
  )
}
