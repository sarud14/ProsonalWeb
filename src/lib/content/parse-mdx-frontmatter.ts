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
    frontmatter[key] = parseFrontmatterValue(rawValue)
  }

  return { slug, frontmatter, body }
}

function parseFrontmatterValue(rawValue: string): unknown {
  if (rawValue === 'null') return null
  if (rawValue === 'true') return true
  if (rawValue === 'false') return false

  if (rawValue.startsWith('[') || rawValue.startsWith('{')) {
    try {
      return JSON.parse(rawValue) as unknown
    } catch {
      return rawValue
    }
  }

  const quotedMatch = rawValue.match(/^"(.*)"$/) ?? rawValue.match(/^'(.*)'$/)
  if (quotedMatch) return quotedMatch[1]

  return rawValue
}
