import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'

import { StatusBadge } from './StatusBadge'

test('exposes published status for assistive tests', () => {
  render(<StatusBadge status="PUBLISHED" />)

  const badge = screen.getByText('Published')
  expect(badge).toHaveAttribute('data-status', 'published')
})

test('exposes draft status for assistive tests', () => {
  render(<StatusBadge status="DRAFT" />)

  const badge = screen.getByText('Draft')
  expect(badge).toHaveAttribute('data-status', 'draft')
})
