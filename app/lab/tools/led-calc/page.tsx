'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';

interface LEDSpec {
  color: string;
  hex: string;
  vf: number;       // typical forward voltage (V)
  ifMax: number;    // max current (mA)
  ifTyp: number;    // typical operating current (mA)
}

const LED_SPECS: LEDSpec[] = [
  { color: 'Red',        hex: '#FF3333', vf: 2.0, ifMax: 30, ifTyp: 20 },
  { color: 'Yellow',     hex: '#FFEE22', vf: 2.1, ifMax: 30, ifTyp: 20 },
  { color: 'Orange',     hex: '#FF8800', vf: 2.1, ifMax: 30, ifTyp: 20 },
  { color: 'Green',      hex: '#22AA22', vf: 2.2, ifMax: 30, ifTyp: 20 },
  { color: 'Blue',       hex: '#2244FF', vf: 3.2, ifMax: 30, ifTyp: 20 },
  { color: 'White',      hex: '#FFFFFF', vf: 3.3, ifMax: 30, ifTyp: 20 },
  { color: 'IR (940nm)', hex: '#8800AA', vf: 1.2, ifMax: 50, ifTyp: 20 },
];

const SUPPLY_PRESETS = [3.3, 5, 6, 9, 12];

function nearestE24(r: number): number {
  const E24 = [10,11,12,13,15,16,18,20,22,24,27,30,33,36,39,43,47,51,56,62,68,75,82,91];
  const vals = E24.flatMap(v => [v, v*10, v*100, v*1000, v*10000, v*100000]);
  return vals.reduce((b, v) => Math.abs(v - r) < Math.abs(b - r) ? v : b, vals[0]);
}

function fmtR(r: number) {
  if (r >= 1000) return `${(r/1000).toFixed(1).replace(/\.0$/,'')}kΩ`;
  return `${Math.round(r)}Ω`;
}

