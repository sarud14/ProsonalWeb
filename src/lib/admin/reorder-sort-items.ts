interface SortableItem {
  readonly id: string
  readonly sortOrder: number
}

export function getReorderedPair<T extends SortableItem>(
  items: readonly T[],
  id: string,
  direction: 'up' | 'down'
): readonly [T, T] | null {
  const index = items.findIndex((item) => item.id === id)
  if (index < 0) return null

  const swapIndex = direction === 'up' ? index - 1 : index + 1
  if (swapIndex < 0 || swapIndex >= items.length) return null

  const current = items[index]
  const adjacent = items[swapIndex]
  if (!current || !adjacent) return null

  return [current, adjacent]
}
