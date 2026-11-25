import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'

import { MediaAltModal } from '../MediaAltModal'

test('saves the edited alt text for the asset', async () => {
  const user = userEvent.setup()
  const onSave = vi.fn()
  render(<MediaAltModal state={{ id: 'm1', alt: 'Old' }} onClose={vi.fn()} onSave={onSave} />)
  const input = screen.getByRole('textbox', { name: 'Alt text' })
  await user.clear(input)
  await user.type(input, 'Team photo')
  await user.click(screen.getByRole('button', { name: 'Save' }))
  expect(onSave).toHaveBeenCalledWith('m1', 'Team photo')
})

test('closes on cancel', async () => {
  const user = userEvent.setup()
  const onClose = vi.fn()
  render(<MediaAltModal state={{ id: 'm1', alt: '' }} onClose={onClose} onSave={vi.fn()} />)
  await user.click(screen.getByRole('button', { name: 'Cancel' }))
  expect(onClose).toHaveBeenCalled()
})
