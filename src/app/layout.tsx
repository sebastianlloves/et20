import type { Metadata } from 'next'
import { /* Inter,  */ Open_Sans as OpenSans } from 'next/font/google'
import '../styles/globals.css'
import React from 'react'
import { cn } from '@/lib/utils'
import ThemeProvider from '@/components/theme-provider'
import ModeToggle from '@/components/mode-toggle'

// const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const openSans = OpenSans({ subsets: ['latin'], variable: '--font-openSans' })

export const metadata: Metadata = {
  title: 'ET N°20 - Carolina Muzilli',
  description:
    'Aplicación web para análisis académico de la Escuela Técnica n° 20 "Carolina Muzilli"',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html suppressHydrationWarning lang="en">
      <body
        className={cn(
          /* inter.className,  */ openSans.className,
          'min-h-screen bg-background-main font-openSans antialiased',
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <header className="flex justify-end pb-0 p-1 lg:p-2">
            <ModeToggle />
          </header>
          <main>
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
