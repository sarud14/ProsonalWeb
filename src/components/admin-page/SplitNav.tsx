'use client'

import Link from 'next/link'

import type { AdminSubNavItem } from '@/types/admin-page.types'

import { ADMIN_NAV_ITEMS } from '@/constants/admin-nav'

import { cn } from '@/lib/utils'

interface SplitNavProps {
  readonly activeKey: string
  readonly unreadCount: number
}

function getSubNav(key: string): readonly AdminSubNavItem[] {
  switch (key) {
    case 'work':
      return [
        { label: 'All work', href: '/admin/work' },
        { label: 'New case study', href: '/admin/work/new' },
      ]
    case 'journal':
      return [
        { label: 'All posts', href: '/admin/journal' },
        { label: 'New post', href: '/admin/journal/new' },
      ]
    case 'engineering':
      return [
        { label: 'All notes', href: '/admin/engineering' },
        { label: 'New note', href: '/admin/engineering/new' },
      ]
    case 'pages':
      return [
        { label: 'Landing', href: '/admin/pages/landing' },
        { label: 'Focus', href: '/admin/pages/focus' },
        { label: 'Stack', href: '/admin/pages/stack' },
        { label: 'Site config', href: '/admin/pages/site' },
      ]
    default:
      return []
  }
}

export function SplitNav({ activeKey, unreadCount }: SplitNavProps): React.JSX.Element {
  const activeItem = ADMIN_NAV_ITEMS.find((item) => item.key === activeKey)
  const subNav = getSubNav(activeKey)

  return (
    <>
      <nav className="flex w-[60px] shrink-0 flex-col items-center gap-1 bg-sidebar py-[18px]">
        <div className="mb-3.5 text-xl font-medium text-foreground">F</div>
        {ADMIN_NAV_ITEMS.map((item) => {
          const isActive = item.key === activeKey
          const badge = item.key === 'messages' ? unreadCount : undefined
          return (
            <Link
              key={item.key}
              href={item.href}
              title={item.label}
              className={cn(
                'relative flex size-10 items-center justify-center rounded-lg font-mono text-[13px] font-semibold',
                isActive
                  ? 'bg-primary/15 text-foreground'
                  : 'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground'
              )}
            >
              {item.icon}
              {badge !== undefined && badge > 0 && (
                <span className="absolute right-1 top-1 size-[7px] rounded-full bg-primary" />
              )}
            </Link>
          )
        })}
      </nav>

      <aside className="w-[208px] shrink-0 border-r border-sidebar-border bg-sidebar p-[18px_18px_26px]">
        <div className="mb-1 text-[26px] font-medium tracking-[-0.01em]">
          {activeItem?.label ?? 'Dashboard'}
        </div>
        <div className="mb-5 font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted-foreground">
          {activeItem?.meta ?? 'Overview'}
        </div>
        {subNav.length > 0 && (
          <div className="flex flex-col gap-0.5">
            {subNav.map((sub) => (
              <Link
                key={sub.href}
                href={sub.href}
                className="flex items-center justify-between rounded-md px-2.5 py-2 text-[13px] text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
              >
                <span>{sub.label}</span>
                {sub.hint && (
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {sub.hint}
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </aside>
    </>
  )
}
