'use client'

import { motion } from 'framer-motion'
import { FiZap, FiTarget, FiHeart, FiUsers, FiAward, FiTrendingUp, FiCpu, FiCode } from 'react-icons/fi'

export default function AboutPage() {
  const values = [
    {
      icon: FiHeart,
      title: 'Passion for Learning',
      description: 'We believe in fostering curiosity and a love for electronics through hands-on experience and practical knowledge.',
    },
    {
      icon: FiUsers,
      title: 'Community First',
      description: 'Building a supportive community where enthusiasts can share, learn, and grow together in their electronics journey.',
    },
    {
      icon: FiAward,
      title: 'Excellence',
      description: 'Committed to providing high-quality education, mentorship, and resources to help you achieve your goals.',
    },
    {
      icon: FiTrendingUp,
      title: 'Innovation',
      description: 'Encouraging creative thinking and innovative solutions to real-world problems through electronics.',
    },
  ]

  const expertise = [
    {
      icon: FiCpu,
      title: 'Embedded Systems',
      topics: ['Arduino', 'ESP32/ESP8266', 'STM32', 'Raspberry Pi', 'Microcontroller Programming'],
    },
    {
      icon: FiZap,
      title: 'Hardware Design',
      topics: ['PCB Design', 'Circuit Analysis', 'Power Electronics', 'Analog & Digital Circuits'],
    },
    {
      icon: FiCode,
      title: 'IoT & Communication',
      topics: ['WiFi & Bluetooth', 'LoRa & RF', 'MQTT & Protocols', 'Cloud Integration'],
    },
  ]

  const timeline = [
    {
      year: '2023',
      title: 'The Beginning',
      description: 'Started sharing electronics content on Instagram, reaching thousands of enthusiasts.',
    },
    {
      year: '2024',
      title: 'Going Viral',
      description: 'Electronics tutorials went viral, building a community of 10K+ followers.',
    },
    {
      year: '2025',
      title: 'ElectroPhobia Launch',
      description: 'Officially launched mentorship programs and workshops to scale our impact.',
    },
    {
      year: '2026',
      title: 'Growing Community',
      description: 'Now serving 500+ students with comprehensive electronics education.',
    },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/5 dark:to-transparent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              About <span className="text-primary">ElectroPhobia</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              ElectroPhobia is more than just a platform—it's a movement to democratize electronics 
              education and empower the next generation of hardware innovators. We're building a 
              community where passion meets expertise.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/5 dark:to-transparent p-8 rounded-xl border border-primary/20"
            >
              <FiTarget className="w-12 h-12 text-primary mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Our Mission
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                To make electronics education accessible, practical, and engaging for everyone—from 
                curious beginners to aspiring professionals. We provide hands-on mentorship, comprehensive 
                workshops, and a supportive community to help you master electronics and embedded systems.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/5 dark:to-transparent p-8 rounded-xl border border-primary/20"
            >
              <FiZap className="w-12 h-12 text-primary mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Our Vision
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                To become the leading platform for electronics education in the region, creating a 
                thriving ecosystem of makers, innovators, and entrepreneurs who are shaping the future 
                of technology through hardware and embedded systems.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 text-center"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Expertise Areas */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Expertise
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Comprehensive knowledge across key electronics domains
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {expertise.map((area, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl border border-gray-200 dark:border-gray-700"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                  <area.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {area.title}
                </h3>
                <ul className="space-y-2">
                  {area.topics.map((topic, topicIndex) => (
                    <li
                      key={topicIndex}
                      className="flex items-start space-x-2 text-gray-600 dark:text-gray-400"
                    >
                      <span className="text-primary mt-1">•</span>
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              From passion project to thriving community
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {timeline.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="relative mb-12 last:mb-0"
              >
                <div className="flex items-center mb-4">
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg flex-shrink-0">
                    {event.year}
                  </div>
                  <div className="flex-1 h-1 bg-primary/20 ml-4"></div>
                </div>
                <div className="ml-24 bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {event.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Meet the Founder
              </h2>
              <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl border border-gray-200 dark:border-gray-700">
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                  As an electronics engineering student with a deep passion for hardware and embedded 
                  systems, I created ElectroPhobia to share knowledge and build a community of like-minded 
                  enthusiasts. What started as sharing projects on Instagram has grown into a comprehensive 
                  platform for electronics education.
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                  My journey in electronics has been filled with exciting projects, countless learning 
                  experiences, and the joy of seeing concepts come to life. Through ElectroPhobia, I aim 
                  to provide the guidance and resources I wished I had when starting out.
                </p>
                <a
                  href="https://bhandari-prashant.com.np/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-primary hover:text-primary-600 font-semibold"
                >
                  <span>Visit My Personal Website</span>
                  <FiZap />
                </a>
              </div>
            </motion.div>
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
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Join Our Community?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Start your electronics journey with expert guidance, hands-on projects, and a 
              supportive community of learners and makers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/experiences"
                className="px-8 py-4 bg-white text-primary rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg"
              >
                Explore Programs
              </a>
              <a
                href="/contact"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-white/20 transition-all duration-200 border border-white/30"
              >
                Get in Touch
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
