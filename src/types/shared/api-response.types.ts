export interface ApiResponse<T> {
  readonly data: T
  readonly success: boolean
}
