import 'server-only'

import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'

import { AUTH_PROVIDER } from '@/constants/auth'
import { env, isAuthConfigured, isGithubAuthConfigured } from '@/env'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: isGithubAuthConfigured()
    ? [
        GitHub({
          clientId: env.authGithubId,
          clientSecret: env.authGithubSecret,
        }),
      ]
    : [],
  secret: isAuthConfigured() ? env.nextAuthSecret : undefined,
  trustHost: true,
  pages: {
    signIn: '/login',
  },
})

export { isAuthConfigured }

export const primaryAuthProvider = AUTH_PROVIDER.GITHUB
