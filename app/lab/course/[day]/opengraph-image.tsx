import { OG_SIZE, OG_CONTENT_TYPE, renderOgCard } from '@/lib/og'
import { MODULE_MAP, MODULES } from '@/lib/lab/curriculum-data'

export const runtime = 'nodejs'
export const alt = 'ElectroLab Course Day — ElectroPhobia'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export function generateStaticParams() {
  return MODULES.map((m) => ({ day: m.id }))
}

export default async function Image({ params }: { params: { day: string } }) {
  const m = MODULE_MAP[params.day]
  if (!m) {
    return renderOgCard({
      eyebrow: 'ElectroLab · Course',
      title: 'Free Electronics & Robotics Course',
    })
  }
  return renderOgCard({
    eyebrow: m.day ? `ElectroLab · Day ${m.day}` : 'ElectroLab · Course',
    title: m.title,
    subtitle: m.summary,
  })
}
