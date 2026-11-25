import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, expect, test, vi } from 'vitest'

import { DEFAULT_FOCUS_PAGE_DATA } from '@/lib/admin/page-section-defaults'

import { FocusPageEditor } from '../FocusPageEditor'

const router = vi.hoisted(() => ({ refresh: vi.fn() }))
const updatePage = vi.hoisted(() => vi.fn())
vi.mock('next/navigation', () => ({ useRouter: () => router }))
vi.mock('@/actions/page.actions', () => ({ updatePage }))

beforeEach(() => {
  vi.clearAllMocks()
})

test('saves edited header fields', async () => {
  const user = userEvent.setup()
  updatePage.mockResolvedValue({ success: true, data: null })
  render(<FocusPageEditor initialData={DEFAULT_FOCUS_PAGE_DATA} />)
  const topic = screen.getByRole('textbox', { name: 'Topic' })
  await user.clear(topic)
  await user.type(topic, 'Design systems')
  await user.click(screen.getByRole('button', { name: 'Save page' }))
  expect(updatePage).toHaveBeenCalledWith({ key: 'focus', data: expect.objectContaining({ topic: 'Design systems' }) })
  expect(router.refresh).toHaveBeenCalled()
})

test('adds a reading item through the modal', async () => {
  const user = userEvent.setup()
  updatePage.mockResolvedValue({ success: true, data: null })
  render(<FocusPageEditor initialData={DEFAULT_FOCUS_PAGE_DATA} />)
  const addButtons = screen.getAllByRole('button', { name: '+ Add' })
  await user.click(addButtons[addButtons.length - 1] as HTMLElement)
  await user.type(screen.getByRole('textbox', { name: 'Title' }), 'Refactoring UI')
  await user.click(screen.getByRole('button', { name: 'Apply' }))
  await user.click(screen.getByRole('button', { name: 'Save page' }))
  const saved = updatePage.mock.calls[0]?.[0] as { data: { reading: { title: string }[] } }
  expect(saved.data.reading.map((item) => item.title)).toContain('Refactoring UI')
})
