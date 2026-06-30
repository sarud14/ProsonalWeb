import type { Metadata } from 'next'

import { LoginPanel } from '@/components/admin-page/Login/LoginPanel'
import { isAuthConfigured, isGithubAuthConfigured } from '@/env'

export const metadata: Metadata = {
  title: 'Login — FEOps Kit',
}

export default function LoginPage(): React.JSX.Element {
  const isReady = isAuthConfigured() && isGithubAuthConfigured()

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-16">
      <LoginPanel isReady={isReady} />
    </main>
  )
}
