export function LoadingScreen(): React.JSX.Element {
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="size-6 animate-spin rounded-full border-2 border-muted-foreground border-t-primary" />
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Loading</p>
      </div>
    </div>
  )
}
