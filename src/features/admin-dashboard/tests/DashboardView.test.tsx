import { render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'

import { DashboardView } from '../DashboardView'

vi.mock('next/link', async () => ({ default: (await import('@/test-utils/next-link-mock')).MockLink }))

test('composes greeting, actions, recents, inbox, and library stats', () => {
  render(
    <DashboardView
      userName="Sarut"
      data={{
        recents: [{ kind: 'journal', kindLabel: 'Journal', title: 'First post', status: 'PUBLISHED', editHref: '/admin/journal/j1' }],
        libraryStats: [{ label: 'Media', value: 4 }],
        unreadCount: 2,
      }}
    />,
  )
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Sarut')
  expect(screen.getByRole('link', { name: /New Work/ })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /First post/ })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /unread messages/ })).toHaveTextContent('2')
  expect(screen.getByText('Media')).toBeInTheDocument()
})
