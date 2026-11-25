import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'

import { FocusPageView } from '../FocusPageView'

test('renders the topic, roadmap columns, learning, and reading list', () => {
  render(
    <FocusPageView
      data={{
        updatedLabel: 'UPDATED 2026 · 11',
        topic: 'Platform Engineering',
        intro: 'Working toward Platform Engineering this year.',
        roadmap: [
          { phase: 'NOW', tag: 'IN PROGRESS', items: [{ title: 'Design tokens', note: 'One theme', dot: 'active' }] },
          { phase: 'NEXT', tag: 'QUEUED', items: [{ title: 'Turborepo', note: 'Shared packages', dot: 'queued' }] },
        ],
        learning: ['RSC internals'],
        reading: [{ idx: '01', title: 'Next.js RFCs' }],
      }}
    />,
  )
  expect(screen.getByRole('heading', { level: 1, name: 'Right now' })).toBeInTheDocument()
  expect(screen.getByText('Platform Engineering')).toBeInTheDocument()
  expect(screen.getByText('UPDATED 2026 · 11')).toBeInTheDocument()
  expect(screen.getByText('NOW')).toBeInTheDocument()
  expect(screen.getByText('Turborepo')).toBeInTheDocument()
  expect(screen.getByText('RSC internals')).toBeInTheDocument()
  expect(screen.getByText('Next.js RFCs')).toBeInTheDocument()
})
