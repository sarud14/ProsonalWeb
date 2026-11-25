import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'

import { SectionHeading } from '../SectionHeading'

test('renders kicker, page heading, and action slot', () => {
  render(<SectionHeading kicker="CMS" title="Work" action={<button type="button">New</button>} />)
  expect(screen.getByRole('heading', { level: 1, name: 'Work' })).toBeInTheDocument()
  expect(screen.getByText('CMS')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'New' })).toBeInTheDocument()
})
