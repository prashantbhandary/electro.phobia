import { FiArrowLeft, FiClock, FiUser, FiCalendar } from 'react-icons/fi'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getBlogs, getBlogBySlug } from '@/lib/server-api'

// Rendered on the server so the full article is in the HTML crawlers receive
// (metadata comes from layout.tsx). Pages are pre-built for every published
// post and refreshed in the background; new posts render on first request.
export const revalidate = 300

export async function generateStaticParams() {
  const blogs = await getBlogs()
  return blogs.filter((b) => b.slug).map((b) => ({ slug: b.slug }))
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const blog = await getBlogBySlug(params.slug)
  if (!blog || blog.isPublished === false) notFound()

  const published = blog.publishedAt || blog.createdAt

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-20">
      <article className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {/* Back Button */}
          <Link
            href="/blogs"
            className="inline-flex items-center space-x-2 text-primary hover:text-primary-600 mb-8"
          >
            <FiArrowLeft />
            <span>Back to Blogs</span>
          </Link>

          {/* Article Header */}
          <header className="mb-12">
            <div className="mb-6">
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                {blog.category}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {blog.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <FiUser className="w-5 h-5" />
                <span>{blog.author}</span>
              </div>
              {published && (
                <div className="flex items-center space-x-2">
                  <FiCalendar className="w-5 h-5" />
                  <time dateTime={published}>
                    {new Date(published).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </time>
                </div>
              )}
              {blog.readTime && (
                <div className="flex items-center space-x-2">
                  <FiClock className="w-5 h-5" />
                  <span>{blog.readTime}</span>
                </div>
              )}
            </div>
          </header>

          {/* Featured Image */}
          {blog.imageUrl && (
            <div className="mb-12">
              <img
                src={blog.imageUrl}
                alt={blog.title}
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          )}

          {/* Article Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              {blog.excerpt}
            </p>

            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {blog.content}
            </ReactMarkdown>
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </div>
  )
}
