export const env = {
  databaseUrl: process.env.DATABASE_URL ?? '',
  directUrl: process.env.DIRECT_URL ?? '',
  nextAuthUrl: process.env.NEXTAUTH_URL ?? '',
  nextAuthSecret: process.env.NEXTAUTH_SECRET ?? '',
  authGithubId: process.env.AUTH_GITHUB_ID ?? '',
  authGithubSecret: process.env.AUTH_GITHUB_SECRET ?? '',
  contentSource: (process.env.CONTENT_SOURCE ?? 'mdx') as 'mdx' | 'db',
} as const

export function isAuthConfigured(): boolean {
  return env.nextAuthSecret.length > 0 && env.nextAuthUrl.length > 0
}

export function isGithubAuthConfigured(): boolean {
  return env.authGithubId.length > 0 && env.authGithubSecret.length > 0
}
