import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'

import type { AdminMediaItem } from '@/types/admin-media.types'

import { MediaGrid } from '../MediaGrid'

vi.mock('next/image', async () => ({ default: (await import('@/test-utils/next-image-mock')).MockImage }))

const items: AdminMediaItem[] = [
  { id: 'm1', url: 'https://cdn.test/a.png', alt: 'Hero', mimeType: 'image/png', folder: null, createdAt: '', referenceCount: 0 },
  { id: 'm2', url: 'https://cdn.test/b.png', alt: '', mimeType: 'image/jpeg', folder: null, createdAt: '', referenceCount: 2 },
]

test('shows an empty state', () => {
  render(<MediaGrid items={[]} />)
  expect(screen.getByText(/no media assets yet/i)).toBeInTheDocument()
})

test('library mode edits alt text and only deletes unused assets', async () => {
  const user = userEvent.setup()
  const onEditAlt = vi.fn()
  const onDelete = vi.fn()
  render(<MediaGrid items={items} onEditAlt={onEditAlt} onDelete={onDelete} />)

  expect(screen.getByText('2 refs')).toBeInTheDocument()
  expect(screen.getByText('Untitled')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Delete media asset' })).toBeDisabled()

  await user.click(screen.getByRole('button', { name: 'Hero' }))
  await user.click(screen.getByRole('button', { name: 'Delete Hero' }))
  expect(onEditAlt).toHaveBeenCalledWith(items[0])
  expect(onDelete).toHaveBeenCalledWith('m1')
})

test('picker mode selects an asset and hides delete', async () => {
  const user = userEvent.setup()
  const onSelect = vi.fn()
  render(<MediaGrid items={items} mode="picker" onSelect={onSelect} onDelete={vi.fn()} />)
  expect(screen.queryByRole('button', { name: /^Delete/ })).toBeNull()
  await user.click(screen.getByRole('button', { name: 'Hero' }))
  expect(onSelect).toHaveBeenCalledWith('m1')
})
