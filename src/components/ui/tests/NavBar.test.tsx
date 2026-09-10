import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'

import { NavBar } from '../NavBar'

vi.mock('next/navigation', () => ({
  usePathname: (): string => '/',
}))

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

const items = [
  { key: 'work', label: 'Work', href: '/work', enabled: true, order: 1 },
  { key: 'journal', label: 'Journal', href: '/journal', enabled: true, order: 2 },
] as const

const brand = {
  name: 'Ruj',
  role: 'Frontend engineer',
  isAvailable: true,
} as const

test('exposes the primary navigation landmark', () => {
  render(<NavBar items={items} brand={brand} />)

  expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /Ruj/ })).toHaveAttribute('href', '/')
  expect(screen.getByRole('link', { name: 'Work' })).toHaveAttribute('href', '/work')
})

test('toggles the mobile menu with aria attributes and Escape', async () => {
  const user = userEvent.setup()
  render(<NavBar items={items} brand={brand} />)

  const toggle = screen.getByRole('button', { name: 'Open menu' })
  expect(toggle).toHaveAttribute('aria-expanded', 'false')

  await user.click(toggle)

  expect(screen.getByRole('button', { name: 'Close menu' })).toHaveAttribute('aria-expanded', 'true')
  expect(screen.getByRole('navigation', { name: 'Mobile' })).toBeInTheDocument()

  await user.keyboard('{Escape}')
  expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute('aria-expanded', 'false')
  expect(screen.queryByRole('navigation', { name: 'Mobile' })).toBeNull()
})
