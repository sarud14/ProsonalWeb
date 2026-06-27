import { NavBar } from '@/components/ui/NavBar'
import { Footer } from '@/components/ui/Footer'
import { getNavItems } from '@/lib/content/site-config'

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>): Promise<React.JSX.Element> {
  const navItems = await getNavItems()

  return (
    <>
      <NavBar items={navItems} />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  )
}
