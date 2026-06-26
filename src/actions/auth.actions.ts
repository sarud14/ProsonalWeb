'use server'

import { redirect } from 'next/navigation'

import { AUTH_PROVIDER } from '@/constants/auth'
import {
  isAuthConfigured,
  isGithubAuthConfigured,
  signIn,
  signOut,
} from '@/lib/auth/session'

export async function signInWithGitHubAction(): Promise<void> {
  if (!isAuthConfigured() || !isGithubAuthConfigured()) {
    redirect('/login')
  }

  await signIn(AUTH_PROVIDER.GITHUB, { redirectTo: '/admin' })
}

export async function signOutAction(): Promise<void> {
  if (!isAuthConfigured()) {
    redirect('/login')
  }

  await signOut({ redirectTo: '/login' })
}
