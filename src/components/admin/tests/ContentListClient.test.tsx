import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, expect, test, vi } from 'vitest'

import type { AdminContentListConfig } from '@/types/admin-content.types'

import { ContentListClient } from '../ContentListClient'

const router = vi.hoisted(() => ({ push: vi.fn(), refresh: vi.fn() }))
const actions = vi.hoisted(() => ({
  publishWork: vi.fn(),
  unpublishWork: vi.fn(),
  deleteWork: vi.fn(),
}))

vi.mock('next/navigation', () => ({ useRouter: () => router }))
vi.mock('next/link', async () => ({ default: (await import('@/test-utils/next-link-mock')).MockLink }))
vi.mock('@/actions/work.actions', () => actions)
vi.mock('@/actions/journal.actions', () => ({ publishJournal: vi.fn(), unpublishJournal: vi.fn(), deleteJournal: vi.fn() }))
vi.mock('@/actions/engineering.actions', () => ({
  publishEngineering: vi.fn(),
  unpublishEngineering: vi.fn(),
  deleteEngineering: vi.fn(),
}))

const config: AdminContentListConfig = {
  section: 'work',
  kicker: 'Content',
  title: 'Work',
  newLabel: 'New case study',
  listHref: '/admin/work',
  newHref: '/admin/work/new',
  editHrefTemplate: '/admin/work/{id}',
  gridTemplate: '1fr 200px',
}

const columns = [{ key: 'title', label: 'Title' }]
const rows = [
  { id: 'w1', status: 'PUBLISHED' as const, cells: [{ kind: 'title' as const, text: 'CMS rebuild' }] },
  { id: 'w2', status: 'DRAFT' as const, cells: [{ kind: 'title' as const, text: 'Booking' }] },
]

beforeEach(() => {
  vi.clearAllMocks()
})

test('links to the new form and opens the edit route', async () => {
  const user = userEvent.setup()
  render(<ContentListClient config={config} columns={columns} rows={rows} />)
  expect(screen.getByRole('link', { name: /New case study/ })).toHaveAttribute('href', '/admin/work/new')
  await user.click(screen.getByRole('button', { name: 'Booking' }))
  expect(router.push).toHaveBeenCalledWith('/admin/work/w2')
})

test('unpublishes a published row and refreshes', async () => {
  const user = userEvent.setup()
  actions.unpublishWork.mockResolvedValue({ success: true, data: null })
  render(<ContentListClient config={config} columns={columns} rows={rows} />)
  await user.click(screen.getByRole('button', { name: 'Unpublish' }))
  expect(actions.unpublishWork).toHaveBeenCalledWith('w1')
  expect(router.refresh).toHaveBeenCalled()
})

test('shows an error toast when publishing fails', async () => {
  const user = userEvent.setup()
  actions.publishWork.mockResolvedValue({ success: false, error: 'Slug taken' })
  render(<ContentListClient config={config} columns={columns} rows={rows} />)
  await user.click(screen.getByRole('button', { name: 'Publish' }))
  expect(await screen.findByRole('status')).toHaveTextContent('Slug taken')
  expect(router.refresh).not.toHaveBeenCalled()
})

test('deletes only after confirming', async () => {
  const user = userEvent.setup()
  actions.deleteWork.mockResolvedValue({ success: true, data: null })
  render(<ContentListClient config={config} columns={columns} rows={rows} />)
  await user.click(screen.getAllByRole('button', { name: 'Delete' })[0])
  const dialog = screen.getByRole('dialog')
  expect(actions.deleteWork).not.toHaveBeenCalled()
  await user.click(within(dialog).getByRole('button', { name: 'Delete' }))
  expect(actions.deleteWork).toHaveBeenCalledWith('w1')
  expect(router.refresh).toHaveBeenCalled()
})
