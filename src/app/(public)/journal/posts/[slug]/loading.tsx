import { Container } from '@/components/ui/Container'
import { Skeleton } from '@/components/ui/Skeleton'

export default function JournalPostLoading(): React.JSX.Element {
  return (
    <main className="py-16">
      <Container className="max-w-3xl">
        <header className="mb-10 space-y-3 border-b border-border pb-8">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-4 w-28" />
        </header>
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </Container>
    </main>
  )
}
