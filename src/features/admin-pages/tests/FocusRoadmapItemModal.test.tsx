import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'

import { FocusRoadmapItemModal } from '../FocusRoadmapItemModal'

test('applies title, note, and status dot', async () => {
  const user = userEvent.setup()
  const onSave = vi.fn()
  render(
    <FocusRoadmapItemModal
      state={{ columnIndex: 0, isNew: true, item: { title: '', note: '', dot: 'active' } }}
      onClose={vi.fn()}
      onSave={onSave}
    />,
  )
  await user.type(screen.getByRole('textbox', { name: 'Title' }), 'Turborepo')
  await user.type(screen.getByRole('textbox', { name: 'Note' }), 'Shared packages')
  await user.selectOptions(screen.getByRole('combobox', { name: 'Status dot' }), 'exploring')
  await user.click(screen.getByRole('button', { name: 'Apply' }))
  expect(onSave).toHaveBeenCalledWith({ title: 'Turborepo', note: 'Shared packages', dot: 'exploring' })
})
