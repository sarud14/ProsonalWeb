import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, expect, test, vi } from 'vitest'

import { TaxonomyPageView } from '../TaxonomyPageView'

const router = vi.hoisted(() => ({ refresh: vi.fn() }))
const actions = vi.hoisted(() => ({ createDomain: vi.fn(), updateDomain: vi.fn(), deleteDomain: vi.fn() }))

vi.mock('next/navigation', () => ({ useRouter: () => router }))
vi.mock('@/actions/taxonomy.actions', () => actions)

const domains = [
  { id: 'd1', label: 'CMS', sortOrder: 0, referenceCount: 0 },
  { id: 'd2', label: 'Events', sortOrder: 4, referenceCount: 3 },
]

beforeEach(() => {
  vi.clearAllMocks()
})

test('adds a domain after the highest sort order', async () => {
  const user = userEvent.setup()
  actions.createDomain.mockResolvedValue({ success: true, data: null })
  render(<TaxonomyPageView initialDomains={domains} />)
  expect(screen.getByRole('button', { name: 'Add' })).toBeDisabled()
  await user.type(screen.getByRole('textbox', { name: 'Label' }), ' Mobile {Enter}')
  expect(actions.createDomain).toHaveBeenCalledWith({ label: 'Mobile', sortOrder: 5 })
  expect(router.refresh).toHaveBeenCalled()
})

test('renames a domain inline', async () => {
  const user = userEvent.setup()
  actions.updateDomain.mockResolvedValue({ success: true, data: null })
  render(<TaxonomyPageView initialDomains={domains} />)
  const input = screen.getByDisplayValue('CMS')
  await user.clear(input)
  await user.type(input, 'Content')
  await user.tab()
  expect(actions.updateDomain).toHaveBeenCalledWith({ id: 'd1', label: 'Content' })
})

test('shows the server error when a delete is refused', async () => {
  const user = userEvent.setup()
  actions.deleteDomain.mockResolvedValue({ success: false, error: 'Domain in use' })
  render(<TaxonomyPageView initialDomains={domains} />)
  await user.click(screen.getAllByRole('button', { name: 'Delete' })[0])
  await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Delete' }))
  expect(actions.deleteDomain).toHaveBeenCalledWith('d1')
  expect(await screen.findByRole('status')).toHaveTextContent('Domain in use')
})

test('shows an empty state', () => {
  render(<TaxonomyPageView initialDomains={[]} />)
  expect(screen.getByText('No domains yet.')).toBeInTheDocument()
})
