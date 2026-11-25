import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'

import { FocusReadingModal } from '../FocusReadingModal'

test('applies an edited reading item', async () => {
  const user = userEvent.setup()
  const onSave = vi.fn()
  render(<FocusReadingModal state={{ isNew: true, item: { idx: '', title: '' } }} onClose={vi.fn()} onSave={onSave} />)
  expect(screen.getByRole('heading', { name: 'Add reading item' })).toBeInTheDocument()
  await user.type(screen.getByRole('textbox', { name: 'Index' }), '04')
  await user.type(screen.getByRole('textbox', { name: 'Title' }), 'WAI-ARIA')
  await user.click(screen.getByRole('button', { name: 'Apply' }))
  expect(onSave).toHaveBeenCalledWith({ idx: '04', title: 'WAI-ARIA' })
})

test('says edit for an existing item and cancels', async () => {
  const user = userEvent.setup()
  const onClose = vi.fn()
  render(<FocusReadingModal state={{ isNew: false, item: { idx: '01', title: 'RFCs' } }} onClose={onClose} onSave={vi.fn()} />)
  expect(screen.getByRole('heading', { name: 'Edit reading item' })).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: 'Cancel' }))
  expect(onClose).toHaveBeenCalled()
})
