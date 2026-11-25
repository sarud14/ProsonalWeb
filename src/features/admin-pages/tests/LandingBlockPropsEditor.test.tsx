import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { expect, test, vi } from 'vitest'

import { LandingBlockPropsEditor } from '../LandingBlockPropsEditor'

function Harness({
  type,
  initial,
  onChange,
}: {
  readonly type: string
  readonly initial: Record<string, unknown>
  readonly onChange: (props: Record<string, unknown>) => void
}): React.JSX.Element {
  const [props, setProps] = useState(initial)
  return (
    <LandingBlockPropsEditor
      type={type}
      props={props}
      onChange={(next) => {
        setProps(next)
        onChange(next)
      }}
    />
  )
}

test('stats editor edits values and adds a stat', async () => {
  const user = userEvent.setup()
  const onChange = vi.fn()
  render(<Harness type="stats" initial={{ items: [{ value: '', label: 'Case Studies' }] }} onChange={onChange} />)
  await user.type(screen.getByRole('textbox', { name: /^Value/ }), '9')
  await user.click(screen.getByRole('button', { name: '+ Add stat' }))
  expect(onChange).toHaveBeenLastCalledWith({
    items: [
      { value: '9', label: 'Case Studies' },
      { value: '', label: '' },
    ],
  })
})

test('modules editor toggles visibility and edits the link label', async () => {
  const user = userEvent.setup()
  const onChange = vi.fn()
  render(
    <Harness
      type="modules"
      initial={{ items: [{ num: '01', title: 'Work', desc: 'Cases', link: '/work', linkLabel: '', enabled: true }] }}
      onChange={onChange}
    />,
  )
  await user.click(screen.getByRole('checkbox', { name: 'Show on landing page' }))
  await user.type(screen.getByRole('textbox', { name: /^Link label/ }), 'X')
  expect(onChange).toHaveBeenLastCalledWith({
    items: [expect.objectContaining({ enabled: false, linkLabel: 'X' })],
  })
})

test('contact editor edits the headline', async () => {
  const user = userEvent.setup()
  const onChange = vi.fn()
  render(<Harness type="contact" initial={{ headline: 'Hello', body: 'B', successMessage: 'S' }} onChange={onChange} />)
  await user.type(screen.getByRole('textbox', { name: /^Headline/ }), ' you')
  expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({ headline: 'Hello you' }))
})

test('tech stack editor adds a technology', async () => {
  const user = userEvent.setup()
  const onChange = vi.fn()
  render(<Harness type="techStack" initial={{ items: [] }} onChange={onChange} />)
  await user.type(screen.getByRole('textbox', { name: 'Technologies' }), 'Expo{Enter}')
  expect(onChange).toHaveBeenLastCalledWith({ items: ['Expo'] })
})

test('explains unknown block types', () => {
  render(<LandingBlockPropsEditor type="hero" props={{}} onChange={vi.fn()} />)
  expect(screen.getByText(/no visual editor yet/)).toBeInTheDocument()
})
