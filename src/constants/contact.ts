/** Hidden field name — bots fill it; humans never see it. */
export const CONTACT_HONEYPOT_FIELD = 'website' as const

/** Returned as success `id` when honeypot trips — not a real ContactMessage id. */
export const CONTACT_HONEYPOT_FAKE_ID = 'ok' as const

export const CONTACT_RATE_LIMIT_ERROR =
  'Too many messages. Try again later.' as const

/** Per hashed IP — rolling window. */
export const CONTACT_RATE_LIMIT_IP_MAX = 5
export const CONTACT_RATE_LIMIT_IP_WINDOW_MS = 60 * 60 * 1000

/** Per email (lowercased) — rolling window. */
export const CONTACT_RATE_LIMIT_EMAIL_MAX = 3
export const CONTACT_RATE_LIMIT_EMAIL_WINDOW_MS = 60 * 60 * 1000

/** Site-wide flood cap — rolling window. */
export const CONTACT_RATE_LIMIT_GLOBAL_MAX = 30
export const CONTACT_RATE_LIMIT_GLOBAL_WINDOW_MS = 10 * 60 * 1000

export const CONTACT_DEFAULT_SUCCESS_MESSAGE =
  'Thanks — your message was sent.' as const

export const CONTACT_DEFAULT_HEADLINE = 'Get in touch' as const

export const CONTACT_DEFAULT_BODY =
  'Send a note about a project, collaboration, or question. I read every message.' as const
