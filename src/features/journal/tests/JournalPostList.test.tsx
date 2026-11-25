import { render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'

import { journalFixture } from '@/test-utils/fixtures'

import { JournalPostList } from '../JournalPostList'

vi.mock('next/link', async () => ({ default: (await import('@/test-utils/next-link-mock')).MockLink }))

test('links each post to its detail page', () => {
  render(<JournalPostList posts={[journalFixture(), journalFixture({ slug: 'second', title: 'Second post' })]} />)
  expect(screen.getByRole('link', { name: /First post/ })).toHaveAttribute('href', '/journal/posts/first-post')
  expect(screen.getByRole('link', { name: /Second post/ })).toHaveAttribute('href', '/journal/posts/second')
})
