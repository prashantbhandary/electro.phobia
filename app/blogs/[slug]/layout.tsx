import { Metadata } from 'next'
import { generateBlogMetadata } from '@/lib/metadata'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  return await generateBlogMetadata(params.slug)
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
