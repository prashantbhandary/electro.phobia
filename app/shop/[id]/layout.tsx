import { Metadata } from 'next'
import { generateProductMetadata } from '@/lib/metadata'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  return await generateProductMetadata(params.id)
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
