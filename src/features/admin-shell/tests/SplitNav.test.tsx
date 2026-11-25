import { render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'

import { SplitNav } from '../SplitNav'

vi.mock('next/link', async () => ({ default: (await import('@/test-utils/next-link-mock')).MockLink }))

test('shows the active section with its sub-navigation', () => {
  render(<SplitNav activeKey="journal" unreadCount={0} />)
  expect(screen.getByRole('link', { name: 'Journal' })).toHaveAttribute('aria-current', 'page')
  expect(screen.getByRole('link', { name: 'All posts' })).toHaveAttribute('href', '/admin/journal')
  expect(screen.getByRole('link', { name: 'New post' })).toHaveAttribute('href', '/admin/journal/new')
})

test('has no sub-navigation for sections without one', () => {
  render(<SplitNav activeKey="media" unreadCount={0} />)
  expect(screen.queryByRole('link', { name: /^All / })).toBeNull()
})
