import 'server-only'

import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'

import { AUTH_PROVIDER } from '@/constants/auth'
import {
  env,
  isAuthConfigured,
  isGithubAuthConfigured,
  isGoogleAuthConfigured,
} from '@/env'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    ...(isGithubAuthConfigured()
      ? [
          GitHub({
            clientId: env.authGithubId,
            clientSecret: env.authGithubSecret,
          }),
        ]
      : []),
    ...(isGoogleAuthConfigured()
      ? [
          Google({
            clientId: env.authGoogleId,
            clientSecret: env.authGoogleSecret,
          }),
        ]
      : []),
  ],
  secret: isAuthConfigured() ? env.nextAuthSecret : undefined,
  trustHost: true,
  pages: {
    signIn: '/login',
  },
})

export { isAuthConfigured }

export const primaryAuthProvider = AUTH_PROVIDER.GITHUB
