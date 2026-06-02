'use client';

/**
 * Cinematic scene library for the "How Batteries Charge / BMS / CC-CV" deck.
 *
 * Design intent: 70% motion, 30% text. Every scene is a self-contained, dark,
 * neon, simulation-style frame. Continuous loops (electrons, ions, scope traces)
 * use native SMIL so they keep playing forever — ideal for screen-recording.
 * Entrance reveals + kinetic text fragments use framer-motion and run on mount
 * (the deck remounts each scene via AnimatePresence, so they re-fire on arrival).
 *
 * Palette: navy void · neon blue #38bdf8 · teal #34DBC9 · green #34d399 ·
 *          amber #fbbf24 · danger #f87171
 */

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

// ── shared tokens ──────────────────────────────────────────────────────────
const NEON = '#38bdf8';
const TEAL = '#34DBC9';
const GREEN = '#34d399';
const AMBER = '#fbbf24';
const RED = '#f87171';

export interface SceneProps {
  /** seconds-ish progress hint; scenes mostly self-loop, so usually unused */
  active?: boolean;
}

// ── kinetic text fragment ────────────────────────────────────────────────
function Frag({
  children,
  delay = 0,
  className = '',
  from = 'up',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  from?: 'up' | 'down' | 'left' | 'right' | 'scale';
}) {
  const offset =
    from === 'up' ? { y: 22 } : from === 'down' ? { y: -22 } : from === 'left' ? { x: -28 } : from === 'right' ? { x: 28 } : { scale: 0.8 };
  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(8px)', ...offset }}
      animate={{ opacity: 1, filter: 'blur(0px)', x: 0, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// big neon headline
function Headline({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <Frag delay={delay} className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-[1.05] drop-shadow-[0_0_30px_rgba(56,189,248,0.25)]">
      {children}
    </Frag>
  );
}

// tiny glowing label chip used over diagrams
function Tag({ children, color = NEON, className = '' }: { children: ReactNode; color?: string; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.72rem] sm:text-sm font-semibold uppercase tracking-widest backdrop-blur-md ${className}`}
      style={{ color, background: `${color}14`, border: `1px solid ${color}40`, boxShadow: `0 0 22px ${color}22` }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
      {children}
    </span>
  );
}

// glass panel
function Glass({ children, className = '', glow = NEON }: { children: ReactNode; className?: string; glow?: string }) {
  return (
    <div
      className={`rounded-2xl backdrop-blur-xl ${className}`}
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', boxShadow: `inset 0 1px 0 rgba(255,255,255,0.08), 0 0 50px ${glow}14` }}
    >
      {children}
    </div>
  );
}

// SVG defs reused across scenes (glow filter + grid)
function Defs({ id }: { id: string }) {
  return (
    <defs>
      <filter id={`${id}-glow`} x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3.2" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <pattern id={`${id}-grid`} width="34" height="34" patternUnits="userSpaceOnUse">
        <path d="M34 0H0V34" fill="none" stroke="#1b2a4a" strokeWidth="1" />
      </pattern>
      <linearGradient id={`${id}-scan`} x1="0" x2="1" y1="0" y2="0">
        <stop offset="0%" stopColor={TEAL} stopOpacity="0" />
        <stop offset="50%" stopColor={TEAL} stopOpacity="0.9" />
        <stop offset="100%" stopColor={TEAL} stopOpacity="0" />
      </linearGradient>
    </defs>
  );
}

// a stage that holds an absolutely-positioned full-bleed SVG simulation
function Stage({ children }: { children: ReactNode }) {
  return <div className="relative h-full w-full flex flex-col">{children}</div>;
}

// a continuously running oscilloscope strip (used as ambient + hero element)
function ScopeStrip({ id, color = TEAL, glitch = false }: { id: string; color?: string; glitch?: boolean }) {
  const wave = glitch
    ? 'M0 60 H120 L130 20 L140 95 L150 35 L160 60 H260 Q320 10 380 60 T500 60 H640'
    : 'M0 60 Q40 20 80 60 T160 60 T240 60 T320 60 T400 60 T480 60 T560 60 T640 60';
  return (
    <svg viewBox="0 0 640 120" className="h-full w-full" preserveAspectRatio="none">
      <Defs id={id} />
      <rect width="640" height="120" fill={`url(#${id}-grid)`} opacity="0.5" />
      <path d={wave} fill="none" stroke={color} strokeWidth="2.5" filter={`url(#${id}-glow)`} opacity="0.9">
        {!glitch && <animate attributeName="d" dur="3.5s" repeatCount="indefinite"
          values="M0 60 Q40 20 80 60 T160 60 T240 60 T320 60 T400 60 T480 60 T560 60 T640 60;M0 60 Q40 95 80 60 T160 60 T240 60 T320 60 T400 60 T480 60 T560 60 T640 60;M0 60 Q40 20 80 60 T160 60 T240 60 T320 60 T400 60 T480 60 T560 60 T640 60" />}
      </path>
      {/* sweeping scan cursor */}
      <rect x="0" y="0" width="120" height="120" fill={`url(#${id}-scan)`} opacity="0.25">
        <animate attributeName="x" from="-120" to="640" dur="2.6s" repeatCount="indefinite" />
      </rect>
    </svg>
  );
}

// drifting electron / ion particle along a path
function flow(id: string, path: string, count: number, dur: number, color: string, r = 4) {
  return Array.from({ length: count }).map((_, i) => (
    <circle key={`${id}-${i}`} r={r} fill={color} filter={`url(#${id}-glow)`}>
      <animateMotion dur={`${dur}s`} begin={`${(dur / count) * i}s`} repeatCount="indefinite" path={path} />
    </circle>
  ));
}

// ════════════════════════════════════════════════════════════════════════
// SCENE 1 — HOOK
// ════════════════════════════════════════════════════════════════════════
function SceneHook() {
  return (
    <Stage>
      {/* ambient glitching scope behind */}
      <div className="absolute inset-0 opacity-60">
        <ScopeStrip id="hook-bg" color={NEON} glitch />
      </div>
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 45%, rgba(56,189,248,0.10), transparent 60%)' }} />

      <div className="relative flex-1 flex flex-col items-center justify-center text-center px-6">
        <Frag delay={0.1}><Tag color={AMBER}>Phase 01 · Curiosity</Tag></Frag>
        <div className="mt-6">
          <Headline delay={0.35}>
            Your charger is <span style={{ color: RED }}>NOT</span> constant.
          </Headline>
        </div>

        {/* sudden current spike */}
        <motion.div
          initial={{ opacity: 0, scaleY: 0.2 }}
          animate={{ opacity: [0, 1, 0.85], scaleY: [0.2, 1.4, 1] }}
          transition={{ delay: 1.0, duration: 0.5, times: [0, 0.4, 1] }}
          className="mt-10 w-full max-w-2xl"
        >
          <svg viewBox="0 0 600 140" className="w-full">
            <Defs id="hook-spike" />
            <line x1="0" y1="100" x2="600" y2="100" stroke="#1b2a4a" strokeWidth="1.5" />
            <motion.path
              d="M0 100 H210 L240 100 L255 18 L270 120 L285 60 L300 100 H600"
              fill="none"
              stroke={AMBER}
              strokeWidth="3"
              filter="url(#hook-spike-glow)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 1.0, duration: 1.1, ease: 'easeOut' }}
            />
            <text x="250" y="14" fill={AMBER} fontSize="12" fontWeight="700" textAnchor="middle">CURRENT SPIKE</text>
          </svg>
        </motion.div>

        <div className="mt-8 flex items-center gap-4">
          <Frag delay={2.0} from="left"><span className="text-xl sm:text-2xl font-semibold text-sky-200/90">It changes mode…</span></Frag>
          <Frag delay={2.6} from="right"><span className="text-xl sm:text-2xl font-semibold" style={{ color: TEAL }}>automatically.</span></Frag>
        </div>

        {/* zoom into IC */}
        <motion.div
          initial={{ opacity: 0, scale: 0.3, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 3.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-9"
        >
          <div className="relative">
            <div className="absolute -inset-4 rounded-2xl blur-2xl" style={{ background: `${NEON}30` }} />
            <div className="relative h-16 w-28 rounded-md border-2 flex items-center justify-center font-mono text-sm tracking-widest"
              style={{ borderColor: NEON, color: NEON, background: '#0a1222', boxShadow: `0 0 30px ${NEON}55` }}>
              IC
              {[...Array(4)].map((_, i) => (
                <span key={i} className="absolute -left-2 h-1 w-2" style={{ top: 12 + i * 9, background: '#475569' }} />
              ))}
              {[...Array(4)].map((_, i) => (
                <span key={i} className="absolute -right-2 h-1 w-2" style={{ top: 12 + i * 9, background: '#475569' }} />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </Stage>
  );
}

// ════════════════════════════════════════════════════════════════════════
// SCENE 2 — BATTERY EXPLODED VIEW
// ════════════════════════════════════════════════════════════════════════
function SceneBatteryAnatomy() {
  const layers = [
    { x: 70, c: AMBER, label: 'Anode', sub: '(−) graphite' },
    { x: 170, c: NEON, label: 'Separator', sub: 'porous film' },
    { x: 270, c: TEAL, label: 'Electrolyte', sub: 'ion highway' },
    { x: 370, c: GREEN, label: 'Cathode', sub: '(+) metal oxide' },
  ];
  return (
    <Stage>
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(52,211,153,0.08), transparent 65%)' }} />
      <div className="relative px-10 pt-9">
        <Frag><Tag color={TEAL}>Phase 02 · Inside the cell</Tag></Frag>
        <div className="mt-3"><Headline>What a battery is made of</Headline></div>
      </div>

      <div className="relative flex-1">
        <svg viewBox="0 0 480 300" className="absolute inset-0 h-full w-full">
          <Defs id="anat" />
          {layers.map((l, i) => (
            <motion.g
              key={l.label}
              initial={{ opacity: 0, x: 240 - l.x }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.18, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <rect x={l.x} y="70" width="58" height="150" rx="6" fill={`${l.c}1f`} stroke={l.c} strokeWidth="2" filter="url(#anat-glow)" />
              <text x={l.x + 29} y="245" textAnchor="middle" fill={l.c} fontSize="13" fontWeight="700">{l.label}</text>
              <text x={l.x + 29} y="261" textAnchor="middle" fill="#94a3b8" fontSize="10">{l.sub}</text>
              {/* gently drifting particles inside each layer */}
              {flow('anat', `M${l.x + 14} 90 V200 M${l.x + 44} 200 V90`, 3, 5 + i, l.c, 2.5)}
            </motion.g>
          ))}
          {/* terminals */}
          <rect x="40" y="120" width="14" height="50" rx="3" fill="#64748b" />
          <rect x="426" y="120" width="14" height="50" rx="3" fill="#64748b" />
          <text x="47" y="110" textAnchor="middle" fill={AMBER} fontSize="20" fontWeight="800">−</text>
          <text x="433" y="110" textAnchor="middle" fill={GREEN} fontSize="20" fontWeight="800">+</text>
        </svg>
      </div>
      <div className="relative px-10 pb-9">
        <Frag delay={1.4}><p className="text-base sm:text-lg text-sky-200/70">Four layers. Ions shuttle across the electrolyte — that motion <span className="text-white font-semibold">is</span> the stored energy.</p></Frag>
      </div>
    </Stage>
  );
}

// ════════════════════════════════════════════════════════════════════════
// SCENE 3 / 4 — DISCHARGE / CHARGE (shared engine, direction flips)
// ════════════════════════════════════════════════════════════════════════
function SceneEnergyFlow({ mode }: { mode: 'out' | 'in' }) {
  const charging = mode === 'in';
  const color = charging ? GREEN : AMBER;
  // electron path (external wire) + ion path (internal)
  const eWire = charging
    ? 'M120 70 H360 V120' // into battery (+)
    : 'M360 70 H120 V120'; // out to load
  const ionPath = charging ? 'M300 200 H180' : 'M180 200 H300';
  return (
    <Stage>
      <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 50% 50%, ${color}14, transparent 65%)` }} />
      <div className="relative px-10 pt-9">
        <Frag><Tag color={color}>{charging ? 'Phase 02 · Charging' : 'Phase 02 · Discharging'}</Tag></Frag>
        <div className="mt-3">
          <Headline>
            Energy <span style={{ color }}>{charging ? 'IN' : 'OUT'}</span>
          </Headline>
        </div>
      </div>

      <div className="relative flex-1">
        <svg viewBox="0 0 480 280" className="absolute inset-0 h-full w-full">
          <Defs id={`flow-${mode}`} />
          {/* battery body */}
          <rect x="150" y="120" width="180" height="120" rx="10" fill="#0a1222" stroke="#334766" strokeWidth="2" />
          <rect x="150" y="120" width="20" height="120" fill={`${AMBER}22`} />
          <rect x="310" y="120" width="20" height="120" fill={`${GREEN}22`} />
          <text x="160" y="180" fill={AMBER} fontSize="22" fontWeight="800" textAnchor="middle">−</text>
          <text x="320" y="180" fill={GREEN} fontSize="22" fontWeight="800" textAnchor="middle">+</text>
          <text x="240" y="262" fill="#64748b" fontSize="11" textAnchor="middle">ions move {charging ? 'back to the anode' : 'toward the cathode'}</text>

          {/* external load / charger box */}
          <rect x="200" y="30" width="80" height="36" rx="6" fill="#0a1222" stroke={color} strokeWidth="2" filter={`url(#flow-${mode}-glow)`} />
          <text x="240" y="53" fill={color} fontSize="12" fontWeight="700" textAnchor="middle">{charging ? 'CHARGER' : 'LOAD'}</text>

          {/* wires */}
          <path d="M170 120 V48 H200" fill="none" stroke="#475569" strokeWidth="2.5" />
          <path d="M280 48 H310 V120" fill="none" stroke="#475569" strokeWidth="2.5" />

          {/* electrons on external wire */}
          {flow(`flow-${mode}`, charging ? 'M310 120 V48 H200 H280' : 'M170 120 V48 H280 H200', 6, 3, NEON, 3.5)}
          {/* ions inside electrolyte */}
          {flow(`flow-${mode}`, ionPath, 5, 3.4, color, 4)}

          <text x="240" y="92" fill={NEON} fontSize="10" textAnchor="middle">e⁻ {charging ? 'pushed in' : 'do work'}</text>
        </svg>
      </div>

      <div className="relative px-10 pb-9 flex items-center gap-3">
        <Frag delay={0.8} from="left"><span className="text-base sm:text-lg" style={{ color }}>{charging ? '⚡ external source forces electrons back in' : '⚡ stored chemistry powers your device'}</span></Frag>
      </div>
    </Stage>
  );
}

// ════════════════════════════════════════════════════════════════════════
// SCENE 5 — DANGER / HEAT
// ════════════════════════════════════════════════════════════════════════
function SceneDanger() {
  return (
    <Stage>
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: [0.25, 0.6, 0.25] }}
        transition={{ duration: 2.2, repeat: Infinity }}
        style={{ background: `radial-gradient(circle at 50% 55%, ${RED}33, transparent 60%)` }}
      />
      <div className="relative px-10 pt-9">
        <Frag><Tag color={RED}>Phase 03 · Why smart charging exists</Tag></Frag>
      </div>

      <div className="relative flex-1 flex items-center justify-center">
        <svg viewBox="0 0 360 260" className="h-full w-auto">
          <Defs id="danger" />
          {/* swelling battery */}
          <motion.rect
            x="120" y="70" width="120" height="120" rx="14"
            fill={`${RED}26`} stroke={RED} strokeWidth="3" filter="url(#danger-glow)"
            animate={{ scaleX: [1, 1.12, 1], scaleY: [1, 1.06, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '180px 130px' }}
          />
          <rect x="170" y="58" width="20" height="14" rx="2" fill={RED} />
          {/* heat waves rising */}
          {[140, 180, 220].map((x, i) => (
            <motion.path
              key={x}
              d={`M${x} 70 q -8 -18 0 -34 q 8 -16 0 -32`}
              fill="none" stroke={AMBER} strokeWidth="3" strokeLinecap="round" opacity="0.8"
              animate={{ y: [0, -14, 0], opacity: [0.2, 0.9, 0.2] }}
              transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.35 }}
            />
          ))}
        </svg>
      </div>

      <div className="relative px-10 pb-12 flex flex-col sm:flex-row gap-4 justify-center">
        <Frag delay={0.5} from="left">
          <Glass glow={AMBER} className="px-5 py-3"><span className="text-lg sm:text-xl font-semibold" style={{ color: AMBER }}>Too much current = heat 🔥</span></Glass>
        </Frag>
        <Frag delay={1.0} from="right">
          <Glass glow={RED} className="px-5 py-3"><span className="text-lg sm:text-xl font-semibold" style={{ color: RED }}>Too much voltage = damage ⚠️</span></Glass>
        </Frag>
      </div>
    </Stage>
  );
}

// ════════════════════════════════════════════════════════════════════════
// SCENE 6 — THE QUESTION
// ════════════════════════════════════════════════════════════════════════
function SceneQuestion() {
  return (
    <Stage>
      <div className="absolute inset-x-0 bottom-0 h-40 opacity-50">
        <ScopeStrip id="q-bg" color={NEON} />
      </div>
      <div className="relative flex-1 flex flex-col items-center justify-center text-center px-8">
        <Frag><Tag>Phase 03</Tag></Frag>
        <div className="mt-6">
          <Headline delay={0.3}>So how do engineers control this?</Headline>
        </div>
        <motion.div
          className="mt-10 h-px w-64"
          style={{ background: `linear-gradient(90deg, transparent, ${TEAL}, transparent)` }}
          animate={{ opacity: [0.3, 1, 0.3], scaleX: [0.6, 1, 0.6] }}
          transition={{ duration: 2.4, repeat: Infinity }}
        />
        <Frag delay={1.2}><span className="mt-8 block text-sm uppercase tracking-[0.4em] text-sky-300/60">two modes. one decision.</span></Frag>
      </div>
    </Stage>
  );
}

// ════════════════════════════════════════════════════════════════════════
// SCENE 7 / 9 — CC and CV graphs (shared engine)
// ════════════════════════════════════════════════════════════════════════
function SceneMode({ mode }: { mode: 'cc' | 'cv' }) {
  const isCC = mode === 'cc';
  // CC: current flat high, voltage rising. CV: voltage flat high, current decaying.
  const flat = isCC ? 'M40 60 H440' : 'M40 60 H440'; // the held quantity (top)
  const curve = isCC
    ? 'M40 200 C 160 200, 260 120, 440 70' // voltage rising
    : 'M40 80 C 180 90, 300 170, 440 205'; // current decaying
  const heldColor = isCC ? AMBER : NEON;
  const movingColor = isCC ? NEON : AMBER;
  const heldLabel = isCC ? 'Current — held constant' : 'Voltage — held constant';
  const moveLabel = isCC ? 'Voltage — climbing' : 'Current — tapering off';
  return (
    <Stage>
      <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 50% 40%, ${heldColor}12, transparent 65%)` }} />
      <div className="relative px-10 pt-9 flex items-end justify-between">
        <div>
          <Frag><Tag color={heldColor}>{isCC ? 'Phase 04' : 'Phase 05'}</Tag></Frag>
          <div className="mt-3">
            <Headline>
              {isCC ? 'Constant Current' : 'Constant Voltage'}{' '}
              <span style={{ color: heldColor }}>{isCC ? '(CC)' : '(CV)'}</span>
            </Headline>
          </div>
          <Frag delay={0.6}><p className="mt-2 text-lg" style={{ color: movingColor }}>{isCC ? 'Fast charging phase — fill it quickly & safely' : 'Slow finish phase — top off without stress'}</p></Frag>
        </div>
      </div>

      <div className="relative flex-1">
        <svg viewBox="0 0 480 260" className="absolute inset-0 h-full w-full">
          <Defs id={`mode-${mode}`} />
          <rect x="40" y="30" width="400" height="190" fill={`url(#mode-${mode}-grid)`} opacity="0.5" />
          {/* axes */}
          <line x1="40" y1="220" x2="440" y2="220" stroke="#334766" strokeWidth="1.5" />
          <line x1="40" y1="30" x2="40" y2="220" stroke="#334766" strokeWidth="1.5" />
          <text x="240" y="245" fill="#64748b" fontSize="11" textAnchor="middle">time →</text>

          {/* held-constant line */}
          <motion.path d={flat} fill="none" stroke={heldColor} strokeWidth="3.5" strokeDasharray="2 0" filter={`url(#mode-${mode}-glow)`}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.4, duration: 1 }} />
          {/* moving quantity */}
          <motion.path d={curve} fill="none" stroke={movingColor} strokeWidth="3.5" filter={`url(#mode-${mode}-glow)`}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.9, duration: 1.4, ease: 'easeOut' }} />

          {/* travelling probe dot on the moving curve */}
          <circle r="5" fill={movingColor} filter={`url(#mode-${mode}-glow)`}>
            <animateMotion dur="2.6s" repeatCount="indefinite" path={curve} />
          </circle>
          {/* probe on the flat line too */}
          <circle r="4" fill={heldColor}>
            <animateMotion dur="2.6s" repeatCount="indefinite" path={flat} />
          </circle>

          {/* legend */}
          <g>
            <rect x="250" y="40" width="14" height="4" fill={heldColor} />
            <text x="270" y="46" fill={heldColor} fontSize="11" fontWeight="600">{heldLabel}</text>
            <rect x="250" y="58" width="14" height="4" fill={movingColor} />
            <text x="270" y="64" fill={movingColor} fontSize="11" fontWeight="600">{moveLabel}</text>
          </g>
        </svg>
      </div>
    </Stage>
  );
}

