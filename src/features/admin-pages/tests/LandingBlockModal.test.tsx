import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'

import { LandingBlockModal } from '../LandingBlockModal'

test('switching type on a new block resets its fields', async () => {
  const user = userEvent.setup()
  const onSave = vi.fn()
  render(
    <LandingBlockModal
      state={{ isNew: true, block: { type: 'stats', enabled: true, order: 0, props: { items: [{ value: '1', label: 'A' }] } } }}
      onClose={vi.fn()}
      onSave={onSave}
    />,
  )
  await user.selectOptions(screen.getByRole('combobox', { name: 'Section type' }), 'contact')
  expect(screen.getByRole('textbox', { name: /^Headline/ })).toBeInTheDocument()
  await user.click(screen.getByRole('checkbox', { name: 'Show on landing page' }))
  await user.click(screen.getByRole('button', { name: 'Apply' }))
  expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ type: 'contact', enabled: false }))
})

test('shows the type read-only for an existing block', () => {
  render(
    <LandingBlockModal
      state={{ isNew: false, block: { type: 'techStack', enabled: true, order: 2, props: { items: [] } } }}
      onClose={vi.fn()}
      onSave={vi.fn()}
    />,
  )
  expect(screen.getByRole('heading', { name: 'Edit landing block' })).toBeInTheDocument()
  expect(screen.getByRole('textbox', { name: 'Section type' })).toHaveAttribute('readonly')
})
