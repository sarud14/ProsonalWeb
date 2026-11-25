import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'

import ContactSection from '../ContactSection'

test('renders the headline, body, and injected form', () => {
  render(<ContactSection headline="Say hi" body="I reply fast." form={<form aria-label="Contact form" />} />)
  expect(screen.getByRole('heading', { level: 2, name: 'Say hi' })).toBeInTheDocument()
  expect(screen.getByText('I reply fast.')).toBeInTheDocument()
  expect(screen.getByRole('form', { name: 'Contact form' })).toBeInTheDocument()
})
