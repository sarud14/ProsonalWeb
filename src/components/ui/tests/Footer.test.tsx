import { render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'

import { Footer } from '../Footer'

const site = vi.hoisted(() => ({
  footer: { tagline: 'Designed as a system', buildLabel: 'Build 2026.11', copyrightName: 'Sarut' },
  contact: { email: 'hi@example.com', location: 'Bangkok' },
  socialLinks: [{ label: 'GitHub', url: 'https://github.com/example' }],
}))

vi.mock('@/lib/content/site-config', () => ({
  getSiteFooter: async () => site.footer,
  getSiteContact: async () => site.contact,
  getSiteSocialLinks: async () => site.socialLinks,
}))
vi.mock('next/link', async () => ({ default: (await import('@/test-utils/next-link-mock')).MockLink }))

test('renders footer settings, contact links, and social links', async () => {
  render(await Footer())
  expect(screen.getByText(/Sarut/)).toBeInTheDocument()
  expect(screen.getByText('Build 2026.11')).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '/contact')
  expect(screen.getByRole('link', { name: 'hi@example.com' })).toHaveAttribute('href', 'mailto:hi@example.com')
  expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute('rel', 'noopener noreferrer')
})

test('hides empty email, location, and social links', async () => {
  site.contact = { email: ' ', location: '' }
  site.socialLinks = []
  render(await Footer())
  expect(screen.queryByRole('link', { name: /@/ })).toBeNull()
  expect(screen.queryByRole('link', { name: 'GitHub' })).toBeNull()
})
