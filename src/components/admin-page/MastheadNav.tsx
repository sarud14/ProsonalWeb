'use client'

import Link from 'next/link'

import { ADMIN_NAV_ITEMS } from '@/constants/admin-nav'

import { AdminUserMenu } from '@/components/admin-page/AdminUserMenu'
import { cn } from '@/lib/utils'

interface MastheadNavProps {
  readonly activeKey: string
  readonly unreadCount: number
}

export function MastheadNav({ activeKey, unreadCount }: MastheadNavProps): React.JSX.Element {
  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-9 bg-sidebar px-7 text-sidebar-foreground">
      <div className="mr-2 flex items-baseline gap-2.5">
        <span className="text-[22px] font-medium tracking-[-0.01em]">FEOps Kit</span>
        <span className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-muted-foreground">
          CMS
        </span>
      </div>

      <nav className="flex h-full flex-1 items-stretch gap-0.5 overflow-x-auto">
        {ADMIN_NAV_ITEMS.map((item) => {
          const isActive = item.key === activeKey
          const badge = item.key === 'messages' ? unreadCount : undefined
          return (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                'flex h-full cursor-pointer items-center gap-[7px] whitespace-nowrap border-b-2 px-3.5 font-mono text-[11px] uppercase tracking-[0.12em]',
                isActive
                  ? 'border-primary bg-primary/10 text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              <span>{item.label}</span>
              {badge !== undefined && badge > 0 && (
                <span className="inline-flex min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] text-primary-foreground">
                  {badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      <AdminUserMenu />
    </header>
  )
}
