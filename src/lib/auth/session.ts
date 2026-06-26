import 'server-only'

import { redirect } from 'next/navigation'

import { auth, isAuthConfigured, signIn, signOut } from '@/lib/auth/config'
import { AUTH_PROVIDER } from '@/constants/auth'

export async function requireAdminSession(): Promise<void> {
  if (!isAuthConfigured()) return

  const session = await auth()
  if (!session) {
    redirect('/login')
  }
}

export async function getOptionalAdminSession() {
  if (!isAuthConfigured()) return null
  return auth()
}

export { isAuthConfigured, isGithubAuthConfigured } from '@/env'
export { auth, signIn, signOut, AUTH_PROVIDER }
