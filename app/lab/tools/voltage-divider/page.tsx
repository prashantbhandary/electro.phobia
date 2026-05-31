'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';

function fmtR(r: number) {
  if (!isFinite(r)) return '—';
  if (r >= 1_000_000) return `${parseFloat((r / 1_000_000).toFixed(2))}MΩ`;
  if (r >= 1000) return `${parseFloat((r / 1000).toFixed(2))}kΩ`;
  return `${Math.round(r)}Ω`;
}

const PRESETS = [3.3, 5, 9, 12];

export default function VoltageDividerPage() {
  const [vin, setVin] = useState('5');
  const [r1, setR1] = useState('10000');
  const [r2, setR2] = useState('10000');

  const Vin = parseFloat(vin) || 0;
  const R1 = parseFloat(r1) || 0;
  const R2 = parseFloat(r2) || 0;

  const Vout = useMemo(() => (R1 + R2 > 0 ? (Vin * R2) / (R1 + R2) : 0), [Vin, R1, R2]);
  const current = useMemo(() => (R1 + R2 > 0 ? Vin / (R1 + R2) : 0), [Vin, R1, R2]); // amps
  const pct = Vin > 0 ? Math.max(0, Math.min(100, (Vout / Vin) * 100)) : 0;
  const valid = R1 + R2 > 0 && Vin > 0;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6 md:p-10">
      <Link href="/lab/tools" className="text-primary hover:underline text-sm">&larr; Back to Tools</Link>

      <h1 className="mt-6 text-3xl font-bold">
        Voltage Divider <span className="text-primary">Calculator</span>
      </h1>
      <p className="mt-2 text-gray-600 max-w-xl">
        Two resistors split a voltage. This is how you read resistive sensors (LDR, thermistor) and
        scale a higher voltage down to something an ADC pin can safely measure.
      </p>

      <div className="mt-8 grid md:grid-cols-2 gap-8">
        {/* Inputs */}
        <div className="rounded-xl bg-white border border-gray-200 p-6 space-y-5">
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">Input voltage (Vin)</label>
            <div className="flex gap-2 mb-2">
              {PRESETS.map((v) => (
                <button key={v} onClick={() => setVin(String(v))}
                  className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${
                    vin === String(v) ? 'border-primary bg-primary/10 text-primary' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'}`}>
                  {v}V
                </button>
              ))}
            </div>
            <input type="number" value={vin} onChange={(e) => setVin(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1 block">R1 — top resistor (Ω)</label>
            <input type="number" value={r1} onChange={(e) => setR1(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1 block">R2 — bottom resistor, Vout across this (Ω)</label>
            <input type="number" value={r2} onChange={(e) => setR2(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary" />
            <p className="text-xs text-gray-500 mt-1">For a sensor, put the changing resistance as R1 or R2 and watch Vout move.</p>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-5">
          {/* diagram */}
          <div className="rounded-xl bg-white border border-gray-200 p-5">
            <h2 className="font-semibold mb-3">Circuit</h2>
            <svg viewBox="0 0 220 200" width="100%" style={{ display: 'block', maxHeight: 220 }}>
              <text x={92} y={16} fontSize={11} fill="#10b981" fontWeight={700}>Vin {valid ? `${Vin}V` : ''}</text>
              <line x1={100} y1={20} x2={100} y2={45} stroke="#10b981" strokeWidth={2} />
              <rect x={84} y={45} width={32} height={42} rx={4} fill="#fff" stroke="#22C0B3" strokeWidth={2} />
              <text x={124} y={70} fontSize={10} fill="#64748b">R1 {fmtR(R1)}</text>
              <line x1={100} y1={87} x2={100} y2={108} stroke="#475569" strokeWidth={2} />
              <circle cx={100} cy={108} r={3} fill="#0f172a" />
              <line x1={100} y1={108} x2={170} y2={108} stroke="#f59e0b" strokeWidth={2} />
              <text x={150} y={102} fontSize={10} fill="#f59e0b" fontWeight={700}>Vout</text>
              <rect x={84} y={108} width={32} height={42} rx={4} fill="#fff" stroke="#22C0B3" strokeWidth={2} />
              <text x={124} y={133} fontSize={10} fill="#64748b">R2 {fmtR(R2)}</text>
              <line x1={100} y1={150} x2={100} y2={172} stroke="#475569" strokeWidth={2} />
              <line x1={88} y1={172} x2={112} y2={172} stroke="#475569" strokeWidth={2.5} />
              <line x1={92} y1={177} x2={108} y2={177} stroke="#475569" strokeWidth={1.5} />
              <text x={100} y={194} textAnchor="middle" fontSize={9} fill="#94a3b8">GND</text>
            </svg>
          </div>

          {valid ? (
            <>
              <div className="rounded-xl bg-primary/10 border border-primary/30 p-5">
                <p className="text-xs text-primary uppercase tracking-wide mb-1">Output voltage</p>
                <div className="text-3xl font-bold text-primary font-mono tabular-nums">{Vout.toFixed(3)} V</div>
                <p className="text-xs text-gray-500 mt-1">Vout = Vin × R2 / (R1 + R2) = {Vin} × {fmtR(R2)} / {fmtR(R1 + R2)}</p>
                {/* bar */}
                <div className="mt-3 h-3 rounded-full bg-gray-200 overflow-hidden">
                  <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                </div>
                <p className="text-xs text-gray-500 mt-1">{pct.toFixed(0)}% of Vin</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-white border border-gray-200 p-3">
                  <p className="text-xs text-gray-500">Current through divider</p>
                  <p className="text-lg font-bold font-mono text-amber-600">{(current * 1000).toFixed(2)} mA</p>
                </div>
                <div className="rounded-lg bg-white border border-gray-200 p-3">
                  <p className="text-xs text-gray-500">Power burned</p>
                  <p className="text-lg font-bold font-mono text-orange-600">{(Vin * current * 1000).toFixed(1)} mW</p>
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-xl bg-red-50 border border-red-200 p-5 text-red-600 text-sm">
              Enter a positive Vin and at least one non-zero resistor.
            </div>
          )}

          <div className="rounded-xl bg-primary/10 border border-primary/30 p-4 text-sm text-gray-600">
            <p className="text-primary font-medium mb-1">Where you’ll use this</p>
            Reading an LDR or thermistor, scaling a 12 V battery down to the 3.3 V an ESP32 ADC can read,
            or setting a reference voltage. Keep total resistance in the kΩ range to avoid wasting current.
          </div>
        </div>
      </div>
    </div>
  );
}
