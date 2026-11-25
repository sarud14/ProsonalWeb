import { render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'

import { ContactPageView } from '../ContactPageView'

vi.mock('next/link', async () => ({ default: (await import('@/test-utils/next-link-mock')).MockLink }))
vi.mock('@/actions/contact.actions', () => ({ submitContact: vi.fn() }))

test('shows the form and a direct email sidebar', () => {
  render(<ContactPageView email=" hi@example.com " location="Bangkok" />)
  expect(screen.getByRole('heading', { level: 1, name: 'Contact' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Send message' })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'hi@example.com' })).toHaveAttribute('href', 'mailto:hi@example.com')
  expect(screen.getByText('Bangkok')).toBeInTheDocument()
})

test('hides the sidebar without contact details', () => {
  render(<ContactPageView email="" location=" " />)
  expect(screen.queryByRole('complementary')).toBeNull()
})
