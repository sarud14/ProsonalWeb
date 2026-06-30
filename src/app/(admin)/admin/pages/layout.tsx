import { PagesTabNav } from '@/components/admin-page/Pages/PagesTabNav'

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
