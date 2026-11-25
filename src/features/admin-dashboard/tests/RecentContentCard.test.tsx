import { render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'

import { RecentContentCard } from '../RecentContentCard'

vi.mock('next/link', async () => ({ default: (await import('@/test-utils/next-link-mock')).MockLink }))

test('links each recent item to its editor with its status', () => {
  render(
    <RecentContentCard
      recents={[{ kind: 'work', kindLabel: 'Work', title: 'CMS rebuild', status: 'DRAFT', editHref: '/admin/work/w1' }]}
    />,
  )
  const link = screen.getByRole('link', { name: /CMS rebuild/ })
  expect(link).toHaveAttribute('href', '/admin/work/w1')
  expect(link.querySelector('[data-status="draft"]')).not.toBeNull()
})

test('shows an empty state', () => {
  render(<RecentContentCard recents={[]} />)
  expect(screen.getByText('Nothing here yet.')).toBeInTheDocument()
})
