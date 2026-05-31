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
    openGraph: {
      title: `${label} | ElectroLab`,
      description,
      url,
      type: 'article',
      siteName: 'ElectroPhobia',
      images: ['/img/Logo.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${label} | ElectroLab`,
      description,
      images: ['/img/Logo.png'],
    },
  }
}

export default function CourseDayLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
