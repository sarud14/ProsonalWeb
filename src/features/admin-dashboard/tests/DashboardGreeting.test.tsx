import { render, screen } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'

import { DashboardGreeting } from '../DashboardGreeting'

afterEach(() => {
  vi.useRealTimers()
})

test.each([
  [9, 'Good morning'],
  [14, 'Good afternoon'],
  [20, 'Good evening'],
])('greets by time of day at %i:00', (hour, greeting) => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date(2026, 10, 25, hour))
  render(<DashboardGreeting userName="Sarut" />)
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(`${greeting}, Sarut.`)
})
