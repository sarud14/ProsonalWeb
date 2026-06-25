import './globals.css'

import { Suspense } from 'react'

import type { Metadata } from 'next'
import { Poppins, Geist_Mono } from 'next/font/google'

import { LoadingScreen } from '@/components/ui/LoadingScreen'
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

export const metadata: Metadata = {
  title: 'FEOps Kit',
  description: 'A reusable Next.js-based frontend engineering portfolio system',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>): React.JSX.Element {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${geistMono.variable} dark`}
    >
      <body className="min-h-dvh flex flex-col antialiased">
        <AppProvider>
          <Suspense fallback={<LoadingScreen />}>{children}</Suspense>
        </AppProvider>
      </body>
    </html>
  )
}
