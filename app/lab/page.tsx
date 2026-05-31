'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { MISSIONS } from '@/lib/lab/missions-data'
import { DEMO_CIRCUITS } from '@/lib/lab/demo-circuits'

const DIFFICULTY_COLOR: Record<string, string> = {
  beginner:     'text-green-700 bg-green-50 border-green-200',
  intermediate: 'text-amber-700 bg-amber-50 border-amber-200',
  advanced:     'text-red-700 bg-red-50 border-red-200',
}

const FEATURE_CARDS = [
  {
    title: '5-Day Bootcamp + PCB Track',
    description: 'A full structured curriculum as slide decks — robotics to communication protocols, plus PCB design in KiCad. Read it or present it as video.',
    color: 'bg-primary/5 border-primary/20 hover:border-primary/50',
    href: '/lab/course',
  },
  {
    title: 'Live Circuit Demos',
    description: 'The site builds pre-wired circuits and walks you through them step by step — watch electrons flow in real time.',
    color: 'bg-primary/5 border-primary/20 hover:border-primary/50',
    href: '/lab/demos',
  },
  {
    title: 'Guided Missions',
    description: '7 progressive challenges from blinking an LED to motor drivers. Each mission teaches one concept clearly.',
    color: 'bg-blue-50 border-blue-100 hover:border-blue-300',
    href: '/lab/missions',
  },
  {
    title: 'Electronics Tools',
    description: 'Resistor color-code decoder, Ohm\'s Law solver, and an LED resistor calculator — practical tools for every beginner, in one place.',
    color: 'bg-amber-50 border-amber-100 hover:border-amber-300',
    href: '/lab/tools',
  },
  {
    title: 'Practice Building',
    description: 'Ready to build? We recommend Wokwi (Arduino + code) and Tinkercad (visual drag-and-drop) for hands-on practice.',
    color: 'bg-green-50 border-green-100 hover:border-green-300',
    href: '/lab/sandbox',
  },
]

