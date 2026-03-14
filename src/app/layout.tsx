import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/navbar'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Routine - Habit Challenge Tracker',
  description: 'Track your daily habits and challenges to build a better routine.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background antialiased selection:bg-primary/30`}>
        <Navbar />
        <main className="flex min-h-[calc(100vh-3.5rem)] flex-col">
          {children}
        </main>
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  )
}
