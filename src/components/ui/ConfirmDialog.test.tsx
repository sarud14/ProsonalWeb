import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'

import { ConfirmDialog } from './ConfirmDialog'

test('renders nothing when closed', () => {
  render(
    <ConfirmDialog
      open={false}
      title="Delete this item?"
      body="This cannot be undone."
      onConfirm={vi.fn()}
      onCancel={vi.fn()}
    />
  )

  expect(screen.queryByRole('dialog')).toBeNull()
})

test('exposes a labelled modal dialog when open', () => {
  render(
    <ConfirmDialog
      open
      title="Delete this item?"
      body="This cannot be undone."
      onConfirm={vi.fn()}
      onCancel={vi.fn()}
    />
  )

  const dialog = screen.getByRole('dialog', { name: 'Delete this item?' })
  expect(dialog).toHaveAttribute('aria-modal', 'true')
  expect(screen.getByText('This cannot be undone.')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
})

test('confirm and cancel call the matching handlers', async () => {
  const user = userEvent.setup()
  const onConfirm = vi.fn()
  const onCancel = vi.fn()

  render(
    <ConfirmDialog
      open
      title="Delete this item?"
      body="This cannot be undone."
      confirmLabel="Delete"
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  )

  await user.click(screen.getByRole('button', { name: 'Delete' }))
  expect(onConfirm).toHaveBeenCalledTimes(1)

  await user.click(screen.getByRole('button', { name: 'Cancel' }))
  expect(onCancel).toHaveBeenCalledTimes(1)
})

test('Escape cancels the dialog', async () => {
  const user = userEvent.setup()
  const onCancel = vi.fn()

  render(
    <ConfirmDialog
      open
      title="Delete this item?"
      body="This cannot be undone."
      onConfirm={vi.fn()}
      onCancel={onCancel}
    />
  )

  await user.keyboard('{Escape}')
  expect(onCancel).toHaveBeenCalledTimes(1)
})
