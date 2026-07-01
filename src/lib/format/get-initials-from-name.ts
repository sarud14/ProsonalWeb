/** First letter of the first two name parts, or first two letters of a single word. */
export function getInitialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter((part) => part.length > 0)

  if (parts.length === 0) return '??'

  if (parts.length === 1) {
    const word = parts[0]
    return word.slice(0, 2).toUpperCase()
  }

  const first = parts[0]?.[0] ?? ''
  const second = parts[1]?.[0] ?? ''
  const initials = `${first}${second}`.toUpperCase()

  return initials.length > 0 ? initials : '??'
}
