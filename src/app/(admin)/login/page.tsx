import type { Metadata } from 'next'

import { LoginPanel } from '@/components/admin-page/Login/LoginPanel'
import { isGithubAuthConfigured, isGoogleAuthConfigured } from '@/env'

export const metadata: Metadata = {
  title: 'Login — FEOps Kit',
}

export default function LoginPage(): React.JSX.Element {
  const hasGithub = isGithubAuthConfigured()
  const hasGoogle = isGoogleAuthConfigured()

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-16">
      <LoginPanel hasGithub={hasGithub} hasGoogle={hasGoogle} />
    </main>
  )
}
