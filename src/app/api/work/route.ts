import { NextResponse } from 'next/server'

import { getContentSource } from '@/lib/content/source'
import type { ApiResponse } from '@/types/shared/api-response.types'
import type { WorkCaseStudy } from '@/types/work.types'

export async function GET(): Promise<NextResponse<ApiResponse<readonly WorkCaseStudy[]>>> {
  const content = await getContentSource()
  const data = await content.getAllWork()

  return NextResponse.json({ data, success: true })
}
