const DEFAULT_PORT = '3000'
const DEFAULT_APP_HOST = 'http://localhost'
const ENV_LIST_SEPARATOR = ','

function resolvePort(): string {
  const raw = process.env.PORT?.trim()
  return raw && raw.length > 0 ? raw : DEFAULT_PORT
}

function resolveAppHost(): string {
  const raw = process.env.APP_HOST?.trim()
  return raw && raw.length > 0 ? raw.replace(/\/$/, '') : DEFAULT_APP_HOST
}

function resolveNextAuthUrl(port: string, appHost: string): string {
  if (process.env.NODE_ENV !== 'production') {
    // Next.js may bind a different port than PORT when the default is busy.
    // Let Auth.js resolve the URL per request via trustHost instead of pinning here.
    delete process.env.NEXTAUTH_URL
    return ''
  }

  const explicit = process.env.NEXTAUTH_URL?.trim()
  if (explicit && explicit.length > 0) {
    return explicit.replace(/\/$/, '')
  }

  const derived = `${appHost}:${port}`
  process.env.NEXTAUTH_URL = derived
  return derived
}

const port = resolvePort()
const appHost = resolveAppHost()
const nextAuthUrl = resolveNextAuthUrl(port, appHost)

function parseEnvList(value: string | undefined): readonly string[] {
  if (!value) return []
  return value
    .split(ENV_LIST_SEPARATOR)
    .map((item) => item.trim().toLowerCase())
    .filter((item) => item.length > 0)
}

const adminEmailAllowlist = parseEnvList(process.env.AUTH_ADMIN_EMAIL_ALLOWLIST)
const adminGithubIdAllowlist = parseEnvList(process.env.AUTH_ADMIN_GITHUB_ID_ALLOWLIST)

export const env = {
  port,
  appHost,
  databaseUrl: process.env.DATABASE_URL ?? '',
  directUrl: process.env.DIRECT_URL ?? '',
  nextAuthUrl,
  nextAuthSecret: process.env.NEXTAUTH_SECRET ?? '',
  authGithubId: process.env.AUTH_GITHUB_ID ?? '',
  authGithubSecret: process.env.AUTH_GITHUB_SECRET ?? '',
  authGoogleId: process.env.AUTH_GOOGLE_ID ?? '',
  authGoogleSecret: process.env.AUTH_GOOGLE_SECRET ?? '',
  adminEmailAllowlist,
  adminGithubIdAllowlist,
  contentSource: (process.env.CONTENT_SOURCE ?? 'mdx') as 'mdx' | 'db',
  blobReadWriteToken: process.env.BLOB_READ_WRITE_TOKEN ?? '',
  cronSecret: process.env.CRON_SECRET ?? '',
} as const

export function isAuthConfigured(): boolean {
  if (env.nextAuthSecret.length === 0) return false
  if (process.env.NODE_ENV !== 'production') return true
  return env.nextAuthUrl.length > 0
}

export function isGithubAuthConfigured(): boolean {
  return env.authGithubId.length > 0 && env.authGithubSecret.length > 0
}

export function isGoogleAuthConfigured(): boolean {
  return env.authGoogleId.length > 0 && env.authGoogleSecret.length > 0
}

export function hasAdminAllowlist(): boolean {
  return env.adminEmailAllowlist.length > 0 || env.adminGithubIdAllowlist.length > 0
}

export function isAllowedAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  return env.adminEmailAllowlist.includes(email.trim().toLowerCase())
}

export function isAllowedGithubAccountId(accountId: string | undefined): boolean {
  if (!accountId) return false
  return env.adminGithubIdAllowlist.includes(accountId.trim().toLowerCase())
}
