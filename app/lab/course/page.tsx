'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { BOOTCAMP_MODULES, PCB_MODULES, type Module } from '@/lib/lab/curriculum-data';
import { courseSchema } from '@/app/schema';

const LEVEL_COLOR: Record<string, string> = {
  Beginner: 'text-green-700 bg-green-50 border-green-200',
  Intermediate: 'text-amber-700 bg-amber-50 border-amber-200',
  Advanced: 'text-red-700 bg-red-50 border-red-200',
};

function ModuleCard({ module, i }: { module: Module; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.05 }}
    >
      <Link
        href={`/lab/course/${module.id}`}
        className="group flex flex-col h-full rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:border-primary/40 hover:shadow-md transition-all"
      >
        {/* accent header */}
        <div className={`relative h-24 bg-gradient-to-br ${module.accent} px-5 py-4 flex flex-col justify-between`}>
          <div className="flex items-center justify-between">
            <span className="text-white/90 text-xs font-bold uppercase tracking-wider">
              {module.day ? `Day ${module.day}` : 'PCB Track'}
            </span>
            <span className="text-white/80 text-xs font-medium bg-white/20 rounded-full px-2.5 py-0.5 backdrop-blur-sm">
              {module.slides.length} slides
            </span>
          </div>
          <h3 className="text-white font-bold text-lg leading-tight drop-shadow-sm">{module.title}</h3>
        </div>

        <div className="flex flex-col flex-1 p-5">
          <p className="text-sm text-gray-600 leading-relaxed flex-1">{module.summary}</p>

          <div className="flex flex-wrap gap-1.5 mt-4">
            {module.topics.slice(0, 4).map((t) => (
              <span key={t} className="text-[0.7rem] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{t}</span>
            ))}
            {module.topics.length > 4 && (
              <span className="text-[0.7rem] text-gray-400 px-1 py-0.5">+{module.topics.length - 4}</span>
            )}
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <span className={`text-[0.7rem] px-2 py-0.5 rounded-full border font-medium ${LEVEL_COLOR[module.level]}`}>
                {module.level}
              </span>
              <span className="text-xs text-gray-400">{module.duration}</span>
            </div>
            <span className="text-xs font-semibold text-primary group-hover:translate-x-0.5 transition-transform">
              Open deck →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function CoursePage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/lab" className="text-sm text-gray-500 hover:text-primary transition-colors">
            ← ElectroLab
          </Link>
          <span className="text-gray-300">|</span>
          <span className="text-primary font-bold">Course</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/lab/demos" className="text-sm text-gray-600 hover:text-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100">Demos</Link>
          <Link href="/lab/missions" className="text-sm text-gray-600 hover:text-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100">Missions</Link>
          <Link href="/lab/tools" className="text-sm text-gray-600 hover:text-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100">Tools</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-16 pb-14 px-6 bg-white border-b border-gray-100">
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-1.5 text-primary text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Structured curriculum · slide by slide
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-5 leading-tight text-gray-900">
              The Electronics &amp; Robotics{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">Bootcamp</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
              Five focused days from "what is voltage" to communication protocols, plus a full PCB design track.
              Every topic is a clean slide deck — read it, learn it, or screen-record it into a video.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href={`/lab/course/${BOOTCAMP_MODULES[0].id}`} className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                Start Day 1
              </Link>
              <Link href={`/lab/course/${PCB_MODULES[0]?.id}`} className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-gray-800 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-all shadow-sm">
                Jump to PCB Design
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bootcamp days */}
      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="flex items-end justify-between mb-7">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">5-Day Bootcamp</h2>
            <p className="text-gray-500 text-sm mt-1">Progressive — each day builds on the last</p>
          </div>
          <span className="text-sm text-gray-400">{BOOTCAMP_MODULES.length} modules</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {BOOTCAMP_MODULES.map((m, i) => <ModuleCard key={m.id} module={m} i={i} />)}
        </div>
      </section>

      {/* PCB track */}
      <section className="bg-white border-t border-b border-gray-100 py-14 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-7">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">PCB Design Track</h2>
              <p className="text-gray-500 text-sm mt-1">Take a circuit from breadboard to a real manufactured board</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PCB_MODULES.map((m, i) => <ModuleCard key={m.id} module={m} i={i} />)}
          </div>
        </div>
      </section>

      {/* For instructors */}
      <section className="max-w-4xl mx-auto px-6 py-14 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Built for teaching</h2>
        <p className="text-gray-600 leading-relaxed mb-6">
          Every deck has a <span className="font-semibold text-gray-900">Present</span> mode (fullscreen, 16:9) and a built-in{' '}
          <span className="font-semibold text-gray-900">speaker script</span> — so you can teach a live class or screen-record
          each slide straight into a lesson video. Navigate with arrow keys, present with <kbd className="px-1.5 py-0.5 rounded bg-gray-100 border border-gray-200 text-xs">F</kbd>.
        </p>
        <Link href={`/lab/course/${BOOTCAMP_MODULES[0].id}`} className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-primary/20">
          Open the first deck →
        </Link>
      </section>

      <footer className="border-t border-gray-200 py-6 px-6 text-center text-xs text-gray-400">
        Part of <Link href="/" className="text-primary hover:underline">Electrophobia.tech</Link> — Interactive Electronics Education
      </footer>
    </div>
  );
}
