import './globals.css'

import { Suspense } from 'react'

import type { Metadata } from 'next'
import { Poppins, Geist_Mono } from 'next/font/google'

import { LoadingScreen } from '@/components/ui/LoadingScreen'
import { buildThemeCssVars, shouldApplyCustomTheme } from '@/lib/admin/site-theme'
import { getSiteSeo, getSiteTheme } from '@/lib/content/site-config'
import { AppProvider } from '@/providers/AppProvider'

const poppins = Poppins({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSiteSeo()

  return {
    title: {
      default: seo.title,
      template: `%s — ${seo.title}`,
    },
    description: seo.description,
    openGraph: seo.ogImageUrl
      ? {
          title: seo.title,
          description: seo.description,
          images: [{ url: seo.ogImageUrl }],
        }
      : undefined,
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>): Promise<React.JSX.Element> {
  const theme = await getSiteTheme()
  const themeStyle = shouldApplyCustomTheme(theme) ? buildThemeCssVars(theme) : undefined

  return (
    <html
      lang="en"
      className={`${poppins.variable} ${geistMono.variable} dark`}
      style={themeStyle}
    >
      <body className="min-h-dvh flex flex-col antialiased">
        <AppProvider>
          <Suspense fallback={<LoadingScreen />}>{children}</Suspense>
        </AppProvider>
      </body>
    </html>
  )
}
