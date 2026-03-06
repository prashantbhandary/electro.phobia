'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { MISSIONS } from '@/lib/lab/missions-data'

const DIFFICULTY_COLOR: Record<string, string> = {
  beginner:     'text-green-700 bg-green-50 border-green-200',
  intermediate: 'text-amber-700 bg-amber-50 border-amber-200',
  advanced:     'text-red-700 bg-red-50 border-red-200',
}

export default function MissionsPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/lab" className="text-sm text-gray-500 hover:text-primary transition-colors">
            ← ElectroLab
          </Link>
          <span className="text-gray-300">|</span>
          <span className="text-primary font-bold">Guided Missions</span>
        </div>
        <Link
          href="/lab/sandbox"
          className="text-sm font-semibold bg-primary text-white px-4 py-1.5 rounded-lg hover:bg-primary/90 transition-colors"
        >
          Open Sandbox
        </Link>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold mb-3"
          >
            Learning Missions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 max-w-xl mx-auto"
          >
            Complete missions in order to build your electronics knowledge step by step.
            Each mission teaches a core concept through hands-on circuit building.
          </motion.p>
        </div>

        {/* XP/Progress banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-4 mb-10"
        >
          {[
            { label: 'Total XP',   value: MISSIONS.reduce((s, m) => s + m.reward.xp, 0).toString() },
            { label: 'Missions',   value: MISSIONS.length.toString() },
            { label: 'Badges',     value: MISSIONS.filter(m => m.reward.badge).length.toString() },
          ].map(stat => (
            <div key={stat.label} className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm">
              <div className="text-xl font-bold text-primary">{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Mission list */}
        <div className="space-y-4">
          {MISSIONS.map((mission, i) => (
            <motion.div
              key={mission.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
            >
              <Link href={`/lab/missions/${mission.id}`}>
                <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-primary/40 hover:shadow-sm transition-all group cursor-pointer">
                  <div className="flex items-start gap-4">
                    {/* Level number */}
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gray-100 group-hover:bg-primary/10 border border-gray-200 group-hover:border-primary/40 flex items-center justify-center transition-all">
                        <span className="text-lg font-black text-gray-400 group-hover:text-primary/70 transition-colors">
                        {mission.level}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors">
                          {mission.title}
                        </h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${DIFFICULTY_COLOR[mission.difficulty]}`}>
                          {mission.difficulty}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-2 leading-relaxed">{mission.description}</p>

                      {/* Required components */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-gray-500">Components:</span>
                        {mission.requiredComponents.slice(0, 5).map(c => (
                          <span key={c} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">
                            {c.replace(/_/g, ' ')}
                          </span>
                        ))}
                        {mission.requiredComponents.length > 5 && (
                          <span className="text-xs text-gray-400">+{mission.requiredComponents.length - 5} more</span>
                        )}
                      </div>
                    </div>

                    {/* Right side */}
                    <div className="flex-shrink-0 text-right space-y-1">
                      <div className="text-sm font-bold text-primary">+{mission.reward.xp} XP</div>
                      {mission.reward.badge && (
                        <div className="text-lg">{mission.reward.badge.split(' ')[0]}</div>
                      )}
                      <div className="text-xs text-gray-400">{mission.steps.length} steps</div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  )
}
