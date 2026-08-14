import type { Metadata } from 'next'

import { EngineeringTypePageView } from '@/components/public-page/Engineering/EngineeringTypePageView'
import { loadEngineeringTypePage } from '@/lib/content/engineering-type-page'

export const metadata: Metadata = {
  title: 'Performance — Engineering',
}

export default async function PerformancePage(): Promise<React.JSX.Element> {
  const page = await loadEngineeringTypePage('performance')

  return (
    <EngineeringTypePageView
      pathSegment={page.pathSegment}
      noteType={page.noteType}
      notes={page.notes}
    />
  )
}
