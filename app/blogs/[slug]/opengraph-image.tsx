import { OG_SIZE, OG_CONTENT_TYPE, renderOgCard, isUsableSocialImage } from '@/lib/og'

export const runtime = 'nodejs'
export const alt = 'ElectroPhobia Blog'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

const getApiUrl = () => process.env.NEXT_PUBLIC_API_URL || 'https://backend-j3mf.onrender.com/api'

export default async function Image({ params }: { params: { slug: string } }) {
  try {
    const res = await fetch(`${getApiUrl()}/blogs/slug/${params.slug}`, { cache: 'no-store' })
    if (!res.ok) throw new Error('not found')
    const blog = (await res.json())?.data
    if (!blog) throw new Error('no data')

    // Resolve a backend-relative image to an absolute URL.
    let imageUrl: string | undefined = blog.imageUrl
    if (imageUrl && !imageUrl.startsWith('http')) {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || ''
      imageUrl = `${backendUrl}${imageUrl}`
    }

    const excerpt: string | undefined = blog.excerpt || blog.content?.replace(/<[^>]+>/g, '').slice(0, 120)

    return renderOgCard({
      eyebrow: 'ElectroPhobia · Blog',
      title: blog.title,
      subtitle: excerpt,
      bgImage: isUsableSocialImage(imageUrl) ? imageUrl : undefined,
    })
  } catch {
    return renderOgCard({
      eyebrow: 'ElectroPhobia · Blog',
      title: 'Electronics tutorials & insights',
    })
  }
}
