'use client';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { DEMO_MAP, DEMO_CIRCUITS } from '@/lib/lab/demo-circuits';
import DemoViewer from '@/components/lab/DemoViewer';

export default function DemoPage({ params }: { params: { id: string } }) {
  const circuit = DEMO_MAP[params.id];
  if (!circuit) notFound();

  const others = DEMO_CIRCUITS.filter(c => c.id !== circuit.id);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="sticky top-0 z-20 border-b border-gray-200 bg-white/90 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 sm:px-6 flex items-center justify-between">
          <Link href="/lab/demos" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary">
            ← All Demos
          </Link>
          <span className="text-sm font-medium text-gray-900 hidden sm:block">{circuit.title}</span>
          <Link href="/lab/sandbox" className="text-xs text-primary hover:underline">
            Build your own →
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6">
        <DemoViewer circuit={circuit} />

        {/* More demos */}
        {others.length > 0 && (
          <section className="mt-12">
            <h2 className="text-lg font-bold text-gray-900 mb-4">More Demos</h2>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
              {others.slice(0, 4).map(c => (
                <Link
                  key={c.id}
                  href={`/lab/demos/${c.id}`}
                  className="group rounded-xl border border-gray-200 bg-white p-4 shadow-sm
                    hover:border-primary/40 hover:shadow-md transition-all"
                >
                  <div className="text-sm font-semibold text-gray-900 group-hover:text-primary mb-1 leading-tight">
                    {c.title}
                  </div>
                  <div className="text-xs text-gray-500">{c.steps.length} steps</div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
