import type { NextConfig } from 'next'

import {
  FALLBACK_FAVICON_RELATIVE_PATH,
  SITE_ICON_API_PATH,
} from './src/constants/site-favicon'

const nextConfig: NextConfig = {
  serverExternalPackages: ['@prisma/client', '@prisma/adapter-pg', 'pg'],
  outputFileTracingIncludes: {
    '/api/site-icon': [`./${FALLBACK_FAVICON_RELATIVE_PATH}`],
  },
  async rewrites() {
    return [
      {
        source: '/favicon.ico',
        destination: SITE_ICON_API_PATH,
      },
    ]
  },
}

export default nextConfig
