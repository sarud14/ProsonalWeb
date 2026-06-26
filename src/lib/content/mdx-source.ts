import 'server-only'

import fs from 'fs/promises'
import path from 'path'

import { JOURNAL_STATUS, WORK_STATUS } from '@/constants/content'
import type { ContentSource } from '@/types/content.types'
import type { JournalPost } from '@/types/journal.types'
import type { ParsedMdxFile } from '@/types/parsed-mdx.types'
import type { WorkCaseStudy } from '@/types/work.types'
import { parseMdxFrontmatter } from '@/lib/content/parse-mdx-frontmatter'
import { journalFrontmatterSchema } from '@/validators/journal.schema'
import { workFrontmatterSchema } from '@/validators/work.schema'

const CONTENT_ROOT = path.join(process.cwd(), 'content')

function parseFrontmatter(raw: string, slug: string): ParsedMdxFile {
  return parseMdxFrontmatter(raw, slug)
}

async function readMdxDirectory(relativeDir: string): Promise<ParsedMdxFile[]> {
  const directoryPath = path.join(CONTENT_ROOT, relativeDir)

  try {
    const entries = await fs.readdir(directoryPath)
    const files = await Promise.all(
      entries
        .filter((entry) => entry.endsWith('.mdx'))
        .map(async (entry) => {
          const slug = entry.replace(/\.mdx$/, '')
          const raw = await fs.readFile(path.join(directoryPath, entry), 'utf8')
          return parseFrontmatter(raw, slug)
        })
    )

    return files
  } catch {
    return []
  }
}

function toWorkCaseStudy(file: ParsedMdxFile): WorkCaseStudy | null {
  const parsed = workFrontmatterSchema.safeParse(file.frontmatter)
  if (!parsed.success) return null

  return {
    slug: file.slug,
    ...parsed.data,
  }
}

function toJournalPost(file: ParsedMdxFile): JournalPost | null {
  const parsed = journalFrontmatterSchema.safeParse(file.frontmatter)
  if (!parsed.success) return null

  return {
    slug: file.slug,
    title: parsed.data.title,
    status: parsed.data.status,
    content: file.body,
    publishedAt: parsed.data.publishedAt ?? null,
  }
}

export const mdxSource: ContentSource = {
  async getAllWork() {
    const files = await readMdxDirectory('work')
    return files
      .map(toWorkCaseStudy)
      .filter((item): item is WorkCaseStudy => item !== null)
      .filter((item) => item.status === WORK_STATUS.PUBLISHED)
  },

  async getWorkBySlug(slug: string) {
    const files = await readMdxDirectory('work')
    const match = files.find((file) => file.slug === slug)
    if (!match) return null

    const work = toWorkCaseStudy(match)
    if (!work || work.status !== WORK_STATUS.PUBLISHED) return null

    return work
  },

  async getAllJournalPosts() {
    const files = await readMdxDirectory('journal')
    return files
      .map(toJournalPost)
      .filter((item): item is JournalPost => item !== null)
      .filter((item) => item.status === JOURNAL_STATUS.PUBLISHED)
  },

  async getJournalPostBySlug(slug: string) {
    const files = await readMdxDirectory('journal')
    const match = files.find((file) => file.slug === slug)
    if (!match) return null

    const post = toJournalPost(match)
    if (!post || post.status !== JOURNAL_STATUS.PUBLISHED) return null

    return post
  },
}
