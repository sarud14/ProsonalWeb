import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'

import ExploreStackSection from '../ExploreStackSection'

test('renders each technology tag', () => {
  render(<ExploreStackSection items={['Next.js', 'React Native']} />)
  expect(screen.getByText('Next.js')).toBeInTheDocument()
  expect(screen.getByText('React Native')).toBeInTheDocument()
  expect(screen.getByText('Currently Exploring')).toBeInTheDocument()
})
