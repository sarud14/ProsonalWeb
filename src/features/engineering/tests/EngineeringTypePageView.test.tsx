import { render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'

import { engineeringFixture } from '@/test-utils/fixtures'

import { EngineeringTypePageView } from '../EngineeringTypePageView'

vi.mock('next/link', async () => ({ default: (await import('@/test-utils/next-link-mock')).MockLink }))

test('shows the note type, its count, and only that type', () => {
  render(
    <EngineeringTypePageView pathSegment="architecture" noteType="Architecture" notes={[engineeringFixture()]} />,
  )
  expect(screen.getByRole('heading', { level: 1, name: 'Architecture' })).toBeInTheDocument()
  expect(screen.getByText('01 NOTES')).toBeInTheDocument()
  expect(screen.getByText('Layering rules')).toBeInTheDocument()
})
