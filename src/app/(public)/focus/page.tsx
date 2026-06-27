import type { Metadata } from 'next'

import { FocusPageView } from '@/components/public-page/Focus/FocusPageView'

export const metadata: Metadata = {
  title: 'Focus — FEOps Kit',
}

export default function FocusPage(): React.JSX.Element {
  return <FocusPageView />
}
