import { OG_SIZE, OG_CONTENT_TYPE, renderOgCard } from '@/lib/og'

export const runtime = 'nodejs'
export const alt = 'ElectroLab — Free Interactive Electronics & Robotics Course'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default async function Image() {
  return renderOgCard({
    eyebrow: 'ElectroLab',
    title: 'Free Electronics & Robotics Course',
    subtitle: 'Bootcamp · Animated demos · Missions · PCB design · Calculators',
  })
}
