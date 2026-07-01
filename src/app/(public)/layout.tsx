import { NavBar } from '@/components/ui/NavBar'
import { Footer } from '@/components/ui/Footer'
import { getNavItems, getSiteBrand } from '@/lib/content/site-config'

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>): Promise<React.JSX.Element> {
  const [navItems, brand] = await Promise.all([getNavItems(), getSiteBrand()])

  return (
    <>
      <NavBar items={navItems} brand={brand} />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  )
}
