import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, expect, test, vi } from 'vitest'

import { DEFAULT_LANDING_PAGE_DATA } from '@/lib/admin/page-section-defaults'

import { LandingPageEditor } from '../LandingPageEditor'

const router = vi.hoisted(() => ({ refresh: vi.fn() }))
const updatePage = vi.hoisted(() => vi.fn())
vi.mock('next/navigation', () => ({ useRouter: () => router }))
vi.mock('next/image', async () => ({ default: (await import('@/test-utils/next-image-mock')).MockImage }))
vi.mock('@/actions/page.actions', () => ({ updatePage }))
vi.mock('@/lib/media/client-upload', () => ({ uploadMediaFile: vi.fn() }))

beforeEach(() => {
  vi.clearAllMocks()
  updatePage.mockResolvedValue({ success: true, data: null })
})

test('saving the hero persists the landing page', async () => {
  const user = userEvent.setup()
  render(<LandingPageEditor initialData={DEFAULT_LANDING_PAGE_DATA} media={[]} uploadEnabled={false} />)
  await user.click(screen.getByRole('button', { name: 'Save hero' }))
  expect(updatePage).toHaveBeenCalledWith({ key: 'landing', data: expect.objectContaining({ hero: expect.any(Object) }) })
  expect(router.refresh).toHaveBeenCalled()
})

test('adding a block appends it and saves', async () => {
  const user = userEvent.setup()
  render(<LandingPageEditor initialData={DEFAULT_LANDING_PAGE_DATA} media={[]} uploadEnabled={false} />)
  await user.click(screen.getByRole('button', { name: '+ Add block' }))
  expect(screen.getByRole('heading', { name: 'Add landing block' })).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: 'Apply' }))
  const saved = updatePage.mock.calls[0]?.[0] as { data: { blocks: unknown[] } }
  expect(saved.data.blocks).toHaveLength(DEFAULT_LANDING_PAGE_DATA.blocks.length + 1)
})
