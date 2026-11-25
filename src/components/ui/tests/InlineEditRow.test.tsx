import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'

import { InlineEditRow } from '../InlineEditRow'

function renderRow(referenceCount: number): { onLabelChange: ReturnType<typeof vi.fn>; onDelete: ReturnType<typeof vi.fn> } {
  const onLabelChange = vi.fn()
  const onDelete = vi.fn()
  render(
    <InlineEditRow
      id="d1"
      label="CMS"
      sortOrder={1}
      referenceCount={referenceCount}
      onLabelChange={onLabelChange}
      onDelete={onDelete}
    />,
  )
  return { onLabelChange, onDelete }
}

test('saves a trimmed, changed label on blur', async () => {
  const user = userEvent.setup()
  const { onLabelChange } = renderRow(0)
  const input = screen.getByDisplayValue('CMS')
  await user.clear(input)
  await user.type(input, '  Content  ')
  await user.tab()
  expect(onLabelChange).toHaveBeenCalledWith('d1', 'Content')
})

test('does not save an unchanged label', async () => {
  const user = userEvent.setup()
  const { onLabelChange } = renderRow(0)
  await user.click(screen.getByDisplayValue('CMS'))
  await user.tab()
  expect(onLabelChange).not.toHaveBeenCalled()
})

test('deletes a row that nothing references', async () => {
  const user = userEvent.setup()
  const { onDelete } = renderRow(0)
  await user.click(screen.getByRole('button', { name: 'Delete' }))
  expect(onDelete).toHaveBeenCalledWith('d1')
})

test('disables delete when work items reference the row', () => {
  renderRow(2)
  expect(screen.getByRole('button', { name: 'Delete' })).toBeDisabled()
})
