import { NavBar } from '@/components/ui/NavBar'
import { Footer } from '@/components/ui/Footer'

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>): React.JSX.Element {
  return (
    <>
      <NavBar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  )
}
