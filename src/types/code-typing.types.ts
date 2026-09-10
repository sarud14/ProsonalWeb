export interface CodeToken {
  readonly text: string
  readonly className: string
}

export type CodeLine = readonly CodeToken[]

export interface CodeTypingQueryResult {
  readonly visibleLines: readonly string[]
  readonly isDone: boolean
}
