import 'server-only'

/**
 * Prisma client entry point.
 * Run `yarn prisma generate` after configuring DATABASE_URL when DB features are enabled.
 */
export async function getPrismaClient(): Promise<never> {
  throw new Error('Database features are not configured. Set DATABASE_URL and run prisma generate.')
}
