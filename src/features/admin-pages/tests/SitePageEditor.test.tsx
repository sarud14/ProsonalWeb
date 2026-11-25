import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, expect, test, vi } from 'vitest'

import { DEFAULT_SITE_CONFIG } from '@/lib/admin/page-section-defaults'

import { SitePageEditor } from '../SitePageEditor'

const router = vi.hoisted(() => ({ refresh: vi.fn() }))
const updatePage = vi.hoisted(() => vi.fn())
vi.mock('next/navigation', () => ({ useRouter: () => router }))
vi.mock('next/image', async () => ({ default: (await import('@/test-utils/next-image-mock')).MockImage }))
vi.mock('@/actions/page.actions', () => ({ updatePage }))
vi.mock('@/lib/media/client-upload', () => ({ uploadMediaFile: vi.fn() }))

beforeEach(() => {
  vi.clearAllMocks()
})

test('saves the edited SEO title', async () => {
  const user = userEvent.setup()
  updatePage.mockResolvedValue({ success: true, data: null })
  render(<SitePageEditor initialData={DEFAULT_SITE_CONFIG} media={[]} uploadEnabled={false} />)
  const title = screen.getByRole('textbox', { name: /^Site title/ })
  await user.clear(title)
  await user.type(title, 'Portfolio')
  await user.click(screen.getByRole('button', { name: 'Save site config' }))
  expect(updatePage).toHaveBeenCalledWith({
    key: 'site',
    data: expect.objectContaining({ seo: expect.objectContaining({ title: 'Portfolio' }) }),
  })
})

test('shows a save error', async () => {
  const user = userEvent.setup()
  updatePage.mockResolvedValue({ success: false, error: 'Invalid colour' })
  render(<SitePageEditor initialData={DEFAULT_SITE_CONFIG} media={[]} uploadEnabled={false} />)
  await user.click(screen.getByRole('button', { name: 'Save site config' }))
  expect(await screen.findByRole('status')).toHaveTextContent('Invalid colour')
})
