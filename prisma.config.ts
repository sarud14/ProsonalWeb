import 'dotenv/config'

import { defineConfig } from 'prisma/config'

/** Migrations use DIRECT_URL when set (Supabase session/direct); runtime app uses DATABASE_URL. */
const DATABASE_URL =
  process.env.DIRECT_URL?.trim() ||
  process.env.DATABASE_URL?.trim() ||
  'postgresql://localhost:5432/postgres'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'npx ts-node --transpile-only prisma/seed.ts',
  },
  datasource: {
    url: DATABASE_URL,
  },
})
