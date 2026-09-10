import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'

import { PageRouteHeader } from '../PageRouteHeader'

test('renders the route title as a heading', () => {
  render(
    <PageRouteHeader
      path="/work"
      title="Selected work"
      description="Case studies abstracted to be NDA-safe."
      trailing="04 CASE STUDIES"
    />
  )

  expect(screen.getByRole('heading', { level: 1, name: 'Selected work' })).toBeInTheDocument()
  expect(screen.getByText('/work')).toBeInTheDocument()
  expect(screen.getByText('Case studies abstracted to be NDA-safe.')).toBeInTheDocument()
  expect(screen.getByText('04 CASE STUDIES')).toBeInTheDocument()
})
