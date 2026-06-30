'use client'

import { useCallback, useSyncExternalStore } from 'react'
import { usePathname } from 'next/navigation'

import type { AdminLayoutMode } from '@/types/admin-page.types'

import { ADMIN_LAYOUT_STORAGE_KEY, ADMIN_NAV_ITEMS } from '@/constants/admin-nav'

import { AdminBreadcrumb } from '@/components/admin-page/AdminBreadcrumb'
import { MastheadNav } from '@/components/admin-page/MastheadNav'
import { SidebarNav } from '@/components/admin-page/SidebarNav'
import { SplitNav } from '@/components/admin-page/SplitNav'

interface AdminShellProps {
  readonly children: React.ReactNode
  readonly unreadCount?: number
}

function getActiveKey(pathname: string): string {
  const segment = pathname.replace('/admin', '').split('/').filter(Boolean)[0]
  if (!segment) return 'dashboard'
  return ADMIN_NAV_ITEMS.find((item) => item.key === segment)?.key ?? 'dashboard'
}

const VALID_MODES = new Set<AdminLayoutMode>(['masthead', 'sidebar', 'split'])

function subscribeToStorage(callback: () => void): () => void {
  window.addEventListener('storage', callback)
  return () => window.removeEventListener('storage', callback)
}

function getLayoutSnapshot(): AdminLayoutMode {
  const stored = localStorage.getItem(ADMIN_LAYOUT_STORAGE_KEY) as AdminLayoutMode | null
  return stored && VALID_MODES.has(stored) ? stored : 'masthead'
}

function getLayoutServerSnapshot(): AdminLayoutMode {
  return 'masthead'
}

export function AdminShell({ children, unreadCount = 0 }: AdminShellProps): React.JSX.Element {
  const pathname = usePathname()
  const activeKey = getActiveKey(pathname)

  const layout = useSyncExternalStore(subscribeToStorage, getLayoutSnapshot, getLayoutServerSnapshot)

  const handleLayoutChange = useCallback((mode: AdminLayoutMode) => {
    localStorage.setItem(ADMIN_LAYOUT_STORAGE_KEY, mode)
    window.dispatchEvent(new StorageEvent('storage', { key: ADMIN_LAYOUT_STORAGE_KEY }))
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-sm text-foreground">
      {layout === 'masthead' && (
        <MastheadNav activeKey={activeKey} unreadCount={unreadCount} />
      )}

      <div className="flex min-h-0 flex-1">
        {layout === 'sidebar' && (
          <SidebarNav activeKey={activeKey} unreadCount={unreadCount} />
        )}

        {layout === 'split' && (
          <SplitNav activeKey={activeKey} unreadCount={unreadCount} />
        )}

        <main className="flex min-w-0 flex-1 flex-col overflow-y-auto">
          <AdminBreadcrumb
            layout={layout}
            onLayoutChange={handleLayoutChange}
          />
          <div className="mx-auto w-full max-w-[1180px] flex-1 p-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
