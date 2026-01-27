import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import LayoutWrapper from '@/components/LayoutWrapper'
import { SpeedInsights } from '@vercel/speed-insights/next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ElectroPhobia - Electronics Mentorship & Community',
  description: 'Join ElectroPhobia for expert electronics mentorship, workshops, and project showcases. Learn hardware, embedded systems, and more from experienced mentors.',
  keywords: 'electronics, mentorship, workshops, embedded systems, hardware, Arduino, IoT, projects',
  icons: {
    icon: [
      { url: '/favicon/web-app-manifest-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon/web-app-manifest-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/favicon/web-app-manifest-192x192.png',
  },
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
        <SpeedInsights />
      </body>
    </html>
  )
}
