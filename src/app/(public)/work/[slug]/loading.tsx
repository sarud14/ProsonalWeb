import { Container } from '@/components/ui/Container'
import { Skeleton } from '@/components/ui/Skeleton'

const SKELETON_CARD_COUNT = 3

export default function WorkDetailLoading(): React.JSX.Element {
  return (
    <main className="py-16">
      <Container className="max-w-3xl">
        <div className="mb-10 space-y-3 border-b border-border pb-8">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-3/4" />
        </div>
        <div className="flex flex-col gap-10">
          {Array.from({ length: SKELETON_CARD_COUNT }, (_, index) => (
            <div key={index} className="space-y-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          ))}
        </div>
      </Container>
    </main>
  )
}
