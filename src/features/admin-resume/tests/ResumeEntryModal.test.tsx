import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'

import { ResumeEntryModal } from '../ResumeEntryModal'

function handlers(): Record<'onClose' | 'onSaveExperience' | 'onSaveEducation' | 'onSaveLanguage' | 'onSaveSelectedWork', ReturnType<typeof vi.fn>> {
  return {
    onClose: vi.fn(),
    onSaveExperience: vi.fn(),
    onSaveEducation: vi.fn(),
    onSaveLanguage: vi.fn(),
    onSaveSelectedWork: vi.fn(),
  }
}

test('renders nothing when closed', () => {
  render(<ResumeEntryModal open={false} kind="language" workOptions={[]} {...handlers()} />)
  expect(screen.queryByRole('button', { name: 'Save' })).toBeNull()
})

test('saves a language entry', async () => {
  const user = userEvent.setup()
  const h = handlers()
  render(<ResumeEntryModal open kind="language" workOptions={[]} {...h} />)
  await user.type(screen.getByRole('textbox', { name: /^Language/ }), 'Thai')
  await user.type(screen.getByRole('textbox', { name: /^Level/ }), 'Native')
  await user.click(screen.getByRole('button', { name: 'Save' }))
  expect(h.onSaveLanguage).toHaveBeenCalledWith(expect.objectContaining({ name: 'Thai', level: 'Native' }))
  expect(h.onSaveExperience).not.toHaveBeenCalled()
})

test('edits an existing education entry', async () => {
  const user = userEvent.setup()
  const h = handlers()
  render(
    <ResumeEntryModal
      open
      kind="education"
      workOptions={[]}
      initialEducation={{ id: 'ed1', title: 'B.A.', note: 'University', period: '2014' }}
      {...h}
    />,
  )
  await user.type(screen.getByRole('textbox', { name: /^Note/ }), ' of Arts')
  await user.click(screen.getByRole('button', { name: 'Save' }))
  expect(h.onSaveEducation).toHaveBeenCalledWith({ id: 'ed1', title: 'B.A.', note: 'University of Arts', period: '2014' })
})

test('picks a case study for selected work', async () => {
  const user = userEvent.setup()
  const h = handlers()
  render(<ResumeEntryModal open kind="selectedWork" workOptions={[{ id: 'w1', title: 'Check-in app' }]} {...h} />)
  await user.selectOptions(screen.getByRole('combobox', { name: /^Work case study/ }), 'w1')
  await user.click(screen.getByRole('button', { name: 'Save' }))
  expect(h.onSaveSelectedWork).toHaveBeenCalledWith(expect.objectContaining({ workId: 'w1' }))
})

test('cancels', async () => {
  const user = userEvent.setup()
  const h = handlers()
  render(<ResumeEntryModal open kind="experience" workOptions={[]} {...h} />)
  await user.click(screen.getByRole('button', { name: 'Cancel' }))
  expect(h.onClose).toHaveBeenCalled()
})
