import { render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'

import { journalFixture } from '@/test-utils/fixtures'

import { JournalPostDetailView } from '../JournalPostDetailView'

vi.mock('next/link', async () => ({ default: (await import('@/test-utils/next-link-mock')).MockLink }))

test('renders the post, its parsed sections, and the pull quote', () => {
  render(<JournalPostDetailView post={journalFixture({ pull: 'Ship small.' })} postCount={3} />)
  expect(screen.getByRole('heading', { level: 1, name: 'First post' })).toBeInTheDocument()
  expect(screen.getByRole('heading', { level: 3, name: 'Heading one' })).toBeInTheDocument()
  expect(screen.getByText('Paragraph two.')).toBeInTheDocument()
  expect(screen.getByText('Ship small.')).toBeInTheDocument()
  expect(screen.getByText(/03 POSTS/)).toBeInTheDocument()
})

test('omits the pull quote when there is none', () => {
  render(<JournalPostDetailView post={journalFixture()} postCount={1} />)
  expect(screen.queryByRole('blockquote')).toBeNull()
})
