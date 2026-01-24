'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiSearch, FiCalendar, FiClock, FiUser, FiArrowRight } from 'react-icons/fi'
import { blogAPI } from '@/lib/api'
import Link from 'next/link'
import { initSocket, disconnectSocket } from '@/lib/socket'

export default function BlogsPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [blogs, setBlogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBlogs()

    // Initialize WebSocket
    const socket = initSocket()

    // Listen for real-time blog updates
    socket.on('blog:created', handleBlogUpdate)
    socket.on('blog:updated', handleBlogUpdate)
    socket.on('blog:deleted', () => fetchBlogs())

    return () => {
      socket.off('blog:created', handleBlogUpdate)
      socket.off('blog:updated', handleBlogUpdate)
      socket.off('blog:deleted')
      disconnectSocket()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleBlogUpdate = () => {
    fetchBlogs()
  }

  const fetchBlogs = async () => {
    try {
      const data = await blogAPI.getAll()
      setBlogs(Array.isArray(data) ? data.filter((blog: any) => blog.isPublished) : [])
    } catch (error) {
      console.error('Error fetching blogs:', error)
      setBlogs([])
    } finally {
      setLoading(false)
    }
  }

  const categories = ['All', ...Array.from(new Set(blogs.map(b => b.category)))]

  const gradients = [
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-yellow-500 to-orange-500',
    'from-green-500 to-teal-500',
    'from-red-500 to-pink-500',
    'from-indigo-500 to-purple-500',
    'from-cyan-500 to-blue-500',
    'from-orange-500 to-red-500',
  ]

  const filteredBlogs = blogs.filter(blog => {
    const matchesCategory = activeCategory === 'All' || blog.category === activeCategory
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         blog.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         blog.content?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const featuredBlog = blogs.find(blog => blog.isFeatured)

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 pt-20 flex items-center justify-center">
        <div className="text-2xl text-gray-600 dark:text-gray-400">Loading blogs...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/5 dark:to-transparent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Electronics <span className="text-primary">Blog</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Latest insights, tutorials, and news from the world of electronics
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-primary focus:outline-none text-gray-900 dark:text-white"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-white dark:bg-gray-900 sticky top-20 z-40 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
                  activeCategory === category
                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Blog */}
      {featuredBlog && activeCategory === 'All' && !searchQuery && (
        <section className="py-12 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Featured Post</h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
            >
              <div className="grid md:grid-cols-2 gap-0">
                <div className={`h-64 md:h-full bg-gradient-to-br ${gradients[0]} flex items-center justify-center`}>
                  {featuredBlog.imageUrl ? (
                    <img 
                      src={featuredBlog.imageUrl} 
                      alt={featuredBlog.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-white text-6xl font-bold opacity-20">FEATURED</div>
                  )}
                </div>
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                      {featuredBlog.category}
                    </span>
                    <span className="px-3 py-1 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 rounded-full text-sm font-semibold">
                      Featured
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    {featuredBlog.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
                    {featuredBlog.excerpt}
                  </p>
                  <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400 mb-6">
                    <div className="flex items-center space-x-2">
                      <FiUser className="w-4 h-4" />
                      <span>{featuredBlog.author}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FiCalendar className="w-4 h-4" />
                      <span>{new Date(featuredBlog.createdAt).toLocaleDateString()}</span>
                    </div>
                    {featuredBlog.readTime && (
                      <div className="flex items-center space-x-2">
                        <FiClock className="w-4 h-4" />
                        <span>{featuredBlog.readTime}</span>
                      </div>
                    )}
                  </div>
                  <Link 
                    href={`/blogs/${featuredBlog.slug || featuredBlog._id}`}
                    className="inline-flex items-center space-x-2 text-primary font-semibold hover:gap-3 transition-all"
                  >
                    <span>Read More</span>
                    <FiArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Blog Grid */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            {searchQuery ? `Search Results (${filteredBlogs.length})` : 'All Posts'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog, index) => (
              <motion.article
                key={blog._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 group"
              >
                {/* Blog Image */}
                <div className={`h-48 bg-gradient-to-br ${gradients[index % gradients.length]} flex items-center justify-center relative overflow-hidden`}>
                  {blog.imageUrl ? (
                    <img 
                      src={blog.imageUrl} 
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                  )}
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 text-gray-900">
                      {blog.category}
                    </span>
                  </div>
                </div>

                {/* Blog Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {blog.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm leading-relaxed line-clamp-3">
                    {blog.excerpt}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2">
                      <FiUser className="w-3 h-3" />
                      <span>{blog.author}</span>
                    </div>
                    {blog.readTime && (
                      <div className="flex items-center space-x-2">
                        <FiClock className="w-3 h-3" />
                        <span>{blog.readTime}</span>
                      </div>
                    )}
                  </div>

                  {/* Date and Read More */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                      <FiCalendar className="w-3 h-3" />
                      <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                    </div>
                    <Link
                      href={`/blogs/${blog.slug || blog._id}`}
                      className="flex items-center space-x-1 text-primary text-sm font-semibold hover:gap-2 transition-all"
                    >
                      <span>Read</span>
                      <FiArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                  {/* Tags */}
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      {blog.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.article>
            ))}
          </div>

          {filteredBlogs.length === 0 && (
            <div className="text-center py-20">
              <p className="text-xl text-gray-600 dark:text-gray-400">
                {searchQuery 
                  ? 'No blogs found matching your search.' 
                  : blogs.length === 0 
                  ? 'No blogs available yet.' 
                  : 'No blogs found in this category.'}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
