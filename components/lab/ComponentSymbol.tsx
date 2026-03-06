'use client';

import React from 'react';
import { resistanceToColorBands, bandHex } from '@/lib/lab/resistor-colors';
import type { SimComponentState } from '@/lib/lab/types';

export interface SymbolProps {
  defId: string;
  width: number;
  height: number;
  simState?: SimComponentState;
  time?: number;
  properties?: Record<string, string | number | boolean>;
  instanceId?: string;
}

// ─── LED Color palettes ───────────────────────────────────────────────────────
const LED_PAL: Record<string, { hi: string; lo: string; glow: string; rays: string }> = {
  red:    { hi: '#FF3333', lo: '#4A1010', glow: '#FF0000', rays: '#FF6666' },
  green:  { hi: '#33FF55', lo: '#0D3D18', glow: '#00DD44', rays: '#66FFaa' },
  blue:   { hi: '#3366FF', lo: '#0D1A4A', glow: '#2244FF', rays: '#6699FF' },
  yellow: { hi: '#FFEE22', lo: '#3D3A00', glow: '#FFCC00', rays: '#FFEE88' },
  white:  { hi: '#FFFFFF', lo: '#2A2A3A', glow: '#AACCFF', rays: '#FFFFFF' },
  orange: { hi: '#FF8822', lo: '#3D2200', glow: '#FF6600', rays: '#FFaa55' },
};

// ─── Shared SVG Defs (include once inside the CircuitBuilder <svg>) ───────────
export function ComponentSVGDefs() {
  return (
    <>
      {/* Resistor body gradient — warm cream/tan */}
      <linearGradient id="res-body" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%"   stopColor="#F8EDD0" />
        <stop offset="40%"  stopColor="#EED8A0" />
        <stop offset="60%"  stopColor="#EED8A0" />
        <stop offset="100%" stopColor="#C8A850" />
      </linearGradient>
      <linearGradient id="res-cap" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%"   stopColor="#CC9944" />
        <stop offset="100%" stopColor="#885522" />
      </linearGradient>

      {/* Capacitor body */}
      <linearGradient id="cap-body" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stopColor="#555566" />
        <stop offset="100%" stopColor="#2A2A3A" />
      </linearGradient>

      {/* PCB gradient (Arduino / ESP32) */}
      <linearGradient id="pcb-grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%"   stopColor="#1A6432" />
        <stop offset="100%" stopColor="#0A3A1C" />
      </linearGradient>
      <linearGradient id="esp-grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%"   stopColor="#2A3A6A" />
        <stop offset="100%" stopColor="#141E3A" />
      </linearGradient>

      {/* IC chip gradient */}
      <linearGradient id="ic-body" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%"   stopColor="#2C2C3C" />
        <stop offset="100%" stopColor="#111118" />
      </linearGradient>

      {/* Metal lead */}
      <linearGradient id="lead-grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%"   stopColor="#DDDDDD" />
        <stop offset="50%"  stopColor="#AAAAAA" />
        <stop offset="100%" stopColor="#888888" />
      </linearGradient>

      {/* LED Glow filters — one per color */}
      {(Object.keys(LED_PAL) as Array<keyof typeof LED_PAL>).map(colorName => (
        <filter key={colorName} id={`led-glow-${colorName}`}
          x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      ))}

      {/* Soft drop shadow for components */}
      <filter id="comp-shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="1" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.5" />
      </filter>
    </>
  );
}

