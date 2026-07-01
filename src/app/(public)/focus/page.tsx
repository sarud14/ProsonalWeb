import type { Metadata } from 'next'

import { FocusPageView } from '@/components/public-page/Focus/FocusPageView'
import { resolveFocusPageData } from '@/lib/content/page-sections'

export const metadata: Metadata = {
  title: 'Focus — FEOps Kit',
}

export default async function FocusPage(): Promise<React.JSX.Element> {
  const data = await resolveFocusPageData()

  return <FocusPageView data={data} />
}
