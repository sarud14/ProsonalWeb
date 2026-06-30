import type { Metadata } from 'next'

import { ResumePageView } from '@/components/admin-page/Resume/ResumePageView'
import { mapResumePageData } from '@/lib/admin/resume-form-mappers'
import { resumeData } from '@/lib/data/resume.data'
import { workData } from '@/lib/data/work.data'

export const metadata: Metadata = {
  title: 'Résumé — Admin — FEOps Kit',
}

export default async function AdminResumePage(): Promise<React.JSX.Element> {
  const [profile, workItems] = await Promise.all([resumeData.getProfile(), workData.getAll()])

  const initialData = mapResumePageData(
    profile,
    workItems.map((work) => ({ id: work.id, title: work.title }))
  )

  return <ResumePageView initialData={initialData} />
}
