export const AUTH_PROVIDER = {
  GITHUB: 'github',
  GOOGLE: 'google',
} as const

export type AuthProviderId = (typeof AUTH_PROVIDER)[keyof typeof AUTH_PROVIDER]
