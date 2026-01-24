import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import LayoutWrapper from '@/components/LayoutWrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ElectroPhobia - Electronics Mentorship & Community',
  description: 'Join ElectroPhobia for expert electronics mentorship, workshops, and project showcases. Learn hardware, embedded systems, and more from experienced mentors.',
  keywords: 'electronics, mentorship, workshops, embedded systems, hardware, Arduino, IoT, projects',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  )
}
