'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { ADMIN_PAGE_TABS } from '@/constants/admin-pages'
import { cn } from '@/lib/utils'

export function PagesTabNav(): React.JSX.Element {
  const pathname = usePathname()

  return (
    <div className="mb-[26px] flex gap-1 border-b border-border">
      {ADMIN_PAGE_TABS.map((tab) => {
        const isActive = pathname === tab.href || pathname.startsWith(`${tab.href}/`)
        return (
          <Link
            key={tab.key}
            href={tab.href}
            className={cn(
              'border-b-2 px-3.5 py-2.5 font-mono text-[11px] uppercase tracking-[0.08em]',
              isActive
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {tab.label}
          </Link>
        )
      })}
    </div>
  )
}
