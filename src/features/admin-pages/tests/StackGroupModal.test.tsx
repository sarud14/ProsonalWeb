import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'

import { StackGroupModal } from '../StackGroupModal'

test('edits the label and tools, then applies', async () => {
  const user = userEvent.setup()
  const onSave = vi.fn()
  render(
    <StackGroupModal
      state={{ isNew: false, group: { label: 'FRAMEWORK', tools: [{ name: 'Next.js', note: 'app' }, { name: 'Old', note: 'x' }] } }}
      onClose={vi.fn()}
      onSave={onSave}
    />,
  )
  await user.click(screen.getByRole('button', { name: 'Remove tool 2' }))
  await user.click(screen.getByRole('button', { name: '+ Add tool' }))
  await user.type(screen.getByRole('textbox', { name: 'Tool 2 name' }), 'React Native')
  await user.type(screen.getByRole('textbox', { name: 'Tool 2 note' }), 'mobile')
  await user.click(screen.getByRole('button', { name: 'Apply' }))
  expect(onSave).toHaveBeenCalledWith({
    label: 'FRAMEWORK',
    tools: [
      { name: 'Next.js', note: 'app' },
      { name: 'React Native', note: 'mobile' },
    ],
  })
})
