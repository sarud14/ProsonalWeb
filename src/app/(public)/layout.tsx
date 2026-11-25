import { NavBar } from '@/components/ui'
import { Footer } from '@/components/ui/server'
import { getNavItems, getSiteBrand } from '@/lib/content/site-config'

// Public pages are prerendered at build. Without a revalidate window, content
// written outside the CMS (scripts, direct DB edits) stays stale until the next
// deploy. Re-render at most once an hour; CMS actions still revalidate instantly.
// Next.js requires a literal here, so this cannot come from a constant.
export const revalidate = 3600

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
