import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'

import { FormSection } from '../FormSection'

test('renders the section label and fields', () => {
  render(
    <FormSection label="Basics">
      <input aria-label="Title" />
    </FormSection>,
  )
  expect(screen.getByText('Basics')).toBeInTheDocument()
  expect(screen.getByRole('textbox', { name: 'Title' })).toBeInTheDocument()
})
