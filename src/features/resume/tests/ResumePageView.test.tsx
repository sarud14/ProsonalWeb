import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'

import { ResumePageView } from '../ResumePageView'

test('renders every resume section from the data', () => {
  render(
    <ResumePageView
      data={{
        name: 'Sarut D.',
        role: 'Frontend Developer',
        contactLine: 'hello@example.com',
        experience: [{ title: 'Frontend Developer', org: 'Agency', period: '2025 - Now', bullets: ['Built admin portals'] }],
        selectedWork: [{ name: 'Check-in app', note: 'QR check-in' }],
        skills: ['React'],
        coreTools: ['Prisma'],
        education: [{ title: 'B.A.', note: 'University', period: '2014' }],
        languages: [{ name: 'Thai', level: 'Native' }],
      }}
    />,
  )
  expect(screen.getByRole('heading', { level: 1, name: 'Sarut D.' })).toBeInTheDocument()
  expect(screen.getByText('Built admin portals')).toBeInTheDocument()
  expect(screen.getByText('Check-in app')).toBeInTheDocument()
  expect(screen.getByText('React')).toBeInTheDocument()
  expect(screen.getByText('Prisma')).toBeInTheDocument()
  expect(screen.getByText('University')).toBeInTheDocument()
  expect(screen.getByText('Native')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /Save PDF/ })).toBeInTheDocument()
})
