'use client';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MODULE_MAP, MODULES } from '@/lib/lab/curriculum-data';
import SlideDeck from '@/components/lab/SlideDeck';

export default function CourseDayPage({ params }: { params: { day: string } }) {
  const module = MODULE_MAP[params.day];
  if (!module) notFound();

  const idx = MODULES.findIndex((m) => m.id === module.id);
  const prev = idx > 0 ? MODULES[idx - 1] : null;
  const next = idx < MODULES.length - 1 ? MODULES[idx + 1] : null;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="sticky top-0 z-30 border-b border-gray-200 bg-white/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <Link href="/lab/course" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary whitespace-nowrap">
            ← All modules
          </Link>
          <span className="text-sm font-medium text-gray-900 truncate hidden sm:block">
            {module.day ? `Day ${module.day} · ` : ''}{module.title}
          </span>
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${
            module.level === 'Beginner' ? 'bg-green-50 text-green-700'
            : module.level === 'Intermediate' ? 'bg-amber-50 text-amber-700'
            : 'bg-red-50 text-red-700'}`}>
            {module.level}
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="text-sm font-semibold text-primary uppercase tracking-wide mb-1">
            {module.day ? `Day ${module.day}` : 'PCB Design Track'}
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight">{module.title}</h1>
          <p className="text-gray-500 mt-2 max-w-2xl">{module.tagline}</p>
        </div>

        {/* The deck */}
        <SlideDeck module={module} />

        {/* Prev / Next module nav */}
        <nav className="mt-12 grid sm:grid-cols-2 gap-4">
          {prev ? (
            <Link href={`/lab/course/${prev.id}`} className="group rounded-xl border border-gray-200 bg-white p-4 hover:border-primary/40 hover:shadow-sm transition-all">
              <div className="text-xs text-gray-400 mb-1">← Previous</div>
              <div className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                {prev.day ? `Day ${prev.day}: ` : ''}{prev.title}
              </div>
            </Link>
          ) : <div className="hidden sm:block" />}
          {next ? (
            <Link href={`/lab/course/${next.id}`} className="group rounded-xl border border-gray-200 bg-white p-4 text-right hover:border-primary/40 hover:shadow-sm transition-all">
              <div className="text-xs text-gray-400 mb-1">Next →</div>
              <div className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                {next.day ? `Day ${next.day}: ` : ''}{next.title}
              </div>
            </Link>
          ) : (
            <Link href="/lab/missions" className="group rounded-xl border border-primary/30 bg-primary/[0.04] p-4 text-right hover:shadow-sm transition-all">
              <div className="text-xs text-primary/70 mb-1">You finished the course 🎉</div>
              <div className="font-semibold text-gray-900 group-hover:text-primary transition-colors">Try the hands-on Missions →</div>
            </Link>
          )}
        </nav>
      </div>
    </main>
  );
}
