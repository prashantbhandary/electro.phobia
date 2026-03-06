'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { DemoCircuit, SchComponent, DemoStep } from '@/lib/lab/demo-circuits';

// ─── Schematic SVG component renderers ───────────────────────────────────────

function BatterySymbol({ cx, cy, orient = 'v', value = '9V', highlighted }: {
  cx: number; cy: number; orient?: 'h' | 'v'; value?: string; highlighted: boolean;
}) {
  const color = highlighted ? '#22C0B3' : '#374151';
  const glow = highlighted ? 'drop-shadow(0 0 6px #22C0B3)' : undefined;
  if (orient === 'v') {
    return (
      <g filter={glow ? `drop-shadow(0 0 6px #22C0B3)` : undefined}>
        {/* Long positive plate */}
        <line x1={cx - 14} y1={cy - 20} x2={cx + 14} y2={cy - 20} stroke={color} strokeWidth={3} />
        {/* Short negative plate */}
        <line x1={cx - 8}  y1={cy - 10} x2={cx + 8}  y2={cy - 10} stroke={color} strokeWidth={2} />
        {/* Second cell */}
        <line x1={cx - 14} y1={cy}      x2={cx + 14} y2={cy}      stroke={color} strokeWidth={3} />
        <line x1={cx - 8}  y1={cy + 10} x2={cx + 8}  y2={cy + 10} stroke={color} strokeWidth={2} />
        {/* Labels */}
        <text x={cx + 18} y={cy - 18} fontSize={9} fill="#10B981" fontWeight="bold">+</text>
        <text x={cx + 18} y={cy + 12} fontSize={9} fill="#EF4444" fontWeight="bold">−</text>
        <text x={cx}      y={cy + 30} fontSize={9} fill="#6B7280" textAnchor="middle">{value}</text>
      </g>
    );
  }
  // horizontal — used for left-side battery
  return (
    <g filter={highlighted ? 'drop-shadow(0 0 6px #22C0B3)' : undefined}>
      <line x1={cx - 10} y1={cy - 14} x2={cx - 10} y2={cy + 14} stroke={color} strokeWidth={3} />
      <line x1={cx - 10 + 10} y1={cy - 8}  x2={cx - 10 + 10} y2={cy + 8}  stroke={color} strokeWidth={1.5} />
      <line x1={cx + 4}  y1={cy - 14} x2={cx + 4}  y2={cy + 14} stroke={color} strokeWidth={3} />
      <line x1={cx + 14} y1={cy - 8}  x2={cx + 14} y2={cy + 8}  stroke={color} strokeWidth={1.5} />
      <text x={cx - 12} y={cy - 16} fontSize={9} fill="#10B981" fontWeight="bold">+</text>
      <text x={cx + 18} y={cy - 16} fontSize={9} fill="#EF4444" fontWeight="bold">−</text>
      <text x={cx + 4}  y={cy + 26} fontSize={9} fill="#6B7280" textAnchor="middle">{value}</text>
    </g>
  );
}

