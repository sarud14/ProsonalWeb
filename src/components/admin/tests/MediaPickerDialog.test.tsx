import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'

import { MediaPickerDialog } from '../MediaPickerDialog'

vi.mock('next/image', async () => ({ default: (await import('@/test-utils/next-image-mock')).MockImage }))

const media = [{ id: 'm1', url: 'https://cdn.test/a.png', alt: 'Hero' }]

test('renders nothing when closed', () => {
  render(<MediaPickerDialog open={false} media={media} onSelect={vi.fn()} onClose={vi.fn()} />)
  expect(screen.queryByText('Choose from media')).toBeNull()
})

test('selects an asset and closes', async () => {
  const user = userEvent.setup()
  const onSelect = vi.fn()
  const onClose = vi.fn()
  render(<MediaPickerDialog open media={media} onSelect={onSelect} onClose={onClose} />)
  await user.click(screen.getByRole('button', { name: 'Hero' }))
  expect(onSelect).toHaveBeenCalledWith('m1')
  expect(onClose).toHaveBeenCalled()
})

test('closes from the close button', async () => {
  const user = userEvent.setup()
  const onClose = vi.fn()
  render(<MediaPickerDialog open media={media} onSelect={vi.fn()} onClose={onClose} />)
  await user.click(screen.getByRole('button', { name: 'Close' }))
  expect(onClose).toHaveBeenCalled()
})
