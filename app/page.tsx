'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FiArrowRight, FiZap, FiUsers, FiCode, FiBookOpen, FiAward, FiTrendingUp } from 'react-icons/fi'
import { projectAPI } from '@/lib/api'
import { initSocket, disconnectSocket } from '@/lib/socket'

export default function Home() {
  const [featuredProjects, setFeaturedProjects] = useState<any[]>([])
  const [loadingProjects, setLoadingProjects] = useState(true)

  useEffect(() => {
    fetchFeaturedProjects()

    // Initialize WebSocket
    const socket = initSocket()

    // Listen for real-time project updates
    socket.on('project:created', handleProjectUpdate)
    socket.on('project:updated', handleProjectUpdate)
    socket.on('project:deleted', () => fetchFeaturedProjects())

    return () => {
      socket.off('project:created', handleProjectUpdate)
      socket.off('project:updated', handleProjectUpdate)
      socket.off('project:deleted')
      disconnectSocket()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleProjectUpdate = () => {
    fetchFeaturedProjects()
  }

  const fetchFeaturedProjects = async () => {
    try {
      const data = await projectAPI.getAll()
      const featured = Array.isArray(data) 
        ? data.filter((p: any) => p.featured && p.isPublished).slice(0, 3)
        : []
      setFeaturedProjects(featured)
    } catch (error) {
      setFeaturedProjects([])
    } finally {
      setLoadingProjects(false)
    }
  }

  const features = [
    {
      icon: FiUsers,
      title: 'Mentorship Programs',
      description: 'Get personalized guidance from experienced electronics professionals and enthusiasts.',
    },
    {
      icon: FiCode,
      title: 'Hands-on Workshops',
      description: 'Learn by doing with practical workshops on embedded systems, IoT, and hardware design.',
    },
    {
      icon: FiBookOpen,
      title: 'Knowledge Sharing',
      description: 'Access comprehensive tutorials, blogs, and resources on electronics and embedded systems.',
    },
    {
      icon: FiZap,
      title: 'Project Showcases',
      description: 'Explore innovative projects and get inspired to create your own electronics solutions.',
    },
  ]

  const stats = [
    { number: '500+', label: 'Students Mentored' },
    { number: '50+', label: 'Workshops Conducted' },
    { number: '100+', label: 'Projects Completed' },
    { number: '10K+', label: 'Community Members' },
  ]

  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 -top-48 -left-48 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute w-96 h-96 -bottom-48 -right-48 bg-primary/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-6"
            >
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold border border-primary/20">
                Welcome to ElectroPhobia
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Master Electronics,
              <br />
              <span className="text-primary">Build the Future</span>
            </h1>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/experiences"
                className="group px-8 py-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary-600 transition-all duration-200 flex items-center space-x-2 shadow-lg shadow-primary/20 hover:shadow-primary/40"
              >
                <span>Explore Mentorship</span>
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/projects"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-white/20 transition-all duration-200 border border-white/20"
              >
                View Projects
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-gray-400 text-sm md:text-base">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose ElectroPhobia?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Everything you need to excel in electronics and embedded systems
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 group hover:border-primary"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Projects */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Featured Projects
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Explore our latest innovations and creations
              </p>
            </div>
            <Link
              href="/projects"
              className="hidden md:flex items-center space-x-2 text-primary hover:text-primary-600 font-semibold"
            >
              <span>View All</span>
              <FiArrowRight />
            </Link>
          </div>

          {loadingProjects ? (
            <div className="text-center py-12">
              <div className="text-gray-600 dark:text-gray-400">Loading featured projects...</div>
            </div>
          ) : featuredProjects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">No featured projects available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProjects.map((project, index) => (
                <Link key={project._id} href={`/projects/${project._id}`}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="group bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 cursor-pointer"
                  >
                    <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center overflow-hidden">
                      {project.imageUrl ? (
                        <img 
                          src={project.imageUrl} 
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <FiZap className="w-16 h-16 text-primary opacity-50 group-hover:scale-110 transition-transform" />
                      )}
                    </div>
                    <div className="p-6">
                      <div className="text-sm text-primary font-semibold mb-2">{project.category}</div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                        {project.description}
                      </p>
                      <div className="inline-flex items-center space-x-2 text-primary hover:text-primary-600 font-semibold">
                        <span>Learn More</span>
                        <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-8 md:hidden">
            <Link
              href="/projects"
              className="inline-flex items-center space-x-2 text-primary hover:text-primary-600 font-semibold"
            >
              <span>View All Projects</span>
              <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <FiAward className="w-16 h-16 text-white mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Start Your Electronics Journey?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of learners mastering electronics through our mentorship programs and workshops.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="px-8 py-4 bg-white text-primary rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg"
              >
                Get Started Today
              </Link>
              <Link
                href="/blogs"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-white/20 transition-all duration-200 border border-white/30"
              >
                Read Our Blogs
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
