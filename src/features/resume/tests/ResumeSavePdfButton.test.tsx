import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'

import { ResumeSavePdfButton } from '../ResumeSavePdfButton'

test('opens the print dialog', async () => {
  const user = userEvent.setup()
  const print = vi.spyOn(window, 'print').mockImplementation(() => undefined)
  render(<ResumeSavePdfButton />)
  await user.click(screen.getByRole('button', { name: /Save PDF/ }))
  expect(print).toHaveBeenCalled()
})
