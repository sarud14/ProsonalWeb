import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'

import { ADMIN_USER_FIXTURE } from '@/test-utils/admin-user'

import { AdminUserMenu } from '../AdminUserMenu'

const signOutAction = vi.hoisted(() => vi.fn())
vi.mock('@/actions/auth.actions', () => ({ signOutAction }))

test('shows initials without an avatar and the label when asked', () => {
  render(<AdminUserMenu user={ADMIN_USER_FIXTURE} showLabel />)
  expect(screen.getByText('SD')).toBeInTheDocument()
  expect(screen.getByText('owner@example.com')).toBeInTheDocument()
})

test('signs out from the menu', async () => {
  const user = userEvent.setup()
  render(<AdminUserMenu user={ADMIN_USER_FIXTURE} />)
  await user.click(screen.getByRole('button', { name: 'Account menu' }))
  await user.click(await screen.findByRole('menuitem', { name: 'Sign out' }))
  expect(signOutAction).toHaveBeenCalled()
})
