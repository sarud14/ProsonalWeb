import { render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'

import { ADMIN_PAGE_TABS } from '@/constants/admin-pages'

import { PagesTabNav } from '../PagesTabNav'

vi.mock('next/navigation', () => ({ usePathname: () => '/admin/pages/stack' }))
vi.mock('next/link', async () => ({ default: (await import('@/test-utils/next-link-mock')).MockLink }))

test('links every pages tab and marks the current one', () => {
  render(<PagesTabNav />)
  for (const tab of ADMIN_PAGE_TABS) {
    expect(screen.getByRole('link', { name: tab.label })).toHaveAttribute('href', tab.href)
  }
  expect(screen.getByRole('link', { name: 'Stack' })).toHaveAttribute('aria-current', 'page')
  expect(screen.getByRole('link', { name: 'Landing' })).not.toHaveAttribute('aria-current')
})
