export const env = {
  databaseUrl: process.env.DATABASE_URL ?? '',
  directUrl: process.env.DIRECT_URL ?? '',
  nextAuthUrl: process.env.NEXTAUTH_URL ?? '',
  nextAuthSecret: process.env.NEXTAUTH_SECRET ?? '',
  contentSource: (process.env.CONTENT_SOURCE ?? 'mdx') as 'mdx' | 'db',
} as const
