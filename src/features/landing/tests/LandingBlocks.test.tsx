import { render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'

import { LandingBlocks } from '../LandingBlocks'

vi.mock('server-only', () => ({}))
vi.mock('next/link', async () => ({ default: (await import('@/test-utils/next-link-mock')).MockLink }))
vi.mock('@/lib/content/landing-page', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/content/landing-page')>()),
  getLandingCounts: async () => ({ workCount: 9, domainCount: 4 }),
  getVisibleLandingBlocks: async () => [
    { type: 'stats', order: 0, enabled: true, props: { items: [{ value: '{workCount}', label: 'Case Studies' }] } },
    {
      type: 'modules',
      order: 1,
      enabled: true,
      props: {
        items: [
          { num: '01', title: 'Work', desc: 'Cases', link: '/work', linkLabel: '{workCount} ENTRIES', enabled: true },
          { num: '02', title: 'Hidden', desc: 'Off', link: '/journal', linkLabel: 'Posts', enabled: false },
        ],
      },
    },
    { type: 'techStack', order: 2, enabled: true, props: { items: ['Next.js'] } },
    { type: 'contact', order: 3, enabled: true, props: { headline: 'Say hi', body: 'Body', successMessage: 'Thanks' } },
  ],
}))

test('renders blocks in order with live counts and the injected contact form', async () => {
  const renderContactForm = vi.fn(({ successMessage }: { readonly successMessage: string }) => (
    <p>form:{successMessage}</p>
  ))
  render(await LandingBlocks({ renderContactForm }))

  expect(screen.getByText('09')).toBeInTheDocument()
  expect(screen.getByText('09 ENTRIES')).toBeInTheDocument()
  expect(screen.queryByText('Hidden')).toBeNull()
  expect(screen.getByText('Next.js')).toBeInTheDocument()
  expect(screen.getByText('form:Thanks')).toBeInTheDocument()
})
