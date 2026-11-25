import { render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'

import type { LandingModule } from '@/types/landing.types'

import ModulesSection from '../ModulesSection'

vi.mock('next/link', async () => ({ default: (await import('@/test-utils/next-link-mock')).MockLink }))

const items: LandingModule[] = [
  { num: '01', title: 'Work', desc: 'Case studies', link: '/work', linkLabel: '09 ENTRIES', enabled: true, badge: 'LIVE' },
  { num: '03', title: 'Focus', desc: 'Roadmap', link: '/focus', linkLabel: 'Roadmap', enabled: true },
]

test('numbers cards by display order regardless of stored numbers', () => {
  render(<ModulesSection items={items} />)
  expect(screen.getByRole('link', { name: /Work/ })).toHaveTextContent('01')
  expect(screen.getByRole('link', { name: /Focus/ })).toHaveTextContent('02')
  expect(screen.queryByText('03')).toBeNull()
  expect(screen.getByText(/Entry points/)).toHaveTextContent('02')
})

test('links each card and shows its badge and label', () => {
  render(<ModulesSection items={items} />)
  expect(screen.getByRole('link', { name: /Work/ })).toHaveAttribute('href', '/work')
  expect(screen.getByText('LIVE')).toBeInTheDocument()
  expect(screen.getByText('09 ENTRIES')).toBeInTheDocument()
})

test('renders nothing without items', () => {
  const { container } = render(<ModulesSection items={[]} />)
  expect(container).toBeEmptyDOMElement()
})
