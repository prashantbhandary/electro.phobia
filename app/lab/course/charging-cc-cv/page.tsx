'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import CinematicDeck from '@/components/lab/cinematic/CinematicDeck';

export default function ChargingCinematicPage() {
  return (
    <main className="min-h-screen bg-[#04070f] text-slate-100">
      {/* Top bar */}
      <div className="sticky top-0 z-30 border-b border-slate-800 bg-[#04070f]/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link href="/lab/course" className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm text-slate-400 hover:text-sky-300">
            ← All modules
          </Link>
          <span className="hidden truncate text-sm font-medium text-slate-200 sm:block">
            Cinematic · How Batteries Charge — CC / CV / BMS
          </span>
          <span className="whitespace-nowrap rounded-full bg-sky-500/10 px-2.5 py-1 text-xs font-medium text-sky-300 ring-1 ring-sky-500/30">
            Cinematic
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <div className="mb-1 font-mono text-sm uppercase tracking-[0.3em] text-teal-300/70">
            Engineering simulation
          </div>
          <h1 className="text-3xl font-black leading-tight text-white sm:text-4xl">
            How Batteries Charge ·{' '}
            <span className="bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">CC vs CV &amp; the BMS</span>
          </h1>
          <p className="mt-2 max-w-2xl text-slate-400">
            A motion-first walkthrough — see the physics and the embedded control logic that decides when your
            charger switches from constant-current to constant-voltage. Best viewed in <span className="font-semibold text-slate-200">Present</span> mode.
          </p>
        </motion.div>

        {/* The cinematic deck */}
        <CinematicDeck />

        {/* Back nav */}
        <nav className="mt-12 grid gap-4 sm:grid-cols-2">
          <Link href="/lab/course" className="group rounded-xl border border-slate-800 bg-slate-900/50 p-4 transition-all hover:border-sky-500/40">
            <div className="mb-1 text-xs text-slate-500">← Back to</div>
            <div className="font-semibold text-slate-100 transition-colors group-hover:text-sky-300">All course modules</div>
          </Link>
          <Link href="/lab/missions" className="group rounded-xl border border-teal-500/20 bg-teal-500/5 p-4 text-right transition-all hover:border-teal-400/40">
            <div className="mb-1 text-xs text-teal-300/70">Put it into practice</div>
            <div className="font-semibold text-slate-100 transition-colors group-hover:text-teal-300">Try the hands-on Missions →</div>
          </Link>
        </nav>
      </div>
    </main>
  );
}
