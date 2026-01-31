'use client'

import { useState, useEffect } from 'react'
import { FiArrowLeft, FiClock, FiUser, FiCalendar } from 'react-icons/fi'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { blogAPI } from '@/lib/api'
import LoadingSpinner from '@/components/LoadingSpinner'
import DynamicMeta from '@/components/DynamicMeta'

// Note: Metadata is generated on the server side via metadata.ts
// This component focuses on client-side rendering

export default function BlogPost() {
  const params = useParams()
  const [blog, setBlog] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true)
        const slug = params.slug as string
        const data = await blogAPI.getBySlug(slug)
        setBlog(data)
      } catch (err: any) {
        setError(err.message || 'Failed to load blog post')
      } finally {
        setLoading(false)
      }
    }

    if (params.slug) {
      fetchBlog()
    }
  }, [params.slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 pt-20 flex items-center justify-center">
        <LoadingSpinner message="Loading blog" size="lg" />
      </div>
    )
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-12">
          <Link 
            href="/blogs"
            className="inline-flex items-center space-x-2 text-primary hover:text-primary-600 mb-8"
          >
            <FiArrowLeft />
            <span>Back to Blogs</span>
          </Link>
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Blog Post Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400">{error || 'The blog post you are looking for does not exist.'}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-20">
      {blog && (
        <DynamicMeta
          title={blog.title}
          description={blog.excerpt || blog.content?.substring(0, 160) || ''}
          image={blog.imageUrl}
          type="article"
          publishedTime={blog.createdAt}
        />
      )}
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
              <div className="flex items-center space-x-2">
                <FiCalendar className="w-5 h-5" />
                <span>{new Date(blog.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              {blog.readTime && (
                <div className="flex items-center space-x-2">
                  <FiClock className="w-5 h-5" />
                  <span>{blog.readTime}</span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <FiClock className="w-5 h-5" />
                <span>{blog.views} views</span>
              </div>
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
