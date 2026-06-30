import { signInWithGitHubAction, signInWithGoogleAction } from '@/actions/auth.actions'

interface LoginPanelProps {
  readonly hasGithub: boolean
  readonly hasGoogle: boolean
}

interface ProviderIconBadgeProps {
  readonly variant: 'github' | 'google'
  readonly children: React.ReactNode
}

function BrandMark(): React.JSX.Element {
  return (
    <span className="inline-flex size-10 items-center justify-center rounded-md border border-primary/40 bg-primary/10 font-mono text-base font-bold tracking-[0.08em] text-primary">
      FK
    </span>
  )
}

function ProviderIconBadge({ variant, children }: ProviderIconBadgeProps): React.JSX.Element {
  const circleClass =
    variant === 'github'
      ? 'bg-white text-[#24292f] shadow-[0_1px_2px_rgba(0,0,0,0.2)]'
      : 'border border-[#dadce0] bg-white shadow-[0_1px_2px_rgba(60,64,67,0.18)]'

  return (
    <span
      className={`flex size-9 shrink-0 items-center justify-center rounded-full ${circleClass}`}
    >
      {children}
    </span>
  )
}

function GitHubMark(): React.JSX.Element {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="size-[22px] fill-current"
      focusable="false"
    >
      <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58l-.02-2.04c-3.35.73-4.06-1.61-4.06-1.61a3.2 3.2 0 0 0-1.35-1.77c-1.11-.76.08-.75.08-.75a2.53 2.53 0 0 1 1.85 1.24 2.56 2.56 0 0 0 3.5 1 2.57 2.57 0 0 1 .76-1.61c-2.67-.3-5.48-1.34-5.48-5.97a4.68 4.68 0 0 1 1.24-3.25 4.34 4.34 0 0 1 .12-3.2s1.01-.32 3.3 1.24a11.47 11.47 0 0 1 6 0c2.3-1.56 3.3-1.24 3.3-1.24a4.34 4.34 0 0 1 .12 3.2 4.67 4.67 0 0 1 1.24 3.25c0 4.64-2.81 5.66-5.49 5.96a2.87 2.87 0 0 1 .82 2.23l-.01 3.29c0 .32.22.69.83.58A12 12 0 0 0 12 .5Z" />
    </svg>
  )
}

function GoogleMark(): React.JSX.Element {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="size-[22px]"
      focusable="false"
    >
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.26-.96 2.33-2.04 3.05l3.3 2.56c1.92-1.77 3.02-4.37 3.02-7.44 0-.7-.07-1.39-.2-2.05H12Z" />
      <path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.61-2.44l-3.3-2.56c-.92.62-2.1.99-3.3.99-2.54 0-4.7-1.72-5.47-4.02L3.13 16.6A10 10 0 0 0 12 22Z" />
      <path fill="#4A90E2" d="M6.53 13.97a6 6 0 0 1 0-3.94L3.13 7.4a10 10 0 0 0 0 9.2l3.4-2.63Z" />
      <path fill="#FBBC05" d="M12 6.01c1.47 0 2.8.5 3.84 1.49l2.87-2.87C16.95 2.95 14.69 2 12 2A10 10 0 0 0 3.13 7.4l3.4 2.63C7.3 7.73 9.46 6.01 12 6.01Z" />
    </svg>
  )
}

export function LoginPanel({ hasGithub, hasGoogle }: LoginPanelProps): React.JSX.Element {
  const hasAnyProvider = hasGithub || hasGoogle

  return (
    <div className="w-full max-w-[420px] rounded-[14px] border border-border bg-card p-8 shadow-[0_24px_60px_rgba(0,0,0,0.2)]">
      <div className="mb-8 space-y-2">
        <div className="flex items-center gap-2.5">
          <BrandMark />
          <div className="font-mono text-base uppercase tracking-[0.12em] text-primary">
            FEOps Kit
          </div>
        </div>
        <h1 className="text-[28px] font-medium leading-tight tracking-[-0.02em]">
          Admin sign-in
        </h1>
        <p className="text-base leading-relaxed text-foreground/80">
          Sign in to manage content, pages, media, and messages.
        </p>
      </div>

      {hasAnyProvider ? (
        <div className="flex flex-col gap-3">
          {hasGithub && (
            <form action={signInWithGitHubAction}>
              <button
                type="submit"
                className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg border border-white/10 bg-[#24292f] px-5 py-3.5 text-base font-medium text-white transition-colors hover:bg-black"
              >
                <ProviderIconBadge variant="github">
                  <GitHubMark />
                </ProviderIconBadge>
                Continue with GitHub
              </button>
            </form>
          )}

          {hasGoogle && (
            <form action={signInWithGoogleAction}>
              <button
                type="submit"
                className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg border border-[#dadce0] bg-white px-5 py-3.5 text-base font-medium text-[#3c4043] transition-colors hover:bg-[#f8f9fa]"
              >
                <ProviderIconBadge variant="google">
                  <GoogleMark />
                </ProviderIconBadge>
                Continue with Google
              </button>
            </form>
          )}
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-secondary p-4 text-base leading-relaxed text-foreground/80">
          Auth is not configured yet. Copy `.env.example` to `.env` and set
          `NEXTAUTH_SECRET` plus at least one provider pair:
          `AUTH_GITHUB_ID`/`AUTH_GITHUB_SECRET` or
          `AUTH_GOOGLE_ID`/`AUTH_GOOGLE_SECRET`.
        </div>
      )}

      <p className="mt-6 text-center text-base text-foreground/70">
        Single-session admin access
      </p>
    </div>
  )
}
