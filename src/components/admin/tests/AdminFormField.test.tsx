import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'

import { AdminFormField, adminInputClassName } from '../AdminFormField'

test('labels its control and marks required fields', () => {
  render(
    <AdminFormField label="Title" required>
      <input className={adminInputClassName} />
    </AdminFormField>,
  )
  expect(screen.getByRole('textbox', { name: /Title/ })).toBeInTheDocument()
  expect(screen.getByText('*')).toBeInTheDocument()
})

test('omits the required marker by default', () => {
  render(
    <AdminFormField label="Note">
      <input />
    </AdminFormField>,
  )
  expect(screen.queryByText('*')).toBeNull()
})
