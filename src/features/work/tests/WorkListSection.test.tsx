import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'

import { WORK_FILTER_ALL } from '@/constants/work'
import type { WorkCaseStudy } from '@/types/work.types'

import { WorkListSection } from '../WorkListSection'

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { readonly href: string }): React.JSX.Element => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

function study(slug: string, domains: readonly string[]): WorkCaseStudy {
  return {
    slug,
    title: slug,
    status: 'published',
    listId: '01',
    role: 'FE',
    tagline: 'Tagline',
    domains: [...domains],
    stack: ['Next.js'],
    metric: '1',
    metricLabel: 'TEST',
    year: '2026',
    context: 'Context',
    problem: 'Problem',
    constraints: 'Constraints',
    architecture: 'Architecture',
    decisions: 'Decisions',
    impact: 'Impact',
  }
}

test('domain filters expose pressed state and case-study links', async () => {
  const user = userEvent.setup()
  const items = [study('cms-rebuild', ['CMS']), study('booking', ['Booking'])]

  render(<WorkListSection items={items} domainFilters={['CMS', 'Booking']} />)

  const allFilter = screen.getByRole('button', { name: WORK_FILTER_ALL })
  expect(allFilter).toHaveAttribute('aria-pressed', 'true')
  expect(screen.getByRole('link', { name: /cms-rebuild/i })).toHaveAttribute(
    'href',
    '/work/cms-rebuild'
  )

  await user.click(screen.getByRole('button', { name: 'CMS' }))

  expect(screen.getByRole('button', { name: 'CMS' })).toHaveAttribute('aria-pressed', 'true')
  expect(allFilter).toHaveAttribute('aria-pressed', 'false')
  expect(screen.getByRole('link', { name: /cms-rebuild/i })).toBeInTheDocument()
  expect(screen.queryByRole('link', { name: /booking/i })).toBeNull()
})
