import { render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'

import { NavBarLink } from '../NavBarLink'

const pathname = vi.hoisted(() => ({ current: '/' }))

vi.mock('next/navigation', () => ({ usePathname: () => pathname.current }))
vi.mock('next/link', async () => ({ default: (await import('@/test-utils/next-link-mock')).MockLink }))

test('marks the link current on its own route and nested routes', () => {
  pathname.current = '/work/feops-kit'
  render(<NavBarLink href="/work" label="Work" />)
  expect(screen.getByRole('link', { name: 'Work' })).toHaveAttribute('aria-current', 'page')
})

test('is not current on other routes', () => {
  pathname.current = '/stack'
  render(<NavBarLink href="/work" label="Work" />)
  expect(screen.getByRole('link', { name: 'Work' })).not.toHaveAttribute('aria-current')
})
