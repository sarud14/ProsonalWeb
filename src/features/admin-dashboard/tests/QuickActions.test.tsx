import { render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'

import { DASHBOARD_QUICK_ACTIONS } from '@/constants/dashboard'

import { QuickActions } from '../QuickActions'

vi.mock('next/link', async () => ({ default: (await import('@/test-utils/next-link-mock')).MockLink }))

test('links every quick action to its create route', () => {
  render(<QuickActions />)
  for (const action of DASHBOARD_QUICK_ACTIONS) {
    expect(screen.getByRole('link', { name: new RegExp(action.label) })).toHaveAttribute('href', action.href)
  }
})
