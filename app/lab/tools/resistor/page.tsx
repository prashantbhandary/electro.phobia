'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { BAND_DATA, resistanceToColorBands, colorBandsToResistance, formatResistance, bandHex } from '@/lib/lab/resistor-colors';

// E24 series standard values (×1 through ×1MΩ)
const E24_BASE = [10,11,12,13,15,16,18,20,22,24,27,30,33,36,39,43,47,51,56,62,68,75,82,91];
const E24 = E24_BASE.flatMap(v => [v, v*10, v*100, v*1000, v*10000, v*100000]);

function nearestE24(ohms: number) {
  return E24.reduce((best, v) => Math.abs(v - ohms) < Math.abs(best - ohms) ? v : best, E24[0]);
}

const DIGIT_COLORS = BAND_DATA.filter(b => b.digit !== null);
const MULT_COLORS  = BAND_DATA.filter(b => b.mult  !== null);
const TOL_COLORS   = BAND_DATA.filter(b => b.tol   !== null);

// ── Visual Resistor SVG ──────────────────────────────────────────────────────
function ResistorSVG({
  b1, b2, b3, b4, large = false,
}: { b1: string; b2: string; b3: string; b4: string; large?: boolean }) {
  const scale = large ? 2 : 1;
  const W = 200 * scale;  const H = 60 * scale;
  const bx = (x: number) => x * scale;
  const by = (y: number) => y * scale;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ display: 'block' }}>
      <defs>
        <linearGradient id="rbg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#F8EDD0" />
          <stop offset="40%"  stopColor="#EED8A0" />
          <stop offset="60%"  stopColor="#EED8A0" />
          <stop offset="100%" stopColor="#C8A850" />
        </linearGradient>
        <linearGradient id="rcap" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#CC9944" />
          <stop offset="100%" stopColor="#885522" />
        </linearGradient>
      </defs>
      {/* Left lead */}
      <rect x={0} y={by(28)} width={bx(42)} height={bx(4)} fill="#B0B0B0" rx={2} />
      {/* Right lead */}
      <rect x={bx(158)} y={by(28)} width={bx(42)} height={bx(4)} fill="#B0B0B0" rx={2} />
      {/* Body */}
      <rect x={bx(38)} y={by(12)} width={bx(124)} height={bx(36)} rx={bx(18)} fill="url(#rbg)" />
      {/* Caps */}
      <ellipse cx={bx(50)}  cy={by(30)} rx={bx(13)} ry={bx(18)} fill="url(#rcap)" />
      <ellipse cx={bx(150)} cy={by(30)} rx={bx(13)} ry={bx(18)} fill="url(#rcap)" />
      {/* Highlight */}
      <rect x={bx(52)} y={bx(12)} width={bx(96)} height={bx(8)} rx={bx(4)} fill="rgba(255,255,255,0.25)" />
      {/* Bands */}
      <rect x={bx(62)}  y={bx(12)} width={bx(16)} height={bx(36)} fill={bandHex(b1)} />
      <rect x={bx(82)}  y={bx(12)} width={bx(16)} height={bx(36)} fill={bandHex(b2)} />
      <rect x={bx(102)} y={bx(12)} width={bx(16)} height={bx(36)} fill={bandHex(b3)} />
      <rect x={bx(130)} y={bx(12)} width={bx(12)} height={bx(36)} fill={bandHex(b4)} />
    </svg>
  );
}

