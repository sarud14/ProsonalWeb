import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'

import { Badge } from '../Badge'

test('renders its label and forwards attributes', () => {
  render(<Badge variant="success" data-testid="badge">Live</Badge>)
  expect(screen.getByTestId('badge')).toHaveTextContent('Live')
})