function ResistorSymbol({ cx, cy, orient = 'h', label, value, highlighted }: {
  cx: number; cy: number; orient?: 'h' | 'v'; label: string; value?: string; highlighted: boolean;
}) {
  const color = highlighted ? '#F59E0B' : '#374151';
  const boxFill = highlighted ? '#FEF3C7' : '#F9FAFB';
  if (orient === 'h') {
    return (
      <g filter={highlighted ? 'drop-shadow(0 0 6px #F59E0B)' : undefined}>
        <rect x={cx - 60} y={cy - 14} width={120} height={28} rx={6}
          fill={boxFill} stroke={color} strokeWidth={highlighted ? 2 : 1.5} />
        {/* Zigzag inside */}
        <polyline points={`${cx-46},${cy} ${cx-36},${cy-9} ${cx-26},${cy+9} ${cx-16},${cy-9} ${cx-6},${cy+9} ${cx+4},${cy-9} ${cx+14},${cy+9} ${cx+24},${cy-9} ${cx+34},${cy} ${cx+44},${cy}`}
          fill="none" stroke={color} strokeWidth={1.5} />
        <text x={cx} y={cy - 17} fontSize={8.5} fill="#374151" textAnchor="middle" fontWeight="500">{label}</text>
        <text x={cx} y={cy + 27} fontSize={8} fill="#6B7280" textAnchor="middle">{value}</text>
      </g>
    );
  }
  return (
    <g filter={highlighted ? 'drop-shadow(0 0 6px #F59E0B)' : undefined}>
      <rect x={cx - 14} y={cy - 35} width={28} height={70} rx={6}
        fill={boxFill} stroke={color} strokeWidth={highlighted ? 2 : 1.5} />
      <polyline points={`${cx},${cy-30} ${cx+9},${cy-20} ${cx-9},${cy-10} ${cx+9},${cy} ${cx-9},${cy+10} ${cx+9},${cy+20} ${cx},${cy+30}`}
        fill="none" stroke={color} strokeWidth={1.5} />
      <text x={cx + 17} y={cy - 5} fontSize={8.5} fill="#374151">{label}</text>
      <text x={cx + 17} y={cy + 8} fontSize={8}   fill="#6B7280">{value}</text>
    </g>
  );
}

function LEDSymbol({ cx, cy, orient = 'h', ledColor = '#EF4444', highlighted, on }: {
  cx: number; cy: number; orient?: 'h' | 'v'; ledColor?: string; highlighted: boolean; on: boolean;
}) {
  const active = on || highlighted;
  if (orient === 'h') {
    return (
      <g filter={active ? `drop-shadow(0 0 10px ${ledColor})` : undefined}>
        {/* Anode lead */}
        <line x1={cx - 25} y1={cy} x2={cx - 14} y2={cy} stroke="#6B7280" strokeWidth={1.5} />
        {/* Triangle body */}
        <polygon points={`${cx - 14},${cy - 14} ${cx - 14},${cy + 14} ${cx + 12},${cy}`}
          fill={active ? ledColor : '#E5E7EB'} stroke={active ? ledColor : '#9CA3AF'} strokeWidth={1.5} />
        {/* Cathode bar */}
        <line x1={cx + 12} y1={cy - 14} x2={cx + 12} y2={cy + 14} stroke={active ? ledColor : '#9CA3AF'} strokeWidth={2.5} />
        {/* Cathode lead */}
        <line x1={cx + 12} y1={cy} x2={cx + 27} y2={cy} stroke="#6B7280" strokeWidth={1.5} />
        {/* Glow halo */}
        {active && <circle cx={cx} cy={cy} r={20} fill={ledColor} opacity={0.15} />}
        {/* Light rays */}
        {active && (
          <>
            <line x1={cx + 16} y1={cy - 10} x2={cx + 24} y2={cy - 20} stroke={ledColor} strokeWidth={1.5} strokeLinecap="round" opacity={0.8} />
            <line x1={cx + 20} y1={cy - 2}  x2={cx + 30} y2={cy - 8}  stroke={ledColor} strokeWidth={1.5} strokeLinecap="round" opacity={0.8} />
          </>
        )}
        <text x={cx} y={cy + 22} fontSize={8} fill="#6B7280" textAnchor="middle">LED</text>
      </g>
    );
  }
  // vertical LED
  return (
    <g filter={active ? `drop-shadow(0 0 10px ${ledColor})` : undefined}>
      <line x1={cx} y1={cy - 25} x2={cx} y2={cy - 14} stroke="#6B7280" strokeWidth={1.5} />
      <polygon points={`${cx - 14},${cy - 14} ${cx + 14},${cy - 14} ${cx},${cy + 12}`}
        fill={active ? ledColor : '#E5E7EB'} stroke={active ? ledColor : '#9CA3AF'} strokeWidth={1.5} />
      <line x1={cx - 14} y1={cy + 12} x2={cx + 14} y2={cy + 12} stroke={active ? ledColor : '#9CA3AF'} strokeWidth={2.5} />
      <line x1={cx} y1={cy + 12} x2={cx} y2={cy + 25} stroke="#6B7280" strokeWidth={1.5} />
      {active && <circle cx={cx} cy={cy} r={20} fill={ledColor} opacity={0.15} />}
      {active && (
        <>
          <line x1={cx + 10} y1={cy - 16} x2={cx + 20} y2={cy - 26} stroke={ledColor} strokeWidth={1.5} strokeLinecap="round" opacity={0.8} />
          <line x1={cx + 18} y1={cy - 6}  x2={cx + 28} y2={cy - 10} stroke={ledColor} strokeWidth={1.5} strokeLinecap="round" opacity={0.8} />
        </>
      )}
    </g>
  );
}

