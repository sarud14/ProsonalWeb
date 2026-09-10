import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'

import { LoadingScreen } from './LoadingScreen'

test('tells the user the page is loading', () => {
  render(<LoadingScreen />)

  expect(screen.getByText('Loading')).toBeInTheDocument()
})
