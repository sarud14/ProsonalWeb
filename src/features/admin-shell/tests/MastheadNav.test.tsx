import { render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'

import { ADMIN_NAV_ITEMS } from '@/constants/admin-nav'
import { ADMIN_USER_FIXTURE } from '@/test-utils/admin-user'

import { MastheadNav } from '../MastheadNav'

vi.mock('next/link', async () => ({ default: (await import('@/test-utils/next-link-mock')).MockLink }))
vi.mock('@/actions/auth.actions', () => ({ signOutAction: vi.fn() }))

test('links every section, marks the active one, and badges unread messages', () => {
  render(<MastheadNav activeKey="work" unreadCount={4} user={ADMIN_USER_FIXTURE} />)
  expect(screen.getAllByRole('link')).toHaveLength(ADMIN_NAV_ITEMS.length)
  expect(screen.getByRole('link', { name: 'Work' })).toHaveAttribute('aria-current', 'page')
  expect(screen.getByRole('link', { name: /Messages/ })).toHaveTextContent('4')
})
