import { env } from '@/env'
import type { ContentSource } from '@/types/content.types'

function getMdxSource(): Promise<ContentSource> {
  return import('./mdx-source').then((m) => m.mdxSource)
}

function getDbSource(): Promise<ContentSource> {
  return import('./db-source').then((m) => m.dbSource)
}

export async function getContentSource(): Promise<ContentSource> {
  if (env.contentSource === 'db') {
    return getDbSource()
  }
  return getMdxSource()
}
