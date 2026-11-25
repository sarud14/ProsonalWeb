import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'

import { engineeringFixture } from '@/test-utils/fixtures'

import { EngineeringListSection } from '../EngineeringListSection'

const notes = [
  engineeringFixture(),
  engineeringFixture({ slug: 'budget', title: 'Perf budget', type: 'Performance' }),
]

test('filters notes by type and updates the shown count', async () => {
  const user = userEvent.setup()
  render(<EngineeringListSection items={notes} />)
  expect(screen.getByRole('button', { name: 'ALL' })).toHaveAttribute('aria-pressed', 'true')
  expect(screen.getByText('2 / 2 SHOWN')).toBeInTheDocument()

  await user.click(screen.getByRole('button', { name: 'Performance' }))
  expect(screen.getByRole('button', { name: 'Performance' })).toHaveAttribute('aria-pressed', 'true')
  expect(screen.getByText('1 / 2 SHOWN')).toBeInTheDocument()
  expect(screen.queryByText('Layering rules')).toBeNull()
  expect(screen.getByText('Perf budget')).toBeInTheDocument()
})

test('can hide filters and start from a fixed type', () => {
  render(<EngineeringListSection items={notes} showFilters={false} initialFilter="Architecture" />)
  expect(screen.queryByRole('button')).toBeNull()
  expect(screen.getByText('1 / 2 SHOWN')).toBeInTheDocument()
})
