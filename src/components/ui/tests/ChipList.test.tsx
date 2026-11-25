import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'

import { ChipList } from '../ChipList'

test('renders one chip per item', () => {
  render(<ChipList items={['Next.js', 'Prisma']} />)
  expect(screen.getByText('Next.js')).toBeInTheDocument()
  expect(screen.getByText('Prisma')).toBeInTheDocument()
})