export default function LabHomePage() {
  const featuredDemos = DEMO_CIRCUITS.filter(d => d.difficulty === 'Beginner').slice(0, 3)

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-sm text-gray-500 hover:text-primary transition-colors">
            ← Electrophobia
          </Link>
          <span className="text-gray-300">|</span>
          <span className="flex items-center gap-2 text-primary font-bold">
            ElectroLab
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/lab/course"
            className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors px-3 py-1.5 rounded-lg hover:bg-primary/5"
          >
            Course
          </Link>
          <Link
            href="/lab/demos"
            className="text-sm text-gray-600 hover:text-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100"
          >
            Demos
          </Link>
          <Link
            href="/lab/missions"
            className="text-sm text-gray-600 hover:text-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100"
          >
            Missions
          </Link>
          <Link
            href="/lab/tools"
            className="text-sm text-gray-600 hover:text-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100"
          >
            Tools
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-16 pb-20 px-6 bg-white border-b border-gray-100">
        {/* Subtle circuit pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circuit-bg" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 0 50 H 30 V 20 H 60 V 50 H 100" stroke="#22C0B3" strokeWidth="1" fill="none" />
              <circle cx="30" cy="20" r="3" fill="#22C0B3" />
              <circle cx="60" cy="50" r="3" fill="#22C0B3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit-bg)" />
        </svg>

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-1.5 text-primary text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Interactive Electronics Lab · Beta
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-gray-900">
              Watch circuits come alive.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">
                Understand, not just build.
              </span>
            </h1>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              ElectroLab explains how circuits actually work — animated current flow, component breakdowns,
              and step-by-step logic. No hardware needed, no guesswork.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/lab/demos"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 text-lg"
              >
                Watch Circuit Demos
              </Link>
              <Link
                href="/lab/tools"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-800 font-semibold rounded-xl hover:bg-gray-50 transition-all border border-gray-200 text-lg shadow-sm"
              >
                Explore Tools
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Curriculum banner */}
      <section className="max-w-6xl mx-auto px-6 pt-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-blue-600 p-8 sm:p-10 text-white shadow-xl"
        >
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-semibold mb-3">
                New · Structured Course
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2 leading-tight">
                The 5-Day Electronics &amp; Robotics Bootcamp
              </h2>
              <p className="text-white/90 leading-relaxed">
                From voltage and Ohm&apos;s Law to sensors, motors, control systems, and a complete PCB-design track in KiCad —
                every topic is a clean slide deck you can read, teach, or record into a video.
              </p>
            </div>
            <div className="flex flex-col gap-3 flex-shrink-0">
              <Link href="/lab/course" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-primary font-bold rounded-xl hover:bg-gray-50 transition-all shadow-lg">
                Explore the Course →
              </Link>
              <Link href="/lab/course/day-1" className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/30 hover:bg-white/20 transition-all">
                Start Day 1
              </Link>
            </div>
          </div>
          <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
        </motion.div>
      </section>

      {/* Featured Demos */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Live Circuit Demos</h2>
            <p className="text-gray-500 text-sm mt-1">
              Pre-built circuits with animated current flow and step-by-step explanations
            </p>
          </div>
          <Link href="/lab/demos" className="text-sm text-primary hover:underline font-medium">
            All demos →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {featuredDemos.map((demo, i) => (
            <motion.div
              key={demo.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Link href={`/lab/demos/${demo.id}`}
                className="group flex flex-col h-full rounded-2xl border border-gray-200 bg-white p-5 shadow-sm
                  hover:border-primary/40 hover:shadow-md transition-all">
                <h3 className="font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                  {demo.title}
                </h3>
                <p className="text-sm text-gray-500 flex-1 leading-relaxed mb-4">{demo.subtitle}</p>
                <div className="flex gap-1.5 flex-wrap mb-3">
                  {demo.tags.slice(0, 3).map(t => (
                    <span key={t} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{t}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{demo.steps.length} steps</span>
                  <span className="text-xs font-semibold text-primary group-hover:translate-x-0.5 transition-transform">
                    Watch demo →
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Feature Cards */}
      <section className="bg-white border-t border-b border-gray-100 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Everything in one place</h2>
          <p className="text-gray-500 text-sm text-center mb-10">Demos, missions, and tools — all free, all focused on understanding</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURE_CARDS.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <Link href={card.href}
                  className={`group flex flex-col h-full ${card.color} border rounded-xl p-5 transition-all`}>
                  <h3 className="text-base font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed flex-1">{card.description}</p>
                  <span className="mt-3 text-xs font-semibold text-primary">Open →</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Missions Preview */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Guided Missions</h2>
            <p className="text-gray-500 text-sm mt-1">Progressive challenges that build on each other</p>
          </div>
          <Link
            href="/lab/missions"
            className="text-sm text-primary hover:underline font-medium"
          >
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MISSIONS.slice(0, 6).map((mission, i) => (
            <motion.div
              key={mission.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.07 }}
            >
              <Link href={`/lab/missions/${mission.id}`}>
                <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-primary/40 hover:shadow-sm transition-all group cursor-pointer h-full">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl font-black text-gray-200 group-hover:text-primary/30 transition-colors leading-none">
                      {String(mission.level).padStart(2, '0')}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${DIFFICULTY_COLOR[mission.difficulty]}`}>
                      {mission.difficulty}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                    {mission.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed mb-3">{mission.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-primary font-semibold">+{mission.reward.xp} XP</span>
                    {mission.reward.badge && (
                      <span className="text-xs">{mission.reward.badge}</span>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats banner */}
      <section className="border-t border-gray-200 bg-white py-12 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { n: '6',    label: 'Course modules' },
            { n: '175+', label: 'Slides' },
            { n: '7',   label: 'Missions' },
            { n: '0',   label: 'Hardware needed' },
          ].map(stat => (
            <div key={stat.label}>
              <div className="text-3xl font-black text-primary mb-1">{stat.n}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 text-center bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Ready to start learning?</h2>
        <p className="text-gray-500 mb-6 text-sm">No sign-up required. Everything runs in your browser.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/lab/demos"
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
          >
            Watch a Demo
          </Link>
          <Link
            href="/lab/sandbox"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-gray-800 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-all"
          >
            Practice Building
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-6 px-6 text-center text-xs text-gray-400">
        Part of <Link href="/" className="text-primary hover:underline">Electrophobia.tech</Link> — Interactive Electronics Education
      </footer>
    </div>
  )
}