// ── Band Selector ─────────────────────────────────────────────────────────────
function BandSelect({
  label, value, options, onChange, accent,
}: {
  label: string;
  value: string;
  options: typeof BAND_DATA;
  onChange: (v: string) => void;
  accent: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium uppercase tracking-wide" style={{ color: accent }}>
        {label}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900
          focus:outline-none focus:ring-2 focus:ring-primary"
      >
        {options.map(b => (
          <option key={b.name} value={b.name}>
            {b.name}{b.digit !== null ? ` (${b.digit})` : ''}{b.mult !== null ? ` ×${b.mult >= 1 ? b.mult.toLocaleString() : b.mult}` : ''}{b.tol ? ` ${b.tol}` : ''}
          </option>
        ))}
      </select>
      {/* Color swatch */}
      <div className="h-2 rounded" style={{ backgroundColor: bandHex(value) }} />
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ResistorCalculatorPage() {
  // ── Decode mode (bands → value) ────────────────────────────────
  const [b1, setB1] = useState('Red');
  const [b2, setB2] = useState('Red');
  const [b3, setB3] = useState('Brown');
  const [b4, setB4] = useState('Gold');

  const decodedValue = useMemo(() => colorBandsToResistance(b1, b2, b3), [b1, b2, b3]);
  const tolerance = useMemo(() => BAND_DATA.find(b => b.name === b4)?.tol ?? '±5%', [b4]);
  const minVal = useMemo(() => decodedValue * (1 - parseFloat((tolerance ?? '5').replace('±','').replace('%','')) / 100), [decodedValue, tolerance]);
  const maxVal = useMemo(() => decodedValue * (1 + parseFloat((tolerance ?? '5').replace('±','').replace('%','')) / 100), [decodedValue, tolerance]);

  // ── Encode mode (value → bands) ────────────────────────────────
  const [inputVal, setInputVal] = useState('220');
  const [inputUnit, setInputUnit] = useState<'Ω' | 'kΩ' | 'MΩ'>('Ω');
  const ohmsFromInput = useMemo(() => {
    const n = parseFloat(inputVal) || 0;
    if (inputUnit === 'kΩ') return n * 1000;
    if (inputUnit === 'MΩ') return n * 1_000_000;
    return n;
  }, [inputVal, inputUnit]);
  const encodedBands = useMemo(() => resistanceToColorBands(ohmsFromInput), [ohmsFromInput]);
  const nearest = useMemo(() => nearestE24(ohmsFromInput), [ohmsFromInput]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6 md:p-10">
      <Link href="/lab/tools" className="text-primary hover:underline text-sm">&larr; Back to Tools</Link>

      <h1 className="mt-6 text-3xl font-bold">
        Resistor <span className="text-primary">Color Code</span> Calculator
      </h1>
      <p className="mt-2 text-gray-600 max-w-xl">
        Every resistor has colored bands that encode its value. Master these and you can read any resistor at a glance — a core skill every electronics engineer needs.
      </p>

      {/* ── MODE TABS ───────────────────────────────────────────── */}
      <div className="mt-8 grid md:grid-cols-2 gap-8">

        {/* ── DECODE: Bands → Value ─────────────────────────── */}
        <div className="rounded-xl bg-white border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-1">Bands <span className="text-gray-400">→</span> Value</h2>
          <p className="text-sm text-gray-500 mb-5">Select the color bands you see on a real resistor</p>

          {/* Visual resistor */}
          <div className="flex justify-center mb-6 bg-gray-100 rounded-lg p-4">
            <ResistorSVG b1={b1} b2={b2} b3={b3} b4={b4} large />
          </div>

          {/* Band selectors */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <BandSelect label="Band 1 (digit)" value={b1} options={DIGIT_COLORS} onChange={setB1} accent="#F59E0B" />
            <BandSelect label="Band 2 (digit)" value={b2} options={DIGIT_COLORS} onChange={setB2} accent="#F59E0B" />
            <BandSelect label="Band 3 (multiplier)" value={b3} options={MULT_COLORS} onChange={setB3} accent="#10B981" />
            <BandSelect label="Band 4 (tolerance)" value={b4} options={TOL_COLORS} onChange={setB4} accent="#9CA3AF" />
          </div>

          {/* Result */}
          <div className="rounded-lg bg-gray-50 border border-gray-200 p-4">
            <div className="text-3xl font-bold text-primary tabular-nums">
              {formatResistance(decodedValue)}
            </div>
            <div className="mt-1 text-sm text-gray-600">
              Tolerance {tolerance} → range: {formatResistance(Math.round(minVal))} – {formatResistance(Math.round(maxVal))}
            </div>
            <div className="mt-2 text-xs text-gray-500 font-mono">
              = ({BAND_DATA.find(b=>b.name===b1)?.digit ?? 0}{BAND_DATA.find(b=>b.name===b2)?.digit ?? 0}) × {BAND_DATA.find(b=>b.name===b3)?.mult?.toLocaleString()} Ω
            </div>
          </div>
        </div>

        {/* ── ENCODE: Value → Bands ─────────────────────────── */}
        <div className="rounded-xl bg-white border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-1">🔢 Value <span className="text-gray-400">→</span> Bands</h2>
          <p className="text-sm text-gray-500 mb-5">Enter a resistance, see the color code</p>

          {/* Value input */}
          <div className="flex gap-2 mb-6">
            <input
              type="number"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-lg font-mono
                text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="220"
            />
            <select
              value={inputUnit}
              onChange={e => setInputUnit(e.target.value as 'Ω' | 'kΩ' | 'MΩ')}
              className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-3 text-white
                focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="Ω">Ω</option>
              <option value="kΩ">kΩ</option>
              <option value="MΩ">MΩ</option>
            </select>
          </div>

          {/* Visual result */}
          <div className="flex justify-center mb-4 bg-gray-100 rounded-lg p-4">
            <ResistorSVG b1={encodedBands[0]} b2={encodedBands[1]} b3={encodedBands[2]} b4={encodedBands[3]} large />
          </div>

          {/* Band names */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {encodedBands.map((bName, i) => (
              <div key={i} className="text-center">
                <div className="h-8 rounded-md border border-gray-700 mb-1"
                  style={{ backgroundColor: bandHex(bName) }} />
                <div className="text-xs text-gray-400 leading-tight">{bName}</div>
                <div className="text-xs text-gray-600">
                  {i < 2 ? `digit ${i+1}` : i === 2 ? 'mult' : 'tol'}
                </div>
              </div>
            ))}
          </div>

          {/* Nearest E24 */}
          {ohmsFromInput > 0 && nearest !== ohmsFromInput && (
            <div className="rounded-md bg-amber-900/30 border border-amber-800 px-3 py-2 text-sm">
              <span className="text-amber-400">⚠ Nearest E24 standard value: </span>
              <span className="text-white font-bold">{formatResistance(nearest)}</span>
              <span className="text-gray-500 ml-2">(resistors come in standard values)</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Color band reference table ──────────────────────────── */}
      <div className="mt-10 rounded-xl bg-white border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">📊 Complete Color Band Reference</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 text-xs uppercase">
                <th className="text-left py-2 pr-4">Color</th>
                <th className="text-left py-2 pr-4">Swatch</th>
                <th className="text-center py-2 pr-4">Digit</th>
                <th className="text-center py-2 pr-4">Multiplier</th>
                <th className="text-center py-2">Tolerance</th>
              </tr>
            </thead>
            <tbody>
              {BAND_DATA.map(b => (
                <tr key={b.name} className="border-t border-gray-800 hover:bg-gray-800/50">
                  <td className="py-2 pr-4 font-medium">{b.name}</td>
                  <td className="py-2 pr-4">
                    <div className="w-10 h-5 rounded border border-gray-600"
                      style={{ backgroundColor: b.hex }} />
                  </td>
                  <td className="py-2 pr-4 text-center font-mono text-gray-600">
                    {b.digit !== null ? b.digit : '—'}
                  </td>
                  <td className="py-2 pr-4 text-center font-mono text-gray-600">
                    {b.mult !== null ? `×${b.mult >= 1 ? b.mult.toLocaleString() : b.mult}` : '—'}
                  </td>
                  <td className="py-2 text-center font-mono text-gray-600">
                    {b.tol ?? '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Memory trick ─────────────────────────── */}
      <div className="mt-8 rounded-xl bg-primary/10 border border-primary/30 p-5">
        <p className="font-semibold text-primary mb-2">🧠 Memory tip — "BB ROY of Great Britain has Very Good Wife"</p>
        <p className="text-sm text-gray-600">
          <strong className="text-gray-800">B</strong>lack (0) &nbsp;
          <strong className="text-gray-800">B</strong>rown (1) &nbsp;
          <strong className="text-red-500">R</strong>ed (2) &nbsp;
          <strong className="text-orange-500">O</strong>range (3) &nbsp;
          <strong className="text-yellow-600">Y</strong>ellow (4) &nbsp;
          <strong className="text-green-600">G</strong>reen (5) &nbsp;
          <strong className="text-blue-600">B</strong>lue (6) &nbsp;
          <strong className="text-violet-600">V</strong>iolet (7) &nbsp;
          <strong className="text-gray-500">G</strong>rey (8) &nbsp;
          <strong className="text-gray-900">W</strong>hite (9)
        </p>
        <p className="mt-2 text-sm text-gray-600">
          Then Gold = ×0.1 (5% tol), Silver = ×0.01 (10% tol). The 4th band is always Gold or Silver on common resistors.
        </p>
      </div>
    </div>
  );
}