function ButtonSymbol({ cx, cy, highlighted, on }: {
  cx: number; cy: number; highlighted: boolean; on: boolean;
}) {
  const closed = on;
  const color = highlighted ? '#22C0B3' : '#374151';
  return (
    <g filter={highlighted ? 'drop-shadow(0 0 6px #22C0B3)' : undefined}>
      {/* Left contact */}
      <line x1={cx - 30} y1={cy} x2={cx - 10} y2={cy} stroke={color} strokeWidth={2} />
      <line x1={cx - 10} y1={cy - 12} x2={cx - 10} y2={cy + 12} stroke={color} strokeWidth={2.5} />
      {/* Right contact */}
      <line x1={cx + 30} y1={cy} x2={cx + 10} y2={cy} stroke={color} strokeWidth={2} />
      <line x1={cx + 10} y1={cy - 12} x2={cx + 10} y2={cy + 12} stroke={color} strokeWidth={2.5} />
      {/* Bridge (closed = solid line, open = gap with arc) */}
      {closed
        ? <line x1={cx - 10} y1={cy} x2={cx + 10} y2={cy} stroke="#22C0B3" strokeWidth={2.5} />
        : <path d={`M ${cx - 10} ${cy} Q ${cx} ${cy - 20} ${cx + 10} ${cy}`}
            fill="none" stroke={color} strokeWidth={1.5} strokeDasharray="3 2" />
      }
      <text x={cx} y={cy + 22} fontSize={8} fill="#6B7280" textAnchor="middle">
        {closed ? '(pressed)' : 'BUTTON'}
      </text>
    </g>
  );
}

function POTSymbol({ cx, cy, highlighted }: { cx: number; cy: number; highlighted: boolean }) {
  const color = highlighted ? '#8B5CF6' : '#374151';
  return (
    <g filter={highlighted ? 'drop-shadow(0 0 6px #8B5CF6)' : undefined}>
      {/* Body box */}
      <rect x={cx - 50} y={cy - 14} width={100} height={28} rx={6}
        fill={highlighted ? '#EDE9FE' : '#F9FAFB'} stroke={color} strokeWidth={highlighted ? 2 : 1.5} />
      {/* Zigzag inside */}
      <polyline
        points={`${cx-40},${cy} ${cx-30},${cy-9} ${cx-20},${cy+9} ${cx-10},${cy-9} ${cx},${cy+9} ${cx+10},${cy-9} ${cx+20},${cy+9} ${cx+30},${cy}`}
        fill="none" stroke={color} strokeWidth={1.5} />
      {/* Wiper arrow down */}
      <line x1={cx} y1={cy + 14} x2={cx} y2={cy + 30} stroke={color} strokeWidth={1.5} strokeDasharray="3 2" />
      <polygon points={`${cx-4},${cy+28} ${cx},${cy+36} ${cx+4},${cy+28}`} fill={color} />
      <text x={cx} y={cy - 17} fontSize={8.5} fill="#374151" textAnchor="middle" fontWeight="500">POT</text>
      <text x={cx + 54} y={cy + 5} fontSize={8} fill="#6B7280">10kΩ</text>
    </g>
  );
}

