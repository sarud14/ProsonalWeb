import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'

import { ImagePicker } from '../ImagePicker'

vi.mock('next/image', () => ({
  default: ({ src, alt }: { readonly src: string; readonly alt: string }): React.JSX.Element => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}))

test('shows the empty state and explains when nothing can be chosen', () => {
  render(<ImagePicker />)
  expect(screen.getByText('No image selected')).toBeInTheDocument()
  expect(screen.getByText(/not available in this context/i)).toBeInTheDocument()
})

test('uploads the chosen file', async () => {
  const user = userEvent.setup()
  const onUpload = vi.fn()
  const { container } = render(<ImagePicker uploadEnabled onUpload={onUpload} />)
  const file = new File(['x'], 'photo.png', { type: 'image/png' })
  const input = container.querySelector('input[type="file"]') as HTMLInputElement
  await user.upload(input, file)
  expect(onUpload).toHaveBeenCalledWith(file)
})

test('disables actions while uploading', () => {
  render(<ImagePicker uploadEnabled isUploading onUpload={vi.fn()} onPickFromMedia={vi.fn()} />)
  expect(screen.getByRole('button', { name: 'Uploading…' })).toBeDisabled()
  expect(screen.getByRole('button', { name: 'Choose from media' })).toBeDisabled()
})

test('shows the image with remove and media actions, and notes disabled uploads', async () => {
  const user = userEvent.setup()
  const onRemove = vi.fn()
  const onPickFromMedia = vi.fn()
  render(
    <ImagePicker imageUrl="https://cdn.test/a.png" altText="Cover" onRemove={onRemove} onPickFromMedia={onPickFromMedia} />,
  )
  expect(screen.getByRole('img', { name: 'Cover' })).toHaveAttribute('src', 'https://cdn.test/a.png')
  expect(screen.getByText(/uploads are disabled/i)).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: 'Choose from media' }))
  await user.click(screen.getByRole('button', { name: 'Remove image' }))
  expect(onPickFromMedia).toHaveBeenCalled()
  expect(onRemove).toHaveBeenCalled()
})
