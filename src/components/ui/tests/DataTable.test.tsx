import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'

import { DataTable } from '../DataTable'
import type { DataTableRow } from '../types'

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'status', label: 'Status' },
  { key: 'stack', label: 'Stack' },
] as const

const rows: readonly DataTableRow[] = [
  {
    id: 'w1',
    status: 'PUBLISHED',
    cells: [
      { kind: 'title', text: 'CMS rebuild' },
      { kind: 'badge', status: 'PUBLISHED' },
      { kind: 'chips', items: ['Next.js'] },
    ],
  },
  {
    id: 'w2',
    status: 'DRAFT',
    cells: [
      { kind: 'title', text: 'Booking flow' },
      { kind: 'badge', status: 'DRAFT' },
      { kind: 'text', text: 'Prisma', mono: true },
    ],
  },
]

function setup(): { onEdit: ReturnType<typeof vi.fn>; onTogglePublish: ReturnType<typeof vi.fn>; onDelete: ReturnType<typeof vi.fn> } {
  const handlers = { onEdit: vi.fn(), onTogglePublish: vi.fn(), onDelete: vi.fn() }
  render(<DataTable columns={columns} rows={rows} gridTemplate="1fr 1fr 1fr 200px" {...handlers} />)
  return handlers
}

test('renders headers, cell kinds, and a publish toggle labelled by status', () => {
  setup()
  expect(screen.getByText('Title')).toBeInTheDocument()
  expect(screen.getByText('Next.js')).toBeInTheDocument()
  expect(screen.getByText('Prisma')).toBeInTheDocument()
  expect(screen.getAllByRole('button', { name: 'Unpublish' })).toHaveLength(1)
  expect(screen.getAllByRole('button', { name: 'Publish' })).toHaveLength(1)
})

test('wires title, edit, publish, and delete actions to the row id', async () => {
  const user = userEvent.setup()
  const { onEdit, onTogglePublish, onDelete } = setup()

  await user.click(screen.getByRole('button', { name: 'CMS rebuild' }))
  await user.click(screen.getAllByRole('button', { name: 'Edit' })[1])
  await user.click(screen.getByRole('button', { name: 'Publish' }))
  await user.click(screen.getAllByRole('button', { name: 'Delete' })[0])

  expect(onEdit).toHaveBeenNthCalledWith(1, 'w1')
  expect(onEdit).toHaveBeenNthCalledWith(2, 'w2')
  expect(onTogglePublish).toHaveBeenCalledWith('w2')
  expect(onDelete).toHaveBeenCalledWith('w1')
})

test('shows an empty state without rows', () => {
  render(
    <DataTable
      columns={columns}
      rows={[]}
      gridTemplate="1fr"
      onEdit={vi.fn()}
      onTogglePublish={vi.fn()}
      onDelete={vi.fn()}
    />,
  )
  expect(screen.getByText('Nothing here yet.')).toBeInTheDocument()
})
