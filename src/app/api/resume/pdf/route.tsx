import { renderToBuffer } from '@react-pdf/renderer'

import { getResumeData } from '@/lib/resume/get-resume-data'
import { ResumePdfDocument } from '@/lib/resume/pdf-document'

export async function GET(): Promise<Response> {
  const data = await getResumeData()
  const buffer = await renderToBuffer(<ResumePdfDocument data={data} />)

  return new Response(buffer as unknown as BodyInit, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="sarut-resume.pdf"',
      'Cache-Control': 'no-store',
    },
  })
}
