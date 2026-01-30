'use client'

import { motion } from 'framer-motion'
import { FiAward, FiUsers, FiCalendar, FiClock, FiStar } from 'react-icons/fi'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { experienceAPI } from '@/lib/api'
import { initSocket, disconnectSocket } from '@/lib/socket'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function ExperiencesPage() {
  const [experiences, setExperiences] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchExperiences()

    // Initialize WebSocket
    const socket = initSocket()

    // Listen for real-time experience updates
    socket.on('experience:created', handleExperienceUpdate)
    socket.on('experience:updated', handleExperienceUpdate)
    socket.on('experience:deleted', () => fetchExperiences())

    return () => {
      socket.off('experience:created', handleExperienceUpdate)
      socket.off('experience:updated', handleExperienceUpdate)
      socket.off('experience:deleted')
      disconnectSocket()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleExperienceUpdate = () => {
    fetchExperiences()
  }

  const fetchExperiences = async () => {
    try {
      const data = await experienceAPI.getAll()
      setExperiences(Array.isArray(data) ? data.filter((exp: any) => exp.isPublished) : [])
    } catch (error) {
      setExperiences([])
    } finally {
      setLoading(false)
    }
  }

  const mentorshipPrograms = experiences.filter(exp => exp.type === 'mentorship')
  const workshops = experiences.filter(exp => exp.type === 'workshop')
  const pastExperiences = experiences.filter(exp => exp.type === 'achievement')

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 pt-20 flex items-center justify-center">
        <LoadingSpinner message="Loading experiences" size="lg" />
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
              Our <span className="text-primary">Experiences</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Comprehensive mentorship programs, hands-on workshops, and a track record of empowering 
              electronics enthusiasts to achieve their goals.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mentorship Programs Section */}
      <section id="mentorship" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Mentorship Programs
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Personalized guidance to accelerate your electronics learning journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mentorshipPrograms.map((program, index) => (
              <Link 
                key={program._id || index}
                href={`/experiences/${program._id}`}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 group cursor-pointer h-full"
                >
                {/* Program Image */}
                <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center relative overflow-hidden">
                  {program.imageUrl ? (
                    <img 
                      src={program.imageUrl} 
                      alt={program.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors"></div>
                      <FiAward className="w-20 h-20 text-primary opacity-50 group-hover:scale-110 transition-transform relative z-10" />
                    </>
                  )}
                </div>

                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {program.title}
                  </h3>

                  <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <FiClock className="w-4 h-4" />
                      <span>{program.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FiUsers className="w-4 h-4" />
                      <span>{program.participants || 0}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-3">
                    {program.description.replace(/[#*`_~\[\]()]/g, '').substring(0, 150)}...
                  </p>

                  {program.outcomes && program.outcomes.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">Key Outcomes:</h4>
                      <ul className="space-y-1">
                        {program.outcomes.map((outcome: string, idx: number) => (
                          <li key={idx} className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-400">
                            <span className="text-primary mt-1">•</span>
                            <span>{outcome}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {program.location && (
                    <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                      <strong>Location:</strong> {program.location}
                    </div>
                  )}
                </div>
              </motion.div>
              </Link>
            ))}
          </div>

          {mentorshipPrograms.length === 0 && (
            <div className="text-center text-gray-600 dark:text-gray-400 py-12">
              No mentorship programs available at the moment.
            </div>
          )}
        </div>
      </section>

      {/* Workshops Section */}
      <section id="workshops" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Workshops
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Intensive hands-on workshops to build practical skills
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {workshops.map((workshop, index) => (
              <Link 
                key={workshop._id}
                href={`/experiences/${workshop._id}`}
              >
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 hover:border-primary transition-all duration-300 group cursor-pointer h-full"
                >
                {/* Workshop Image */}
                <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center relative overflow-hidden">
                  {workshop.imageUrl ? (
                    <img 
                      src={workshop.imageUrl} 
                      alt={workshop.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors"></div>
                      <FiUsers className="w-20 h-20 text-primary opacity-50 group-hover:scale-110 transition-transform relative z-10" />
                    </>
                  )}
                </div>

                <div className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {workshop.title}
                      </h3>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        workshop.status === 'upcoming' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        workshop.status === 'ongoing' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                      }`}>
                        {workshop.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-3">
                    {workshop.description.replace(/[#*`_~\[\]()]/g, '').substring(0, 150)}...
                  </p>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  {workshop.date && (
                    <div>
                      <div className="flex items-center space-x-1 text-primary mb-1">
                        <FiCalendar className="w-4 h-4" />
                      </div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        {new Date(workshop.date).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                  {workshop.duration && (
                    <div>
                      <div className="flex items-center space-x-1 text-primary mb-1">
                        <FiClock className="w-4 h-4" />
                      </div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">{workshop.duration}</div>
                    </div>
                  )}
                  <div>
                    <div className="flex items-center space-x-1 text-primary mb-1">
                      <FiUsers className="w-4 h-4" />
                    </div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">{workshop.participants || 0} participants</div>
                  </div>
                </div>

                {workshop.location && (
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <strong>Location:</strong> {workshop.location}
                  </div>
                )}
                </div>
              </motion.div>
              </Link>
            ))}
          </div>

          {workshops.length === 0 && (
            <div className="text-center text-gray-600 dark:text-gray-400 py-12">
              No workshops available at the moment.
            </div>
          )}
        </div>
      </section>

      {/* Past Experiences Timeline */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Achievements
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Milestones and achievements that shaped ElectroPhobia
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {pastExperiences.map((achievement, index) => (
              <motion.div
                key={achievement._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0">
                    <FiAward />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {achievement.title}
                    </h3>
                    {achievement.date && (
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        {new Date(achievement.date).toLocaleDateString()}
                      </div>
                    )}
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {achievement.description.replace(/[#*`_~\[\]()]/g, '').substring(0, 120)}...
                    </p>
                    {achievement.outcomes && achievement.outcomes.length > 0 && (
                      <div className="space-y-1">
                        {achievement.outcomes.map((outcome: string, idx: number) => (
                          <div key={idx} className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-400">
                            <span className="text-primary mt-1">-</span>
                            <span>{outcome}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {pastExperiences.length === 0 && (
            <div className="text-center text-gray-600 dark:text-gray-400 py-12">
              No achievements recorded yet.
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
