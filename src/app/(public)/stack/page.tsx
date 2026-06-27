import type { Metadata } from 'next'

import { StackPageView } from '@/components/public-page/Stack/StackPageView'

export const metadata: Metadata = {
  title: 'Stack — FEOps Kit',
}

export default function StackPage(): React.JSX.Element {
  return <StackPageView />
}
