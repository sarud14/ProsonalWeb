'use client'

import Link from 'next/link'

import { ADMIN_NAV_ITEMS } from '@/constants/admin-nav'

import { AdminUserMenu } from '@/components/admin-page/AdminUserMenu'
import { cn } from '@/lib/utils'

interface SidebarNavProps {
  readonly activeKey: string
  readonly unreadCount: number
}

export function SidebarNav({ activeKey, unreadCount }: SidebarNavProps): React.JSX.Element {
  return (
    <aside className="flex w-[232px] shrink-0 flex-col border-r border-sidebar-border bg-sidebar py-6">
      <div className="mb-4 border-b border-border px-6 pb-6">
        <div className="text-[22px] font-medium">FEOps Kit</div>
        <div className="mt-0.5 font-mono text-[9.5px] uppercase tracking-[0.22em] text-muted-foreground">
          Studio CMS
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-px px-3.5">
        {ADMIN_NAV_ITEMS.map((item) => {
          const isActive = item.key === activeKey
          const badge = item.key === 'messages' ? unreadCount : undefined
          return (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                'flex items-center justify-between rounded-md px-3 py-2.5 font-mono text-[11px] uppercase tracking-[0.08em]',
                isActive
                  ? 'bg-primary/15 text-foreground'
                  : 'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground'
              )}
            >
              <span className="flex items-center gap-2.5">
                <span className="w-[18px] text-center font-semibold opacity-60">
                  {item.icon}
                </span>
                {item.label}
              </span>
              {badge !== undefined && badge > 0 && (
                <span className="inline-flex min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] text-primary-foreground">
                  {badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      <div className="mt-4 border-t border-border px-6 pt-4">
        <AdminUserMenu showLabel />
      </div>
    </aside>
  )
}
