export type ActionResult<T = null> =
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly error: string }
