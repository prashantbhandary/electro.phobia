import Link from 'next/link';
import { DEMO_CIRCUITS } from '@/lib/lab/demo-circuits';

export const metadata = {
  title: 'Circuit Demos | Electronics Lab',
  description: 'Watch pre-built circuits come to life with step-by-step explanations.',
};

const difficultyColor: Record<string, string> = {
  Beginner: 'bg-green-50 text-green-700 border-green-200',
  Intermediate: 'bg-amber-50 text-amber-700 border-amber-200',
};

export default function DemosPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6">
          <Link href="/lab" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary mb-4">
            ← Back to Lab
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Circuit Demos</h1>
          <p className="mt-2 text-gray-600 max-w-xl">
            The site builds the circuit — you watch and learn.
            Each demo walks you through a real circuit step by step with live explanations.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-5xl mx-auto px-4 py-10 sm:px-6">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {DEMO_CIRCUITS.map(circuit => (
            <Link
              key={circuit.id}
              href={`/lab/demos/${circuit.id}`}
              className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm
                hover:border-primary/40 hover:shadow-md transition-all"
            >
              {/* Icon + title */}
              <div className="flex items-start justify-between mb-3">
              {/* no icon */}
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${difficultyColor[circuit.difficulty]}`}>
                  {circuit.difficulty}
                </span>
              </div>

              <h2 className="font-bold text-gray-900 text-base leading-snug mb-1 group-hover:text-primary transition-colors">
                {circuit.title}
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">{circuit.subtitle}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {circuit.tags.slice(0, 3).map(t => (
                  <span key={t} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                    {t}
                  </span>
                ))}
              </div>

              {/* Steps count */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">{circuit.steps.length} steps</span>
                <span className="text-xs font-semibold text-primary group-hover:translate-x-0.5 transition-transform">
                  Watch demo →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Info banner */}
        <div className="mt-10 rounded-2xl border border-primary/20 bg-primary/5 p-6 flex gap-4">
          <span className="text-2xl">🎓</span>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">How do demos work?</h3>
            <p className="text-sm text-gray-600">
              Each demo shows a schematic circuit diagram with components highlighted as you progress.
              You can step through manually or hit the play button to auto-advance every 5 seconds.
              Current flow is animated so you can visually trace electrons through the circuit.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
