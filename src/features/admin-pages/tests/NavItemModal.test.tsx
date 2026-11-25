import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'

import { NavItemModal } from '../NavItemModal'

const item = { key: 'work', label: 'Work', href: '/work', enabled: true }

test('locks the key when editing and applies changes', async () => {
  const user = userEvent.setup()
  const onSave = vi.fn()
  render(<NavItemModal state={{ isNew: false, item }} onClose={vi.fn()} onSave={onSave} />)
  expect(screen.getByRole('textbox', { name: 'Key' })).toHaveAttribute('readonly')
  await user.type(screen.getByRole('textbox', { name: 'Label' }), 's')
  await user.click(screen.getByRole('checkbox', { name: 'Visible in navigation' }))
  await user.click(screen.getByRole('button', { name: 'Apply' }))
  expect(onSave).toHaveBeenCalledWith({ ...item, label: 'Works', enabled: false })
})

test('allows a key for a new item', () => {
  render(<NavItemModal state={{ isNew: true, item: { key: '', label: '', href: '', enabled: true } }} onClose={vi.fn()} onSave={vi.fn()} />)
  expect(screen.getByRole('textbox', { name: 'Key' })).not.toHaveAttribute('readonly')
})
