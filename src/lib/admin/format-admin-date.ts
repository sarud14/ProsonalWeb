export function formatAdminDate(date: Date | null | undefined): string {
  if (!date) return '—'
  return date.toISOString().slice(0, 10)
}
