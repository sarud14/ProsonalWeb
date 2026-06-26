export interface CodeToken {
  readonly text: string
  readonly className: string
}

export type CodeLine = readonly CodeToken[]
