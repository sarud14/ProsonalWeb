export function omitClientId<T extends { readonly clientId: string }>(
  item: T
): Omit<T, 'clientId'> {
  return Object.fromEntries(
    Object.entries(item).filter(([key]) => key !== 'clientId')
  ) as Omit<T, 'clientId'>
}

export function omitClientIds<T extends { readonly clientId: string }>(
  items: readonly T[]
): Array<Omit<T, 'clientId'>> {
  return items.map((item) => omitClientId(item))
}

export function moveItemByClientId<T extends { readonly clientId: string }>(
  items: readonly T[],
  id: string,
  direction: 'up' | 'down'
): T[] | null {
  const index = items.findIndex((item) => item.clientId === id)
  if (index < 0) return null

  const swapIndex = direction === 'up' ? index - 1 : index + 1
  if (swapIndex < 0 || swapIndex >= items.length) return null

  const next = [...items]
  ;[next[index], next[swapIndex]] = [next[swapIndex], next[index]]
  return next
}
