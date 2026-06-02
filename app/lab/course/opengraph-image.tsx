import { OG_SIZE, OG_CONTENT_TYPE, renderOgCard } from '@/lib/og'

export const runtime = 'nodejs'
export const alt = 'ElectroLab Course — 5-Day Electronics & Robotics Bootcamp'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default async function Image() {
  return renderOgCard({
    eyebrow: 'ElectroLab · Course',
    title: '5-Day Electronics & Robotics Bootcamp',
    subtitle: 'Hands-on, beginner-friendly, and 100% free',
  })
}
