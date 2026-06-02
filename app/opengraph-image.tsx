import { OG_SIZE, OG_CONTENT_TYPE, renderOgCard } from '@/lib/og'

export const runtime = 'nodejs'
export const alt = 'ElectroPhobia — Electronics Mentorship, Projects & Community'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default async function Image() {
  return renderOgCard({
    eyebrow: 'Electronics Mentorship',
    title: 'ElectroPhobia',
    subtitle: 'Mentorship · Projects · Workshops · Arduino, IoT & Embedded Systems',
  })
}
