import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'

import { ReorderableList } from '../ReorderableList'

const items = [
  { id: 'a', primary: 'Alpha', secondary: 'First', bullets: ['One'] },
  { id: 'b', primary: 'Beta' },
]

function setup(): Record<'onMoveUp' | 'onMoveDown' | 'onRemove' | 'onAdd', ReturnType<typeof vi.fn>> {
  const handlers = { onMoveUp: vi.fn(), onMoveDown: vi.fn(), onRemove: vi.fn(), onAdd: vi.fn() }
  render(<ReorderableList label="Experience" items={items} {...handlers} renderExtra={(item) => <span>extra-{item.id}</span>} />)
  return handlers
}

test('renders items with details and disables moves at the ends', () => {
  setup()
  expect(screen.getByText('Experience')).toBeInTheDocument()
  expect(screen.getByText('First')).toBeInTheDocument()
  expect(screen.getByText('One')).toBeInTheDocument()
  expect(screen.getByText('extra-b')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Move Alpha up' })).toBeDisabled()
  expect(screen.getByRole('button', { name: 'Move Beta down' })).toBeDisabled()
})

test('wires move, remove, and add actions', async () => {
  const user = userEvent.setup()
  const { onMoveUp, onMoveDown, onRemove, onAdd } = setup()
  await user.click(screen.getByRole('button', { name: 'Move Beta up' }))
  await user.click(screen.getByRole('button', { name: 'Move Alpha down' }))
  await user.click(screen.getByRole('button', { name: 'Remove Alpha' }))
  await user.click(screen.getByRole('button', { name: '+ Add' }))
  expect(onMoveUp).toHaveBeenCalledWith('b')
  expect(onMoveDown).toHaveBeenCalledWith('a')
  expect(onRemove).toHaveBeenCalledWith('a')
  expect(onAdd).toHaveBeenCalled()
})

test('shows an empty state', () => {
  render(
    <ReorderableList label="Languages" items={[]} onMoveUp={vi.fn()} onMoveDown={vi.fn()} onRemove={vi.fn()} onAdd={vi.fn()} />,
  )
  expect(screen.getByText(/nothing here yet/i)).toBeInTheDocument()
})
