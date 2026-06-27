import type { Metadata } from 'next'

import { ResumePageView } from '@/components/public-page/Resume/ResumePageView'

export const metadata: Metadata = {
  title: 'Resume — FEOps Kit',
}

export default function ResumePage(): React.JSX.Element {
  return <ResumePageView />
}
