'use client'

import { useState, useEffect } from 'react'
import { FiArrowLeft, FiGithub, FiExternalLink, FiCpu, FiCalendar } from 'react-icons/fi'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { projectAPI } from '@/lib/api'
import LoadingSpinner from '@/components/LoadingSpinner'
import DynamicMeta from '@/components/DynamicMeta'

export default function ProjectDetail() {
  const params = useParams()
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true)
        const id = params.id as string
        const data = await projectAPI.getById(id)
        setProject(data)
      } catch (err: any) {
        setError(err.message || 'Failed to load project')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProject()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 pt-20 flex items-center justify-center">
        <LoadingSpinner message="Loading project" size="lg" />
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-12">
          <Link 
            href="/projects"
            className="inline-flex items-center space-x-2 text-primary hover:text-primary-600 mb-8"
          >
            <FiArrowLeft />
            <span>Back to Projects</span>
          </Link>
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Project Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400">{error || 'The project you are looking for does not exist.'}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-20">
      {project && (
        <DynamicMeta
          title={project.title}
          description={project.description?.substring(0, 160) || ''}
          image={project.imageUrl}
          type="article"
        />
      )}
      <article className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {/* Back Button */}
          <Link 
            href="/projects"
            className="inline-flex items-center space-x-2 text-primary hover:text-primary-600 mb-8"
          >
            <FiArrowLeft />
            <span>Back to Projects</span>
          </Link>

          {/* Project Header */}
          <header className="mb-12">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                {project.category}
              </span>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                project.status === 'completed' 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                  : project.status === 'in-progress'
                  ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
              }`}>
                {project.status}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {project.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <FiCalendar className="w-5 h-5" />
                <span>{new Date(project.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          {project.imageUrl && (
            <div className="mb-12">
              <img 
                src={project.imageUrl} 
                alt={project.title}
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          )}

          {/* Description */}
          <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {project.description}
            </ReactMarkdown>
            
            {project.fullDescription && (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {project.fullDescription}
              </ReactMarkdown>
            )}
          </div>

          {/* Technologies */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="mb-12 pb-8 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FiCpu className="w-5 h-5" />
                Technologies Used
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech: string, index: number) => (
                  <span 
                    key={index}
                    className="px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          {(project.githubUrl || project.liveUrl) && (
            <div className="flex flex-wrap gap-4">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-gray-800 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors font-medium"
                >
                  <FiGithub className="w-5 h-5" />
                  View on GitHub
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
                >
                  <FiExternalLink className="w-5 h-5" />
                  View Live Project
                </a>
              )}
            </div>
          )}
        </div>
      </article>
    </div>
  )
}
