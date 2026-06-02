import type { Metadata } from 'next'
import { MODULE_MAP, MODULES } from '@/lib/lab/curriculum-data'

export function generateStaticParams() {
  return MODULES.map((m) => ({ day: m.id }))
}

export async function generateMetadata({ params }: { params: { day: string } }): Promise<Metadata> {
  const m = MODULE_MAP[params.day]
  if (!m) {
    return { title: 'Course — ElectroLab' }
  }
  const label = m.day ? `Day ${m.day}: ${m.title}` : m.title
  const url = `https://electrophobia.tech/lab/course/${m.id}`
  const title = `${label} — Free Electronics & Robotics Course`
  const description = m.summary

  return {
    title,
    description,
    keywords: [...m.topics, 'electronics course', 'robotics tutorial', 'Arduino', 'ESP32', 'learn electronics free'],
    alternates: { canonical: url },
    // og:image / twitter:image come from opengraph-image.tsx in this segment,
    // which renders a per-day branded card.
    openGraph: {
      title: `${label} | ElectroLab`,
      description,
      url,
      type: 'article',
      siteName: 'ElectroPhobia',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${label} | ElectroLab`,
      description,
    },
  }
}

export default function CourseDayLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
