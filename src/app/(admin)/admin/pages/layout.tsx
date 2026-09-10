import { PagesTabNav } from '@/features/admin-pages/PagesTabNav'

export default function AdminPagesLayout({
  children,
}: {
  readonly children: React.ReactNode
}): React.JSX.Element {
  return (
    <div>
      <PagesTabNav />
      {children}
    </div>
  )
}
