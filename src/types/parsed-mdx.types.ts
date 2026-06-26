export interface ParsedMdxFile {
  readonly slug: string
  readonly frontmatter: Record<string, unknown>
  readonly body: string
}
