import { Container } from '@/components/ui/Container'
import { Skeleton } from '@/components/ui/Skeleton'

const SKELETON_CARD_COUNT = 3

export default function JournalLoading(): React.JSX.Element {
  return (
    <main className="py-16">
      <Container>
        <Skeleton className="mb-3 h-4 w-20" />
        <Skeleton className="mb-3 h-10 w-40" />
        <Skeleton className="mb-10 h-5 w-full max-w-2xl" />
        <div className="grid gap-4">
          {Array.from({ length: SKELETON_CARD_COUNT }, (_, index) => (
            <div key={index} className="space-y-3 border border-border p-6">
              <div className="flex items-center justify-between gap-4">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
            </div>
          ))}
        </div>
      </Container>
    </main>
  )
}
