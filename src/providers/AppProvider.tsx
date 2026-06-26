'use client'

import type { AppProviderProps } from '@/types/app-provider.types'

export function AppProvider({ children }: AppProviderProps): React.JSX.Element {
  return <>{children}</>
}
