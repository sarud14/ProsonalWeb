import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'

import { DEFAULT_LANDING_HERO } from '@/lib/admin/landing-hero'

import { LandingHeroEditor } from '../LandingHeroEditor'

vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh: vi.fn() }) }))
vi.mock('next/image', async () => ({ default: (await import('@/test-utils/next-image-mock')).MockImage }))
vi.mock('@/lib/media/client-upload', () => ({ uploadMediaFile: vi.fn() }))

test('saves edited hero copy', async () => {
  const user = userEvent.setup()
  const onSave = vi.fn()
  render(<LandingHeroEditor hero={DEFAULT_LANDING_HERO} media={[]} uploadEnabled={false} isSaving={false} onSave={onSave} />)
  const title = screen.getByRole('textbox', { name: 'Title line 1' })
  await user.clear(title)
  await user.type(title, 'Shipping systems')
  await user.click(screen.getByRole('button', { name: 'Save hero' }))
  expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ titleLine1: 'Shipping systems' }))
})

test('disables save while saving', () => {
  render(<LandingHeroEditor hero={DEFAULT_LANDING_HERO} media={[]} uploadEnabled={false} isSaving onSave={vi.fn()} />)
  expect(screen.getByRole('button', { name: 'Save hero' })).toBeDisabled()
})
