'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiZap, FiCpu, FiRadio, FiTool, FiGithub, FiExternalLink } from 'react-icons/fi'
import { projectAPI } from '@/lib/api'
import Link from 'next/link'
import { initSocket, disconnectSocket } from '@/lib/socket'

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()

    // Initialize WebSocket
    const socket = initSocket()

    // Listen for real-time project updates
    socket.on('project:created', handleProjectUpdate)
    socket.on('project:updated', handleProjectUpdate)
    socket.on('project:deleted', () => fetchProjects())

    return () => {
      socket.off('project:created', handleProjectUpdate)
      socket.off('project:updated', handleProjectUpdate)
      socket.off('project:deleted')
      disconnectSocket()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleProjectUpdate = () => {
    fetchProjects()
  }

  const fetchProjects = async () => {
    try {
      const data = await projectAPI.getAll()
      setProjects(Array.isArray(data) ? data.filter((proj: any) => proj.isPublished) : [])
    } catch (error) {
      console.error('Error fetching projects:', error)
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  const categories = ['All', ...Array.from(new Set(projects.map(p => p.category)))]

  const filteredProjects = activeFilter === 'All' 
    ? projects 
    : projects.filter(project => project.category === activeFilter)

  const gradients = [
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-yellow-500 to-orange-500',
    'from-green-500 to-teal-500',
    'from-red-500 to-pink-500',
    'from-indigo-500 to-purple-500',
    'from-cyan-500 to-blue-500',
    'from-orange-500 to-red-500',
    'from-teal-500 to-green-500',
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 pt-20 flex items-center justify-center">
        <div className="text-2xl text-gray-600 dark:text-gray-400">Loading projects...</div>
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
              Our <span className="text-primary">Projects</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Explore innovative electronics projects ranging from IoT solutions to robotics, 
              embedded systems, and power electronics.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-white dark:bg-gray-900 sticky top-20 z-40 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
                  activeFilter === category
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

      {/* Projects Grid */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <Link 
                key={project._id}
                href={`/projects/${project._id}`}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 group cursor-pointer h-full"
                >
                  {/* Project Image/Gradient */}
                  <div className={`h-48 bg-gradient-to-br ${gradients[index % gradients.length]} flex items-center justify-center relative overflow-hidden`}>
                    {project.imageUrl ? (
                      <img 
                        src={project.imageUrl} 
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                        <FiZap className="w-20 h-20 text-white opacity-50 group-hover:scale-110 transition-transform relative z-10" />
                      </>
                    )}
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4 z-10">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        project.status === 'completed' 
                          ? 'bg-green-500 text-white' 
                          : project.status === 'in-progress'
                          ? 'bg-yellow-500 text-gray-900'
                          : 'bg-gray-500 text-white'
                      }`}>
                        {project.status}
                      </span>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 text-gray-900">
                        {project.category}
                      </span>
                    </div>
                  </div>

                  {/* Project Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm leading-relaxed line-clamp-3">
                      {project.description.replace(/[#*`_~\[\]()]/g, '').substring(0, 150)}...
                    </p>

                    {/* Technologies */}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.slice(0, 3).map((tech: string, techIndex: number) => (
                          <span
                            key={techIndex}
                            className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-md font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-md font-medium">
                            +{project.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Links */}
                    {(project.githubUrl || project.liveUrl) && (
                      <div className="flex items-center space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        {project.githubUrl && (
                          <span className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 group-hover:text-primary transition-colors">
                            <FiGithub className="w-5 h-5" />
                            <span className="text-sm font-medium">Code</span>
                          </span>
                        )}
                        {project.liveUrl && (
                          <span className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 group-hover:text-primary transition-colors">
                            <FiExternalLink className="w-5 h-5" />
                            <span className="text-sm font-medium">Demo</span>
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-20">
              <p className="text-xl text-gray-600 dark:text-gray-400">
                {projects.length === 0 ? 'No projects available yet.' : 'No projects found in this category.'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Project Stats */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <FiCpu className="w-12 h-12 text-primary mx-auto mb-4" />
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{projects.length}</div>
              <div className="text-gray-600 dark:text-gray-400">Total Projects</div>
            </div>
            <div className="text-center">
              <FiZap className="w-12 h-12 text-primary mx-auto mb-4" />
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {projects.filter(p => p.status === 'in-progress').length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Active Projects</div>
            </div>
            <div className="text-center">
              <FiRadio className="w-12 h-12 text-primary mx-auto mb-4" />
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{categories.length - 1}</div>
              <div className="text-gray-600 dark:text-gray-400">Categories</div>
            </div>
            <div className="text-center">
              <FiTool className="w-12 h-12 text-primary mx-auto mb-4" />
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {projects.filter(p => p.status === 'completed').length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Completed</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
