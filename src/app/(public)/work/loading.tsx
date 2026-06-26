import { Container } from '@/components/ui/Container'
import { Skeleton } from '@/components/ui/Skeleton'

const SKELETON_CARD_COUNT = 3

export default function WorkLoading(): React.JSX.Element {
  return (
    <main className="py-16">
      <Container>
        <Skeleton className="mb-3 h-4 w-24" />
        <Skeleton className="mb-3 h-10 w-48" />
        <Skeleton className="mb-10 h-5 w-full max-w-2xl" />
        <div className="grid gap-4">
          {Array.from({ length: SKELETON_CARD_COUNT }, (_, index) => (
            <div key={index} className="space-y-3 border border-border p-6">
              <div className="flex items-center justify-between gap-4">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-5 w-20" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ))}
        </div>
      </Container>
    </main>
  )
}
