import { render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'

import { LoginPanel } from './LoginPanel'

vi.mock('@/actions/auth.actions', () => ({
  signInWithGitHubAction: vi.fn(),
  signInWithGoogleAction: vi.fn(),
}))

test('explains how to configure auth when no providers are set', () => {
  render(<LoginPanel hasGithub={false} hasGoogle={false} />)

  expect(screen.getByRole('heading', { name: 'Admin sign-in' })).toBeInTheDocument()
  expect(screen.getByText(/Auth is not configured yet/)).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Continue with GitHub' })).toBeNull()
})

test('offers GitHub and Google sign-in when those providers are configured', () => {
  render(<LoginPanel hasGithub hasGoogle />)

  expect(screen.getByRole('button', { name: 'Continue with GitHub' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Continue with Google' })).toBeInTheDocument()
})