export default function LEDCalcPage() {
  const [ledIdx, setLedIdx]     = useState(0);
  const [vfCustom, setVfCustom] = useState('');
  const [supply, setSupply]     = useState('5');
  const [ifMa, setIfMa]         = useState('20');

  const led = LED_SPECS[ledIdx];
  const Vf  = vfCustom !== '' ? parseFloat(vfCustom) : led.vf;
  const Vs  = parseFloat(supply) || 5;
  const If  = (parseFloat(ifMa) || 20) / 1000; // to Amps

  const R     = useMemo(() => (Vs - Vf) / If,    [Vs, Vf, If]);
  const Rn    = useMemo(() => nearestE24(R),       [R]);
  const If_n  = useMemo(() => (Vs - Vf) / Rn,     [Vs, Vf, Rn]);
  const P_R   = useMemo(() => (Vs - Vf) * If,      [Vs, Vf, If]);
  const P_LED = useMemo(() => Vf * If,              [Vf, If]);

  const isValid = isFinite(R) && R > 0;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6 md:p-10">
      <Link href="/lab/tools" className="text-primary hover:underline text-sm">&larr; Back to Tools</Link>

      <h1 className="mt-6 text-3xl font-bold">
        LED Resistor <span className="text-primary">Calculator</span>
      </h1>
      <p className="mt-2 text-gray-400 max-w-xl">
        LEDs burn out without a current-limiting resistor. This tool tells you exactly which resistor
        to use for any LED color and supply voltage.
      </p>

      <div className="mt-8 grid md:grid-cols-2 gap-8">

        {/* ── Inputs ─────────────────────────────────────────── */}
        <div className="rounded-xl bg-white border border-gray-200 p-6 space-y-5">

          {/* LED color */}
          <div>
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2 block">
              LED Color
            </label>
            <div className="grid grid-cols-4 gap-2">
              {LED_SPECS.map((l, i) => (
                <button key={l.color} onClick={() => { setLedIdx(i); setVfCustom(''); }}
                  className={`rounded-lg border py-2 px-1 text-xs font-medium transition-all ${
                    i === ledIdx
                      ? 'border-white bg-gray-700 scale-105'
                      : 'border-gray-700 bg-gray-800 hover:bg-gray-200'
                  }`}>
                  <div className="w-full h-4 rounded-sm mb-1 mx-auto"
                    style={{ backgroundColor: l.hex, maxWidth: '40px' }} />
                  {l.color}
                </button>
              ))}
            </div>
          </div>

          {/* Supply voltage */}
          <div>
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2 block">
              Supply Voltage (Vs)
            </label>
            <div className="flex gap-2 mb-2">
              {SUPPLY_PRESETS.map(v => (
                <button key={v} onClick={() => setSupply(String(v))}
                  className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${
                    supply === String(v)
                      ? 'border-primary bg-primary/20 text-primary'
                      : 'border-gray-700 bg-gray-800 hover:bg-gray-200'
                  }`}>
                  {v}V
                </button>
              ))}
            </div>
            <input type="number" value={supply} onChange={e => setSupply(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono
                text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Custom voltage" />
          </div>

          {/* Forward voltage override */}
          <div>
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1 block">
              Forward Voltage Vf — <span className="text-primary">{led.color}</span> default: {led.vf}V
            </label>
            <input type="number" value={vfCustom}
              onChange={e => setVfCustom(e.target.value)}
              placeholder={`${led.vf} (from datasheet)`}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono
                text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary" />
            <p className="text-xs text-gray-600 mt-1">Leave blank to use typical value for selected color</p>
          </div>

          {/* Desired current */}
          <div>
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1 block">
              Desired LED current (If)
            </label>
            <div className="flex gap-2">
              <input type="number" value={ifMa} onChange={e => setIfMa(e.target.value)}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono
                  text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary" />
              <span className="flex items-center px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-400">mA</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Max: {led.ifMax}mA — typical: {led.ifTyp}mA. Use 10–20mA for normal brightness.
            </p>
          </div>
        </div>

        {/* ── Results ─────────────────────────────────────────── */}
        <div className="space-y-5">

          {/* Circuit diagram */}
          <div className="rounded-xl bg-white border border-gray-200 p-5">
            <h2 className="font-semibold mb-4">Circuit</h2>
            <svg viewBox="0 0 300 80" width="100%" style={{ display: 'block' }}>
              {/* Supply + terminal */}
              <text x={10} y={45} fontSize={10} fill="#FBBF24">+{Vs}V</text>
              <line x1={40} y1={40} x2={70} y2={40} stroke="#FBBF24" strokeWidth={2} />
              {/* Resistor */}
              <rect x={70} y={32} width={50} height={16} rx={8} fill="#EED8A0" />
              <text x={95} y={44} textAnchor="middle" fontSize={9} fill="#78350F">
                {isValid ? fmtR(Rn) : '??'}
              </text>
              <line x1={120} y1={40} x2={150} y2={40} stroke="#9CA3AF" strokeWidth={2} />
              {/* LED */}
              <polygon points="150,28 150,52 175,40" fill={led.hex} opacity={0.9} />
              <line x1={175} y1={28} x2={175} y2={52} stroke={led.hex} strokeWidth={3} />
              {/* Cathode */}
              <line x1={175} y1={40} x2={210} y2={40} stroke="#9CA3AF" strokeWidth={2} />
              {/* GND */}
              <line x1={210} y1={40} x2={210} y2={65} stroke="#9CA3AF" strokeWidth={2} />
              <line x1={200} y1={65} x2={220} y2={65} stroke="#9CA3AF" strokeWidth={2.5} />
              <line x1={205} y1={70} x2={215} y2={70} stroke="#9CA3AF" strokeWidth={1.5} />
              <line x1={208} y1={75} x2={212} y2={75} stroke="#9CA3AF" strokeWidth={1} />
              <text x={210} y={30} textAnchor="middle" fontSize={9} fill="#9CA3AF">GND</text>
              {/* Current label */}
              {isValid && (
                <text x={165} y={18} textAnchor="middle" fontSize={8} fill="#60A5FA">
                  If = {(If*1000).toFixed(1)}mA
                </text>
              )}
              {/* Glow */}
              {isValid && (
                <circle cx={162} cy={40} r={16} fill={led.hex} opacity={0.12} />
              )}
            </svg>
          </div>

          {/* Calculated R */}
          {isValid ? (
            <>
              <div className="rounded-xl bg-amber-900/30 border border-amber-700 p-5">
                <p className="text-xs text-amber-400 uppercase tracking-wide mb-1">Exact Resistor</p>
                <div className="text-3xl font-bold text-amber-300 font-mono tabular-nums">
                  {fmtR(R)}
                </div>
                <p className="text-xs text-gray-500 mt-1">R = (Vs − Vf) / If = ({Vs} − {Vf}) / {(If*1000).toFixed(0)}mA</p>
              </div>

              <div className="rounded-xl bg-green-900/30 border border-green-700 p-5">
                <p className="text-xs text-green-400 uppercase tracking-wide mb-1">
                  Nearest Standard E24 Value — <span className="text-green-300">use this one</span>
                </p>
                <div className="text-3xl font-bold text-green-300 font-mono tabular-nums">
                  {fmtR(Rn)}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  → actual If = {(If_n * 1000).toFixed(1)}mA &nbsp;·&nbsp;
                  resistor dissipates {(P_R * 1000).toFixed(0)}mW &nbsp;·&nbsp;
                  use ≥ ¼W (250mW) rated resistor
                </p>
              </div>

              {/* Power budget */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-gray-900 border border-gray-700 p-3">
                  <p className="text-xs text-gray-500">Resistor power</p>
                  <p className="text-lg font-bold font-mono text-orange-400">{(P_R * 1000).toFixed(0)} mW</p>
                </div>
                <div className="rounded-lg bg-gray-900 border border-gray-700 p-3">
                  <p className="text-xs text-gray-500">LED power</p>
                  <p className="text-lg font-bold font-mono" style={{ color: led.hex }}>{(P_LED * 1000).toFixed(0)} mW</p>
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-xl bg-red-900/30 border border-red-800 p-5 text-red-400">
              ⚠ Supply voltage must be greater than LED forward voltage ({Vf}V).
              Choose a higher Vs.
            </div>
          )}

          {/* Tip */}
          <div className="rounded-xl bg-primary/10 border border-primary/30 p-4 text-sm text-gray-600">
            <p className="text-primary font-medium mb-1">Why this matters</p>
            Without a resistor, an LED connected to 5V draws <strong>hundreds of mA</strong> — it burns
            out in seconds and can damage your Arduino pin. A 220Ω or 330Ω resistor is the #1 most
            used component in beginner projects for exactly this reason.
          </div>
        </div>
      </div>
    </div>
  );
}
