import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'

import { Container } from '../Container'

test('renders its children', () => {
  render(
    <Container>
      <p>Inside</p>
    </Container>,
  )
  expect(screen.getByText('Inside')).toBeInTheDocument()
})
