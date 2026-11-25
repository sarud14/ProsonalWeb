import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, expect, test, vi } from 'vitest'

import { emptyWorkFormState } from '@/lib/admin/content-form-mappers'

import { WorkForm } from '../WorkForm'

const router = vi.hoisted(() => ({ push: vi.fn(), refresh: vi.fn() }))
const actions = vi.hoisted(() => ({ createWork: vi.fn(), updateWork: vi.fn(), publishWork: vi.fn() }))

vi.mock('next/navigation', () => ({ useRouter: () => router }))
vi.mock('next/image', async () => ({ default: (await import('@/test-utils/next-image-mock')).MockImage }))
vi.mock('@/actions/work.actions', () => actions)

beforeEach(() => {
  vi.clearAllMocks()
})

function renderForm(initial = emptyWorkFormState()): void {
  render(<WorkForm initialValues={initial} media={[{ id: 'm1', url: 'https://cdn.test/a.png', alt: 'Cover' }]} listHref="/admin/work" />)
}

test('creates a draft with the typed values and returns to the list', async () => {
  const user = userEvent.setup()
  actions.createWork.mockResolvedValue({ success: true, data: { id: 'w1' } })
  renderForm()
  expect(screen.getByRole('heading', { level: 1, name: 'New work' })).toBeInTheDocument()

  await user.type(screen.getByRole('textbox', { name: /^Title\s?\*$/ }), 'CMS rebuild')
  await user.type(screen.getByRole('textbox', { name: /^Slug\s?\*$/ }), 'cms-rebuild')
  await user.click(screen.getByRole('button', { name: 'Save draft' }))

  expect(actions.createWork).toHaveBeenCalledWith(expect.objectContaining({ title: 'CMS rebuild', slug: 'cms-rebuild' }))
  expect(actions.publishWork).not.toHaveBeenCalled()
  expect(router.push).toHaveBeenCalledWith('/admin/work')
})

test('updates an existing item and publishes it', async () => {
  const user = userEvent.setup()
  actions.updateWork.mockResolvedValue({ success: true, data: { id: 'w9' } })
  actions.publishWork.mockResolvedValue({ success: true, data: null })
  renderForm({ ...emptyWorkFormState(), id: 'w9', title: 'Old' })
  expect(screen.getByRole('heading', { level: 1, name: 'Edit work' })).toBeInTheDocument()

  await user.click(screen.getByRole('button', { name: 'Publish' }))
  expect(actions.updateWork).toHaveBeenCalledWith(expect.objectContaining({ id: 'w9' }))
  expect(actions.publishWork).toHaveBeenCalledWith('w9')
})

test('shows the server error and stays on the form', async () => {
  const user = userEvent.setup()
  actions.createWork.mockResolvedValue({ success: false, error: 'Slug already exists' })
  renderForm()
  await user.click(screen.getByRole('button', { name: 'Save draft' }))
  expect(await screen.findByRole('status')).toHaveTextContent('Slug already exists')
  expect(router.push).not.toHaveBeenCalled()
})

test('picks a cover image from the media library', async () => {
  const user = userEvent.setup()
  renderForm()
  // The picker sits inside the field's <label>, which names the button "Cover image".
  await user.click(screen.getByText('Choose from media'))
  await user.click(screen.getByRole('button', { name: 'Cover' }))
  expect(screen.getByRole('img', { name: 'Cover' })).toHaveAttribute('src', 'https://cdn.test/a.png')
})
