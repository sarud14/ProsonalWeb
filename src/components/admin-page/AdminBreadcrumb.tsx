'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import type { AdminLayoutMode } from '@/types/admin-page.types'

import { ADMIN_NAV_ITEMS } from '@/constants/admin-nav'

import { LayoutSwitcher } from '@/components/admin-page/LayoutSwitcher'

interface AdminBreadcrumbProps {
  readonly layout: AdminLayoutMode
  readonly onLayoutChange: (mode: AdminLayoutMode) => void
}

function buildCrumbs(pathname: string): readonly { label: string; href?: string }[] {
  const crumbs: { label: string; href?: string }[] = [{ label: 'Admin', href: '/admin' }]

  const segments = pathname.replace('/admin', '').split('/').filter(Boolean)
  if (segments.length === 0) return crumbs

  const navItem = ADMIN_NAV_ITEMS.find((item) => item.key === segments[0])
  if (navItem) {
    crumbs.push(
      segments.length > 1
        ? { label: navItem.label, href: navItem.href }
        : { label: navItem.label }
    )
  }

  if (segments.includes('new')) {
    crumbs.push({ label: 'New' })
  } else if (segments.includes('edit')) {
    crumbs.push({ label: 'Edit' })
  } else if (segments.length > 1 && navItem?.key === 'pages') {
    const pageSegment = segments[1]
    if (pageSegment) {
      crumbs.push({ label: pageSegment.charAt(0).toUpperCase() + pageSegment.slice(1) })
    }
  }

  return crumbs
}

export function AdminBreadcrumb({
  layout,
  onLayoutChange,
}: AdminBreadcrumbProps): React.JSX.Element {
  const pathname = usePathname()
  const crumbs = buildCrumbs(pathname)

  return (
    <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-[oklch(0.05_0.007_255)] px-10 py-4">
      <nav className="flex items-center gap-2 font-mono text-[11px] tracking-[0.06em] text-muted-foreground">
        {crumbs.map((crumb, i) => (
          <span key={crumb.label} className="flex items-center gap-2">
            {i > 0 && <span className="opacity-50">/</span>}
            {crumb.href ? (
              <Link href={crumb.href} className="hover:text-foreground">
                {crumb.label}
              </Link>
            ) : (
              <span className="text-foreground">{crumb.label}</span>
            )}
          </span>
        ))}
      </nav>
      <LayoutSwitcher layout={layout} onChange={onLayoutChange} />
    </div>
  )
}
