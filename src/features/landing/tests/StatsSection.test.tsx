import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'

import StatsSection from '../StatsSection'

test('renders each stat value with its label', () => {
  render(<StatsSection items={[{ value: '09', label: 'Case Studies' }, { value: '2025', label: 'Shipping Since' }]} />)
  expect(screen.getByText('09')).toBeInTheDocument()
  expect(screen.getByText('Case Studies')).toBeInTheDocument()
  expect(screen.getByText('2025')).toBeInTheDocument()
})
