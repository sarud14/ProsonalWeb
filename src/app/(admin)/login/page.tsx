import type { Metadata } from 'next'

import { signInWithGitHubAction } from '@/actions/auth.actions'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { isAuthConfigured, isGithubAuthConfigured } from '@/env'

export const metadata: Metadata = {
  title: 'Login — FEOps Kit',
}

export default function LoginPage(): React.JSX.Element {
  const isReady = isAuthConfigured() && isGithubAuthConfigured()

  return (
    <main className="py-16">
      <Container className="max-w-md">
        <div className="space-y-6 border border-border p-8">
          <div className="space-y-2">
            <span className="font-mono text-xs tracking-[0.14em] text-primary uppercase">
              Admin
            </span>
            <h1 className="text-3xl font-semibold tracking-[-0.02em]">Login</h1>
            <p className="text-sm text-muted-foreground">
              Sign in to manage case studies and journal posts.
            </p>
          </div>

          {isReady ? (
            <form action={signInWithGitHubAction}>
              <Button type="submit" className="w-full">
                Sign in with GitHub
              </Button>
            </form>
          ) : (
            <p className="text-sm leading-relaxed text-muted-foreground">
              Auth is not configured yet. Copy `.env.example` to `.env` and set
              `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `AUTH_GITHUB_ID`, and
              `AUTH_GITHUB_SECRET`.
            </p>
          )}
        </div>
      </Container>
    </main>
  )
}
