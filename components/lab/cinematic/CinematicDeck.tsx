'use client';

/**
 * CinematicDeck — a dark, simulation-style presentation shell.
 *
 * Shares the navigation grammar of <SlideDeck/> (← → / Space, F to present,
 * N for the script, thumbnail jump bar) so it feels native to the lab, but the
 * stage is a deep-navy "engineering console": ambient PCB grid, drifting bloom,
 * a live oscilloscope baseline, vignette + bloom, and cinematic scene-to-scene
 * transitions. An autoplay mode auto-advances for hands-free screen-recording.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cinematicSlides } from './scenes';

const AUTOPLAY_MS = 9000; // per-scene dwell when autoplaying

export default function CinematicDeck() {
  const slides = cinematicSlides;
  const total = slides.length;

  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [showNotes, setShowNotes] = useState(false);
  const [isFull, setIsFull] = useState(false);
  const [playing, setPlaying] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

  const slide = slides[index];

  const go = useCallback((next: number) => {
    setIndex((cur) => {
      const wrapped = (next + total) % total; // loop for kiosk-style playback
      setDir(wrapped >= cur || (cur === total - 1 && wrapped === 0) ? 1 : -1);
      return wrapped;
    });
  }, [total]);

  const toggleFullscreen = useCallback(() => {
    const el = stageRef.current;
    if (!el) return;
    if (!document.fullscreenElement) el.requestFullscreen?.().catch(() => {});
    else document.exitFullscreen?.().catch(() => {});
  }, []);

  useEffect(() => {
    const onFs = () => setIsFull(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, []);

  // autoplay
  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => go(index + 1), AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [playing, index, go]);

  // keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') { e.preventDefault(); go(index + 1); }
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); go(index - 1); }
      else if (e.key === 'Home') go(0);
      else if (e.key === 'End') go(total - 1);
      else if (k === 'f') toggleFullscreen();
      else if (k === 'n') setShowNotes((s) => !s);
      else if (k === 'p') setPlaying((p) => !p);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, total, go, toggleFullscreen]);

  return (
    <div>
      {/* ── Stage — 16:9, the recordable area ───────────────────────────── */}
      <div
        ref={stageRef}
        className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl ring-1 ring-sky-500/20 shadow-2xl
          data-[full=true]:rounded-none data-[full=true]:ring-0"
        data-full={isFull}
        style={{ background: 'radial-gradient(120% 120% at 50% 0%, #0a1326 0%, #060a16 55%, #03060f 100%)' }}
      >
        {/* ambient PCB grid */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.10]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="cine-grid" width="44" height="44" patternUnits="userSpaceOnUse">
              <path d="M44 0H0V44" fill="none" stroke="#2dd4bf" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cine-grid)" />
        </svg>

        {/* drifting bloom blobs */}
        <motion.div
          className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full blur-3xl"
          style={{ background: 'rgba(56,189,248,0.16)' }}
          animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="pointer-events-none absolute -right-24 bottom-8 h-80 w-80 rounded-full blur-3xl"
          style={{ background: 'rgba(52,211,153,0.12)' }}
          animate={{ x: [0, -40, 0], y: [0, -24, 0] }}
          transition={{ duration: 17, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* live oscilloscope baseline at the very bottom (ambient motion) */}
        <svg className="pointer-events-none absolute inset-x-0 bottom-0 h-16 w-full opacity-30" viewBox="0 0 1200 80" preserveAspectRatio="none">
          <path fill="none" stroke="#22d3ee" strokeWidth="2"
            d="M0 40 Q60 8 120 40 T240 40 T360 40 T480 40 T600 40 T720 40 T840 40 T960 40 T1080 40 T1200 40">
            <animate attributeName="d" dur="4s" repeatCount="indefinite"
              values="M0 40 Q60 8 120 40 T240 40 T360 40 T480 40 T600 40 T720 40 T840 40 T960 40 T1080 40 T1200 40;M0 40 Q60 72 120 40 T240 40 T360 40 T480 40 T600 40 T720 40 T840 40 T960 40 T1080 40 T1200 40;M0 40 Q60 8 120 40 T240 40 T360 40 T480 40 T600 40 T720 40 T840 40 T960 40 T1080 40 T1200 40" />
          </path>
        </svg>

        {/* top progress strip */}
        <div className="absolute inset-x-0 top-0 z-30 h-1 bg-white/5">
          <motion.div
            className="h-full"
            style={{ background: 'linear-gradient(90deg,#22d3ee,#34d399)', boxShadow: '0 0 12px #22d3ee' }}
            animate={{ width: `${((index + 1) / total) * 100}%` }}
            transition={{ type: 'spring', stiffness: 200, damping: 30 }}
          />
        </div>

        {/* phase eyebrow */}
        <div className="absolute left-5 top-4 z-30">
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-sky-300/70">{slide.phase}</span>
        </div>

        {/* the scene */}
        <div className="absolute inset-0 z-10">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={index}
              custom={dir}
              initial={{ opacity: 0, scale: 1.04, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="h-full w-full"
            >
              <slide.Scene />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* vignette + bloom overlay */}
        <div className="pointer-events-none absolute inset-0 z-20"
          style={{ boxShadow: 'inset 0 0 120px 24px rgba(0,0,0,0.55)' }} />

        {/* footer brand + counter */}
        <div className="pointer-events-none absolute inset-x-5 bottom-3 z-30 flex items-center justify-between font-mono text-[0.7rem] text-sky-300/50">
          <span className="font-semibold text-teal-300/70">ElectroLab · CC / CV · BMS</span>
          <span>{String(index + 1).padStart(2, '0')} / {total}</span>
        </div>

        {/* invisible click zones */}
        <button aria-label="Previous" onClick={() => go(index - 1)} className="absolute left-0 top-0 bottom-0 z-20 w-[12%] cursor-default" />
        <button aria-label="Next" onClick={() => go(index + 1)} className="absolute right-0 top-0 bottom-0 z-20 w-[12%] cursor-default" />
      </div>

      {/* ── Controls ────────────────────────────────────────────────────── */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => go(index - 1)}
            className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:border-sky-500/50"
          >
            ← Prev
          </button>
          <button
            onClick={() => go(index + 1)}
            className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-sky-400"
          >
            Next →
          </button>
          <button
            onClick={() => setPlaying((p) => !p)}
            className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
              playing ? 'border-teal-400/50 bg-teal-400/10 text-teal-300' : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-teal-400/50'
            }`}
            title="Autoplay — hands-free recording (P)"
          >
            {playing ? '❚❚ Auto' : '▶ Auto'}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNotes((s) => !s)}
            className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
              showNotes ? 'border-sky-500/50 bg-sky-500/10 text-sky-300' : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-sky-500/50'
            }`}
            title="Director / speaker script (N)"
          >
            🎬 Script
          </button>
          <button
            onClick={toggleFullscreen}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:border-sky-500/50"
            title="Present fullscreen (F) — best for recording"
          >
            ⛶ Present
          </button>
        </div>
      </div>

      {/* ── Director / speaker script ───────────────────────────────────── */}
      <AnimatePresence>
        {showNotes && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/70 p-5">
              <div className="mb-2 font-mono text-xs uppercase tracking-wide text-sky-400">
                Scene {index + 1} · {slide.title}
              </div>
              <p className="leading-relaxed text-slate-300">{slide.note}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Thumbnail jump bar ──────────────────────────────────────────── */}
      <div className="mt-5 flex flex-wrap gap-1.5">
        {slides.map((s, i) => (
          <button
            key={s.id}
            onClick={() => go(i)}
            title={s.title}
            className={`h-2 rounded-full transition-all ${i === index ? 'w-8 bg-sky-400' : 'w-2 bg-slate-700 hover:bg-slate-500'}`}
          />
        ))}
      </div>

      <p className="mt-4 text-center text-xs text-slate-500">
        ← → or Space to navigate · <span className="font-medium text-slate-300">F</span> present fullscreen ·{' '}
        <span className="font-medium text-slate-300">P</span> autoplay · <span className="font-medium text-slate-300">N</span> script
      </p>
    </div>
  );
}
