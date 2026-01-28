import { Metadata } from 'next'
import { generateBlogMetadata } from '@/lib/metadata'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  return await generateBlogMetadata(params.slug)
}

// Export the page component from the main file
export { default } from './page'
