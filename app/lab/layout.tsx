import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ElectroLab — Free Interactive Electronics & Robotics Course',
  description:
    'Learn electronics and robotics free: a structured 5-day bootcamp, animated circuit demos, hands-on missions, a PCB-design track, and tools like a resistor color-code decoder, Ohm’s Law and LED resistor calculators. No hardware needed.',
  keywords: [
    'learn electronics free', 'electronics course', 'robotics tutorial', 'Arduino tutorial',
    'ESP32 course', 'circuit simulator', 'resistor color code calculator', 'Ohms law calculator',
    'LED resistor calculator', 'voltage divider calculator', 'PCB design KiCad', 'embedded systems course',
    'logic gates transistor', 'line follower robot',
  ],
  alternates: { canonical: 'https://electrophobia.tech/lab' },
  openGraph: {
    title: 'ElectroLab — Free Interactive Electronics & Robotics Course',
    description:
      'A 5-day electronics & robotics bootcamp, animated demos, hands-on missions, PCB design, and free calculators — all in your browser.',
    url: 'https://electrophobia.tech/lab',
    siteName: 'ElectroPhobia',
    type: 'website',
    // og:image comes from app/lab/opengraph-image.tsx (branded ElectroLab card).
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ElectroLab — Free Electronics & Robotics Course',
    description: 'Learn electronics free: bootcamp, animated demos, missions, PCB design & calculators.',
  },
}

export default function LabLayout({ children }: { children: React.ReactNode }) {
  // Lab pages are full-screen (no site header/footer)
  return <>{children}</>
}
