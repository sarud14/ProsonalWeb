import { CONTACT_HONEYPOT_FIELD } from '@/constants/contact'
import type { ContactSubmitFields, ContactSubmitInput } from '@/types/contact.types'

export function buildContactSubmitInput(fields: ContactSubmitFields): ContactSubmitInput {
  return {
    name: fields.name,
    email: fields.email,
    message: fields.message,
    [CONTACT_HONEYPOT_FIELD]: fields.website,
  }
}
