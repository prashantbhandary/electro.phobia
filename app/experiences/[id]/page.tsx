'use client'

import { useState, useEffect } from 'react'
import { FiArrowLeft, FiCalendar, FiClock, FiUsers, FiMapPin, FiAward } from 'react-icons/fi'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { experienceAPI } from '@/lib/api'
import LoadingSpinner from '@/components/LoadingSpinner'
import DynamicMeta from '@/components/DynamicMeta'

export default function ExperienceDetail() {
  const params = useParams()
  const [experience, setExperience] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        setLoading(true)
        const id = params.id as string
        const data = await experienceAPI.getById(id)
        console.log('Experience data:', data)
        console.log('Experience description:', data.description)
        setExperience(data)
      } catch (err: any) {
        console.error('Error fetching experience:', err)
        setError(err.message || 'Failed to load experience')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchExperience()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 pt-20 flex items-center justify-center">
        <LoadingSpinner message="Loading experience" size="lg" />
      </div>
    )
  }

  if (error || !experience) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-12">
          <Link 
            href="/experiences"
            className="inline-flex items-center space-x-2 text-primary hover:text-primary-600 mb-8"
          >
            <FiArrowLeft />
            <span>Back to Experiences</span>
          </Link>
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Experience Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400">{error || 'The experience you are looking for does not exist.'}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-20">
      {experience && (
        <DynamicMeta
          title={experience.title}
          description={experience.description?.substring(0, 160) || ''}
          image={experience.image}
          type="article"
        />
      )}
      <article className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {/* Back Button */}
          <Link 
            href="/experiences"
            className="inline-flex items-center space-x-2 text-primary hover:text-primary-600 mb-8"
          >
            <FiArrowLeft />
            <span>Back to Experiences</span>
          </Link>

          {/* Experience Header */}
          <header className="mb-12">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold capitalize">
                {experience.type}
              </span>
              {experience.status && (
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  experience.status === 'completed' 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                    : experience.status === 'ongoing'
                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                }`}>
                  {experience.status}
                </span>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {experience.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-400">
              {experience.date && (
                <div className="flex items-center space-x-2">
                  <FiCalendar className="w-5 h-5" />
                  <span>{new Date(experience.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              )}
              {experience.duration && (
                <div className="flex items-center space-x-2">
                  <FiClock className="w-5 h-5" />
                  <span>{experience.duration}</span>
                </div>
              )}
              {experience.participants && (
                <div className="flex items-center space-x-2">
                  <FiUsers className="w-5 h-5" />
                  <span>{experience.participants} participants</span>
                </div>
              )}
            </div>
          </header>

          {/* Featured Image */}
          {experience.imageUrl && (
            <div className="mb-12">
              <img 
                src={experience.imageUrl} 
                alt={experience.title}
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          )}

          {/* Description */}
          <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {experience.description}
            </ReactMarkdown>
          </div>

          {/* Outcomes */}
          {experience.outcomes && experience.outcomes.length > 0 && (
            <div className="mb-12 pb-8 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <FiAward className="w-6 h-6 text-primary" />
                Key Outcomes
              </h3>
              <ul className="space-y-4">
                {experience.outcomes.map((outcome: string, index: number) => (
                  <li 
                    key={index}
                    className="flex items-start space-x-3 text-gray-700 dark:text-gray-300"
                  >
                    <span className="text-primary text-xl mt-1">✓</span>
                    <span className="text-lg">{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Location */}
          {experience.location && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <FiMapPin className="w-6 h-6 text-primary" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Location</h4>
                  <p className="text-gray-600 dark:text-gray-400">{experience.location}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </article>
    </div>
  )
}
