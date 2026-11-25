import { render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'

import { AdminBreadcrumb } from '../AdminBreadcrumb'

const pathname = vi.hoisted(() => ({ current: '/admin' }))
vi.mock('next/navigation', () => ({ usePathname: () => pathname.current }))
vi.mock('next/link', async () => ({ default: (await import('@/test-utils/next-link-mock')).MockLink }))

test('builds crumbs for a new-item route', () => {
  pathname.current = '/admin/work/new'
  render(<AdminBreadcrumb layout="masthead" onLayoutChange={vi.fn()} />)
  expect(screen.getByRole('link', { name: 'Admin' })).toHaveAttribute('href', '/admin')
  expect(screen.getByRole('link', { name: 'Work' })).toHaveAttribute('href', '/admin/work')
  expect(screen.getByText('New')).toBeInTheDocument()
})

test('names the page section under pages', () => {
  pathname.current = '/admin/pages/landing'
  render(<AdminBreadcrumb layout="masthead" onLayoutChange={vi.fn()} />)
  expect(screen.getByText('Landing')).toBeInTheDocument()
})

test('shows the section as plain text on its index route', () => {
  pathname.current = '/admin/media'
  render(<AdminBreadcrumb layout="masthead" onLayoutChange={vi.fn()} />)
  expect(screen.queryByRole('link', { name: 'Media' })).toBeNull()
  expect(screen.getByText('Media')).toBeInTheDocument()
})
