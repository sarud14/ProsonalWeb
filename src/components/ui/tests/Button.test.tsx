import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'

import { Button } from '../Button'

test('renders a button with the design-system slot hook', () => {
  render(<Button>Save draft</Button>)

  const button = screen.getByRole('button', { name: 'Save draft' })
  expect(button).toHaveAttribute('data-slot', 'button')
})

test('exposes disabled state to the accessibility tree', () => {
  render(<Button disabled>Save draft</Button>)

  expect(screen.getByRole('button', { name: 'Save draft' })).toBeDisabled()
})
