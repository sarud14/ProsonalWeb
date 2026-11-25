import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, expect, test, vi } from 'vitest'

import type { AdminMediaItem } from '@/types/admin-media.types'

import { MediaLibraryView } from '../MediaLibraryView'

const router = vi.hoisted(() => ({ refresh: vi.fn() }))
const actions = vi.hoisted(() => ({ deleteMedia: vi.fn(), updateMediaAlt: vi.fn() }))
const uploadMediaFile = vi.hoisted(() => vi.fn())

vi.mock('next/navigation', () => ({ useRouter: () => router }))
vi.mock('next/image', async () => ({ default: (await import('@/test-utils/next-image-mock')).MockImage }))
vi.mock('@/actions/media.actions', () => actions)
vi.mock('@/lib/media/client-upload', () => ({ uploadMediaFile }))

const items: AdminMediaItem[] = [
  { id: 'm1', url: 'https://cdn.test/a.png', alt: 'Hero', mimeType: 'image/png', folder: null, createdAt: '', referenceCount: 0 },
]

beforeEach(() => {
  vi.clearAllMocks()
})

test('explains disabled uploads when blob storage is missing', () => {
  render(<MediaLibraryView initialItems={items} uploadEnabled={false} />)
  expect(screen.queryByRole('button', { name: '+ Upload' })).toBeNull()
  expect(screen.getByText(/Uploads disabled/)).toBeInTheDocument()
})

test('uploads selected files and refreshes', async () => {
  const user = userEvent.setup()
  uploadMediaFile.mockResolvedValue({ success: true, data: { id: 'm2' } })
  const { container } = render(<MediaLibraryView initialItems={items} uploadEnabled />)
  const file = new File(['x'], 'b.png', { type: 'image/png' })
  await user.upload(container.querySelector('input[type="file"]') as HTMLInputElement, file)
  expect(uploadMediaFile).toHaveBeenCalledWith(file)
  expect(router.refresh).toHaveBeenCalled()
})

test('reports a failed upload', async () => {
  const user = userEvent.setup()
  uploadMediaFile.mockResolvedValue({ success: false, error: 'Too large' })
  const { container } = render(<MediaLibraryView initialItems={items} uploadEnabled />)
  await user.upload(container.querySelector('input[type="file"]') as HTMLInputElement, new File(['x'], 'b.png', { type: 'image/png' }))
  expect(await screen.findByRole('status')).toHaveTextContent('Too large')
})

test('edits alt text through the modal', async () => {
  const user = userEvent.setup()
  actions.updateMediaAlt.mockResolvedValue({ success: true, data: null })
  render(<MediaLibraryView initialItems={items} uploadEnabled={false} />)
  await user.click(screen.getByRole('button', { name: 'Hero' }))
  await user.type(screen.getByRole('textbox', { name: 'Alt text' }), '!')
  await user.click(screen.getByRole('button', { name: 'Save' }))
  expect(actions.updateMediaAlt).toHaveBeenCalledWith({ id: 'm1', alt: 'Hero!' })
  expect(screen.queryByText('Edit alt text')).toBeNull()
})

test('deletes an asset after confirming', async () => {
  const user = userEvent.setup()
  actions.deleteMedia.mockResolvedValue({ success: true, data: null })
  render(<MediaLibraryView initialItems={items} uploadEnabled={false} />)
  await user.click(screen.getByRole('button', { name: 'Delete Hero' }))
  await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Delete' }))
  expect(actions.deleteMedia).toHaveBeenCalledWith('m1')
  expect(router.refresh).toHaveBeenCalled()
})
