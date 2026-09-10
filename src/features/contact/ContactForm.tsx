'use client'

import { useState, useTransition } from 'react'

import { submitContact } from '@/actions/contact.actions'
import {
  CONTACT_DEFAULT_SUCCESS_MESSAGE,
  CONTACT_HONEYPOT_FIELD,
} from '@/constants/contact'
import type { ContactFormProps } from '@/types/contact.types'

const fieldClassName =
  'w-full border border-border bg-transparent px-3 py-2.5 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary'

const labelClassName =
  'font-mono text-[10.5px] tracking-[0.14em] text-muted-foreground uppercase'

export function ContactForm({
  successMessage = CONTACT_DEFAULT_SUCCESS_MESSAGE,
}: ContactFormProps): React.JSX.Element {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [website, setWebsite] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    setError(null)

    startTransition(async () => {
      const result = await submitContact({
        name,
        email,
        message,
        [CONTACT_HONEYPOT_FIELD]: website,
      })

      if (!result.success) {
        setError(result.error)
        return
      }

      setIsSuccess(true)
      setName('')
      setEmail('')
      setMessage('')
      setWebsite('')
    })
  }

  if (isSuccess) {
    return (
      <p
        className="border border-border px-5 py-6 text-base leading-relaxed text-foreground"
        role="status"
      >
        {successMessage}
      </p>
    )
  }

  return (
    <form
      className="relative flex flex-col gap-5"
      onSubmit={handleSubmit}
      noValidate
    >
      <div
        className="absolute -left-[9999px] h-px w-px overflow-hidden"
        aria-hidden="true"
      >
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
          name={CONTACT_HONEYPOT_FIELD}
          type="text"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <label className="flex flex-col gap-2">
        <span className={labelClassName}>Name</span>
        <input
          type="text"
          name="name"
          required
          maxLength={100}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={fieldClassName}
          disabled={isPending}
          autoComplete="name"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className={labelClassName}>Email</span>
        <input
          type="email"
          name="email"
          required
          maxLength={255}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={fieldClassName}
          disabled={isPending}
          autoComplete="email"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className={labelClassName}>Message</span>
        <textarea
          name="message"
          required
          maxLength={5000}
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={`${fieldClassName} min-h-[140px] resize-y leading-relaxed`}
          disabled={isPending}
        />
      </label>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="cursor-pointer self-start bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
      >
        {isPending ? 'Sending…' : 'Send message'}
      </button>
    </form>
  )
}
