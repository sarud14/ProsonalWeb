import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, expect, test, vi } from 'vitest'

import { ContactForm } from '../ContactForm'

const submitContact = vi.hoisted(() => vi.fn())
vi.mock('@/actions/contact.actions', () => ({ submitContact }))

beforeEach(() => {
  submitContact.mockReset()
})

async function fillAndSend(): Promise<void> {
  const user = userEvent.setup()
  await user.type(screen.getByRole('textbox', { name: 'Name' }), 'Ada')
  await user.type(screen.getByRole('textbox', { name: 'Email' }), 'ada@example.com')
  await user.type(screen.getByRole('textbox', { name: 'Message' }), 'Hello there')
  await user.click(screen.getByRole('button', { name: 'Send message' }))
}

test('submits the fields and shows the success message', async () => {
  submitContact.mockResolvedValue({ success: true, data: null })
  render(<ContactForm successMessage="Thanks, talk soon." />)
  await fillAndSend()
  expect(submitContact).toHaveBeenCalledWith(
    expect.objectContaining({ name: 'Ada', email: 'ada@example.com', message: 'Hello there' }),
  )
  expect(await screen.findByRole('status')).toHaveTextContent('Thanks, talk soon.')
})

test('shows the server error and keeps the form', async () => {
  submitContact.mockResolvedValue({ success: false, error: 'Too many messages' })
  render(<ContactForm />)
  await fillAndSend()
  expect(await screen.findByRole('alert')).toHaveTextContent('Too many messages')
  expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('Ada')
})
