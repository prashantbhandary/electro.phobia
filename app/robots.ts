import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://electrophobia.tech'
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Keep the admin panel and any auth endpoints out of search results
        disallow: ['/admin', '/admin/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
