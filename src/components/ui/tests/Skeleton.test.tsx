import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'

import { Skeleton } from '../Skeleton'

test('renders a placeholder that forwards attributes', () => {
  render(<Skeleton data-testid="skeleton" aria-hidden="true" />)
  expect(screen.getByTestId('skeleton')).toHaveAttribute('aria-hidden', 'true')
})
