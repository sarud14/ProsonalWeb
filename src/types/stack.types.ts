export interface StackTool {
  readonly name: string
  readonly note: string
}

export interface StackGroup {
  readonly label: string
  readonly tools: readonly StackTool[]
}

export interface StackPageData {
  readonly groups: readonly StackGroup[]
}
