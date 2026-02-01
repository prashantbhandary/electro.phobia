import { Metadata } from 'next'
import { generateProductMetadata } from '@/lib/metadata'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  return await generateProductMetadata(id)
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
