import type { Metadata } from 'next'

import { EngineeringTypePageView } from '@/components/public-page/Engineering/EngineeringTypePageView'
import { loadEngineeringTypePage } from '@/lib/content/engineering-type-page'

export const metadata: Metadata = {
  title: 'Decisions — Engineering — FEOps Kit',
}

export default async function DecisionsPage(): Promise<React.JSX.Element> {
  const page = await loadEngineeringTypePage('decisions')

  return (
    <EngineeringTypePageView
      pathSegment={page.pathSegment}
      noteType={page.noteType}
      notes={page.notes}
    />
  )
}
