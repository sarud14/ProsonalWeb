'use client'

import { useCallback, useRef } from 'react'

interface TagInputProps {
  readonly tags: readonly string[]
  readonly onChange: (tags: readonly string[]) => void
  readonly placeholder?: string
}

export function TagInput({
  tags,
  onChange,
  placeholder = 'Type and press Enter…',
}: TagInputProps): React.JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== 'Enter') return
      e.preventDefault()
      const value = e.currentTarget.value.trim()
      if (value && !tags.includes(value)) {
        onChange([...tags, value])
      }
      e.currentTarget.value = ''
    },
    [tags, onChange]
  )

  const handleRemove = useCallback(
    (tag: string) => {
      onChange(tags.filter((t) => t !== tag))
    },
    [tags, onChange]
  )

  return (
    <div
      className="flex min-h-[42px] flex-wrap items-center gap-1.5 rounded-lg border border-border bg-[oklch(0.13_0.008_255)] p-2"
      onClick={() => inputRef.current?.focus()}
    >
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-2.5 py-1 text-xs text-primary-foreground"
        >
          {tag}
          <button
            type="button"
            onClick={() => handleRemove(tag)}
            className="cursor-pointer border-none bg-transparent p-0 text-sm leading-none text-primary-foreground/60"
          >
            ×
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        onKeyDown={handleKeyDown}
        placeholder={tags.length === 0 ? placeholder : ''}
        className="min-w-[120px] flex-1 border-none bg-transparent p-1 text-[13px] text-foreground outline-none placeholder:text-muted-foreground"
      />
    </div>
  )
}
