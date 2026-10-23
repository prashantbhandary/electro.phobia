// Server-side data fetching for public pages.
//
// Public content (blogs, projects) must be in the initial HTML so crawlers —
// Googlebot and the AdSense reviewer — see the actual article, not a loading
// spinner. Pages call these from server components; the client components can
// still refetch / listen on the socket for live updates afterwards.

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend-j3mf.onrender.com/api'

// Re-fetch from the backend at most every 5 minutes; between revalidations the
// cached page is served even if the Render backend is asleep.
const REVALIDATE = 300

export class NotFoundError extends Error {}

async function getData(path: string) {
  const res = await fetch(`${API_URL}${path}`, { next: { revalidate: REVALIDATE } })
  if (res.status === 404) throw new NotFoundError(path)
  if (!res.ok) throw new Error(`Backend ${res.status} for ${path}`)
  const json = await res.json()
  return json?.data ?? null
}

// Lists degrade to [] so the page still renders (the client refetches on mount).
async function getList(path: string): Promise<any[]> {
  try {
    const data = await getData(path)
    return Array.isArray(data) ? data.filter((item: any) => item?.isPublished !== false) : []
  } catch {
    return []
  }
}

export const getBlogs = () => getList('/blogs')
export const getProjects = () => getList('/projects')

// Returns null only when the backend says the item doesn't exist; other
// failures throw so Next keeps serving the last good cached page.
async function getOne(path: string) {
  try {
    return await getData(path)
  } catch (err) {
    if (err instanceof NotFoundError) return null
    throw err
  }
}

export const getBlogBySlug = (slug: string) => getOne(`/blogs/slug/${encodeURIComponent(slug)}`)
export const getProjectById = (id: string) => getOne(`/projects/${encodeURIComponent(id)}`)
