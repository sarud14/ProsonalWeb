import 'dotenv/config'

import { defineConfig } from 'prisma/config'

/** Fallback URL for `prisma generate` when no DB is provisioned (CI, fresh clone). */
const DATABASE_URL =
  process.env.DATABASE_URL ?? 'postgresql://localhost:5432/postgres'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: DATABASE_URL,
  },
})
