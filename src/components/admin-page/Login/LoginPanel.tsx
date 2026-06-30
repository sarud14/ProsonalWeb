import { signInWithGitHubAction } from '@/actions/auth.actions'

interface LoginPanelProps {
  readonly isReady: boolean
}

export function LoginPanel({ isReady }: LoginPanelProps): React.JSX.Element {
  return (
    <div className="w-full max-w-[420px] rounded-[14px] border border-border bg-card p-8 shadow-[0_24px_60px_rgba(0,0,0,0.2)]">
      <div className="mb-8 space-y-2">
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-primary">
          FEOps Kit
        </div>
        <h1 className="text-[34px] font-medium leading-tight tracking-[-0.02em]">
          Admin sign-in
        </h1>
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          Sign in with GitHub to manage content, pages, media, and messages.
        </p>
      </div>

      {isReady ? (
        <form action={signInWithGitHubAction}>
          <button
            type="submit"
            className="flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-lg bg-primary px-[22px] py-3.5 text-[13px] font-bold text-primary-foreground"
          >
            <span aria-hidden className="text-base">
              ◆
            </span>
            Continue with GitHub
          </button>
        </form>
      ) : (
        <div className="rounded-lg border border-border bg-secondary p-4 text-[13px] leading-relaxed text-muted-foreground">
          Auth is not configured yet. Copy `.env.example` to `.env` and set
          `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `AUTH_GITHUB_ID`, and `AUTH_GITHUB_SECRET`.
        </div>
      )}

      <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
        Single-session admin access
      </p>
    </div>
  )
}
