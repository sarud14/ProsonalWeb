import type { ChipListProps } from './types'


export function ChipList({ items }: ChipListProps): React.JSX.Element {
  return (
    <span className="flex flex-wrap gap-[5px]">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full bg-primary/85 px-2 py-[3px] text-[11px] text-primary-foreground"
        >
          {item}
        </span>
      ))}
    </span>
  )
}
