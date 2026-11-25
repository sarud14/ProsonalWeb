import { render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'

import { workFixture } from '@/test-utils/fixtures'

import { WorkCaseDetailView } from '../WorkCaseDetailView'

vi.mock('next/link', async () => ({ default: (await import('@/test-utils/next-link-mock')).MockLink }))

test('composes the hero, contents rail, and article', () => {
  render(<WorkCaseDetailView work={workFixture({ title: 'Check-in app' })} />)
  expect(screen.getByRole('heading', { level: 1, name: 'Check-in app' })).toBeInTheDocument()
  expect(screen.getByText('Contents')).toBeInTheDocument()
  expect(screen.getByText('Problem text')).toBeInTheDocument()
})
