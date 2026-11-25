import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, expect, test, vi } from 'vitest'

import { StackPageEditor } from '../StackPageEditor'

const router = vi.hoisted(() => ({ refresh: vi.fn() }))
const updatePage = vi.hoisted(() => vi.fn())
vi.mock('next/navigation', () => ({ useRouter: () => router }))
vi.mock('@/actions/page.actions', () => ({ updatePage }))

const initialData = {
  groups: [
    { label: 'FRAMEWORK', tools: [{ name: 'Next.js', note: 'app router' }] },
    { label: 'DATA', tools: [{ name: 'Prisma', note: 'orm' }] },
  ],
}

beforeEach(() => {
  vi.clearAllMocks()
})

test('removing a group saves the remaining groups', async () => {
  const user = userEvent.setup()
  updatePage.mockResolvedValue({ success: true, data: null })
  render(<StackPageEditor initialData={initialData} />)
  await user.click(screen.getByRole('button', { name: 'Remove DATA' }))
  expect(updatePage).toHaveBeenCalledWith({ key: 'stack', data: { groups: [initialData.groups[0]] } })
  expect(router.refresh).toHaveBeenCalled()
})

test('editing a group through the modal saves it', async () => {
  const user = userEvent.setup()
  updatePage.mockResolvedValue({ success: true, data: null })
  render(<StackPageEditor initialData={initialData} />)
  await user.click(screen.getByRole('button', { name: 'Edit FRAMEWORK' }))
  await user.type(screen.getByRole('textbox', { name: 'Group label' }), 'S')
  await user.click(screen.getByRole('button', { name: 'Apply' }))
  expect(updatePage).toHaveBeenCalledWith({
    key: 'stack',
    data: { groups: [{ label: 'FRAMEWORKS', tools: initialData.groups[0]?.tools }, initialData.groups[1]] },
  })
})

test('shows a save error', async () => {
  const user = userEvent.setup()
  updatePage.mockResolvedValue({ success: false, error: 'Not signed in' })
  render(<StackPageEditor initialData={initialData} />)
  await user.click(screen.getByRole('button', { name: 'Move DATA up' }))
  expect(await screen.findByRole('status')).toHaveTextContent('Not signed in')
})
