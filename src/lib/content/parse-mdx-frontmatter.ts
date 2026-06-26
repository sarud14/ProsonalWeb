import type { ParsedMdxFile } from '@/types/parsed-mdx.types'

export function parseMdxFrontmatter(raw: string, slug: string): ParsedMdxFile {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)

  if (!match) {
    return { slug, frontmatter: {}, body: raw.trim() }
  }

  const frontmatterBlock = match[1]
  const body = match[2].trim()
  const frontmatter: Record<string, unknown> = {}

  for (const line of frontmatterBlock.split('\n')) {
    const separatorIndex = line.indexOf(':')
    if (separatorIndex === -1) continue

    const key = line.slice(0, separatorIndex).trim()
    const rawValue = line.slice(separatorIndex + 1).trim()
    const value =
      rawValue === 'null'
        ? null
        : rawValue.replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1')

    frontmatter[key] = value
  }

  return { slug, frontmatter, body }
}