function NPNSymbol({ cx, cy, highlighted, on }: { cx: number; cy: number; highlighted: boolean; on: boolean }) {
  const color = highlighted ? '#22C0B3' : '#374151';
  const active = on || highlighted;
  return (
    <g filter={highlighted ? 'drop-shadow(0 0 8px #22C0B3)' : undefined}>
      {/* Circle body */}
      <circle cx={cx} cy={cy} r={24} fill={active ? '#ECFDF5' : '#F9FAFB'} stroke={color} strokeWidth={highlighted ? 2 : 1.5} />
      {/* Vertical bar (base line) */}
      <line x1={cx - 8} y1={cy - 18} x2={cx - 8} y2={cy + 18} stroke={color} strokeWidth={2.5} />
      {/* Collector arrow up */}
      <line x1={cx - 8} y1={cy - 10} x2={cx + 14} y2={cy - 22} stroke={color} strokeWidth={2} />
      {/* Emitter arrow down (with arrow) */}
      <line x1={cx - 8} y1={cy + 10} x2={cx + 14} y2={cy + 22} stroke={color} strokeWidth={2} />
      <polygon points={`${cx+6},${cy+22} ${cx+14},${cy+22} ${cx+14},${cy+14}`} fill={color} />
      {/* Base lead */}
      <line x1={cx - 32} y1={cy} x2={cx - 8} y2={cy} stroke={color} strokeWidth={2} />
      <text x={cx - 14} y={cy + 4}  fontSize={8.5} fill={color} fontWeight="bold">B</text>
      <text x={cx + 16} y={cy - 20} fontSize={8.5} fill={color} fontWeight="bold">C</text>
      <text x={cx + 16} y={cy + 28} fontSize={8.5} fill={color} fontWeight="bold">E</text>
      <text x={cx}      y={cy + 38} fontSize={8}   fill="#6B7280" textAnchor="middle">NPN</text>
    </g>
  );
}

function GNDSymbol({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      <line x1={cx - 16} y1={cy}      x2={cx + 16} y2={cy}      stroke="#6B7280" strokeWidth={2} />
      <line x1={cx - 10} y1={cy + 6}  x2={cx + 10} y2={cy + 6}  stroke="#6B7280" strokeWidth={1.5} />
      <line x1={cx - 5}  y1={cy + 12} x2={cx + 5}  y2={cy + 12} stroke="#6B7280" strokeWidth={1} />
    </g>
  );
}

function VCCSymbol({ cx, cy, label = 'VCC' }: { cx: number; cy: number; label?: string }) {
  return (
    <g>
      <line x1={cx} y1={cy + 0} x2={cx} y2={cy + 10} stroke="#10B981" strokeWidth={2} />
      <line x1={cx - 14} y1={cy}      x2={cx + 14} y2={cy}      stroke="#10B981" strokeWidth={2} />
      <text x={cx} y={cy - 6} fontSize={9} fill="#10B981" textAnchor="middle" fontWeight="bold">{label}</text>
    </g>
  );
}

function WireNode({ cx, cy, label }: { cx: number; cy: number; label: string }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={4} fill="#22C0B3" />
      <text x={cx + 8} y={cy + 4} fontSize={9} fill="#22C0B3" fontWeight="600">{label}</text>
    </g>
  );
}

// ─── Current flow animation dot ───────────────────────────────────────────────
function CurrentDot({ pathD, duration = 2.5 }: { pathD: string; duration?: number }) {
  return (
    <circle r={5} fill="#22C0B3" opacity={0.85}>
      <animateMotion dur={`${duration}s`} repeatCount="indefinite" rotate="auto">
        <mpath href="#current-path" />
      </animateMotion>
    </circle>
  );
}

