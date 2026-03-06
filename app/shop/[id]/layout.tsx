import { Metadata } from 'next'
import { generateProductMetadata } from '@/lib/metadata'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  try {
    const { id } = await params
    return await generateProductMetadata(id)
  } catch (error) {
    console.error('Error in product layout generateMetadata:', error)
    return {
      title: 'Product | ElectroPhobia',
      description: 'Shop our electronics products',
    }
  }
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
