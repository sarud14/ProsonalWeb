import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, expect, test, vi } from 'vitest'

import type { ResumePageData } from '@/types/admin-resume.types'

import { ResumePageView } from '../ResumePageView'

const router = vi.hoisted(() => ({ refresh: vi.fn() }))
const actions = vi.hoisted(() => ({
  updateResumeProfile: vi.fn(),
  upsertExperience: vi.fn(),
  deleteExperience: vi.fn(),
  upsertEducation: vi.fn(),
  deleteEducation: vi.fn(),
  upsertLanguage: vi.fn(),
  deleteLanguage: vi.fn(),
  addSelectedWork: vi.fn(),
  updateSelectedWork: vi.fn(),
  removeSelectedWork: vi.fn(),
}))

vi.mock('next/navigation', () => ({ useRouter: () => router }))
vi.mock('@/actions/resume.actions', () => actions)

const data: ResumePageData = {
  profile: { id: 'p1', name: 'Sarut', role: 'Frontend Developer', contactLine: 'hi@example.com', skills: ['React'], coreTools: ['Prisma'] },
  experiences: [{ id: 'x1', title: 'Frontend Developer', org: 'Agency', period: '2025', bullets: ['Built portals'], sortOrder: 0 }],
  education: [],
  languages: [{ id: 'l1', name: 'English', level: 'Fluent', sortOrder: 0 }],
  selectedWork: [],
  workOptions: [{ id: 'w1', title: 'Check-in app' }],
}

beforeEach(() => {
  vi.clearAllMocks()
})

test('shows existing entries', () => {
  render(<ResumePageView initialData={data} />)
  expect(screen.getByRole('textbox', { name: /^Name/ })).toHaveValue('Sarut')
  expect(screen.getByText('Agency · 2025')).toBeInTheDocument()
  expect(screen.getByText('Built portals')).toBeInTheDocument()
  expect(screen.getByText('English')).toBeInTheDocument()
})

test('saves the edited profile', async () => {
  const user = userEvent.setup()
  actions.updateResumeProfile.mockResolvedValue({ success: true, data: { id: 'p1' } })
  render(<ResumePageView initialData={data} />)
  await user.type(screen.getByRole('textbox', { name: /^Role/ }), ' II')
  await user.click(screen.getByRole('button', { name: 'Save' }))
  expect(actions.updateResumeProfile).toHaveBeenCalledWith(expect.objectContaining({ role: 'Frontend Developer II' }))
  expect(router.refresh).toHaveBeenCalled()
})

test('removes a language entry', async () => {
  const user = userEvent.setup()
  actions.deleteLanguage.mockResolvedValue({ success: true, data: null })
  render(<ResumePageView initialData={data} />)
  await user.click(screen.getByRole('button', { name: 'Remove English' }))
  expect(actions.deleteLanguage).toHaveBeenCalledWith('l1')
})

test('surfaces a failed remove', async () => {
  const user = userEvent.setup()
  actions.deleteExperience.mockResolvedValue({ success: false, error: 'Locked' })
  render(<ResumePageView initialData={data} />)
  await user.click(screen.getByRole('button', { name: 'Remove Frontend Developer' }))
  expect(await screen.findByRole('status')).toHaveTextContent('Locked')
})
