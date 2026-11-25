import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'

import { WorkCaseSectionBlock, WorkCaseSectionHeader } from '../WorkCaseSectionHeader'

test('renders the section number and label', () => {
  render(<WorkCaseSectionHeader num="01" label="Context" />)
  expect(screen.getByText('01')).toBeInTheDocument()
  expect(screen.getByText('Context')).toBeInTheDocument()
})

test('wraps content in an anchorable section', () => {
  const { container } = render(
    <WorkCaseSectionBlock id="sec-context" num="01" label="Context">
      <p>Body</p>
    </WorkCaseSectionBlock>,
  )
  expect(container.querySelector('section#sec-context')).toContainElement(screen.getByText('Body'))
})
