import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, expect, test, vi } from 'vitest'

import { ADMIN_LAYOUT_STORAGE_KEY } from '@/constants/admin-nav'
import { ADMIN_USER_FIXTURE } from '@/test-utils/admin-user'

import { AdminShell } from '../AdminShell'

vi.mock('next/navigation', () => ({ usePathname: () => '/admin/work' }))
vi.mock('next/link', async () => ({ default: (await import('@/test-utils/next-link-mock')).MockLink }))
vi.mock('@/actions/auth.actions', () => ({ signOutAction: vi.fn() }))

beforeEach(() => {
  localStorage.clear()
})

test('renders content in the masthead layout by default', () => {
  render(
    <AdminShell user={ADMIN_USER_FIXTURE}>
      <p>Page body</p>
    </AdminShell>,
  )
  expect(screen.getByText('Page body')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Bar' })).toHaveAttribute('aria-pressed', 'true')
  expect(screen.getAllByRole('link', { name: 'Work' })[0]).toHaveAttribute('aria-current', 'page')
})

test('switches layout and remembers the choice', async () => {
  const user = userEvent.setup()
  render(
    <AdminShell user={ADMIN_USER_FIXTURE}>
      <p>Page body</p>
    </AdminShell>,
  )
  await user.click(screen.getByRole('button', { name: 'Split' }))
  expect(localStorage.getItem(ADMIN_LAYOUT_STORAGE_KEY)).toBe('split')
  expect(screen.getByRole('button', { name: 'Split' })).toHaveAttribute('aria-pressed', 'true')
  expect(screen.getByRole('link', { name: 'All work' })).toBeInTheDocument()
})
