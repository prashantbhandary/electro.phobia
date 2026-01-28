import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import LayoutWrapper from '@/components/LayoutWrapper'
import { organizationSchema, websiteSchema } from './schema'
import { SpeedInsights } from '@vercel/speed-insights/next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'ElectroPhobia - Electronics Mentorship, Projects & Community',
    template: '%s | ElectroPhobia'
  },
  description: 'ElectroPhobia: Your gateway to electronics expertise. Join our community for mentorship, innovative projects, workshops, and learn embedded systems, Arduino, IoT, and hardware development from experienced professionals.',
  keywords: [
    'electrophobia',
    'electronics',
    'mentorship',
    'electronics projects',
    'embedded systems',
    'hardware development',
    'Arduino',
    'IoT',
    'electronics workshops',
    'electronics community',
    'electronics tutorials',
    'circuit design',
    'PCB design',
    'microcontrollers',
    'electronics blog',
    'tech community'
  ],
  authors: [{ name: 'Prashant Bhandari', url: 'https://electrophobia.tech' }],
  creator: 'Prashant Bhandari',
  publisher: 'ElectroPhobia',
  metadataBase: new URL('https://electrophobia.tech'),
  alternates: {
    canonical: 'https://electrophobia.tech',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://electrophobia.tech',
    title: 'ElectroPhobia - Electronics Mentorship, Projects & Community',
    description: 'Join ElectroPhobia for expert electronics mentorship, innovative projects, workshops, and learn embedded systems, Arduino, IoT from experienced professionals.',
    siteName: 'ElectroPhobia',
    images: [
      {
        url: '/img/Logo.png',
        width: 1200,
        height: 630,
        alt: 'ElectroPhobia - Electronics Mentorship & Community',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ElectroPhobia - Electronics Mentorship & Community',
    description: 'Join ElectroPhobia for expert electronics mentorship, innovative projects, and workshops. Learn embedded systems, Arduino, IoT from professionals.',
    images: ['/img/Logo.png'],
    creator: '@electrophobia',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Add your Google Search Console verification code
  },
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className={inter.className}>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  )
}
