import { render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'

import { DASHBOARD_MESSAGES_HREF } from '@/constants/dashboard'

import { InboxCard } from '../InboxCard'

vi.mock('next/link', async () => ({ default: (await import('@/test-utils/next-link-mock')).MockLink }))

test('links to the inbox with the unread count', () => {
  render(<InboxCard unreadCount={3} />)
  const link = screen.getByRole('link', { name: /unread messages/ })
  expect(link).toHaveAttribute('href', DASHBOARD_MESSAGES_HREF)
  expect(link).toHaveTextContent('3')
})
