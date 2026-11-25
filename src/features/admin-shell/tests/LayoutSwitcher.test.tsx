import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'

import { LayoutSwitcher } from '../LayoutSwitcher'

test('marks the current layout and reports a new choice', async () => {
  const user = userEvent.setup()
  const onChange = vi.fn()
  render(<LayoutSwitcher layout="sidebar" onChange={onChange} />)
  expect(screen.getByRole('button', { name: 'Side' })).toHaveAttribute('aria-pressed', 'true')
  expect(screen.getByRole('button', { name: 'Bar' })).toHaveAttribute('aria-pressed', 'false')
  await user.click(screen.getByRole('button', { name: 'Split' }))
  expect(onChange).toHaveBeenCalledWith('split')
})
