import { render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'

import { ADMIN_USER_FIXTURE } from '@/test-utils/admin-user'

import { SidebarNav } from '../SidebarNav'

vi.mock('next/link', async () => ({ default: (await import('@/test-utils/next-link-mock')).MockLink }))
vi.mock('@/actions/auth.actions', () => ({ signOutAction: vi.fn() }))

test('marks the active section and hides a zero unread badge', () => {
  render(<SidebarNav activeKey="media" unreadCount={0} user={ADMIN_USER_FIXTURE} />)
  expect(screen.getByRole('link', { name: /Media/ })).toHaveAttribute('aria-current', 'page')
  expect(screen.getByRole('link', { name: /Messages/ })).not.toHaveTextContent(/\d/)
  expect(screen.getByText('Sarut D.')).toBeInTheDocument()
})
