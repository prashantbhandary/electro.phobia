import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ElectroLab — Interactive Circuit Simulator',
  description: 'Build and simulate electronic circuits in your browser. Learn Arduino, components, and embedded systems through interactive visual experiments.',
}

export default function LabLayout({ children }: { children: React.ReactNode }) {
  // Lab pages are full-screen (no site header/footer)
  return <>{children}</>
}
