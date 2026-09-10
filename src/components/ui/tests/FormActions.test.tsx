import { render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'

import { FormActions } from '../FormActions'

test('exposes publish, draft, and cancel actions', () => {
  render(
    <FormActions
      onPublish={vi.fn()}
      onSaveDraft={vi.fn()}
      onCancel={vi.fn()}
    />
  )

  expect(screen.getByRole('button', { name: 'Publish' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Save draft' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
})

test('disables submit actions while submitting', () => {
  render(
    <FormActions
      onPublish={vi.fn()}
      onSaveDraft={vi.fn()}
      onCancel={vi.fn()}
      isSubmitting
    />
  )

  expect(screen.getByRole('button', { name: 'Publish' })).toBeDisabled()
  expect(screen.getByRole('button', { name: 'Save draft' })).toBeDisabled()
  expect(screen.getByRole('button', { name: 'Cancel' })).toBeEnabled()
})
