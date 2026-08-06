import { z } from 'zod'

export const submitContactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(255),
  message: z.string().min(1).max(5000),
  /** Honeypot — must stay empty for humans. */
  website: z.string().max(500).optional(),
})
