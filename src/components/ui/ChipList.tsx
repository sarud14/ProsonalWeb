interface ChipListProps {
  readonly items: readonly string[]
}

export function ChipList({ items }: ChipListProps): React.JSX.Element {
  return (
    <span className="flex flex-wrap gap-[5px]">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full bg-muted px-2 py-[3px] text-[11px] text-muted-foreground"
        >
          {item}
        </span>
      ))}
    </span>
  )
}
