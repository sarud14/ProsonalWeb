import type { AdminLayoutMode } from '@/types/admin-page.types'
import type { AdminSessionUser } from '@/types/auth.types'

export interface AdminBreadcrumbProps {
  readonly layout: AdminLayoutMode
  readonly onLayoutChange: (mode: AdminLayoutMode) => void
}

export interface AdminShellProps {
  readonly children: React.ReactNode
  readonly unreadCount?: number
  readonly user: AdminSessionUser
}

export interface AdminUserMenuProps {
  readonly user: AdminSessionUser
  readonly showLabel?: boolean
}

export interface UserAvatarProps {
  readonly user: AdminSessionUser
  readonly className?: string
}

export interface LayoutSwitcherProps {
  readonly layout: AdminLayoutMode
  readonly onChange: (mode: AdminLayoutMode) => void
}

export interface MastheadNavProps {
  readonly activeKey: string
  readonly unreadCount: number
  readonly user: AdminSessionUser
}

export interface SidebarNavProps {
  readonly activeKey: string
  readonly unreadCount: number
  readonly user: AdminSessionUser
}

export interface SplitNavProps {
  readonly activeKey: string
  readonly unreadCount: number
}
