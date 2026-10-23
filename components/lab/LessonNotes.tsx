import type { Module, Slide, SlideColumn } from '@/lib/lab/curriculum-data';

// Full-text version of a module's slides, rendered below the deck. Students can
// read/print the whole lesson in one place, and the complete lesson is in the
// server HTML (the deck itself only shows one slide at a time).

function Column({ col }: { col?: SlideColumn }) {
  if (!col) return null;
  return (
    <div>
      {col.heading && <h4 className="font-semibold text-gray-900">{col.heading}</h4>}
      {col.body && <p>{col.body}</p>}
      {col.bullets && (
        <ul>
          {col.bullets.map((b, i) => <li key={i}>{b}</li>)}
        </ul>
      )}
    </div>
  );
}

function SlideNotes({ slide }: { slide: Slide }) {
  return (
    <section className="py-5 border-t border-gray-100 first:border-t-0">
      {slide.eyebrow && <div className="text-xs font-semibold text-primary uppercase tracking-wide">{slide.eyebrow}</div>}
      {slide.title && <h3 className="text-lg font-bold text-gray-900 mt-1">{slide.title}</h3>}
      <div className="mt-2 space-y-3 text-gray-700 leading-relaxed">
        {slide.subtitle && <p>{slide.subtitle}</p>}
        {slide.lead && <p>{slide.lead}</p>}
        {slide.bullets && (
          <ul className="list-disc pl-5 space-y-1">
            {slide.bullets.map((b, i) => (
              <li key={i}>{b.text}{b.sub && <span className="text-gray-500"> — {b.sub}</span>}</li>
            ))}
          </ul>
        )}
        {slide.cards && (
          <ul className="list-disc pl-5 space-y-1">
            {slide.cards.map((c, i) => <li key={i}><strong>{c.title}:</strong> {c.text}</li>)}
          </ul>
        )}
        {(slide.left || slide.right) && (
          <div className="grid sm:grid-cols-2 gap-4 [&_ul]:list-disc [&_ul]:pl-5">
            <Column col={slide.left} />
            <Column col={slide.right} />
          </div>
        )}
        {slide.formula && <p className="font-mono text-gray-900">{slide.formula}</p>}
        {slide.where && (
          <ul className="list-disc pl-5">
            {slide.where.map((w, i) => <li key={i}><span className="font-mono">{w.sym}</span> — {w.def}</li>)}
          </ul>
        )}
        {slide.example && <p><strong>Example:</strong> {slide.example}</p>}
        {slide.steps && (
          <ol className="list-decimal pl-5 space-y-1">
            {slide.steps.map((s, i) => <li key={i}><strong>{s.title}:</strong> {s.text}</li>)}
          </ol>
        )}
        {slide.columns && slide.rows && (
          <div className="overflow-x-auto">
            <table className="text-sm border-collapse">
              <thead>
                <tr>{slide.columns.map((c, i) => <th key={i} className="border border-gray-200 px-3 py-1.5 text-left bg-gray-50">{c}</th>)}</tr>
              </thead>
              <tbody>
                {slide.rows.map((r, i) => (
                  <tr key={i}>{r.map((cell, j) => <td key={j} className="border border-gray-200 px-3 py-1.5">{cell}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {slide.code && (
          <pre className="text-sm bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto"><code>{slide.code}</code></pre>
        )}
        {slide.gallery && (
          <ul className="list-disc pl-5">
            {slide.gallery.map((g, i) => <li key={i}>{g.label}{g.sub && ` — ${g.sub}`}</li>)}
          </ul>
        )}
        {slide.caption && <p className="text-sm text-gray-500">{slide.caption}</p>}
        {slide.note && <p className="text-gray-600">{slide.note}</p>}
      </div>
    </section>
  );
}

export default function LessonNotes({ module }: { module: Module }) {
  return (
    <section className="mt-12 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8" aria-labelledby="lesson-notes">
      <h2 id="lesson-notes" className="text-2xl font-black text-gray-900">Lesson notes</h2>
      <p className="text-gray-500 mt-1 mb-4">{module.summary}</p>
      {module.slides.map((slide, i) => <SlideNotes key={i} slide={slide} />)}
    </section>
  );
}
