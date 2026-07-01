import type { Metadata } from 'next'

import { StackPageView } from '@/components/public-page/Stack/StackPageView'
import { resolveStackPageData } from '@/lib/content/page-sections'

export const metadata: Metadata = {
  title: 'Stack — FEOps Kit',
}

export default async function StackPage(): Promise<React.JSX.Element> {
  const data = await resolveStackPageData()

  return <StackPageView data={data} />
}
