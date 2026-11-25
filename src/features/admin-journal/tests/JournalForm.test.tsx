import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, expect, test, vi } from 'vitest'

import { emptyJournalFormState } from '@/lib/admin/content-form-mappers'

import { JournalForm } from '../JournalForm'

const router = vi.hoisted(() => ({ push: vi.fn(), refresh: vi.fn() }))
const actions = vi.hoisted(() => ({ createJournal: vi.fn(), updateJournal: vi.fn(), publishJournal: vi.fn() }))

vi.mock('next/navigation', () => ({ useRouter: () => router }))
vi.mock('next/image', async () => ({ default: (await import('@/test-utils/next-image-mock')).MockImage }))
vi.mock('@/actions/journal.actions', () => actions)

beforeEach(() => {
  vi.clearAllMocks()
})

test('creates and publishes a new post', async () => {
  const user = userEvent.setup()
  actions.createJournal.mockResolvedValue({ success: true, data: { id: 'j1' } })
  actions.publishJournal.mockResolvedValue({ success: true, data: null })
  render(<JournalForm initialValues={emptyJournalFormState()} media={[]} listHref="/admin/journal" />)

  expect(screen.getByRole('heading', { level: 1, name: 'New journal' })).toBeInTheDocument()
  await user.type(screen.getByRole('textbox', { name: /^Tag\s?\*$/ }), 'Notes')
  await user.click(screen.getByRole('button', { name: 'Publish' }))

  expect(actions.createJournal).toHaveBeenCalledWith(expect.objectContaining({ tag: 'Notes' }))
  expect(actions.publishJournal).toHaveBeenCalledWith('j1')
  expect(router.push).toHaveBeenCalledWith('/admin/journal')
})

test('reports a publish failure', async () => {
  const user = userEvent.setup()
  actions.createJournal.mockResolvedValue({ success: true, data: { id: 'j1' } })
  actions.publishJournal.mockResolvedValue({ success: false, error: 'Excerpt required' })
  render(<JournalForm initialValues={emptyJournalFormState()} media={[]} listHref="/admin/journal" />)
  await user.click(screen.getByRole('button', { name: 'Publish' }))
  expect(await screen.findByRole('status')).toHaveTextContent('Excerpt required')
  expect(router.push).not.toHaveBeenCalled()
})

test('cancel returns to the list', async () => {
  const user = userEvent.setup()
  render(<JournalForm initialValues={emptyJournalFormState()} media={[]} listHref="/admin/journal" />)
  await user.click(screen.getByRole('button', { name: 'Cancel' }))
  expect(router.push).toHaveBeenCalledWith('/admin/journal')
})
