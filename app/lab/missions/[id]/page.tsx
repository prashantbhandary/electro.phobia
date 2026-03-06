'use client'

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { motion } from 'framer-motion'
import { MISSION_MAP, MISSIONS } from '@/lib/lab/missions-data'
import CircuitBuilder from '@/components/lab/CircuitBuilder'
import { useState } from 'react'

export default function MissionPage({ params }: { params: { id: string } }) {
  const { id } = params
  const mission = MISSION_MAP[id]
  if (!mission) notFound()

  const [started, setStarted] = useState(false)
  const [completed, setCompleted] = useState(false)

  const currentIndex = MISSIONS.findIndex(m => m.id === id)
  const nextMission  = MISSIONS[currentIndex + 1]

  if (started) {
    return (
      <CircuitBuilder
        mission={mission}
        onMissionComplete={() => setCompleted(true)}
      />
    )
  }

  // Mission intro screen
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-900">
        <Link href="/lab/missions" className="text-sm text-gray-400 hover:text-primary transition-colors">
          ← Missions
        </Link>
        <span className="text-sm text-gray-500">Mission {mission.level} of {MISSIONS.length}</span>
      </nav>

      <main className="flex-1 max-w-3xl mx-auto px-6 py-12 w-full">
        {completed ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="text-8xl mb-6">🎉</div>
            <h2 className="text-3xl font-bold text-white mb-2">Mission Complete!</h2>
            <p className="text-gray-400 mb-2">+{mission.reward.xp} XP earned</p>
            {mission.reward.badge && (
              <p className="text-xl mb-8">{mission.reward.badge}</p>
            )}
            <div className="flex gap-4 justify-center">
              {nextMission && (
                <Link
                  href={`/lab/missions/${nextMission.id}`}
                  className="px-6 py-3 bg-primary text-gray-900 font-bold rounded-xl hover:bg-primary/90 transition-colors"
                >
                  Next Mission →
                </Link>
              )}
              <button
                onClick={() => { setCompleted(false); setStarted(false); }}
                className="px-6 py-3 bg-gray-800 text-gray-200 font-semibold rounded-xl hover:bg-gray-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Mission header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-5xl font-black text-gray-700 leading-none">
                  {String(mission.level).padStart(2, '0')}
                </span>
                <div>
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium mr-2 ${
                    mission.difficulty === 'beginner' ? 'text-green-400 bg-green-900/30 border-green-700/40' :
                    mission.difficulty === 'intermediate' ? 'text-yellow-400 bg-yellow-900/30 border-yellow-700/40' :
                    'text-red-400 bg-red-900/30 border-red-700/40'
                  }`}>
                    {mission.difficulty}
                  </span>
                  <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/30">
                    +{mission.reward.xp} XP
                  </span>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">{mission.title}</h1>
              <p className="text-gray-400 text-lg leading-relaxed mb-6">{mission.description}</p>

              {/* Objective */}
              <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 mb-6">
                <p className="text-primary font-semibold text-sm mb-1">🎯 Objective</p>
                <p className="text-gray-200 text-sm">{mission.objective}</p>
              </div>

              {/* Theory */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6">
                <p className="text-white font-semibold mb-3">📖 Background Theory</p>
                <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap font-mono text-xs bg-gray-950 rounded-lg p-4">
                  {mission.theory}
                </div>
              </div>

              {/* Required components */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6">
                <p className="text-white font-semibold mb-2 text-sm">🔧 Components You&apos;ll Use</p>
                <div className="flex flex-wrap gap-2">
                  {mission.requiredComponents.map(c => (
                    <span key={c} className="bg-gray-800 border border-gray-700 text-gray-300 text-xs px-3 py-1 rounded-lg">
                      {c.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  ))}
                </div>
              </div>

              {/* Steps preview */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-8">
                <p className="text-white font-semibold mb-3 text-sm">📋 Steps ({mission.steps.length})</p>
                <ol className="space-y-2">
                  {mission.steps.map((step, i) => (
                    <li key={step.id} className="flex items-start gap-3 text-sm">
                      <span className="w-5 h-5 rounded-full bg-gray-800 border border-gray-700 flex-shrink-0 flex items-center justify-center text-xs text-gray-400 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-gray-400">{step.text}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <button
                onClick={() => setStarted(true)}
                className="w-full py-4 bg-primary text-gray-900 font-bold rounded-xl text-lg hover:bg-primary/90 transition-all hover:shadow-[0_0_30px_rgba(34,192,179,0.4)]"
              >
                🚀 Start Mission
              </button>
            </motion.div>
          </>
        )}
      </main>
    </div>
  )
}