// ─── Schematic renderer ───────────────────────────────────────────────────────
function SchematicSVG({
  circuit,
  stepIndex,
}: {
  circuit: DemoCircuit;
  stepIndex: number;
}) {
  const step = circuit.steps[stepIndex];
  const highlight = new Set(step.highlight);
  const isOn = step.isOn ?? false;

  const { schematic } = circuit;

  function renderComp(c: SchComponent) {
    const hl = highlight.has(c.id);
    switch (c.type) {
      case 'battery':
        return <BatterySymbol key={c.id} cx={c.cx} cy={c.cy} orient={c.orient} value={c.value} highlighted={hl} />;
      case 'resistor':
        return <ResistorSymbol key={c.id} cx={c.cx} cy={c.cy} orient={c.orient} label={c.label} value={c.value} highlighted={hl} />;
      case 'led':
        return <LEDSymbol key={c.id} cx={c.cx} cy={c.cy} orient={c.orient} ledColor={c.ledColor} highlighted={hl} on={isOn && highlight.has(c.id)} />;
      case 'button':
        return <ButtonSymbol key={c.id} cx={c.cx} cy={c.cy} highlighted={hl} on={isOn && hl} />;
      case 'pot':
        return <POTSymbol key={c.id} cx={c.cx} cy={c.cy} highlighted={hl} />;
      case 'npn':
        return <NPNSymbol key={c.id} cx={c.cx} cy={c.cy} highlighted={hl} on={isOn} />;
      case 'gnd':
        return <GNDSymbol key={c.id} cx={c.cx} cy={c.cy} />;
      case 'vcc':
        return <VCCSymbol key={c.id} cx={c.cx} cy={c.cy} label={c.label} />;
      case 'wire_node':
        return <WireNode key={c.id} cx={c.cx} cy={c.cy} label={c.label} />;
      default:
        return null;
    }
  }

  return (
    <svg
      viewBox={schematic.viewBox}
      className="w-full h-full"
      style={{ maxHeight: '340px' }}
    >
      <defs>
        {/* Grid pattern */}
        <pattern id="demo-grid" width={20} height={20} patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#F0F4F8" strokeWidth={0.5} />
        </pattern>
        {/* Glow filter for wires */}
        <filter id="wire-glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Background */}
      <rect x="0" y="0" width="100%" height="100%" fill="#FAFAFA" />
      <rect x="0" y="0" width="100%" height="100%" fill="url(#demo-grid)" />

      {/* Wires */}
      {schematic.wires.map(wire => (
        <path
          key={wire.id}
          d={wire.d}
          fill="none"
          stroke={isOn ? (wire.role === 'ground' ? '#6B7280' : wire.role === 'signal' ? '#F59E0B' : '#22C0B3') : '#CBD5E1'}
          strokeWidth={isOn && wire.role !== 'ground' ? 2 : 1.5}
          filter={isOn && wire.role === 'power' ? 'url(#wire-glow)' : undefined}
        />
      ))}

      {/* Current animation path (hidden, used by animateMotion) */}
      {isOn && (
        <path id="current-path" d={schematic.currentPathD} fill="none" stroke="none" />
      )}
      {isOn && <CurrentDot pathD={schematic.currentPathD} />}

      {/* Annotations */}
      {step.annotate?.map((a, i) => (
        <g key={i}>
          <rect x={a.cx - 2} y={a.cy - 12} width={a.text.length * 5.5 + 8} height={16}
            rx={4} fill="white" stroke={a.color} strokeWidth={1} opacity={0.9} />
          <text x={a.cx + 2} y={a.cy} fontSize={9} fill={a.color} fontWeight="600">{a.text}</text>
        </g>
      ))}

      {/* Components on top */}
      {schematic.components.map(renderComp)}
    </svg>
  );
}

