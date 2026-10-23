import type { Metadata } from 'next'
import { getBlogs } from '@/lib/server-api'
import BlogsList from './BlogsList'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Electronics Blog — PCB Design, Fabrication & Embedded Tutorials',
  description: 'Hands-on write-ups from ElectroPhobia workshops: KiCad PCB design, in-house PCB fabrication, embedded systems and electronics projects.',
}

export default async function BlogsPage() {
  const blogs = await getBlogs()
  return <BlogsList initialBlogs={blogs} />
}