// ════════════════════════════════════════════════════════════════════════
// SCENE 8 — WHY CC WORKS (safe controlled inflow)
// ════════════════════════════════════════════════════════════════════════
function SceneWhyCC() {
  return (
    <Stage>
      <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 50% 50%, ${AMBER}10, transparent 65%)` }} />
      <div className="relative px-10 pt-9">
        <Frag><Tag color={AMBER}>Phase 04 · Why it works</Tag></Frag>
        <div className="mt-3"><Headline>A capped, steady inflow</Headline></div>
      </div>
      <div className="relative flex-1">
        <svg viewBox="0 0 480 240" className="absolute inset-0 h-full w-full">
          <Defs id="whycc" />
          {/* a limiter "valve" gating a fat stream of electrons into a cell */}
          <rect x="60" y="100" width="70" height="40" rx="6" fill="#0a1222" stroke={AMBER} strokeWidth="2" filter="url(#whycc-glow)" />
          <text x="95" y="124" fill={AMBER} fontSize="11" fontWeight="700" textAnchor="middle">LIMIT</text>
          <path d="M130 120 H300" stroke="#334766" strokeWidth="2.5" />
          {flow('whycc', 'M130 120 H300', 6, 2.6, NEON, 4)}
          {/* battery */}
          <rect x="300" y="80" width="110" height="80" rx="10" fill="#0a1222" stroke={GREEN} strokeWidth="2" />
          <text x="355" y="125" fill={GREEN} fontSize="13" fontWeight="700" textAnchor="middle">CELL</text>
          {/* fill level rising */}
          <motion.rect x="305" width="100" rx="6" fill={`${GREEN}33`}
            initial={{ y: 155, height: 0 }} animate={{ y: 90, height: 65 }} transition={{ duration: 3, ease: 'easeOut' }} />
        </svg>
      </div>
      <div className="relative px-10 pb-10 flex gap-3">
        <Frag delay={0.5} from="up"><Glass glow={AMBER} className="px-4 py-2.5"><span className="text-base sm:text-lg text-amber-200">Current never exceeds a safe ceiling</span></Glass></Frag>
        <Frag delay={1.0} from="up"><Glass glow={GREEN} className="px-4 py-2.5"><span className="text-base sm:text-lg text-emerald-200">Cell fills fast — no overheating</span></Glass></Frag>
      </div>
    </Stage>
  );
}

// ════════════════════════════════════════════════════════════════════════
// SCENE 10 — THE DECISION (ADC threshold → CC→CV switch)  ★ core moment
// ════════════════════════════════════════════════════════════════════════
function SceneDecision() {
  return (
    <Stage>
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 45%, rgba(56,189,248,0.12), transparent 60%)' }} />
      <div className="relative px-10 pt-8">
        <Frag><Tag color={NEON}>Phase 06 · The decision</Tag></Frag>
      </div>

      <div className="relative flex-1">
        <svg viewBox="0 0 480 250" className="absolute inset-0 h-full w-full">
          <Defs id="dec" />
          <rect x="36" y="24" width="408" height="170" fill="url(#dec-grid)" opacity="0.45" />
          <line x1="36" y1="194" x2="444" y2="194" stroke="#334766" strokeWidth="1.5" />
          {/* threshold line 4.2V */}
          <line x1="36" y1="64" x2="444" y2="64" stroke={RED} strokeWidth="1.5" strokeDasharray="6 5" opacity="0.8" />
          <text x="440" y="58" fill={RED} fontSize="11" fontWeight="700" textAnchor="end">threshold 4.2 V</text>

          {/* rising voltage that flattens after threshold (CC then CV) */}
          <motion.path d="M40 190 C 150 190, 210 90, 270 66 C 320 50, 380 64, 444 64"
            fill="none" stroke={NEON} strokeWidth="3.5" filter="url(#dec-glow)"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2.6, ease: 'easeOut' }} />

          {/* ADC sampling ticks along the curve */}
          {[60, 110, 160, 210, 250, 300].map((x, i) => (
            <motion.line key={x} x1={x} x2={x} y1="194" y2="40" stroke={TEAL} strokeWidth="1" opacity="0.4"
              initial={{ opacity: 0 }} animate={{ opacity: [0, 0.5, 0.15] }} transition={{ delay: i * 0.3, duration: 0.6 }} />
          ))}

          {/* the trigger burst at threshold crossing */}
          <motion.circle cx="270" cy="66" r="6" fill={RED}
            initial={{ scale: 0 }} animate={{ scale: [0, 2.4, 1], opacity: [0, 1, 1] }} transition={{ delay: 2.2, duration: 0.6 }} filter="url(#dec-glow)" />
          <motion.text x="276" y="40" fill={RED} fontSize="12" fontWeight="800"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}>SWITCH!</motion.text>
        </svg>
      </div>

      {/* step-by-step reveal + mode swap chips */}
      <div className="relative px-10 pb-9 flex flex-wrap items-center gap-3">
        <Frag delay={0.4} from="left"><span className="text-base sm:text-xl font-semibold text-sky-200">Battery voltage rises…</span></Frag>
        <Frag delay={1.4} from="left"><span className="text-base sm:text-xl font-semibold" style={{ color: AMBER }}>threshold reached…</span></Frag>
        <Frag delay={2.4} from="left"><span className="text-base sm:text-xl font-semibold" style={{ color: RED }}>mode switch triggered.</span></Frag>
        <motion.div
          className="ml-auto flex items-center gap-2 font-mono text-sm sm:text-base"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.8 }}
        >
          <span className="rounded-md px-3 py-1.5 font-bold" style={{ color: AMBER, background: `${AMBER}1a`, border: `1px solid ${AMBER}55` }}>CC</span>
          <motion.span animate={{ x: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1 }} style={{ color: TEAL }}>→</motion.span>
          <span className="rounded-md px-3 py-1.5 font-bold" style={{ color: NEON, background: `${NEON}1a`, border: `1px solid ${NEON}55` }}>CV</span>
        </motion.div>
      </div>
    </Stage>
  );
}

// ════════════════════════════════════════════════════════════════════════
// SCENE 11 — CONTROL LOOP (comparator + feedback)
// ════════════════════════════════════════════════════════════════════════
function SceneControlLoop() {
  return (
    <Stage>
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(52,219,201,0.10), transparent 65%)' }} />
      <div className="relative px-10 pt-9">
        <Frag><Tag color={TEAL}>Phase 06 · The logic</Tag></Frag>
        <div className="mt-3"><Headline>Embedded control logic</Headline></div>
      </div>
      <div className="relative flex-1">
        <svg viewBox="0 0 500 230" className="absolute inset-0 h-full w-full">
          <Defs id="loop" />
          {/* comparator */}
          <polygon points="120,70 200,110 120,150" fill="#0a1222" stroke={TEAL} strokeWidth="2" filter="url(#loop-glow)" />
          <text x="142" y="115" fill={TEAL} fontSize="16" fontWeight="800">−+</text>
          <text x="150" y="60" fill="#94a3b8" fontSize="11" textAnchor="middle">comparator</text>
          {/* reference */}
          <rect x="20" y="58" width="80" height="28" rx="5" fill="#0a1222" stroke={AMBER} strokeWidth="1.6" />
          <text x="60" y="77" fill={AMBER} fontSize="11" fontWeight="700" textAnchor="middle">Vref 4.2V</text>
          {/* driver */}
          <rect x="240" y="92" width="90" height="36" rx="6" fill="#0a1222" stroke={NEON} strokeWidth="2" />
          <text x="285" y="115" fill={NEON} fontSize="11" fontWeight="700" textAnchor="middle">DRIVER</text>
          {/* cell */}
          <rect x="380" y="84" width="90" height="52" rx="8" fill="#0a1222" stroke={GREEN} strokeWidth="2" />
          <text x="425" y="115" fill={GREEN} fontSize="12" fontWeight="700" textAnchor="middle">CELL</text>

          {/* forward path */}
          <path d="M100 72 H120 M200 110 H240 M330 110 H380" stroke="#475569" strokeWidth="2" fill="none" />
          {flow('loop', 'M200 110 H240', 3, 1.8, NEON, 3)}
          {flow('loop', 'M330 110 H380', 3, 1.8, GREEN, 3)}
          {/* feedback path */}
          <path d="M425 136 V180 H120 V150" stroke={TEAL} strokeWidth="2" fill="none" strokeDasharray="5 4" />
          {flow('loop', 'M425 136 V180 H120 V150', 4, 3.2, TEAL, 3)}
          <text x="270" y="196" fill={TEAL} fontSize="11" textAnchor="middle">feedback — measured cell voltage</text>
        </svg>
      </div>
      <div className="relative px-10 pb-10">
        <Frag delay={0.7}><p className="text-base sm:text-lg text-sky-200/70">Measure → compare to reference → correct the drive. Thousands of times a second.</p></Frag>
      </div>
    </Stage>
  );
}

// ════════════════════════════════════════════════════════════════════════
// SCENE 12 — BMS SYSTEM OVERVIEW (block diagram with flow)
// ════════════════════════════════════════════════════════════════════════
function SceneBMS() {
  const blocks = [
    { x: 24, label: 'USB', c: NEON },
    { x: 130, label: 'Charging IC', c: TEAL },
    { x: 250, label: 'Battery', c: GREEN },
    { x: 360, label: 'BMS', c: AMBER },
    { x: 452, label: 'MCU', c: NEON },
  ];
  return (
    <Stage>
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(251,191,36,0.08), transparent 65%)' }} />
      <div className="relative px-10 pt-9">
        <Frag><Tag color={AMBER}>Phase 07 · The system</Tag></Frag>
        <div className="mt-3"><Headline>Battery Management System</Headline></div>
      </div>
      <div className="relative flex-1">
        <svg viewBox="0 0 540 220" className="absolute inset-0 h-full w-full">
          <Defs id="bms" />
          <path d="M64 110 H130 M210 110 H250 M310 110 H360 M420 110 H452" stroke="#334766" strokeWidth="2.5" fill="none" />
          {flow('bms', 'M24 110 H540', 8, 4, NEON, 4)}
          {blocks.map((b, i) => (
            <motion.g key={b.label}
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.15, duration: 0.6 }}>
              <rect x={b.x} y="84" width="64" height="52" rx="9" fill="#0a1222" stroke={b.c} strokeWidth="2" filter="url(#bms-glow)" />
              <text x={b.x + 32} y="114" fill={b.c} fontSize="11" fontWeight="700" textAnchor="middle">{b.label}</text>
            </motion.g>
          ))}
          <text x="270" y="172" fill="#64748b" fontSize="11" textAnchor="middle">power & telemetry flow left → right · MCU watches everything</text>
        </svg>
      </div>
      <div className="relative px-10 pb-10 flex gap-3 flex-wrap">
        <Frag delay={1.1} from="up"><Glass glow={AMBER} className="px-4 py-2"><span className="text-amber-200">BMS = protection + monitoring + balancing</span></Glass></Frag>
      </div>
    </Stage>
  );
}

// ════════════════════════════════════════════════════════════════════════
// SCENE 13 — INSIDE THE CHARGING IC
// ════════════════════════════════════════════════════════════════════════
function SceneICInternals() {
  const blocks = [
    { x: 60, y: 70, label: 'ADC', c: NEON },
    { x: 60, y: 140, label: 'Thermal sensor', c: RED },
    { x: 220, y: 105, label: 'Control loop', c: TEAL },
    { x: 360, y: 105, label: 'Power MOSFET', c: AMBER },
  ];
  return (
    <Stage>
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(56,189,248,0.10), transparent 65%)' }} />
      <div className="relative px-10 pt-9">
        <Frag><Tag color={NEON}>Phase 07 · Zoom in</Tag></Frag>
        <div className="mt-3"><Headline>Inside the charging IC</Headline></div>
      </div>
      <div className="relative flex-1">
        <svg viewBox="0 0 480 250" className="absolute inset-0 h-full w-full">
          <Defs id="ic" />
          {/* die outline */}
          <rect x="30" y="40" width="430" height="180" rx="12" fill="rgba(56,189,248,0.03)" stroke="#1b2a4a" strokeWidth="1.5" strokeDasharray="4 5" />
          {blocks.map((b, i) => (
            <motion.g key={b.label}
              initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + i * 0.18, duration: 0.5 }}>
              <rect x={b.x} y={b.y} width="120" height="46" rx="8" fill="#0a1222" stroke={b.c} strokeWidth="2" filter="url(#ic-glow)" />
              <text x={b.x + 60} y={b.y + 28} fill={b.c} fontSize="12" fontWeight="700" textAnchor="middle">{b.label}</text>
            </motion.g>
          ))}
          {/* connections to control loop */}
          <path d="M180 93 H220 M180 163 H210 V128 H220 M340 128 H360" stroke="#334766" strokeWidth="2" fill="none" />
          {flow('ic', 'M180 93 H220', 3, 1.8, NEON, 3)}
          {flow('ic', 'M340 128 H360', 3, 1.4, AMBER, 3)}
          {/* MOSFET switching pulse */}
          <motion.rect x="360" y="105" width="120" height="46" rx="8" fill={`${AMBER}10`}
            animate={{ opacity: [0, 0.6, 0] }} transition={{ duration: 0.5, repeat: Infinity }} />
        </svg>
      </div>
      <div className="relative px-10 pb-10">
        <Frag delay={1.0}><p className="text-base sm:text-lg text-sky-200/70">Sense (ADC + thermal) → decide (control loop) → switch (MOSFET). The whole CC/CV brain on one die.</p></Frag>
      </div>
    </Stage>
  );
}

// ════════════════════════════════════════════════════════════════════════
// SCENE 14 — COMMON ICs (holographic chips)
// ════════════════════════════════════════════════════════════════════════
function SceneChips() {
  const chips = [
    { name: 'TP4056', sub: '1-cell Li-ion charger', c: TEAL },
    { name: 'BQ25895', sub: 'fast charge + boost', c: NEON },
    { name: 'MCP73831', sub: 'tiny linear charger', c: GREEN },
    { name: 'LTC4054', sub: 'standalone linear', c: AMBER },
    { name: 'DW01', sub: 'protection IC', c: RED },
  ];
  return (
    <Stage>
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 45%, rgba(52,219,201,0.10), transparent 65%)' }} />
      <div className="relative px-10 pt-9">
        <Frag><Tag color={TEAL}>Phase 07 · The hardware</Tag></Frag>
        <div className="mt-3"><Headline>Chips that do this for real</Headline></div>
      </div>
      <div className="relative flex-1 flex items-center justify-center px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 w-full max-w-3xl">
          {chips.map((chip, i) => (
            <motion.div
              key={chip.name}
              initial={{ opacity: 0, y: 24, rotateX: -30 }}
              animate={{ opacity: 1, y: [24, 0, 0], rotateX: 0 }}
              transition={{ delay: 0.3 + i * 0.22, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                className="relative rounded-xl p-4 text-center"
                style={{ background: '#0a1222', border: `1px solid ${chip.c}55` }}
                animate={{ boxShadow: [`0 0 0px ${chip.c}00`, `0 0 28px ${chip.c}55`, `0 0 6px ${chip.c}20`] }}
                transition={{ delay: 0.3 + i * 0.22, duration: 1.2 }}
              >
                {/* chip pins */}
                <div className="absolute -top-1.5 left-0 right-0 flex justify-center gap-1.5">
                  {[...Array(4)].map((_, p) => <span key={p} className="h-1.5 w-1.5 rounded-sm" style={{ background: chip.c }} />)}
                </div>
                <div className="font-mono font-bold text-lg" style={{ color: chip.c }}>{chip.name}</div>
                <div className="text-xs text-slate-400 mt-1">{chip.sub}</div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </Stage>
  );
}

// ════════════════════════════════════════════════════════════════════════
// SCENE 15 — REAL SYSTEMS
// ════════════════════════════════════════════════════════════════════════
function SceneRealSystems() {
  const sys = [
    { icon: '📡', name: 'ESP32 node', sub: 'battery IoT', c: NEON },
    { icon: '🤖', name: 'STM32 robot', sub: 'mobile power', c: TEAL },
    { icon: '🌱', name: 'Sensor node', sub: 'years on one cell', c: GREEN },
    { icon: '🚁', name: 'Drone pack', sub: 'multi-cell BMS', c: AMBER },
  ];
  return (
    <Stage>
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(56,189,248,0.10), transparent 65%)' }} />
      <div className="relative px-10 pt-9">
        <Frag><Tag color={NEON}>Phase 08 · In the wild</Tag></Frag>
        <div className="mt-3"><Headline>Everything you build runs on this</Headline></div>
      </div>
      <div className="relative flex-1 flex items-center justify-center">
        <svg viewBox="0 0 520 220" className="absolute inset-0 h-full w-full">
          <Defs id="real" />
          {/* central power core */}
          <circle cx="260" cy="110" r="30" fill="#0a1222" stroke={GREEN} strokeWidth="2.5" filter="url(#real-glow)" />
          <text x="260" y="106" fill={GREEN} fontSize="11" fontWeight="700" textAnchor="middle">CC/CV</text>
          <text x="260" y="120" fill="#94a3b8" fontSize="9" textAnchor="middle">power</text>
          {/* spokes with flowing energy to each system */}
          {[[110, 50], [410, 50], [110, 170], [410, 170]].map((p, i) => (
            <g key={i}>
              <path d={`M260 110 L${p[0]} ${p[1]}`} stroke="#334766" strokeWidth="1.8" />
              {flow('real', `M260 110 L${p[0]} ${p[1]}`, 2, 2 + i * 0.3, TEAL, 3)}
            </g>
          ))}
        </svg>
        <div className="relative grid grid-cols-2 gap-x-56 gap-y-24 sm:gap-x-72">
          {sys.map((s, i) => (
            <motion.div key={s.name}
              initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 + i * 0.18, duration: 0.6 }}>
              <Glass glow={s.c} className="px-4 py-3 text-center w-36">
                <div className="text-2xl">{s.icon}</div>
                <div className="mt-1 font-bold text-sm" style={{ color: s.c }}>{s.name}</div>
                <div className="text-[0.7rem] text-slate-400">{s.sub}</div>
              </Glass>
            </motion.div>
          ))}
        </div>
      </div>
    </Stage>
  );
}

// ════════════════════════════════════════════════════════════════════════
// SCENE 16 — FINAL AHA (full CC→CV curve takes the screen)
// ════════════════════════════════════════════════════════════════════════
function SceneFinale() {
  return (
    <Stage>
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(52,219,201,0.14), transparent 60%)' }} />
      <div className="relative flex-1">
        <svg viewBox="0 0 600 320" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid meet">
          <Defs id="fin" />
          <rect x="0" y="0" width="600" height="320" fill="url(#fin-grid)" opacity="0.4" />
          {/* CC region shading */}
          <motion.rect x="60" y="40" width="230" height="230" fill={`${AMBER}0c`}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} />
          <motion.rect x="290" y="40" width="250" height="230" fill={`${NEON}0c`}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} />
          <line x1="290" y1="40" x2="290" y2="270" stroke={TEAL} strokeWidth="1.5" strokeDasharray="6 5" opacity="0.7" />
          <text x="175" y="62" fill={AMBER} fontSize="13" fontWeight="800" textAnchor="middle">CC</text>
          <text x="415" y="62" fill={NEON} fontSize="13" fontWeight="800" textAnchor="middle">CV</text>

          {/* voltage curve: rises in CC, flat in CV */}
          <motion.path d="M60 250 C 170 250, 250 110, 290 92 C 360 70, 470 84, 540 84"
            fill="none" stroke={NEON} strokeWidth="4" filter="url(#fin-glow)"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2.4, ease: 'easeOut' }} />
          {/* current curve: flat in CC, decays in CV */}
          <motion.path d="M60 100 H290 C 360 100, 470 220, 540 244"
            fill="none" stroke={AMBER} strokeWidth="4" filter="url(#fin-glow)"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3, duration: 2.4, ease: 'easeOut' }} />

          {/* travelling probes */}
          <circle r="6" fill={NEON} filter="url(#fin-glow)">
            <animateMotion dur="4s" repeatCount="indefinite" path="M60 250 C 170 250, 250 110, 290 92 C 360 70, 470 84, 540 84" />
          </circle>
          <circle r="6" fill={AMBER} filter="url(#fin-glow)">
            <animateMotion dur="4s" repeatCount="indefinite" path="M60 100 H290 C 360 100, 470 220, 540 244" />
          </circle>

          <text x="540" y="78" fill={NEON} fontSize="12" fontWeight="700" textAnchor="end">Voltage</text>
          <text x="540" y="262" fill={AMBER} fontSize="12" fontWeight="700" textAnchor="end">Current</text>
        </svg>
      </div>
      <div className="relative pb-12 text-center px-6">
        <Frag delay={2.4}><p className="text-2xl sm:text-3xl font-bold text-white">Every charger is making real-time decisions.</p></Frag>
        <Frag delay={3.3}>
          <p className="mt-3 text-lg sm:text-xl font-semibold tracking-wide" style={{ color: TEAL }}>Now you <span className="text-white">SEE</span> it.</p>
        </Frag>
      </div>
    </Stage>
  );
}

// ════════════════════════════════════════════════════════════════════════
// SCENE REGISTRY — order = deck order
// ════════════════════════════════════════════════════════════════════════
export interface CinematicSlide {
  id: string;
  phase: string;
  title: string;
  note: string; // doubles as director sheet (timeline / transition / timing)
  Scene: React.FC<SceneProps>;
}

export const cinematicSlides: CinematicSlide[] = [
  {
    id: 'hook', phase: 'Phase 01 · Hook', title: 'Your charger is NOT constant',
    Scene: SceneHook,
    note: 'HOOK (0–8s). Open on a glitching scope trace. Headline lands → a current spike stabs upward (1.0s) → fragments "It changes mode… automatically" (2.0–2.6s) → camera zooms into the IC (3.1s). Transition in: hard cut feel via blur-in. Hold curiosity — explain nothing yet. Say: "Watch — your charger is quietly switching modes mid-charge."',
  },
  {
    id: 'anatomy', phase: 'Phase 02 · Battery intuition', title: 'Inside the cell',
    Scene: SceneBatteryAnatomy,
    note: 'BATTERY ANATOMY (0–7s). Four layers slide in from offscreen and lock into an exploded view (0.4s stagger). Particles drift continuously inside each layer. Label only: anode, separator, electrolyte, cathode. Narrate: "A battery is just two electrodes and an ion highway between them."',
  },
  {
    id: 'discharge', phase: 'Phase 02 · Discharge', title: 'Energy OUT',
    Scene: () => <SceneEnergyFlow mode="out" />,
    note: 'DISCHARGE (0–6s). Electrons stream out the external wire to the LOAD; ions drift toward the cathode inside. Big "Energy OUT". Transition from anatomy: cross-dissolve. Narrate: "Discharging — chemistry pushes electrons out to do work."',
  },
  {
    id: 'charge', phase: 'Phase 02 · Charge', title: 'Energy IN',
    Scene: () => <SceneEnergyFlow mode="in" />,
    note: 'CHARGE (0–6s). Same rig, flow reverses — the CHARGER forces electrons back in, fill bar implied. Big "Energy IN". Transition: reverse-wipe (motion mirrors discharge). Narrate: "Charging is just discharge run backwards — by force."',
  },
  {
    id: 'danger', phase: 'Phase 03 · Why smart charging', title: 'Too much = damage',
    Scene: SceneDanger,
    note: 'DANGER (0–6s). Red ambient pulse; battery swells; heat waves rise. Two glass cards land: "Too much current = heat", "Too much voltage = damage". Transition: temperature ramp (red glow fades up). Narrate: "Push too hard and it overheats, swells, or dies. So charging has to be controlled."',
  },
  {
    id: 'question', phase: 'Phase 03 · The question', title: 'How do engineers control this?',
    Scene: SceneQuestion,
    note: 'QUESTION (0–5s). Calm beat. Headline + a breathing divider line + scope baseline at the bottom. No answer yet. Transition: settle/ease. Narrate: "So how do engineers actually control it? Two modes — and one decision."',
  },
  {
    id: 'cc', phase: 'Phase 04 · Constant Current', title: 'CC mode',
    Scene: () => <SceneMode mode="cc" />,
    note: 'CC MODE (0–6s). Amber current line draws flat & steady; blue voltage curve climbs. Probes sweep both. Labels: "Constant Current (CC)", "Fast charging phase". Narrate: "Phase one — hold the current steady, let voltage rise. Fast and safe."',
  },
  {
    id: 'whycc', phase: 'Phase 04 · Why CC works', title: 'Capped, steady inflow',
    Scene: SceneWhyCC,
    note: 'WHY CC (0–6s). A LIMIT valve gates a fat electron stream into the cell; fill level rises. Cards: current capped, fills fast, no overheating. Narrate: "Capping the current is what keeps it cool while it fills quickly."',
  },
  {
    id: 'cv', phase: 'Phase 05 · Constant Voltage', title: 'CV mode',
    Scene: () => <SceneMode mode="cv" />,
    note: 'CV MODE (0–6s). Blue voltage line now flat at the top; amber current curve decays toward zero. Labels: "Constant Voltage (CV)", "Slow finish phase". Transition from CC: the held/moving roles swap — emphasise the inversion. Narrate: "Phase two — pin the voltage, let current taper. A gentle top-off."',
  },
  {
    id: 'decision', phase: 'Phase 06 · The decision', title: 'CC → CV switch',
    Scene: SceneDecision,
    note: '★ CORE MOMENT (0–9s). Voltage curve rises through CC then flattens. ADC sample ticks scan across (0–2s). At 4.2 V threshold a red burst fires "SWITCH!" (2.2s). Step fragments: "Battery voltage rises… threshold reached… mode switch triggered" (0.4/1.4/2.4s). CC→CV chips animate (2.8s). Transition: glitch on the switch. Narrate slowly: "The chip samples voltage constantly. The instant it hits the threshold — it flips from CC to CV."',
  },
  {
    id: 'loop', phase: 'Phase 06 · Control logic', title: 'Embedded control logic',
    Scene: SceneControlLoop,
    note: 'CONTROL LOOP (0–6s). Comparator vs Vref → driver → cell → feedback path animates back. Particles flow forward (blue/green) and back along feedback (teal). Narrate: "It is a feedback loop — measure, compare to a reference, correct. Thousands of times a second."',
  },
  {
    id: 'bms', phase: 'Phase 07 · The system', title: 'Battery Management System',
    Scene: SceneBMS,
    note: 'BMS OVERVIEW (0–6s). Five blocks pop in: USB → Charging IC → Battery → BMS → MCU. Energy/telemetry particles flow left→right through all of them. Narrate: "Zoom out — the charging IC is one block in the BMS: protection, monitoring, balancing, all watched by the MCU."',
  },
  {
    id: 'ic', phase: 'Phase 07 · Inside the IC', title: 'Inside the charging IC',
    Scene: SceneICInternals,
    note: 'IC INTERNALS (0–6s). Die outline; ADC + thermal sensor feed the control loop, which switches the power MOSFET (pulsing glow). Narrate: "Inside: an ADC, a thermal sensor, the control loop, and a power MOSFET doing the actual switching."',
  },
  {
    id: 'chips', phase: 'Phase 07 · Real chips', title: 'Common charging ICs',
    Scene: SceneChips,
    note: 'CHIPS (0–7s). Five chips rise like holograms and each glows once as named: TP4056, BQ25895, MCP73831, LTC4054, DW01 (protection). Narrate: "You will meet these by name — TP4056 for a single Li-ion cell, BQ25895 for fast charging, DW01 for protection."',
  },
  {
    id: 'real', phase: 'Phase 08 · Real systems', title: 'Where it runs',
    Scene: SceneRealSystems,
    note: 'REAL SYSTEMS (0–6s). A central CC/CV power core radiates energy along four spokes to ESP32 node, STM32 robot, sensor node, drone pack. Narrate: "Every battery device you build — IoT node, robot, drone — leans on this exact logic."',
  },
  {
    id: 'finale', phase: 'Phase 09 · The aha', title: 'Now you SEE it',
    Scene: SceneFinale,
    note: 'FINALE (0–9s). The full CC→CV chart fills the screen: voltage rises then flattens, current flat then decays, divider marks the handoff, probes loop forever. Text lands late: "Every charger is making real-time decisions." → "Now you SEE it." Transition: everything resolves into the waveform. End frame — hold for the outro.',
  },
];
