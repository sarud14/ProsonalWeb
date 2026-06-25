'use client'

interface AppProviderProps {
  readonly children: React.ReactNode
}

export function AppProvider({ children }: AppProviderProps): React.JSX.Element {
  return <>{children}</>
}
