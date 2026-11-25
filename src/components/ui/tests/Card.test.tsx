import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'

import { Card } from '../Card'

test('renders children and forwards attributes', () => {
  render(<Card aria-label="Summary">Body text</Card>)
  expect(screen.getByLabelText('Summary')).toHaveTextContent('Body text')
})