// ─── Main symbol renderer ─────────────────────────────────────────────────────
export default function ComponentSymbol({
  defId, width: w, height: h, simState, time = 0, properties, instanceId: _iid,
}: SymbolProps) {
  const hw = w / 2;
  const hh = h / 2;
  const on  = simState?.active ?? false;
  const bri = simState?.brightness ?? 0;
  const spin = simState?.spinning ?? false;
  const isHigh = simState?.high ?? false;

  switch (defId) {

    // ── Battery ──────────────────────────────────────────────────────────────
    case 'battery': {
      const volts = String(properties?.voltage ?? 9);
      return (
        <g filter="url(#comp-shadow)">
          {/* Body */}
          <rect x={-hw + 4} y={-14} width={w - 8} height={28} rx={5}
            fill="#3A3A3A" stroke="#555" strokeWidth={1} />
          {/* Cell lines */}
          <line x1={-8} y1={-12} x2={-8} y2={12} stroke="#DDD" strokeWidth={3} />
          <line x1={-2} y1={-9}  x2={-2} y2={9}  stroke="#888" strokeWidth={2} />
          <line x1={4}  y1={-12} x2={4}  y2={12} stroke="#DDD" strokeWidth={3} />
          <line x1={10} y1={-9}  x2={10} y2={9}  stroke="#888" strokeWidth={2} />
          {/* + cap */}
          <rect x={hw - 10} y={-8} width={10} height={16} rx={3} fill="#10B981" />
          <text x={hw - 5} y={4} fontSize={8} fill="#FFF" fontWeight="bold" textAnchor="middle">+</text>
          {/* − cap */}
          <rect x={-hw} y={-6} width={8} height={12} rx={2} fill="#EF4444" />
          <text x={-hw + 4} y={4} fontSize={8} fill="#FFF" fontWeight="bold" textAnchor="middle">−</text>
          {/* Voltage label */}
          <text x={7} y={4} fontSize={8} fill="#D1D5DB" textAnchor="middle">{volts}V</text>
        </g>
      );
    }

    // ── Power supply VCC ─────────────────────────────────────────────────────
    case 'power_supply': {
      const volts = String(properties?.voltage ?? 5);
      return (
        <g>
          <rect x={-20} y={-16} width={40} height={26} rx={5} fill="#1D4ED8" stroke="#3B82F6" strokeWidth={1} />
          <text x={0} y={-4} fontSize={10} fill="#BFDBFE" textAnchor="middle" fontWeight="bold">VCC</text>
          <text x={0} y={7} fontSize={8} fill="#93C5FD" textAnchor="middle">{volts}V</text>
          {/* Arrow down */}
          <line x1={0} y1={10} x2={0} y2={20} stroke="#60A5FA" strokeWidth={2} />
          <polygon points="0,20 -4,14 4,14" fill="#60A5FA" />
        </g>
      );
    }

    // ── Ground ───────────────────────────────────────────────────────────────
    case 'ground':
      return (
        <g>
          <line x1={0} y1={-18} x2={0} y2={-4} stroke="#9CA3AF" strokeWidth={2} />
          <line x1={-16} y1={-4}  x2={16} y2={-4}  stroke="#9CA3AF" strokeWidth={2.5} />
          <line x1={-11} y1={2}   x2={11} y2={2}   stroke="#9CA3AF" strokeWidth={2} />
          <line x1={-6}  y1={8}   x2={6}  y2={8}   stroke="#9CA3AF" strokeWidth={1.5} />
          <line x1={-2}  y1={14}  x2={2}  y2={14}  stroke="#9CA3AF" strokeWidth={1} />
          <text x={0} y={22} fontSize={7} fill="#6B7280" textAnchor="middle">GND</text>
        </g>
      );

    // ── Resistor ─────────────────────────────────────────────────────────────
    case 'resistor': {
      const resistance = Number(properties?.resistance ?? 220);
      const [b1, b2, b3, b4] = resistanceToColorBands(resistance);
      const bc = bandHex;
      // Body spans from -20 to +20, leads from -35 to -20 and +20 to +35
      return (
        <g filter="url(#comp-shadow)">
          {/* Leads */}
          <rect x={-hw} y={-1.5} width={hw - 20} height={3} fill="url(#lead-grad)" rx={1} />
          <rect x={20}   y={-1.5} width={hw - 20} height={3} fill="url(#lead-grad)" rx={1} />
          {/* Body */}
          <rect x={-20} y={-9} width={40} height={18} rx={9} fill="url(#res-body)" />
          {/* End-cap shading (cylinder illusion) */}
          <ellipse cx={-18} cy={0} rx={3.5} ry={9} fill="url(#res-cap)" />
          <ellipse cx={18}  cy={0} rx={3.5} ry={9} fill="url(#res-cap)" />
          {/* Top highlight */}
          <rect x={-17} y={-9} width={34} height={5} rx={3} fill="rgba(255,255,255,0.22)" />
          {/* Color bands */}
          <rect x={-13} y={-9} width={5} height={18} fill={bc(b1)} rx={1} />
          <rect x={-6}  y={-9} width={5} height={18} fill={bc(b2)} rx={1} />
          <rect x={1}   y={-9} width={5} height={18} fill={bc(b3)} rx={1} />
          {/* Tolerance band (spaced away) */}
          <rect x={10}  y={-9} width={4} height={18} fill={bc(b4)} rx={1} />
          {/* Resistance label below */}
          <text x={0} y={16} fontSize={7} fill="#9CA3AF" textAnchor="middle">
            {resistance >= 1000 ? `${resistance / 1000}k` : resistance}Ω
          </text>
        </g>
      );
    }

    // ── LED ──────────────────────────────────────────────────────────────────
    case 'led': {
      const color = String(properties?.color ?? 'red') as keyof typeof LED_PAL;
      const pal   = LED_PAL[color] ?? LED_PAL.red;
      const bodyFill = on ? pal.hi : pal.lo;
      const borderC  = on ? pal.hi : '#555';
      const glowAmt  = on ? Math.max(0.4, bri) : 0;
      return (
        <g filter={on ? `url(#led-glow-${color})` : undefined}>
          {/* Outer glow halo */}
          {on && (
            <ellipse cx={-2} cy={0} rx={22} ry={18}
              fill={pal.glow} opacity={glowAmt * 0.35} />
          )}
          {/* Leads */}
          <rect x={-hw} y={-1.5} width={hw - 12} height={3} fill="url(#lead-grad)" rx={1} />
          <rect x={12}  y={-1.5} width={hw - 12} height={3} fill="url(#lead-grad)" rx={1} />
          {/* LED triangle body (schematic — anode left, cathode right) */}
          <polygon points={`-12,-12 -12,12 12,0`}
            fill={bodyFill}
            stroke={borderC} strokeWidth={1.5}
            opacity={on ? 1 : 0.7} />
          {/* Cathode bar */}
          <line x1={12} y1={-13} x2={12} y2={13}
            stroke={borderC} strokeWidth={2.5} />
          {/* Polarity labels */}
          <text x={-hw + 3} y={-7} fontSize={7} fill={on ? pal.rays : '#555'}>+</text>
          <text x={hw - 5}  y={-7} fontSize={7} fill="#555">−</text>
          {/* Light rays when active */}
          {on && (
            <>
              <line x1={16} y1={-12} x2={23} y2={-20}
                stroke={pal.rays} strokeWidth={1.5} strokeLinecap="round" opacity={0.9} />
              <line x1={18} y1={-5}  x2={26} y2={-9}
                stroke={pal.rays} strokeWidth={1.5} strokeLinecap="round" opacity={0.9} />
              <line x1={14} y1={-17} x2={20} y2={-24}
                stroke={pal.rays} strokeWidth={1}   strokeLinecap="round" opacity={0.6} />
              <line x1={20} y1={-1}  x2={27} y2={-3}
                stroke={pal.rays} strokeWidth={1}   strokeLinecap="round" opacity={0.6} />
            </>
          )}
          {/* Color dot */}
          <circle cx={0} cy={0} r={3} fill={on ? '#FFF' : '#333'} opacity={on ? 0.7 : 0.3} />
        </g>
      );
    }

    // ── Push Button ──────────────────────────────────────────────────────────
    case 'push_button': {
      const pressed = Boolean(properties?.pressed ?? false);
      return (
        <g filter="url(#comp-shadow)">
          {/* Base housing */}
          <rect x={-20} y={-20} width={40} height={40} rx={4}
            fill={pressed ? '#064E3B' : '#1F2937'} stroke={pressed ? '#10B981' : '#374151'} strokeWidth={1.5} />
          {/* PCB pads (4 corners) */}
          <rect x={-18} y={-18} width={6}  height={6}  rx={1} fill="#B45309" />
          <rect x={12}  y={-18} width={6}  height={6}  rx={1} fill="#B45309" />
          <rect x={-18} y={12}  width={6}  height={6}  rx={1} fill="#B45309" />
          <rect x={12}  y={12}  width={6}  height={6}  rx={1} fill="#B45309" />
          {/* Button cap */}
          <circle cx={0} cy={0} r={11}
            fill={pressed ? '#10B981' : '#374151'}
            stroke={pressed ? '#6EE7B7' : '#4B5563'} strokeWidth={2} />
          <circle cx={0} cy={0} r={7}
            fill={pressed ? '#D1FAE5' : '#1F2937'} />
          {/* Highlight */}
          {!pressed && (
            <ellipse cx={-3} cy={-3} rx={3} ry={2} fill="rgba(255,255,255,0.15)" />
          )}
          <text x={0} y={28} fontSize={7} fill="#6B7280" textAnchor="middle">BTN</text>
          <text x={0} y={-22} fontSize={6} fill={pressed ? '#10B981' : '#4B5563'} textAnchor="middle">
            {pressed ? 'PRESSED' : 'CLICK'}
          </text>
        </g>
      );
    }

    // ── Switch ───────────────────────────────────────────────────────────────
    case 'switch': {
      const closed = Boolean(properties?.closed ?? false);
      return (
        <g>
          {/* Body */}
          <rect x={-hw + 4} y={-13} width={w - 8} height={26} rx={4}
            fill={closed ? '#064E3B' : '#1F2937'} stroke={closed ? '#059669' : '#374151'} strokeWidth={1} />
          {/* Contact dots */}
          <circle cx={-16} cy={0} r={3} fill="#9CA3AF" />
          <circle cx={16}  cy={0} r={3} fill="#9CA3AF" />
          {/* Toggle arm */}
          {closed
            ? <line x1={-16} y1={0} x2={16} y2={0} stroke="#10B981" strokeWidth={2.5} />
            : <line x1={-16} y1={0} x2={12} y2={-11} stroke="#6B7280" strokeWidth={2} />
          }
          <text x={0} y={16} fontSize={7} fill={closed ? '#10B981' : '#6B7280'} textAnchor="middle">
            {closed ? 'ON' : 'OFF'}
          </text>
        </g>
      );
    }

    // ── Potentiometer ────────────────────────────────────────────────────────
    case 'potentiometer': {
      const val  = Number(properties?.value ?? 0.5); // 0–1
      const angle = val * 280 - 140; // −140° to +140°
      const rad  = (angle * Math.PI) / 180;
      const kx   = Math.sin(rad) * 14;
      const ky   = -Math.cos(rad) * 14;
      return (
        <g filter="url(#comp-shadow)">
          {/* Body */}
          <rect x={-hw + 4} y={-hh + 4} width={w - 8} height={h - 8} rx={5}
            fill="#312E81" stroke="#4338CA" strokeWidth={1} />
          {/* Resistive track arc — background */}
          <circle cx={0} cy={0} r={17} fill="none" stroke="#1E1B4B" strokeWidth={5}
            strokeDasharray="75 30" strokeDashoffset="15" />
          {/* Wiper indicator */}
          <line x1={0} y1={0} x2={kx} y2={ky} stroke="#818CF8" strokeWidth={2} strokeLinecap="round" />
          <circle cx={0} cy={0} r={4} fill="#6366F1" />
          <circle cx={kx} cy={ky} r={2.5} fill="#A5B4FC" />
          {/* Value % */}
          <text x={0} y={hh - 6} fontSize={7} fill="#C7D2FE" textAnchor="middle">
            {Math.round(val * 100)}%
          </text>
          <text x={0} y={-hh + 12} fontSize={6} fill="#818CF8" textAnchor="middle">POT</text>
        </g>
      );
    }

    // ── Diode ────────────────────────────────────────────────────────────────
    case 'diode': {
      const fwd = on; // conducting
      return (
        <g>
          {/* Leads */}
          <rect x={-hw} y={-1.5} width={hw - 14} height={3} fill="url(#lead-grad)" rx={1} />
          {/* Body band (cathode end) */}
          <rect x={-hw + (hw - 14)} y={-8} width={28} height={16} rx={8}
            fill={fwd ? '#1D4ED8' : '#1E3A5F'} stroke={fwd ? '#60A5FA' : '#374151'} strokeWidth={1} />
          {/* Silver cathode stripe */}
          <rect x={10} y={-8} width={4} height={16} rx={1} fill="#D0D0D0" />
          <rect x={14} y={-1.5} width={hw - 14} height={3} fill="url(#lead-grad)" rx={1} />
          {/* Arrow showing current direction */}
          <polygon points="-8,-7 -8,7 6,0" fill={fwd ? '#60A5FA' : '#1E40AF'} />
          {/* Conducting glow */}
          {fwd && <circle cx={0} cy={0} r={12} fill="#3B82F6" opacity={0.2} />}
          <text x={0} y={-12} fontSize={6} fill={fwd ? '#60A5FA' : '#4B5563'} textAnchor="middle">
            {fwd ? '→I→' : '1N4007'}
          </text>
        </g>
      );
    }

    // ── NPN Transistor ───────────────────────────────────────────────────────
    case 'npn_transistor': {
      return (
        <g filter="url(#comp-shadow)">
          {/* TO-92 package body */}
          <path d={`
            M -20,-30 A 30 30 0 0 1 20,-30
            L 28,0 A 30 30 0 0 1 -28,0 Z
          `} fill="url(#ic-body)" stroke="#374151" strokeWidth={1.5} />
          {/* Package D-flat marking */}
          <line x1={-20} y1={-30} x2={20} y2={-30} stroke="#555" strokeWidth={2} />
          {/* 3 leads */}
          <rect x={-16} y={-2} width={4} height={28} rx={2} fill="url(#lead-grad)" />
          <rect x={-2}  y={-2} width={4} height={28} rx={2} fill="url(#lead-grad)" />
          <rect x={12}  y={-2} width={4} height={28} rx={2} fill="url(#lead-grad)" />
          {/* Labels */}
          <text x={-14} y={34} fontSize={7} fill="#9CA3AF" textAnchor="middle">E</text>
          <text x={0}   y={34} fontSize={7} fill="#FCD34D" textAnchor="middle">B</text>
          <text x={14}  y={34} fontSize={7} fill="#9CA3AF" textAnchor="middle">C</text>
          {/* Part number */}
          <text x={0} y={-16} fontSize={6.5} fill="#6B7280" textAnchor="middle">NPN</text>
          {/* Conducting indicator */}
          {on && <circle cx={0} cy={-8} r={5} fill="#10B981" opacity={0.6} />}
        </g>
      );
    }

    // ── PNP Transistor ───────────────────────────────────────────────────────
    case 'pnp_transistor': {
      return (
        <g filter="url(#comp-shadow)">
          <path d={`M -20,-30 A 30 30 0 0 1 20,-30 L 28,0 A 30 30 0 0 1 -28,0 Z`}
            fill="url(#ic-body)" stroke="#374151" strokeWidth={1.5} />
          <line x1={-20} y1={-30} x2={20} y2={-30} stroke="#555" strokeWidth={2} />
          <rect x={-16} y={-2} width={4} height={28} rx={2} fill="url(#lead-grad)" />
          <rect x={-2}  y={-2} width={4} height={28} rx={2} fill="url(#lead-grad)" />
          <rect x={12}  y={-2} width={4} height={28} rx={2} fill="url(#lead-grad)" />
          <text x={-14} y={34} fontSize={7} fill="#9CA3AF" textAnchor="middle">E</text>
          <text x={0}   y={34} fontSize={7} fill="#FCD34D" textAnchor="middle">B</text>
          <text x={14}  y={34} fontSize={7} fill="#9CA3AF" textAnchor="middle">C</text>
          <text x={0}   y={-16} fontSize={6.5} fill="#6B7280" textAnchor="middle">PNP</text>
          {on && <circle cx={0} cy={-8} r={5} fill="#A78BFA" opacity={0.6} />}
        </g>
      );
    }

    // ── N-Channel MOSFET ─────────────────────────────────────────────────────
    case 'nmos_transistor': {
      return (
        <g filter="url(#comp-shadow)">
          <path d={`M -20,-30 A 30 30 0 0 1 20,-30 L 28,0 A 30 30 0 0 1 -28,0 Z`}
            fill="#1E1B2E" stroke={on ? '#7C3AED' : '#374151'} strokeWidth={1.5} />
          <line x1={-20} y1={-30} x2={20} y2={-30} stroke="#555" strokeWidth={2} />
          <rect x={-16} y={-2} width={4} height={28} rx={2} fill="url(#lead-grad)" />
          <rect x={-2}  y={-2} width={4} height={28} rx={2} fill="url(#lead-grad)" />
          <rect x={12}  y={-2} width={4} height={28} rx={2} fill="url(#lead-grad)" />
          <text x={-14} y={34} fontSize={7} fill="#A78BFA" textAnchor="middle">S</text>
          <text x={0}   y={34} fontSize={7} fill="#FCD34D" textAnchor="middle">G</text>
          <text x={14}  y={34} fontSize={7} fill="#A78BFA" textAnchor="middle">D</text>
          <text x={0}   y={-16} fontSize={6} fill="#7C3AED" textAnchor="middle">NMOS</text>
          {on && <rect x={-14} y={0} width={28} height={4} rx={2} fill="#7C3AED" opacity={0.5} />}
        </g>
      );
    }

    // ── Capacitor ────────────────────────────────────────────────────────────
    case 'capacitor': {
      const cap = properties?.capacitance ?? '100µF';
      const charged = on;
      return (
        <g filter="url(#comp-shadow)">
          {/* Leads */}
          <rect x={-hw} y={-1.5} width={hw - 6} height={3} fill="url(#lead-grad)" rx={1} />
          <rect x={6}   y={-1.5} width={hw - 6} height={3} fill="url(#lead-grad)" rx={1} />
          {/* Plate +  */}
          <line x1={-6} y1={-14} x2={-6} y2={14}
            stroke={charged ? '#FBBF24' : '#9CA3AF'} strokeWidth={3} strokeLinecap="round" />
          {/* Plate − */}
          <line x1={6}  y1={-14} x2={6}  y2={14}
            stroke={charged ? '#60A5FA' : '#9CA3AF'} strokeWidth={3} strokeLinecap="round" />
          {/* + label */}
          <text x={-10} y={-16} fontSize={8} fill={charged ? '#FBBF24' : '#6B7280'} textAnchor="middle">+</text>
          {/* Charge indicator */}
          {charged && (
            <ellipse cx={0} cy={0} rx={9} ry={14} fill="none"
              stroke="#FBBF24" strokeWidth={1} opacity={0.4} />
          )}
          <text x={0} y={22} fontSize={7} fill="#9CA3AF" textAnchor="middle">{String(cap)}</text>
        </g>
      );
    }

    // ── Electrolytic Capacitor ───────────────────────────────────────────────
    case 'electrolytic_cap': {
      const cap = properties?.capacitance ?? '10µF';
      const charged = on;
      return (
        <g filter="url(#comp-shadow)">
          {/* Leads */}
          <rect x={-hw} y={-1.5} width={hw - 8} height={3} fill="url(#lead-grad)" rx={1} />
          <rect x={8}   y={-1.5} width={hw - 8} height={3} fill="url(#lead-grad)" rx={1} />
          {/* Body — cylinder top view */}
          <rect x={-8} y={-16} width={16} height={32} rx={3}
            fill="url(#cap-body)" stroke={charged ? '#FBBF24' : '#374151'} strokeWidth={1} />
          {/* Negative stripe */}
          <rect x={4} y={-16} width={4} height={32} rx={1}
            fill="#888" opacity={0.5} />
          <text x={6} y={2} fontSize={8} fill="#555" textAnchor="middle">−</text>
          {/* Positive */}
          <text x={-4} y={2} fontSize={8} fill={charged ? '#FDE68A' : '#6B7280'} textAnchor="middle">+</text>
          {charged && <circle cx={0} cy={0} r={20} fill="#FBBF24" opacity={0.08} />}
          <text x={0} y={24} fontSize={7} fill="#9CA3AF" textAnchor="middle">{String(cap)}</text>
        </g>
      );
    }

    // ── Inductor / Coil ──────────────────────────────────────────────────────
    case 'inductor': {
      const inductance = properties?.inductance ?? '10mH';
      return (
        <g>
          {/* Leads */}
          <rect x={-hw} y={-1.5} width={hw - 22} height={3} fill="url(#lead-grad)" rx={1} />
          <rect x={22}  y={-1.5} width={hw - 22} height={3} fill="url(#lead-grad)" rx={1} />
          {/* Coil bumps */}
          {[-14, -7, 0, 7, 14].map((cx, i) => (
            <path key={i}
              d={`M ${cx} 0 A 3.5 7 0 0 1 ${cx + 7} 0`}
              fill="none"
              stroke={on ? '#FBBF24' : '#9CA3AF'}
              strokeWidth={2.5}
              strokeLinecap="round"
            />
          ))}
          {on && <rect x={-21} y={-2} width={42} height={4} rx={2} fill="#FBBF24" opacity={0.15} />}
          <text x={0} y={16} fontSize={7} fill="#9CA3AF" textAnchor="middle">{String(inductance)}</text>
        </g>
      );
    }

    // ── 555 Timer IC ─────────────────────────────────────────────────────────
    case 'ic_555': {
      return (
        <g filter="url(#comp-shadow)">
          {/* DIP-8 chip body */}
          <rect x={-hw + 4} y={-hh + 4} width={w - 8} height={h - 8} rx={4}
            fill="url(#ic-body)"
            stroke={on ? '#818CF8' : '#374151'} strokeWidth={on ? 1.5 : 1} />
          {/* Notch */}
          <path d="M -6,-42 A 6 6 0 0 1 6,-42" fill="none" stroke="#555" strokeWidth={2} />
          {/* Chip markings */}
          <text x={0} y={-6} fontSize={11} fill={on ? '#A5B4FC' : '#6B7280'}
            textAnchor="middle" fontWeight="bold">555</text>
          <text x={0} y={7} fontSize={6} fill="#4B5563" textAnchor="middle">TIMER</text>
          {/* Pin marks on sides */}
          {[-28,-16,-4,8].map((y, i) => (
            <g key={i}>
              <rect x={-hw + 4} y={y} width={6} height={4} rx={1} fill="#6B7280" />
              <rect x={hw - 10}  y={y} width={6} height={4} rx={1} fill="#6B7280" />
              <text x={-hw + 12} y={y + 3.5} fontSize={5.5} fill="#374151">{8 - i}</text>
              <text x={hw - 12}  y={y + 3.5} fontSize={5.5} fill="#374151" textAnchor="end">{i + 1}</text>
            </g>
          ))}
          {/* Oscillation indicator */}
          {on && (
            <rect x={-20} y={-hh + 4} width={40} height={8} rx={2} fill="#4F46E5" opacity={0.4}>
              <animate attributeName="opacity" values="0.4;0.8;0.4" dur="0.5s" repeatCount="indefinite" />
            </rect>
          )}
        </g>
      );
    }

    // ── Logic Gates ──────────────────────────────────────────────────────────
    case 'and_gate':
    case 'or_gate':
    case 'not_gate': {
      const label = defId === 'and_gate' ? '&' : defId === 'or_gate' ? '≥1' : '1';
      const outOn = isHigh;
      return (
        <g>
          {/* Gate body — rectangular ANSI-ish style */}
          <rect x={-hw + 4} y={-22} width={w - 8} height={44} rx={defId === 'not_gate' ? 22 : 6}
            fill={outOn ? '#065F46' : '#134E4A'}
            stroke={outOn ? '#10B981' : '#0F766E'} strokeWidth={outOn ? 2 : 1} />
          {/* Gate symbol */}
          <text x={0} y={5} fontSize={14} fill={outOn ? '#6EE7B7' : '#2DD4BF'}
            textAnchor="middle" fontWeight="bold">{label}</text>
          {/* NOT bubble */}
          {defId === 'not_gate' && (
            <circle cx={hw - 8} cy={0} r={4}
              fill="none" stroke={outOn ? '#10B981' : '#0F766E'} strokeWidth={1.5} />
          )}
          {/* Output indicator */}
          <circle cx={hw - 4} cy={0} r={3}
            fill={outOn ? '#10B981' : '#1F2937'} />
          <text x={0} y={-14} fontSize={6} fill="#0F766E" textAnchor="middle">
            {defId.replace('_gate', '').toUpperCase()}
          </text>
        </g>
      );
    }

    // ── L298N Motor Driver ────────────────────────────────────────────────────
    case 'l298n': {
      return (
        <g filter="url(#comp-shadow)">
          <rect x={-hw + 4} y={-hh + 4} width={w - 8} height={h - 8} rx={4}
            fill="url(#ic-body)"
            stroke={on ? '#F97316' : '#374151'} strokeWidth={on ? 1.5 : 1} />
          {/* Heatsink lines */}
          {[-30,-20,-10,0,10,20].map(y => (
            <line key={y} x1={hw - 14} y1={y} x2={hw - 6} y2={y}
              stroke="#333" strokeWidth={1} />
          ))}
          <text x={-6} y={-6} fontSize={9}  fill={on ? '#FED7AA' : '#9CA3AF'}
            textAnchor="middle" fontWeight="bold">L298N</text>
          <text x={-6} y={6}  fontSize={6.5} fill="#6B7280" textAnchor="middle">H-BRIDGE</text>
          {on && (
            <rect x={-hw + 6} y={14} width={16} height={10} rx={2}>
              <animate attributeName="fill"
                values="#EF4444;#F97316;#EF4444" dur="0.8s" repeatCount="indefinite" />
            </rect>
          )}
          <text x={hw - 22} y={hh - 4} fontSize={5.5} fill="#4B5563" textAnchor="middle">2A</text>
        </g>
      );
    }

    // ── Arduino Uno ──────────────────────────────────────────────────────────
    case 'arduino_uno': {
      return (
        <g filter="url(#comp-shadow)">
          {/* PCB body */}
          <rect x={-hw + 4} y={-hh + 4} width={w - 8} height={h - 8} rx={5}
            fill="url(#pcb-grad)"
            stroke={on ? '#34D399' : '#059669'} strokeWidth={on ? 2 : 1} />
          {/* ATmega chip */}
          <rect x={-22} y={-16} width={44} height={32} rx={3}
            fill="url(#ic-body)" stroke="#374151" strokeWidth={1} />
          <text x={0}  y={-3} fontSize={7}   fill="#6B7280" textAnchor="middle">ATmega</text>
          <text x={0}  y={7}  fontSize={6.5} fill="#4B5563" textAnchor="middle">328P</text>
          {/* USB connector  */}
          <rect x={hw - 14} y={-8} width={14} height={16} rx={2}
            fill="#8B5CF6" stroke="#6D28D9" strokeWidth={1} />
          <text x={hw - 7} y={4} fontSize={5.5} fill="#DDD6FE" textAnchor="middle">USB</text>
          {/* Power LED */}
          <circle cx={-hw + 14} cy={-hh + 14} r={4}
            fill={on ? '#10B981' : '#065F46'} />
          {/* Arduino text */}
          <text x={-6} y={-hh + 13} fontSize={6} fill={on ? '#34D399' : '#059669'} textAnchor="middle">
            ARDUINO
          </text>
          <text x={-6} y={hh - 7} fontSize={6} fill="#065F46" textAnchor="middle">UNO</text>
          {/* Pin headers — left */}
          {[-36,-24,-12,0,12,24,36,48].map((y, i) => (
            <rect key={i} x={-hw + 4} y={y - 3} width={6} height={6}
              rx={1} fill={on ? '#B45309' : '#78350F'} />
          ))}
          {/* Pin headers — right */}
          {[-36,-24,-12,0,12,24,36].map((y, i) => (
            <rect key={i} x={hw - 10} y={y - 3} width={6} height={6}
              rx={1} fill={on ? '#B45309' : '#78350F'} />
          ))}
        </g>
      );
    }

    // ── ESP32 ────────────────────────────────────────────────────────────────
    case 'esp32': {
      return (
        <g filter="url(#comp-shadow)">
          <rect x={-hw + 4} y={-hh + 4} width={w - 8} height={h - 8} rx={5}
            fill="url(#esp-grad)"
            stroke={on ? '#60A5FA' : '#1D4ED8'} strokeWidth={on ? 2 : 1} />
          {/* Metal shield */}
          <rect x={-24} y={-20} width={48} height={40} rx={3}
            fill="#2A2A3A" stroke="#374151" strokeWidth={1} />
          <text x={0} y={-5} fontSize={7.5} fill="#93C5FD" textAnchor="middle" fontWeight="bold">ESP32</text>
          <text x={0} y={6}  fontSize={5.5} fill="#4B5563" textAnchor="middle">WiFi·BT·3.3V</text>
          {/* Antenna */}
          <rect x={-4} y={-hh + 4} width={8} height={14} rx={1} fill="#374151" />
          <rect x={-6} y={-hh + 4} width={12} height={3}  rx={1} fill="#4B5563" />
          {on && <circle cx={26} cy={-hh + 14} r={4} fill="#60A5FA" opacity={0.7}>
            <animate attributeName="opacity" values="0.7;0.2;0.7" dur="1.2s" repeatCount="indefinite" />
          </circle>}
          {/* Pin rows */}
          {[-40,-28,-16,-4,8,20,32,44].map((y, i) => (
            <g key={i}>
              <rect x={-hw + 4} y={y - 3} width={6} height={6} rx={1} fill={on ? '#B45309' : '#78350F'} />
              <rect x={hw - 10} y={y - 3} width={6} height={6} rx={1} fill={on ? '#B45309' : '#78350F'} />
            </g>
          ))}
          <text x={0} y={hh - 6} fontSize={6} fill="#1D4ED8" textAnchor="middle">ESP32-DEVKIT</text>
        </g>
      );
    }

    // ── Buzzer ───────────────────────────────────────────────────────────────
    case 'buzzer': {
      return (
        <g filter="url(#comp-shadow)">
          {/* Housing */}
          <circle cx={0} cy={0} r={20}
            fill="#1C1917" stroke={on ? '#FBBF24' : '#374151'} strokeWidth={on ? 2 : 1} />
          {/* Piezo disc */}
          <circle cx={0} cy={0} r={14}
            fill={on ? '#292524' : '#1C1917'} stroke={on ? '#D97706' : '#374151'} strokeWidth={1} />
          <circle cx={0} cy={0} r={6}
            fill={on ? '#FBBF24' : '#44403C'} />
          {/* Sound waves */}
          {on && [24, 30, 37].map((r, i) => (
            <circle key={r} cx={0} cy={0} r={r} fill="none"
              stroke="#FBBF24" strokeWidth={1} opacity={0.5 - i * 0.15}>
              <animate attributeName="r"
                values={`${r};${r + 4};${r}`} dur="0.6s" repeatCount="indefinite" />
            </circle>
          ))}
          <text x={0} y={28} fontSize={7} fill={on ? '#FBBF24' : '#6B7280'} textAnchor="middle">
            {on ? '♪ BUZ' : 'BUZ'}
          </text>
        </g>
      );
    }

    // ── DC Motor ─────────────────────────────────────────────────────────────
    case 'dc_motor': {
      const angle = spin ? (time * 360) : 0;
      const speedBri = simState?.brightness ?? 0;
      return (
        <g filter="url(#comp-shadow)">
          {/* Motor housing */}
          <circle cx={0} cy={0} r={25}
            fill={spin ? '#374151' : '#1F2937'}
            stroke={spin ? '#10B981' : '#4B5563'} strokeWidth={spin ? 2 : 1.5} />
          <circle cx={0} cy={0} r={18}
            fill={spin ? '#1F2937' : '#111827'} />
          {/* Rotor -- spinning cross */}
          <g transform={`rotate(${angle})`}>
            <rect x={-2} y={-16} width={4} height={32} rx={2}
              fill={spin ? '#6EE7B7' : '#374151'} />
            <rect x={-16} y={-2}  width={32} height={4} rx={2}
              fill={spin ? '#6EE7B7' : '#374151'} />
          </g>
          {/* Center shaft */}
          <circle cx={0} cy={0} r={4} fill={spin ? '#10B981' : '#374151'} />
          {/* M label */}
          <text x={0} y={-28} fontSize={8} fill={spin ? '#10B981' : '#6B7280'} textAnchor="middle" fontWeight="bold">M</text>
          {/* Speed indicator */}
          {spin && (
            <text x={0} y={36} fontSize={7} fill="#10B981" textAnchor="middle">
              {Math.round(speedBri * 100)}% spd
            </text>
          )}
        </g>
      );
    }

    // ── Servo Motor ──────────────────────────────────────────────────────────
    case 'servo_motor': {
      const servoAngle = Number(properties?.angle ?? 90);
      const rad = ((servoAngle - 90) * Math.PI) / 180;
      const ax = Math.sin(rad) * 16;
      const ay = -Math.cos(rad) * 16;
      return (
        <g filter="url(#comp-shadow)">
          {/* Body */}
          <rect x={-hw + 4} y={-22} width={w - 8} height={44} rx={5}
            fill="#2A2A2A" stroke={on ? '#0EA5E9' : '#374151'} strokeWidth={on ? 1.5 : 1} />
          {/* Motor housing */}
          <rect x={-28} y={-18} width={56} height={36} rx={4} fill="#3A3A3A" />
          {/* Shaft circle */}
          <circle cx={0} cy={0} r={12}
            fill={on ? '#1E4060' : '#1F2937'}
            stroke={on ? '#38BDF8' : '#374151'} strokeWidth={1.5} />
          {/* Arm */}
          <line x1={0} y1={0} x2={ax} y2={ay}
            stroke={on ? '#38BDF8' : '#6B7280'} strokeWidth={3} strokeLinecap="round" />
          <circle cx={ax} cy={ay} r={3} fill={on ? '#7DD3FC' : '#4B5563'} />
          <circle cx={0} cy={0} r={3}   fill={on ? '#0EA5E9' : '#374151'} />
          {/* Angle label */}
          <text x={0} y={24} fontSize={7} fill={on ? '#38BDF8' : '#6B7280'} textAnchor="middle">
            {servoAngle}°
          </text>
          <text x={0} y={-24} fontSize={6} fill="#4B5563" textAnchor="middle">SERVO</text>
        </g>
      );
    }

    // ── LDR (Light Sensor) ───────────────────────────────────────────────────
    case 'ldr': {
      const light = Number(properties?.lightLevel ?? 0.5);
      const lightColor = `rgba(255, 220, 100, ${0.1 + light * 0.7})`;
      return (
        <g>
          {/* Leads */}
          <rect x={-hw} y={-1.5} width={hw - 14} height={3} fill="url(#lead-grad)" rx={1} />
          <rect x={14}  y={-1.5} width={hw - 14} height={3} fill="url(#lead-grad)" rx={1} />
          {/* LDR body — same shape as resistance but with zigzag + arrows */}
          <rect x={-14} y={-9} width={28} height={18} rx={9} fill="url(#res-body)" />
          <ellipse cx={-12} cy={0} rx={3} ry={9} fill="url(#res-cap)" />
          <ellipse cx={12}  cy={0} rx={3} ry={9} fill="url(#res-cap)" />
          {/* Zigzag line */}
          <path d="M -8,-6 L -4,6 L 0,-6 L 4,6 L 8,-6" fill="none" stroke="#7C5C00" strokeWidth={1.5} />
          {/* Light arrows */}
          <line x1={3}  y1={-14} x2={8}  y2={-20} stroke="#FCD34D" strokeWidth={1.5} />
          <line x1={-2} y1={-14} x2={-7} y2={-20} stroke="#FCD34D" strokeWidth={1.5} />
          <polygon points="8,-20 4,-16 10,-16" fill="#FCD34D" />
          <polygon points="-7,-20 -11,-16 -5,-16" fill="#FCD34D" />
          {/* Light level glow */}
          {light > 0.3 && (
            <circle cx={0} cy={0} r={20} fill={lightColor} />
          )}
          <text x={0} y={-22} fontSize={6.5} fill="#FCD34D" textAnchor="middle">
            {Math.round(light * 100)}% light
          </text>
          <text x={0} y={16} fontSize={7} fill="#9CA3AF" textAnchor="middle">LDR</text>
        </g>
      );
    }

    // ── Temperature Sensor ───────────────────────────────────────────────────
    case 'temp_sensor': {
      const temp = Number(properties?.temperature ?? 25);
      const tempFrac = Math.min(1, Math.max(0, (temp + 20) / 120));
      const levelH = Math.round(tempFrac * 20);
      const tempColor = temp < 0 ? '#60A5FA' : temp < 50 ? '#34D399' : temp < 80 ? '#FBBF24' : '#EF4444';
      return (
        <g>
          {/* 3 leads */}
          {[-6, 0, 6].map((ox, i) => (
            <rect key={i} x={ox - 1.5} y={20} width={3} height={16} rx={1} fill="url(#lead-grad)" />
          ))}
          {/* Sensor body — TO-92 like */}
          <path d="M -12,-28 A 30 30 0 0 1 12,-28 L 14,22 L -14,22 Z"
            fill="url(#ic-body)" stroke="#374151" strokeWidth={1.5} />
          {/* Thermometer inside */}
          <rect x={-3} y={-22} width={6} height={28} rx={3} fill="#1E3A5F" />
          <rect x={-2} y={-2 - levelH + 8} width={4} height={levelH} rx={2} fill={tempColor} />
          <circle cx={0} cy={14} r={5} fill={tempColor} />
          <text x={0} y={-30} fontSize={7} fill={tempColor} textAnchor="middle">{temp}°C</text>
          <text x={0} y={36} fontSize={6}  fill="#4B5563"  textAnchor="middle">NTC</text>
        </g>
      );
    }

    // ── Default fallback ─────────────────────────────────────────────────────
    default: {
      const hw2 = w / 2;
      return (
        <g>
          <rect x={-hw2 + 4} y={-h / 2 + 4} width={w - 8} height={h - 8} rx={4}
            fill="#1F2937" stroke="#374151" strokeWidth={1} />
          <text x={0} y={4} fontSize={9} fill="#6B7280" textAnchor="middle">
            {defId.replace(/_/g, ' ').toUpperCase()}
          </text>
        </g>
      );
    }
  }
}
