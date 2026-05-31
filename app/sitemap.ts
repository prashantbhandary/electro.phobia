import { MetadataRoute } from 'next'
import { MODULES } from '@/lib/lab/curriculum-data'

const baseUrl = 'https://electrophobia.tech'
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend-j3mf.onrender.com/api'

// Re-generate at most once per hour so new blogs/projects get indexed.
export const revalidate = 3600

type Entry = MetadataRoute.Sitemap[number]

async function fetchList(path: string): Promise<any[]> {
  try {
    const res = await fetch(`${API_URL}${path}`, { next: { revalidate: 3600 } })
    if (!res.ok) return []
    const json = await res.json()
    return Array.isArray(json?.data) ? json.data : []
  } catch {
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticRoutes: Entry[] = [
    { url: baseUrl, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/projects`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/blogs`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/shop`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    // Lab — the interactive learning hub (strong, original content for ranking)
    { url: `${baseUrl}/lab`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/lab/course`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/lab/demos`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/lab/missions`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/lab/tools`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/lab/tools/resistor`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/lab/tools/ohms-law`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/lab/tools/led-calc`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/lab/tools/voltage-divider`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/lab/sandbox`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ]

  // Every course module (5 days + KiCad track)
  const courseRoutes: Entry[] = MODULES.map((m) => ({
    url: `${baseUrl}/lab/course/${m.id}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  // Dynamic content from the backend
  const [blogs, projects] = await Promise.all([
    fetchList('/blogs'),
    fetchList('/projects'),
  ])

  const blogRoutes: Entry[] = blogs
    .filter((b) => b?.isPublished !== false && (b?.slug || b?._id))
    .map((b) => ({
      url: `${baseUrl}/blogs/${b.slug ?? b._id}`,
      lastModified: b?.updatedAt ? new Date(b.updatedAt) : now,
      changeFrequency: 'weekly',
      priority: 0.7,
    }))

  const projectRoutes: Entry[] = projects
    .filter((p) => p?.isPublished !== false && p?._id)
    .map((p) => ({
      url: `${baseUrl}/projects/${p._id}`,
      lastModified: p?.updatedAt ? new Date(p.updatedAt) : now,
      changeFrequency: 'monthly',
      priority: 0.6,
    }))

  return [...staticRoutes, ...courseRoutes, ...blogRoutes, ...projectRoutes]
}
