import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'

import { TagInput } from './TagInput'

test('adds a tag when Enter is pressed', async () => {
  const user = userEvent.setup()
  const onChange = vi.fn()

  render(<TagInput tags={[]} onChange={onChange} placeholder="Add stack item…" />)

  await user.type(screen.getByPlaceholderText('Add stack item…'), 'Next.js{Enter}')

  expect(onChange).toHaveBeenCalledWith(['Next.js'])
})

test('remove control uses an accessible name', async () => {
  const user = userEvent.setup()
  const onChange = vi.fn()

  render(<TagInput tags={['Next.js']} onChange={onChange} />)

  await user.click(screen.getByRole('button', { name: 'Remove Next.js' }))
  expect(onChange).toHaveBeenCalledWith([])
})
