import { render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'

import { WORK_CASE_SECTIONS } from '@/constants/work-case-sections'
import { workFixture } from '@/test-utils/fixtures'

import { WorkCaseContentsRail, WorkCaseHero } from '../WorkCaseHero'

vi.mock('next/link', async () => ({ default: (await import('@/test-utils/next-link-mock')).MockLink }))

test('renders the case title, tagline, meta, and a link back to work', () => {
  render(<WorkCaseHero work={workFixture()} />)
  expect(screen.getByRole('heading', { level: 1, name: 'CMS rebuild' })).toBeInTheDocument()
  expect(screen.getByText('A faster CMS')).toBeInTheDocument()
  expect(screen.getByText('Shipped 2026')).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /work/i })).toHaveAttribute('href', '/work')
})

test('contents rail links every section and marks the first as current', () => {
  render(<WorkCaseContentsRail />)
  const links = screen.getAllByRole('link')
  expect(links).toHaveLength(WORK_CASE_SECTIONS.length)
  expect(links[0]).toHaveAttribute('href', `#${WORK_CASE_SECTIONS[0]?.id}`)
  expect(links[0]).toHaveAttribute('aria-current', 'location')
  expect(screen.getByText(`01 / ${String(WORK_CASE_SECTIONS.length).padStart(2, '0')}`)).toBeInTheDocument()
})
