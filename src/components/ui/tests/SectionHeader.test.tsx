import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'

import { SectionHeader } from '../SectionHeader'

test('renders number, heading, and optional trailing text', () => {
  render(<SectionHeader number="02" title="System modules" trailing="Entry points 04" />)
  expect(screen.getByRole('heading', { level: 2, name: 'System modules' })).toBeInTheDocument()
  expect(screen.getByText('02')).toBeInTheDocument()
  expect(screen.getByText('Entry points 04')).toBeInTheDocument()
})

test('omits trailing text when not given', () => {
  render(<SectionHeader number="01" title="Work" />)
  expect(screen.queryByText(/entry points/i)).toBeNull()
})
