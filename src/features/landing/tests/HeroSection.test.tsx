import { render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'

import { DEFAULT_LANDING_HERO } from '@/lib/admin/landing-hero'

import HeroSection from '../HeroSection'

vi.mock('next/link', async () => ({ default: (await import('@/test-utils/next-link-mock')).MockLink }))

test('renders the headline, calls to action, and meta items', () => {
  render(<HeroSection hero={DEFAULT_LANDING_HERO} />)
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(DEFAULT_LANDING_HERO.titleLine1)
  // Base UI renders the link-styled Button as an anchor with role="button".
  expect(screen.getByText(DEFAULT_LANDING_HERO.primaryCtaLabel).closest('a')).toHaveAttribute(
    'href',
    DEFAULT_LANDING_HERO.primaryCtaHref,
  )
  for (const item of DEFAULT_LANDING_HERO.metaItems) {
    expect(screen.getByText(item.value)).toBeInTheDocument()
  }
  expect(screen.getByText(DEFAULT_LANDING_HERO.codeFilename)).toBeInTheDocument()
})

test('shows the profile photo when one is set', () => {
  render(
    <HeroSection hero={{ ...DEFAULT_LANDING_HERO, profileImageUrl: 'https://cdn.test/me.jpg', profileImageAlt: 'Portrait' }} />,
  )
  expect(screen.getByRole('img', { name: 'Portrait' })).toHaveAttribute('src', 'https://cdn.test/me.jpg')
})
