import { render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'

import { Toast } from './Toast'

test('renders nothing when closed', () => {
  render(<Toast message="Saved" open={false} onClose={vi.fn()} />)

  expect(screen.queryByRole('status')).toBeNull()
})

test('announces the message as a live status when open', () => {
  render(<Toast message="Saved" open onClose={vi.fn()} duration={60_000} />)

  const status = screen.getByRole('status')
  expect(status).toHaveAttribute('aria-live', 'polite')
  expect(status).toHaveTextContent('Saved')
})
