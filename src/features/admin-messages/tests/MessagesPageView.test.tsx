import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, expect, test, vi } from 'vitest'

import type { AdminMessageItem } from '@/types/admin-messages.types'

import { MessagesPageView } from '../MessagesPageView'

const router = vi.hoisted(() => ({ refresh: vi.fn() }))
const actions = vi.hoisted(() => ({ markContactRead: vi.fn(), archiveContact: vi.fn(), deleteContact: vi.fn() }))

vi.mock('next/navigation', () => ({ useRouter: () => router }))
vi.mock('@/actions/contact.actions', () => actions)

const longMessage = 'Hello! '.repeat(40).trim()
const messages: AdminMessageItem[] = [
  { id: 'c1', name: 'Ada', email: 'ada@example.com', message: longMessage, read: false, archived: false, createdAt: '2026-11-20T10:00:00.000Z' },
  { id: 'c2', name: 'Bob', email: 'bob@example.com', message: 'Old note', read: true, archived: true, createdAt: '2026-11-01T10:00:00.000Z' },
]

beforeEach(() => {
  vi.clearAllMocks()
})

test('filters messages by tab', async () => {
  const user = userEvent.setup()
  render(<MessagesPageView initialMessages={messages} />)
  await user.click(screen.getByRole('button', { name: 'Archived' }))
  expect(screen.getByRole('button', { name: 'Archived' })).toHaveAttribute('aria-pressed', 'true')
  expect(screen.getByText('Bob')).toBeInTheDocument()
  expect(screen.queryByText('Ada')).toBeNull()
})

test('expands a message and marks it read', async () => {
  const user = userEvent.setup()
  actions.markContactRead.mockResolvedValue({ success: true, data: null })
  render(<MessagesPageView initialMessages={messages} />)
  const toggle = screen.getByRole('button', { name: /Ada/ })
  expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await user.click(toggle)
  expect(toggle).toHaveAttribute('aria-expanded', 'true')
  expect(toggle).toHaveTextContent(longMessage)
  await user.click(screen.getByRole('button', { name: 'Mark read' }))
  expect(actions.markContactRead).toHaveBeenCalledWith('c1')
  expect(router.refresh).toHaveBeenCalled()
})

test('archives and deletes after confirming', async () => {
  const user = userEvent.setup()
  actions.archiveContact.mockResolvedValue({ success: true, data: null })
  actions.deleteContact.mockResolvedValue({ success: false, error: 'Not found' })
  render(<MessagesPageView initialMessages={messages} />)
  await user.click(screen.getByRole('button', { name: 'Archive' }))
  expect(actions.archiveContact).toHaveBeenCalledWith('c1')
  await user.click(screen.getAllByRole('button', { name: 'Delete' })[0])
  await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Delete' }))
  expect(await screen.findByRole('status')).toHaveTextContent('Not found')
})
