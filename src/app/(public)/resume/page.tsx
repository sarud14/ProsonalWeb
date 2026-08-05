import type { Metadata } from 'next'

import { ResumePageView } from '@/components/public-page/Resume/ResumePageView'
import { getResumeData } from '@/lib/resume/get-resume-data'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Resume — FEOps Kit',
}

export default async function ResumePage(): Promise<React.JSX.Element> {
  const data = await getResumeData()

  return <ResumePageView data={data} />
}
