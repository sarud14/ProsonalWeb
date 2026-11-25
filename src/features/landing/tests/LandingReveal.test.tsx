import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'

import { LandingReveal } from '../LandingReveal'

test('reveals immediately when triggered on mount', () => {
  render(
    <LandingReveal trigger="mount">
      <p>Hello</p>
    </LandingReveal>,
  )
  expect(screen.getByText('Hello').parentElement).toHaveAttribute('data-state', 'revealed')
})

test('waits for the viewport when triggered in view', () => {
  render(
    <LandingReveal>
      <p>Later</p>
    </LandingReveal>,
  )
  expect(screen.getByText('Later').parentElement).toHaveAttribute('data-state', 'pending')
})
