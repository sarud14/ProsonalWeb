import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FEOps Kit — Home',
}

export default function HomePage(): React.JSX.Element {
  return (
    <main>
      <h1>FEOps Kit</h1>
      <p>Frontend Engineering Portfolio System</p>
    </main>
  )
}
