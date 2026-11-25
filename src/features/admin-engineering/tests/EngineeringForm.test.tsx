import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, expect, test, vi } from 'vitest'

import { emptyEngineeringFormState } from '@/lib/admin/content-form-mappers'

import { EngineeringForm } from '../EngineeringForm'

const router = vi.hoisted(() => ({ push: vi.fn(), refresh: vi.fn() }))
const actions = vi.hoisted(() => ({
  createEngineering: vi.fn(),
  updateEngineering: vi.fn(),
  publishEngineering: vi.fn(),
}))

vi.mock('next/navigation', () => ({ useRouter: () => router }))
vi.mock('next/image', async () => ({ default: (await import('@/test-utils/next-image-mock')).MockImage }))
vi.mock('@/actions/engineering.actions', () => actions)

beforeEach(() => {
  vi.clearAllMocks()
})

test('saves the chosen note type as a draft', async () => {
  const user = userEvent.setup()
  actions.createEngineering.mockResolvedValue({ success: true, data: { id: 'e1' } })
  render(<EngineeringForm initialValues={emptyEngineeringFormState()} media={[]} listHref="/admin/engineering" />)

  expect(screen.getByRole('heading', { level: 1, name: 'New note' })).toBeInTheDocument()
  await user.selectOptions(screen.getByRole('combobox', { name: /^Type\s?\*$/ }), 'PERFORMANCE')
  await user.click(screen.getByRole('button', { name: 'Save draft' }))

  expect(actions.createEngineering).toHaveBeenCalledWith(expect.objectContaining({ type: 'PERFORMANCE' }))
  expect(actions.publishEngineering).not.toHaveBeenCalled()
  expect(router.push).toHaveBeenCalledWith('/admin/engineering')
})

test('edits an existing note', async () => {
  const user = userEvent.setup()
  actions.updateEngineering.mockResolvedValue({ success: true, data: { id: 'e2' } })
  render(
    <EngineeringForm
      initialValues={{ ...emptyEngineeringFormState(), id: 'e2', title: 'Layering' }}
      media={[]}
      listHref="/admin/engineering"
    />,
  )
  expect(screen.getByRole('heading', { level: 1, name: 'Edit note' })).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: 'Save draft' }))
  expect(actions.updateEngineering).toHaveBeenCalledWith(expect.objectContaining({ id: 'e2', title: 'Layering' }))
})
