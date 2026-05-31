'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import type { Module, Slide } from '@/lib/lab/curriculum-data';

function ToolLink({ link }: { link: { href: string; label: string } }) {
  return (
    <Link
      href={link.href}
      className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm sm:text-base shadow-md shadow-primary/20 hover:bg-primary/90 hover:gap-3 transition-all w-fit"
    >
      🛠 {link.label} →
    </Link>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Per-layout slide rendering. Everything is sized in a 16:9 stage so it reads
// cleanly when screen-recorded into a video.
// ──────────────────────────────────────────────────────────────────────────

function Eyebrow({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <div className="inline-flex items-center gap-2 mb-4">
      <span className="h-2 w-2 rounded-full bg-primary" />
      <span className="text-primary font-semibold tracking-wide uppercase text-[0.78rem] sm:text-sm">{text}</span>
    </div>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 sm:p-5 overflow-auto text-[0.78rem] sm:text-sm leading-relaxed font-mono shadow-lg ring-1 ring-black/20">
      <code>{code}</code>
    </pre>
  );
}

function SlideBody({ slide }: { slide: Slide }) {
  switch (slide.layout) {
    case 'cover':
      return (
        <div className="flex flex-col justify-center flex-1 text-center max-w-4xl mx-auto">
          <Eyebrow text={slide.eyebrow} />
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 leading-[1.05] mb-4">
            {slide.title}
          </h1>
          {slide.subtitle && (
            <p className="text-lg sm:text-2xl text-gray-500 mb-8">{slide.subtitle}</p>
          )}
          {slide.bullets && (
            <div className="flex flex-wrap gap-2.5 justify-center max-w-3xl mx-auto">
              {slide.bullets.map((b, i) => (
                <span key={i} className="px-3.5 py-1.5 rounded-full bg-white border border-gray-200 text-gray-700 text-sm font-medium shadow-sm">
                  {b.text}
                </span>
              ))}
            </div>
          )}
        </div>
      );

    case 'section':
      return (
        <div className="flex flex-col justify-center flex-1">
          <Eyebrow text={slide.eyebrow} />
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-black text-gray-900 leading-[1.02]">
            {slide.title}
          </h2>
          {slide.lead && <p className="text-xl text-gray-500 mt-5 max-w-3xl">{slide.lead}</p>}
        </div>
      );

    case 'statement':
      return (
        <div className="flex flex-col justify-center flex-1 max-w-4xl">
          <Eyebrow text={slide.eyebrow} />
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
            {slide.title}
          </h2>
          {slide.lead && <p className="text-lg sm:text-2xl text-gray-600 leading-relaxed">{slide.lead}</p>}
        </div>
      );

    case 'bullets':
      return (
        <div className="flex flex-col justify-center flex-1">
          {slide.title && <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">{slide.title}</h2>}
          {slide.lead && <p className="text-lg text-gray-500 mb-8">{slide.lead}</p>}
          <ul className="space-y-4 max-w-3xl">
            {slide.bullets?.map((b, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                className="flex items-start gap-4"
              >
                <span className="mt-1 flex-shrink-0 h-7 w-7 rounded-lg bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">
                  {i + 1}
                </span>
                <div>
                  <span className="text-xl sm:text-2xl font-semibold text-gray-900">{b.text}</span>
                  {b.sub && <span className="block text-base sm:text-lg text-gray-500 mt-0.5">{b.sub}</span>}
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      );

    case 'cards':
      return (
        <div className="flex flex-col justify-center flex-1">
          {slide.title && <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">{slide.title}</h2>}
          {slide.lead && <p className="text-lg text-gray-500 mb-7">{slide.lead}</p>}
          <div className={`grid gap-4 ${(slide.cards?.length ?? 0) > 4 ? 'sm:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
            {slide.cards?.map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + i * 0.07 }}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                {c.icon && (
                  <div className="inline-flex items-center justify-center min-w-[2.75rem] h-11 px-2 rounded-xl bg-primary/10 text-primary font-bold text-lg mb-3">
                    {c.icon}
                  </div>
                )}
                <h3 className="text-lg font-bold text-gray-900 mb-1">{c.title}</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{c.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      );

    case 'split':
      return (
        <div className="flex flex-col justify-center flex-1">
          {slide.title && <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">{slide.title}</h2>}
          {slide.lead && <p className="text-lg text-gray-500 mb-7">{slide.lead}</p>}
          <div className="grid sm:grid-cols-2 gap-5">
            {[slide.left, slide.right].map((col, i) =>
              col ? (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                  className={`rounded-2xl border p-6 ${i === 0 ? 'border-primary/30 bg-primary/[0.04]' : 'border-gray-200 bg-white'} shadow-sm`}
                >
                  {col.heading && <h3 className="text-xl font-bold text-gray-900 mb-3">{col.heading}</h3>}
                  {col.body && <p className="text-base sm:text-lg text-gray-600 leading-relaxed">{col.body}</p>}
                  {col.bullets && (
                    <ul className="space-y-2.5 mt-2">
                      {col.bullets.map((b, j) => (
                        <li key={j} className="flex items-start gap-2.5 text-base sm:text-lg text-gray-700">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              ) : null,
            )}
          </div>
        </div>
      );

    case 'formula':
      return (
        <div className="flex flex-col justify-center flex-1 max-w-4xl">
          {slide.title && <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6">{slide.title}</h2>}
          <div className="rounded-2xl bg-gray-900 text-white px-6 py-7 sm:py-9 text-center shadow-xl mb-6">
            <span className="text-2xl sm:text-4xl font-bold font-mono tracking-tight text-primary">{slide.formula}</span>
          </div>
          {slide.where && (
            <div className="flex flex-wrap gap-x-8 gap-y-2 mb-5">
              {slide.where.map((w, i) => (
                <div key={i} className="flex items-baseline gap-2">
                  <span className="font-mono font-bold text-primary text-lg">{w.sym}</span>
                  <span className="text-gray-600 text-base sm:text-lg">= {w.def}</span>
                </div>
              ))}
            </div>
          )}
          {slide.example && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-3.5 text-amber-900 text-base sm:text-lg">
              <span className="font-bold">Example · </span>{slide.example}
            </div>
          )}
          {slide.link && <ToolLink link={slide.link} />}
        </div>
      );

    case 'code':
      return (
        <div className="flex flex-col justify-center flex-1">
          {slide.title && <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4">{slide.title}</h2>}
          <div className="grid lg:grid-cols-5 gap-5 items-start">
            <div className="lg:col-span-3">{slide.code && <CodeBlock code={slide.code} />}</div>
            {slide.bullets && (
              <ul className="lg:col-span-2 space-y-3">
                {slide.bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-base sm:text-lg text-gray-700">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    <span>{b.text}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      );

    case 'table':
      return (
        <div className="flex flex-col justify-center flex-1">
          {slide.title && <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">{slide.title}</h2>}
          {slide.lead && <p className="text-lg text-gray-500 mb-6">{slide.lead}</p>}
          <div className="overflow-auto rounded-2xl border border-gray-200 shadow-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-900 text-white">
                  {slide.columns?.map((c, i) => (
                    <th key={i} className="px-4 py-3 text-sm sm:text-base font-semibold">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {slide.rows?.map((row, ri) => (
                  <tr key={ri} className={ri % 2 ? 'bg-gray-50' : 'bg-white'}>
                    {row.map((cell, ci) => (
                      <td key={ci} className={`px-4 py-2.5 text-sm sm:text-base ${ci === 0 ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );

    case 'steps':
      return (
        <div className="flex flex-col justify-center flex-1">
          {slide.title && <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-7">{slide.title}</h2>}
          <div className="space-y-4 max-w-3xl">
            {slide.steps?.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.09 }}
                className="flex items-start gap-4"
              >
                <span className="flex-shrink-0 h-9 w-9 rounded-full bg-primary text-white font-bold flex items-center justify-center shadow-md">
                  {i + 1}
                </span>
                <div className="pt-0.5">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">{s.title}</h3>
                  <p className="text-base sm:text-lg text-gray-600 leading-relaxed">{s.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      );

    case 'diagram':
      return (
        <div className="flex flex-col justify-center flex-1">
          {slide.title && <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-5 text-center">{slide.title}</h2>}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="mx-auto w-full max-w-3xl rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm [&_svg]:w-full [&_svg]:h-auto"
            dangerouslySetInnerHTML={{ __html: slide.svg ?? '' }}
          />
          {slide.caption && <p className="text-center text-base sm:text-lg text-gray-500 mt-5 max-w-2xl mx-auto">{slide.caption}</p>}
        </div>
      );

    case 'visual':
      return (
        <div className="flex flex-col justify-center flex-1">
          {slide.title && <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 mb-2">{slide.title}</h2>}
          {slide.lead && <p className="text-base sm:text-lg text-gray-500 mb-5 max-w-3xl">{slide.lead}</p>}
          <div className="grid lg:grid-cols-5 gap-5 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="lg:col-span-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm [&_svg]:w-full [&_svg]:h-auto"
              dangerouslySetInnerHTML={{ __html: slide.svg ?? '' }}
            />
            {slide.bullets && (
              <ul className="lg:col-span-2 space-y-3.5">
                {slide.bullets.map((b, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <span className="mt-1 flex-shrink-0 h-6 w-6 rounded-lg bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">{i + 1}</span>
                    <span className="text-base sm:text-lg text-gray-700 leading-snug">{b.text}</span>
                  </motion.li>
                ))}
              </ul>
            )}
          </div>
          {slide.link && <ToolLink link={slide.link} />}
        </div>
      );

    case 'photo':
      return (
        <div className="flex flex-col justify-center flex-1">
          {slide.title && <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 mb-2">{slide.title}</h2>}
          {slide.lead && <p className="text-base sm:text-lg text-gray-500 mb-5 max-w-3xl">{slide.lead}</p>}
          <div className="grid lg:grid-cols-5 gap-6 items-center">
            <motion.figure
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="lg:col-span-3 m-0"
            >
              <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={slide.image} alt={slide.imageAlt ?? slide.title ?? ''} className="w-full h-auto object-cover max-h-[46vh] mx-auto" loading="lazy" />
              </div>
              {slide.credit && <figcaption className="text-[0.7rem] text-gray-400 mt-1.5">{slide.credit}</figcaption>}
            </motion.figure>
            {slide.bullets && (
              <ul className="lg:col-span-2 space-y-3.5">
                {slide.bullets.map((b, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <span className="mt-1 flex-shrink-0 h-6 w-6 rounded-lg bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">{i + 1}</span>
                    <div>
                      <span className="text-base sm:text-lg font-semibold text-gray-900">{b.text}</span>
                      {b.sub && <span className="block text-sm text-gray-500">{b.sub}</span>}
                    </div>
                  </motion.li>
                ))}
              </ul>
            )}
          </div>
        </div>
      );

    case 'gallery':
      return (
        <div className="flex flex-col justify-center flex-1">
          {slide.title && <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">{slide.title}</h2>}
          {slide.lead && <p className="text-lg text-gray-500 mb-6">{slide.lead}</p>}
          <div className={`grid gap-4 ${(slide.gallery?.length ?? 0) >= 4 ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-3'}`}>
            {slide.gallery?.map((g, i) => (
              <motion.figure
                key={i}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + i * 0.08 }}
                className="m-0 rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm"
              >
                <div className="aspect-[4/3] bg-gray-50 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={g.src} alt={g.label} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <figcaption className="px-3 py-2.5">
                  <div className="font-bold text-gray-900 text-sm sm:text-base leading-tight">{g.label}</div>
                  {g.sub && <div className="text-xs text-gray-500 mt-0.5">{g.sub}</div>}
                </figcaption>
              </motion.figure>
            ))}
          </div>
          {slide.credit && <p className="text-[0.7rem] text-gray-400 mt-3">{slide.credit}</p>}
        </div>
      );

    case 'takeaway':
      return (
        <div className="flex flex-col justify-center flex-1">
          <Eyebrow text="Recap" />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-7">{slide.title}</h2>
          <ul className="grid sm:grid-cols-2 gap-3.5 max-w-4xl">
            {slide.bullets?.map((b, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.08 + i * 0.07 }}
                className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm"
              >
                <span className="text-primary mt-0.5 flex-shrink-0">✓</span>
                <span className="text-base sm:text-lg text-gray-800">{b.text}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      );

    default:
      return null;
  }
}

// ──────────────────────────────────────────────────────────────────────────

export default function SlideDeck({ module }: { module: Module }) {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [showNotes, setShowNotes] = useState(false);
  const [isFull, setIsFull] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

  const total = module.slides.length;
  const slide = module.slides[index];

  const go = useCallback((next: number) => {
    setIndex((cur) => {
      const clamped = Math.max(0, Math.min(total - 1, next));
      setDir(clamped >= cur ? 1 : -1);
      return clamped;
    });
  }, [total]);

  const toggleFullscreen = useCallback(() => {
    const el = stageRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }, []);

  useEffect(() => {
    const onFs = () => setIsFull(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') { e.preventDefault(); go(index + 1); }
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); go(index - 1); }
      else if (e.key === 'Home') go(0);
      else if (e.key === 'End') go(total - 1);
      else if (e.key.toLowerCase() === 'f') toggleFullscreen();
      else if (e.key.toLowerCase() === 'n') setShowNotes((s) => !s);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, total, go, toggleFullscreen]);

  return (
    <div>
      {/* Stage — 16:9, the recordable area */}
      <div
        ref={stageRef}
        className="relative bg-gradient-to-br from-gray-50 to-white rounded-2xl overflow-hidden ring-1 ring-gray-200 shadow-xl
          aspect-[16/9] w-full data-[full=true]:rounded-none data-[full=true]:ring-0"
        data-full={isFull}
      >
        {/* subtle brand grid */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.035] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="deck-grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M48 0H0V48" fill="none" stroke="#22C0B3" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#deck-grid)" />
        </svg>

        {/* top progress strip */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gray-100 z-20">
          <motion.div
            className="h-full bg-primary"
            animate={{ width: `${((index + 1) / total) * 100}%` }}
            transition={{ type: 'spring', stiffness: 200, damping: 30 }}
          />
        </div>

        {/* slide content — scrolls instead of clipping when a slide is tall */}
        <div className="absolute inset-0 overflow-y-auto">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={index}
              custom={dir}
              initial={{ opacity: 0, x: dir * 48 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -48 }}
              transition={{ duration: 0.32, ease: 'easeOut' }}
              className="min-h-full flex flex-col px-6 sm:px-12 md:px-16 py-10 sm:py-12"
            >
              <SlideBody slide={slide} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* footer: brand + counter */}
        <div className="absolute bottom-3 left-6 right-6 flex items-center justify-between text-xs text-gray-400 z-20 pointer-events-none">
          <span className="font-semibold text-primary">ElectroLab · {module.title}</span>
          <span>{index + 1} / {total}</span>
        </div>

        {/* click zones for prev/next (don't cover interactive content height-wise too much) */}
        <button aria-label="Previous" onClick={() => go(index - 1)} className="absolute left-0 top-0 bottom-0 w-1/6 z-10 cursor-default" />
        <button aria-label="Next" onClick={() => go(index + 1)} className="absolute right-0 top-0 bottom-0 w-1/6 z-10 cursor-default" />
      </div>

      {/* Controls */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => go(index - 1)}
            disabled={index === 0}
            className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 font-medium text-sm hover:border-primary/40 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ← Prev
          </button>
          <button
            onClick={() => go(index + 1)}
            disabled={index === total - 1}
            className="px-4 py-2 rounded-lg bg-primary text-white font-medium text-sm hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next →
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNotes((s) => !s)}
            className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${showNotes ? 'border-primary/40 bg-primary/10 text-primary' : 'border-gray-200 bg-white text-gray-600 hover:border-primary/40'}`}
            title="Toggle speaker notes (N)"
          >
            🎙 Script
          </button>
          <button
            onClick={toggleFullscreen}
            className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-600 text-sm font-medium hover:border-primary/40 transition-colors"
            title="Present fullscreen (F) — great for recording"
          >
            ⛶ Present
          </button>
        </div>
      </div>

      {/* Speaker notes / video script */}
      <AnimatePresence>
        {showNotes && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 rounded-xl border border-gray-200 bg-white p-5">
              <div className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">Speaker notes — slide {index + 1}</div>
              <p className="text-gray-700 leading-relaxed">
                {slide.note ?? 'No notes for this slide — narrate the on-screen points in your own words.'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slide thumbnails / jump bar */}
      <div className="mt-5 flex gap-1.5 flex-wrap">
        {module.slides.map((s, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            title={s.title || s.layout}
            className={`h-2 rounded-full transition-all ${i === index ? 'w-8 bg-primary' : 'w-2 bg-gray-300 hover:bg-gray-400'}`}
          />
        ))}
      </div>

      <p className="mt-4 text-xs text-gray-400 text-center">
        Navigate with ← → or Space · <span className="font-medium">F</span> to present fullscreen · <span className="font-medium">N</span> for the script
      </p>
    </div>
  );
}