// ─── Step Panel ────────────────────────────────────────────────────────────────
function StepPanel({
  step,
  stepIndex,
  totalSteps,
  onPrev,
  onNext,
  autoPlay,
  setAutoPlay,
}: {
  step: DemoStep;
  stepIndex: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
  autoPlay: boolean;
  setAutoPlay: (v: boolean) => void;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-4">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${
            i === stepIndex ? 'bg-primary' : i < stepIndex ? 'bg-primary/40' : 'bg-gray-200'
          }`} />
        ))}
      </div>

      {/* Status badge */}
      <div className="flex items-center gap-2 mb-3">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
          step.isOn ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-50 text-gray-600 border border-gray-200'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${step.isOn ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
          {step.isOn ? 'Circuit ON — current flowing' : 'Circuit OFF'}
        </span>
        <span className="text-xs text-gray-400">Step {stepIndex + 1} / {totalSteps}</span>
      </div>

      {/* Title */}
      <h3 className="text-base font-bold text-gray-900 mb-2 leading-tight">{step.title}</h3>

      {/* Body text */}
      <p className="text-sm text-gray-700 leading-relaxed flex-1">{step.body}</p>

      {/* Navigation */}
      <div className="mt-5 flex items-center gap-2">
        <button
          onClick={onPrev}
          disabled={stepIndex === 0}
          className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200
            text-gray-700 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ← Prev
        </button>
        <button
          onClick={onNext}
          disabled={stepIndex === totalSteps - 1}
          className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-white
            hover:bg-primary/90 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {stepIndex === totalSteps - 1 ? '✓ Done' : 'Next →'}
        </button>
        <button
          onClick={() => setAutoPlay(!autoPlay)}
          title={autoPlay ? 'Pause auto-play' : 'Auto-play steps'}
          className={`px-3 py-2 rounded-lg text-sm border ${
            autoPlay ? 'bg-primary/10 border-primary text-primary' : 'border-gray-200 text-gray-500 hover:bg-gray-50'
          }`}
        >
          {autoPlay ? '⏸' : '▶'}
        </button>
      </div>
    </div>
  );
}

// ─── Main DemoViewer ──────────────────────────────────────────────────────────
export default function DemoViewer({ circuit }: { circuit: DemoCircuit }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const advance = useCallback(() => {
    setStepIndex(i => {
      if (i < circuit.steps.length - 1) return i + 1;
      setAutoPlay(false);
      return i;
    });
  }, [circuit.steps.length]);

  useEffect(() => {
    if (autoPlay) {
      timerRef.current = setTimeout(advance, 5000);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [autoPlay, stepIndex, advance]);

  const step = circuit.steps[stepIndex];

  return (
    <div className="space-y-0">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">{circuit.title}</h2>
          <p className="text-sm text-gray-500">{circuit.subtitle}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
          circuit.difficulty === 'Beginner'
            ? 'bg-green-50 text-green-700 border-green-200'
            : 'bg-amber-50 text-amber-700 border-amber-200'
        }`}>
          {circuit.difficulty}
        </span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {circuit.tags.map(t => (
          <span key={t} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full border border-gray-200">
            {t}
          </span>
        ))}
      </div>

      {/* Main content: circuit + explanation */}
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-5">

        {/* Circuit SVG */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden"
          style={{ minHeight: '300px' }}>
          <div className="bg-gray-50 border-b border-gray-100 px-4 py-2 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-400" />
            <div className="w-2 h-2 rounded-full bg-yellow-400" />
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-xs text-gray-400 ml-2">Live Schematic</span>
            {step.isOn && (
              <span className="ml-auto flex items-center gap-1 text-xs text-primary font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Current flowing
              </span>
            )}
          </div>
          <div className="p-3">
            <SchematicSVG circuit={circuit} stepIndex={stepIndex} />
          </div>
        </div>

        {/* Explanation panel */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-5">
          <StepPanel
            step={step}
            stepIndex={stepIndex}
            totalSteps={circuit.steps.length}
            onPrev={() => setStepIndex(i => Math.max(0, i - 1))}
            onNext={() => setStepIndex(i => Math.min(circuit.steps.length - 1, i + 1))}
            autoPlay={autoPlay}
            setAutoPlay={setAutoPlay}
          />
        </div>
      </div>

      {/* Step tiles (quick jump) */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
        {circuit.steps.map((s, i) => (
          <button
            key={i}
            onClick={() => setStepIndex(i)}
            className={`text-left px-3 py-2.5 rounded-lg border text-xs transition-all ${
              i === stepIndex
                ? 'bg-primary/10 border-primary text-primary font-semibold'
                : 'bg-white border-gray-200 text-gray-600 hover:border-primary/50 hover:bg-gray-50'
            }`}
          >
            <div className="font-medium leading-tight line-clamp-2">{s.title}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
