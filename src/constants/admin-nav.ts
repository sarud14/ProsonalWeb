import type { AdminNavItem } from '@/types/admin-page.types'

export const ADMIN_NAV_ITEMS: readonly AdminNavItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: '◆', meta: 'Overview', href: '/admin' },
  { key: 'work', label: 'Work', icon: 'W', meta: 'Case studies', href: '/admin/work' },
  { key: 'journal', label: 'Journal', icon: 'J', meta: 'Writing', href: '/admin/journal' },
  { key: 'engineering', label: 'Engineering', icon: 'E', meta: 'Notes', href: '/admin/engineering' },
  { key: 'resume', label: 'Resume', icon: 'R', meta: 'Profile', href: '/admin/resume' },
  { key: 'pages', label: 'Pages', icon: 'P', meta: 'Public site', href: '/admin/pages' },
  { key: 'media', label: 'Media', icon: 'M', meta: 'Assets', href: '/admin/media' },
  { key: 'taxonomy', label: 'Taxonomy', icon: 'T', meta: 'Filters', href: '/admin/taxonomy' },
  { key: 'messages', label: 'Messages', icon: '✉', meta: 'Inbox', href: '/admin/messages' },
] as const

export const ADMIN_LAYOUT_STORAGE_KEY = 'feops-admin-layout'
