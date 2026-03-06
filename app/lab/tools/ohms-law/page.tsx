'use client';

import React, { useState } from 'react';
import Link from 'next/link';

type Quantity = 'V' | 'I' | 'R';

function safeCalc(a: number, b: number, op: 'mul' | 'div') {
  if (!isFinite(a) || !isFinite(b) || b === 0) return null;
  return op === 'mul' ? a * b : a / b;
}

function fmtV(v: number | null) {
  if (v === null || !isFinite(v)) return '—';
  if (v >= 1000)  return `${(v / 1000).toFixed(2)} kV`;
  if (v < 0.01)   return `${(v * 1000).toFixed(2)} mV`;
  return `${v.toFixed(4).replace(/\.?0+$/, '')} V`;
}
function fmtI(v: number | null) {
  if (v === null || !isFinite(v)) return '—';
  if (v < 0.001)  return `${(v * 1_000_000).toFixed(2)} µA`;
  if (v < 1)      return `${(v * 1000).toFixed(2)} mA`;
  return `${v.toFixed(4).replace(/\.?0+$/, '')} A`;
}
function fmtR(v: number | null) {
  if (v === null || !isFinite(v)) return '—';
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(2)} MΩ`;
  if (v >= 1000)      return `${(v / 1000).toFixed(2)} kΩ`;
  return `${v.toFixed(2)} Ω`;
}
function fmtP(v: number | null) {
  if (v === null || !isFinite(v)) return '—';
  if (v < 0.001)  return `${(v * 1000).toFixed(3)} mW`;
  if (v >= 1000)  return `${(v / 1000).toFixed(2)} kW`;
  return `${v.toFixed(4).replace(/\.?0+$/, '')} W`;
}

// Convert input + unit to base SI
function toBase(val: string, unit: string): number {
  const n = parseFloat(val);
  if (!isFinite(n)) return NaN;
  const multipliers: Record<string, number> = {
    'mV': 1e-3, 'V': 1, 'kV': 1e3,
    'µA': 1e-6, 'mA': 1e-3, 'A': 1,
    'Ω': 1, 'kΩ': 1e3, 'MΩ': 1e6,
  };
  return n * (multipliers[unit] ?? 1);
}

const TRIANGLE_LABEL: Record<Quantity, string> = { V: 'Voltage (V)', I: 'Current (I)', R: 'Resistance (R)' };
const TRIANGLE_COLOR: Record<Quantity, string> = { V: '#FBBF24', I: '#60A5FA', R: '#34D399' };
const TRIANGLE_UNITS: Record<Quantity, string[]> = {
  V: ['mV', 'V', 'kV'],
  I: ['µA', 'mA', 'A'],
  R: ['Ω', 'kΩ', 'MΩ'],
};

interface QState { val: string; unit: string; locked: boolean }
const DEFAULT: Record<Quantity, QState> = {
  V: { val: '',  unit: 'V',  locked: false },
  I: { val: '',  unit: 'mA', locked: false },
  R: { val: '',  unit: 'kΩ', locked: false },
};

export default function OhmsLawPage() {
  const [q, setQ] = useState<Record<Quantity, QState>>(DEFAULT);
  const [solve, setSolve] = useState<Quantity | null>(null);

  const quantities: Quantity[] = ['V', 'I', 'R'];

  // Determine which one to solve and compute
  const filled = quantities.filter(k => q[k].val !== '' && isFinite(parseFloat(q[k].val)));

  let computed: Partial<Record<Quantity, number>> = {};
  if (filled.length >= 2) {
    const V = filled.includes('V') ? toBase(q.V.val, q.V.unit) : null;
    const I = filled.includes('I') ? toBase(q.I.val, q.I.unit) : null;
    const R = filled.includes('R') ? toBase(q.R.val, q.R.unit) : null;
    if (V !== null && I !== null)       computed.R = safeCalc(V, I, 'div') ?? 0;
    else if (V !== null && R !== null)  computed.I = safeCalc(V, R, 'div') ?? 0;
    else if (I !== null && R !== null)  computed.V = safeCalc(I, R, 'mul') ?? 0;
  }

  const V_si = filled.includes('V') ? toBase(q.V.val, q.V.unit) : (computed.V ?? null);
  const I_si = filled.includes('I') ? toBase(q.I.val, q.I.unit) : (computed.I ?? null);
  const R_si = filled.includes('R') ? toBase(q.R.val, q.R.unit) : (computed.R ?? null);
  const P_si = V_si !== null && I_si !== null ? V_si * I_si : null;

  const hasSolution = Object.keys(computed).length > 0;

  function handleInput(k: Quantity, field: 'val' | 'unit', value: string) {
    setQ(prev => ({ ...prev, [k]: { ...prev[k], [field]: value } }));
  }
  function clearAll() {
    setQ(DEFAULT);
    setSolve(null);
  }

  const EXAMPLES = [
    { label: '220Ω from 5V', V: ['5','V'], I: ['','mA'], R: ['220','Ω'] },
    { label: '20mA @ 5V', V: ['5','V'], I: ['20','mA'], R: ['','Ω'] },
    { label: '100Ω @ 12V', V: ['12','V'], I: ['','mA'], R: ['100','Ω'] },
    { label: 'Series 10kΩ', V: ['','V'], I: ['1','mA'], R: ['10','kΩ'] },
  ];

  function loadExample(ex: typeof EXAMPLES[0]) {
    setQ({
      V: { val: ex.V[0], unit: ex.V[1], locked: false },
      I: { val: ex.I[0], unit: ex.I[1], locked: false },
      R: { val: ex.R[0], unit: ex.R[1], locked: false },
    });
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6 md:p-10">
      <Link href="/lab/tools" className="text-primary hover:underline text-sm">&larr; Back to Tools</Link>

      <h1 className="mt-6 text-3xl font-bold">
        Ohm&apos;s Law <span className="text-primary">Calculator</span>
      </h1>
      <p className="mt-2 text-gray-400 max-w-xl">
        Fill in any two values and the third is calculated automatically.
        Power is always computed as a bonus.
      </p>

      <div className="mt-8 grid md:grid-cols-2 gap-8">

        {/* ── Calculator ─────────────────────────────────────── */}
        <div className="rounded-xl bg-white border border-gray-200 p-6">

          {/* Visual triangle */}
          <div className="flex justify-center mb-8">
            <svg viewBox="0 0 200 160" width={200} height={160}>
              {/* Triangle */}
              <polygon points="100,10 10,150 190,150"
                fill="none" stroke="#374151" strokeWidth={2} />
              {/* V — top */}
              <circle cx={100} cy={50} r={30}
                fill={V_si !== null ? '#78350F' : '#1F2937'}
                stroke={TRIANGLE_COLOR.V} strokeWidth={2} />
              <text x={100} y={44} textAnchor="middle" fontSize={16} fontWeight="bold" fill={TRIANGLE_COLOR.V}>V</text>
              <text x={100} y={60} textAnchor="middle" fontSize={9} fill="#9CA3AF">{V_si !== null ? fmtV(V_si) : '?'}</text>
              {/* I — bottom left */}
              <circle cx={55} cy={122} r={26}
                fill={I_si !== null ? '#1E3A5F' : '#1F2937'}
                stroke={TRIANGLE_COLOR.I} strokeWidth={2} />
              <text x={55} y={116} textAnchor="middle" fontSize={16} fontWeight="bold" fill={TRIANGLE_COLOR.I}>I</text>
              <text x={55} y={130} textAnchor="middle" fontSize={9} fill="#9CA3AF">{I_si !== null ? fmtI(I_si) : '?'}</text>
              {/* R — bottom right */}
              <circle cx={145} cy={122} r={26}
                fill={R_si !== null ? '#064E3B' : '#1F2937'}
                stroke={TRIANGLE_COLOR.R} strokeWidth={2} />
              <text x={145} y={116} textAnchor="middle" fontSize={16} fontWeight="bold" fill={TRIANGLE_COLOR.R}>R</text>
              <text x={145} y={130} textAnchor="middle" fontSize={9} fill="#9CA3AF">{R_si !== null ? fmtR(R_si) : '?'}</text>
              {/* × line */}
              <line x1={100} y1={150} x2={100} y2={78}
                stroke="#374151" strokeWidth={1.5} strokeDasharray="4 2" />
            </svg>
          </div>

          {/* Inputs */}
          <div className="space-y-4">
            {quantities.map(k => {
              const isComputed = computed[k] !== undefined;
              return (
                <div key={k} className={`rounded-lg border p-4 transition-colors ${
                  isComputed ? 'border-primary bg-primary/5' : 'border-gray-700 bg-gray-800'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-lg" style={{ color: TRIANGLE_COLOR[k] }}>{k}</span>
                    <span className="text-sm text-gray-400">{TRIANGLE_LABEL[k]}</span>
                    {isComputed && (
                      <span className="ml-auto text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">calculated</span>
                    )}
                  </div>
                  {isComputed ? (
                    <div className="text-2xl font-bold font-mono tabular-nums" style={{ color: TRIANGLE_COLOR[k] }}>
                      {k === 'V' ? fmtV(computed[k]!) : k === 'I' ? fmtI(computed[k]!) : fmtR(computed[k]!)}
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={q[k].val}
                        onChange={e => handleInput(k, 'val', e.target.value)}
                        placeholder="Enter value"
                        className="flex-1 bg-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 font-mono
                          focus:outline-none focus:ring-2 focus:ring-primary border border-gray-600"
                      />
                      <select
                        value={q[k].unit}
                        onChange={e => handleInput(k, 'unit', e.target.value)}
                        className="bg-gray-700 rounded-lg px-2 py-2 text-sm text-white
                          focus:outline-none focus:ring-2 focus:ring-primary border border-gray-600"
                      >
                        {TRIANGLE_UNITS[k].map(u => <option key={u} value={u}>{u}</option>)}
                      </select>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Power result */}
          {P_si !== null && (
            <div className="mt-4 rounded-lg bg-violet-900/30 border border-violet-700 p-4">
              <div className="text-sm text-violet-400 mb-1">Power P = V × I</div>
              <div className="text-2xl font-bold font-mono text-violet-300 tabular-nums">
                {fmtP(P_si)}
              </div>
              <div className="mt-1 text-xs text-gray-500">
                Also: P = I² × R = V² / R
              </div>
            </div>
          )}

          <button onClick={clearAll}
            className="mt-4 w-full py-2 rounded-lg bg-gray-800 hover:bg-gray-200 border border-gray-700 text-sm text-gray-400">
            Clear All
          </button>
        </div>

        {/* ── Reference & Examples ──────────────────────────── */}
        <div className="space-y-6">
          {/* Formula box */}
          <div className="rounded-xl bg-white border border-gray-200 p-6">
            <h2 className="font-semibold mb-4">📐 Ohm&apos;s Law Formulas</h2>
            <div className="space-y-3">
              {[
                { label: 'Voltage',    formula: 'V = I × R', color: TRIANGLE_COLOR.V },
                { label: 'Current',    formula: 'I = V / R', color: TRIANGLE_COLOR.I },
                { label: 'Resistance', formula: 'R = V / I', color: TRIANGLE_COLOR.R },
                { label: 'Power',      formula: 'P = V × I = I² × R = V² / R', color: '#C084FC' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="w-24 text-xs text-gray-400">{item.label}</div>
                  <code className="flex-1 px-3 py-1.5 bg-gray-100 rounded text-sm font-mono"
                    style={{ color: item.color }}>
                    {item.formula}
                  </code>
                </div>
              ))}
            </div>
          </div>

          {/* Quick examples */}
          <div className="rounded-xl bg-white border border-gray-200 p-6">
            <h2 className="font-semibold mb-4">Quick Examples</h2>
            <div className="grid grid-cols-2 gap-2">
              {EXAMPLES.map(ex => (
                <button key={ex.label} onClick={() => loadExample(ex)}
                  className="rounded-lg bg-gray-800 hover:bg-gray-200 border border-gray-700 p-3 text-left text-xs">
                  <div className="font-medium text-gray-900 mb-1">{ex.label}</div>
                  <div className="text-gray-500">
                    V={ex.V[0]||'?'}{ex.V[1]} &nbsp; I={ex.I[0]||'?'}{ex.I[1]} &nbsp; R={ex.R[0]||'?'}{ex.R[1]}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Beginner tip */}
          <div className="rounded-xl bg-primary/10 border border-primary/30 p-5">
            <p className="font-semibold text-primary mb-2">🧠 Real-world intuition</p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>💧 <strong>V</strong> = water pressure (volts)</li>
              <li>🌊 <strong>I</strong> = water flow rate (amperes)</li>
              <li>🪠 <strong>R</strong> = pipe narrowness (ohms)</li>
              <li><strong>P</strong> = total power (watts = how much heat is generated)</li>
            </ul>
            <p className="mt-3 text-xs text-gray-500">
              Double the voltage → double the current.<br />
              Double the resistance → halve the current.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
