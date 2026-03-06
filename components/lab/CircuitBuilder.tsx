'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  COMPONENT_DEFS,
  COMPONENT_MAP,
  CATEGORIES,
} from '@/lib/lab/components-data';
import type {
  ComponentDef,
  PlacedComponent,
  Wire,
  SimulationState,
  Mission,
} from '@/lib/lab/types';
import {
  runSimulation,
  interpretArduinoCode,
} from '@/lib/lab/simulation-engine';
import ComponentSymbol, { ComponentSVGDefs } from './ComponentSymbol';

// ─── Constants ────────────────────────────────────────────────────────────────
const GRID = 20;
const snap = (v: number) => Math.round(v / GRID) * GRID;

// ─── Wire Path Helper ─────────────────────────────────────────────────────────
function wirePath(x1: number, y1: number, x2: number, y2: number): string {
  const mx = (x1 + x2) / 2;
  return `M ${x1} ${y1} C ${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`;
}

// ─── Main CircuitBuilder Component ───────────────────────────────────────────
interface CircuitBuilderProps {
  mission?: Mission;
  onMissionComplete?: () => void;
}

export default function CircuitBuilder({ mission, onMissionComplete }: CircuitBuilderProps) {
  // ── State ────────────────────────────────────────────────────────────────
  const [components, setComponents] = useState<PlacedComponent[]>([]);
  const [wires, setWires]           = useState<Wire[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pendingDef, setPendingDef] = useState<string | null>(null);
  const [wireStart, setWireStart]   = useState<{ instanceId: string; pinId: string; x: number; y: number } | null>(null);
  const [cursorSVG, setCursorSVG]   = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [simRunning, setSimRunning] = useState(false);
  const [simState, setSimState]     = useState<SimulationState>({});
  const [simTime, setSimTime]       = useState(0);
  const [code, setCode]             = useState(mission?.starterCode ?? DEFAULT_CODE);
  const [serialLog, setSerialLog]   = useState<string[]>([]);
  const [showCode, setShowCode]     = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Basic');
  const [infoComponent, setInfoComponent]       = useState<ComponentDef | null>(null);
  const [infoPanel, setInfoPanel]               = useState<'properties' | 'learn'>('learn');
  const [missionChecked, setMissionChecked]     = useState(false);
  const [missionSuccess, setMissionSuccess]     = useState(false);
  const [currentStep, setCurrentStep]           = useState(0);
  const [zoom, setZoom]             = useState(1);
  const [pan, setPan]               = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning]   = useState(false);
  const panStart                    = useRef({ x: 0, y: 0, px: 0, py: 0 });
  const svgRef                      = useRef<SVGSVGElement>(null);
  const animFrame                   = useRef<number>(0);
  const simTimeRef                  = useRef(0);

  useEffect(() => {
    if (mission?.starterCode) setCode(mission.starterCode);
  }, [mission]);

  // ── Simulation loop ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!simRunning) {
      cancelAnimationFrame(animFrame.current);
      return;
    }

    const startWall = performance.now();
    let lastT = 0;

    const step = (now: number) => {
      const t = (now - startWall) / 1000; // seconds
      simTimeRef.current = t;
      if (t - lastT > 0.05) {
        lastT = t;
        setSimTime(t);

        // Run Arduino code interpretation every tick
        const digitalInputs: Record<string, number> = {};
        const analogInputs: Record<string, number>  = {};
        components.forEach(c => {
          if (c.definitionId === 'push_button') {
            digitalInputs[c.instanceId] = c.properties.pressed ? 5 : 0;
          }
          if (c.definitionId === 'potentiometer') {
            analogInputs[c.instanceId] = Math.round(Number(c.properties.value ?? 0.5) * 1023);
          }
        });

        let arduinoOutputs: Record<string, number> | undefined;
        const arduinoComp = components.find(c => c.definitionId === 'arduino_uno');
        if (arduinoComp) {
          const result = interpretArduinoCode(code, digitalInputs, analogInputs, t * 1000);
          arduinoOutputs = result.outputs;
          if (result.serialLog.length > 0) {
            setSerialLog(prev => [...prev.slice(-80), ...result.serialLog]);
          }
        }

        const newState = runSimulation(components, wires, t, arduinoOutputs);
        setSimState(newState);

        // Check mission success
        if (mission && !missionChecked) {
          checkMissionSuccess(newState);
        }
      }
      animFrame.current = requestAnimationFrame(step);
    };
    animFrame.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animFrame.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [simRunning, components, wires, code]);

  const checkMissionSuccess = useCallback((state: SimulationState) => {
    if (!mission) return;
    const cond = mission.successCondition;
    let success = false;

    if (cond.type === 'led_on') {
      success = Object.values(state).some(s => s.active && s.brightness > 0.2);
    } else if (cond.type === 'motor_on') {
      success = Object.values(state).some(s => s.spinning);
    } else if (cond.type === 'oscillating') {
      // 555 timer: check if out node oscillates (brightness toggles)
      success = components.some(c => c.definitionId === 'ic_555' && state[c.instanceId]?.active);
    } else if (cond.type === 'pwm_led') {
      success = Object.values(state).some(s => s.active && s.brightness > 0 && s.brightness < 0.9);
    } else if (cond.type === 'button_controls_led') {
      success = Object.values(state).some(s => s.active && s.brightness > 0.2);
    }

    if (success && !missionChecked) {
      setMissionChecked(true);
      setMissionSuccess(true);
      onMissionComplete?.();
    }
  }, [mission, missionChecked, components, onMissionComplete]);

  // ── SVG coordinate helpers ───────────────────────────────────────────────
  const svgPoint = useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    const x = (clientX - rect.left - pan.x) / zoom;
    const y = (clientY - rect.top  - pan.y) / zoom;
    return { x, y };
  }, [pan, zoom]);

  const getPinPosition = useCallback((comp: PlacedComponent, pinId: string) => {
    const def = COMPONENT_MAP[comp.definitionId];
    const pin = def?.pins.find(p => p.id === pinId);
    if (!pin) return { x: comp.x, y: comp.y };
    const rad = (comp.rotation * Math.PI) / 180;
    const rx = pin.x * Math.cos(rad) - pin.y * Math.sin(rad);
    const ry = pin.x * Math.sin(rad) + pin.y * Math.cos(rad);
    return { x: comp.x + rx, y: comp.y + ry };
  }, []);

  // ── Mouse handlers ───────────────────────────────────────────────────────
  const handleSVGMouseMove = (e: React.MouseEvent) => {
    const pt = svgPoint(e.clientX, e.clientY);
    setCursorSVG(pt);
    if (isPanning) {
      setPan({
        x: e.clientX - panStart.current.x + panStart.current.px,
        y: e.clientY - panStart.current.y + panStart.current.py,
      });
    }
  };

  const handleSVGClick = (e: React.MouseEvent) => {
    if (e.target === svgRef.current || (e.target as Element).tagName === 'rect' && (e.target as Element).getAttribute('data-bg')) {
      if (pendingDef) {
        const pt = svgPoint(e.clientX, e.clientY);
        placeComponent(pendingDef, snap(pt.x), snap(pt.y));
        if (!e.shiftKey) setPendingDef(null);
      } else if (!wireStart) {
        setSelectedId(null);
        setInfoComponent(null);
      }
    }
  };

  const handleSVGMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      e.preventDefault();
      setIsPanning(true);
      panStart.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y };
    }
  };

  const handleSVGMouseUp = () => setIsPanning(false);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(z => Math.min(3, Math.max(0.3, z * delta)));
  };

  // ── Component placement ──────────────────────────────────────────────────
  const placeComponent = (defId: string, x: number, y: number) => {
    const def = COMPONENT_MAP[defId];
    if (!def) return;
    const instanceId = `${defId}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const newComp: PlacedComponent = {
      instanceId,
      definitionId: defId,
      x, y,
      rotation: 0,
      properties: { ...def.defaultProperties },
    };
    setComponents(prev => [...prev, newComp]);
    setSelectedId(instanceId);
    setInfoComponent(def);
  };

  const deleteComponent = (instanceId: string) => {
    setComponents(prev => prev.filter(c => c.instanceId !== instanceId));
    setWires(prev => prev.filter(w => w.fromInstanceId !== instanceId && w.toInstanceId !== instanceId));
    if (selectedId === instanceId) setSelectedId(null);
  };

  const rotateComponent = (instanceId: string) => {
    setComponents(prev =>
      prev.map(c => c.instanceId === instanceId
        ? { ...c, rotation: (c.rotation + 90) % 360 }
        : c
      )
    );
  };

  const updateProperty = (instanceId: string, key: string, value: string | number | boolean) => {
    setComponents(prev =>
      prev.map(c => c.instanceId === instanceId
        ? { ...c, properties: { ...c.properties, [key]: value } }
        : c
      )
    );
  };

  // ── Wire drawing ─────────────────────────────────────────────────────────
  const handlePinClick = (e: React.MouseEvent, instanceId: string, pinId: string) => {
    e.stopPropagation();
    const comp = components.find(c => c.instanceId === instanceId);
    if (!comp) return;
    const pos = getPinPosition(comp, pinId);

    if (!wireStart) {
      setWireStart({ instanceId, pinId, x: pos.x, y: pos.y });
    } else if (wireStart.instanceId === instanceId && wireStart.pinId === pinId) {
      setWireStart(null);
    } else {
      // Check no duplicate wire
      const dup = wires.some(
        w =>
          (w.fromInstanceId === wireStart.instanceId &&
            w.fromPinId === wireStart.pinId &&
            w.toInstanceId === instanceId &&
            w.toPinId === pinId) ||
          (w.fromInstanceId === instanceId &&
            w.fromPinId === pinId &&
            w.toInstanceId === wireStart.instanceId &&
            w.toPinId === wireStart.pinId),
      );
      if (!dup) {
        const newWire: Wire = {
          id: `wire-${Date.now()}`,
          fromInstanceId: wireStart.instanceId,
          fromPinId: wireStart.pinId,
          toInstanceId: instanceId,
          toPinId: pinId,
        };
        setWires(prev => [...prev, newWire]);
      }
      setWireStart(null);
    }
  };

  const deleteWire = (wireId: string) => {
    setWires(prev => prev.filter(w => w.id !== wireId));
  };

  // ── Keyboard shortcuts ────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPendingDef(null);
        setWireStart(null);
      }
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
        deleteComponent(selectedId);
      }
      if (e.key === 'r' && selectedId && !(e.target instanceof HTMLInputElement)) {
        rotateComponent(selectedId);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  // ── Drag component (on canvas) ────────────────────────────────────────────
  const draggingRef = useRef<{ instanceId: string; offX: number; offY: number } | null>(null);

  const handleCompMouseDown = (e: React.MouseEvent, instanceId: string) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    if (wireStart || pendingDef) return;
    const pt = svgPoint(e.clientX, e.clientY);
    const comp = components.find(c => c.instanceId === instanceId);
    if (!comp) return;
    draggingRef.current = { instanceId, offX: pt.x - comp.x, offY: pt.y - comp.y };
    setSelectedId(instanceId);
    setInfoComponent(COMPONENT_MAP[comp.definitionId] ?? null);
  };

  const handleSVGMouseMoveGlobal = useCallback((e: MouseEvent) => {
    if (!draggingRef.current) return;
    const pt = svgPoint(e.clientX, e.clientY);
    const nx = snap(pt.x - draggingRef.current.offX);
    const ny = snap(pt.y - draggingRef.current.offY);
    setComponents(prev =>
      prev.map(c => c.instanceId === draggingRef.current!.instanceId ? { ...c, x: nx, y: ny } : c)
    );
  }, [svgPoint]);

  const handleSVGMouseUpGlobal = useCallback(() => {
    draggingRef.current = null;
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleSVGMouseMoveGlobal);
    window.addEventListener('mouseup', handleSVGMouseUpGlobal);
    return () => {
      window.removeEventListener('mousemove', handleSVGMouseMoveGlobal);
      window.removeEventListener('mouseup', handleSVGMouseUpGlobal);
    };
  }, [handleSVGMouseMoveGlobal, handleSVGMouseUpGlobal]);

  // ── Simulation controls ───────────────────────────────────────────────────
  const startSimulation = () => {
    setSerialLog([]);
    setMissionChecked(false);
    setSimRunning(true);
  };
  const stopSimulation = () => {
    setSimRunning(false);
    setSimState({});
  };
  const resetCircuit = () => {
    stopSimulation();
    setComponents([]);
    setWires([]);
    setSelectedId(null);
    setInfoComponent(null);
    setSerialLog([]);
    setMissionSuccess(false);
    setMissionChecked(false);
    setCurrentStep(0);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  const selectedComp = components.find(c => c.instanceId === selectedId);
  const selectedDef = selectedComp ? COMPONENT_MAP[selectedComp.definitionId] : null;
  const visibleComponents = COMPONENT_DEFS.filter(c => c.category === selectedCategory);

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-gray-100 overflow-hidden select-none">
      {/* ── Top Bar ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800 z-10 flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-primary font-bold text-sm tracking-wide">⚗ ElectroLab</span>
          {mission && (
            <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full border border-primary/30">
              Mission {mission.level}: {mission.title}
            </span>
          )}
        </div>

        {/* Simulation Controls */}
        <div className="flex items-center gap-2">
          {simRunning ? (
            <button
              onClick={stopSimulation}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-lg text-xs font-semibold transition-colors"
            >
              ⏹ Stop
            </button>
          ) : (
            <button
              onClick={startSimulation}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded-lg text-xs font-semibold transition-colors"
            >
              ▶ Run Simulation
            </button>
          )}
          <button
            onClick={resetCircuit}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs font-semibold transition-colors"
          >
            ↺ Reset
          </button>
          <button
            onClick={() => setShowCode(v => !v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              showCode ? 'bg-primary text-gray-900' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            {'</>'} Code
          </button>
        </div>

        {/* Status */}
        <div className="flex items-center gap-3 text-xs text-gray-400">
          {simRunning && (
            <span className="flex items-center gap-1 text-green-400">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Simulating {simTime.toFixed(1)}s
            </span>
          )}
          <span>{components.length} components</span>
          <span>{wires.length} wires</span>
        </div>
      </div>

      {/* Mission Success Banner */}
      {missionSuccess && (
        <div className="bg-green-900/80 border-b border-green-600 px-4 py-2 flex items-center justify-between flex-shrink-0">
          <span className="text-green-300 font-semibold text-sm">
            🎉 Mission Complete! +{mission?.reward.xp ?? 0} XP  {mission?.reward.badge}
          </span>
          <button
            onClick={() => setMissionSuccess(false)}
            className="text-green-400 hover:text-white text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* ── Main Layout ──────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left Panel — Component Library */}
        <div className="w-52 flex-shrink-0 bg-gray-900 border-r border-gray-800 flex flex-col overflow-hidden">
          <div className="px-3 pt-3 pb-2 border-b border-gray-800">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Components</p>
          </div>

          {/* Category tabs */}
          <div className="flex flex-wrap gap-1 p-2 border-b border-gray-800">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-2 py-0.5 rounded transition-colors ${
                  selectedCategory === cat
                    ? 'bg-primary text-gray-900 font-semibold'
                    : 'bg-gray-800 text-gray-400 hover:text-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Component list */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {visibleComponents.map(def => (
              <button
                key={def.id}
                onClick={() => { setPendingDef(def.id); setInfoComponent(def); setInfoPanel('learn'); }}
                title={def.name}
                className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg text-left transition-all border ${
                  pendingDef === def.id
                    ? 'bg-primary/20 border-primary text-primary'
                    : 'bg-gray-800 border-transparent text-gray-300 hover:bg-gray-700 hover:border-gray-600'
                }`}
              >
                <span className="text-base w-6 text-center flex-shrink-0">{def.icon}</span>
                <span className="text-xs font-medium truncate">{def.name}</span>
              </button>
            ))}
          </div>

          {/* Pending indicator */}
          {pendingDef && (
            <div className="p-2 border-t border-gray-800 bg-primary/10">
              <p className="text-xs text-primary text-center">
                Click canvas to place &bull; Shift+click for multiple &bull; Esc to cancel
              </p>
            </div>
          )}
        </div>

        {/* Center — SVG Canvas */}
        <div className="flex-1 relative overflow-hidden bg-gray-950">
          <svg
            ref={svgRef}
            className={`w-full h-full ${pendingDef ? 'cursor-crosshair' : wireStart ? 'cursor-cell' : isPanning ? 'cursor-grabbing' : 'cursor-default'}`}
            onClick={handleSVGClick}
            onMouseMove={handleSVGMouseMove}
            onMouseDown={handleSVGMouseDown}
            onMouseUp={handleSVGMouseUp}
            onWheel={handleWheel}
          >
            <g transform={`translate(${pan.x},${pan.y}) scale(${zoom})`}>
              {/* Grid + shared SVG defs */}
              <defs>
                <pattern id="grid-small" width={GRID} height={GRID} patternUnits="userSpaceOnUse">
                  <path d={`M ${GRID} 0 L 0 0 0 ${GRID}`} fill="none" stroke="#1e293b" strokeWidth={0.5} />
                </pattern>
                <pattern id="grid-large" width={GRID * 5} height={GRID * 5} patternUnits="userSpaceOnUse">
                  <rect width={GRID * 5} height={GRID * 5} fill="url(#grid-small)" />
                  <path d={`M ${GRID * 5} 0 L 0 0 0 ${GRID * 5}`} fill="none" stroke="#263548" strokeWidth={1} />
                </pattern>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                {/* Component-specific defs (LED glow filters, gradients) */}
                <ComponentSVGDefs />
              </defs>
              <rect data-bg="1" x={-2000} y={-2000} width={6000} height={6000} fill="url(#grid-large)" />

              {/* Wires */}
              {wires.map(wire => {
                const fromComp = components.find(c => c.instanceId === wire.fromInstanceId);
                const toComp   = components.find(c => c.instanceId === wire.toInstanceId);
                if (!fromComp || !toComp) return null;
                const from = getPinPosition(fromComp, wire.fromPinId);
                const to   = getPinPosition(toComp,   wire.toPinId);
                const isActive = simRunning && (
                  simState[wire.fromInstanceId]?.active ||
                  simState[wire.toInstanceId]?.active
                );
                return (
                  <g key={wire.id}>
                    <path
                      d={wirePath(from.x, from.y, to.x, to.y)}
                      fill="none"
                      stroke={isActive ? '#22C0B3' : '#4B5563'}
                      strokeWidth={isActive ? 2 : 1.5}
                      filter={isActive ? 'url(#glow)' : undefined}
                    />
                    {/* Clickable delete zone */}
                    <path
                      d={wirePath(from.x, from.y, to.x, to.y)}
                      fill="none"
                      stroke="transparent"
                      strokeWidth={12}
                      className="cursor-pointer"
                      onClick={(e) => { e.stopPropagation(); deleteWire(wire.id); }}
                    />
                    {/* Current flow animation */}
                    {isActive && (
                      <circle r={3} fill="#22C0B3" opacity={0.8}>
                        <animateMotion
                          dur="1.2s"
                          repeatCount="indefinite"
                          path={wirePath(from.x, from.y, to.x, to.y)}
                        />
                      </circle>
                    )}
                  </g>
                );
              })}

              {/* Pending wire */}
              {wireStart && (
                <path
                  d={wirePath(wireStart.x, wireStart.y, cursorSVG.x, cursorSVG.y)}
                  fill="none"
                  stroke="#22C0B3"
                  strokeWidth={1.5}
                  strokeDasharray="6 4"
                  opacity={0.7}
                />
              )}

              {/* Placed components */}
              {components.map(comp => {
                const def = COMPONENT_MAP[comp.definitionId];
                if (!def) return null;
                const cState = simState[comp.instanceId];
                const isSelected = selectedId === comp.instanceId;
                const spinning = cState?.spinning ?? false;

                return (
                  <g
                    key={comp.instanceId}
                    transform={`translate(${comp.x},${comp.y}) rotate(${comp.rotation})`}
                    className="cursor-move"
                    onMouseDown={e => handleCompMouseDown(e, comp.instanceId)}
                    onClick={e => {
                      e.stopPropagation();
                      setSelectedId(comp.instanceId);
                      setInfoComponent(def);
                      setInfoPanel('properties');
                    }}
                  >
                    {/* Selection ring */}
                    {isSelected && (
                      <rect
                        x={-def.width / 2 - 4}
                        y={-def.height / 2 - 4}
                        width={def.width + 8}
                        height={def.height + 8}
                        rx={8}
                        fill="none"
                        stroke="#22C0B3"
                        strokeWidth={1.5}
                        strokeDasharray="4 3"
                      />
                    )}

                    {/* Component symbol */}
                    <ComponentSymbol
                      defId={comp.definitionId}
                      width={def.width}
                      height={def.height}
                      simState={cState}
                      time={spinning ? simTime : 0}
                      properties={comp.properties}
                      instanceId={comp.instanceId}
                    />

                    {/* Button interaction overlay */}
                    {comp.definitionId === 'push_button' && (
                      <rect
                        x={-14} y={-14} width={28} height={28}
                        fill="transparent"
                        className="cursor-pointer"
                        onMouseDown={e => {
                          e.stopPropagation();
                          updateProperty(comp.instanceId, 'pressed', true);
                        }}
                        onMouseUp={e => {
                          e.stopPropagation();
                          updateProperty(comp.instanceId, 'pressed', false);
                        }}
                        onMouseLeave={() => updateProperty(comp.instanceId, 'pressed', false)}
                      />
                    )}

                    {/* Switch toggle */}
                    {comp.definitionId === 'switch' && (
                      <rect
                        x={-def.width / 2 + 4} y={-def.height / 2 + 4}
                        width={def.width - 8} height={def.height - 8}
                        fill="transparent"
                        className="cursor-pointer"
                        onClick={e => {
                          e.stopPropagation();
                          updateProperty(comp.instanceId, 'closed', !comp.properties.closed);
                        }}
                      />
                    )}

                    {/* Potentiometer knob interaction */}
                    {comp.definitionId === 'potentiometer' && (
                      <rect
                        x={-20} y={-16} width={40} height={20}
                        fill="transparent"
                        className="cursor-ew-resize"
                        onMouseDown={e => {
                          e.stopPropagation();
                          const startX = e.clientX;
                          const startVal = Number(comp.properties.value ?? 0.5);
                          const onMove = (me: MouseEvent) => {
                            const delta = (me.clientX - startX) / 100;
                            updateProperty(comp.instanceId, 'value', Math.min(1, Math.max(0, startVal + delta)));
                          };
                          const onUp = () => {
                            window.removeEventListener('mousemove', onMove);
                            window.removeEventListener('mouseup', onUp);
                          };
                          window.addEventListener('mousemove', onMove);
                          window.addEventListener('mouseup', onUp);
                        }}
                      />
                    )}

                    {/* Pins */}
                    {def.pins.map(pin => {
                      const isWireFrom = wireStart?.instanceId === comp.instanceId && wireStart.pinId === pin.id;
                      const hasWire = wires.some(
                        w => (w.fromInstanceId === comp.instanceId && w.fromPinId === pin.id) ||
                             (w.toInstanceId   === comp.instanceId && w.toPinId   === pin.id)
                      );
                      return (
                        <g key={pin.id}>
                          <circle
                            cx={pin.x} cy={pin.y}
                            r={5}
                            fill={isWireFrom ? '#22C0B3' : hasWire ? '#0E7490' : '#1F2937'}
                            stroke={wireStart && !isWireFrom ? '#22C0B3' : '#6B7280'}
                            strokeWidth={isWireFrom || wireStart ? 2 : 1}
                            className="cursor-pointer hover:stroke-primary"
                            onClick={e => handlePinClick(e, comp.instanceId, pin.id)}
                          />
                          <text
                            x={pin.x > 0 ? pin.x + 8 : pin.x - 8}
                            y={pin.y + 4}
                            fontSize={7}
                            fill="#6B7280"
                            textAnchor={pin.x > 0 ? 'start' : 'end'}
                            pointerEvents="none"
                          >
                            {pin.label}
                          </text>
                        </g>
                      );
                    })}
                  </g>
                );
              })}

              {/* Pending component ghost */}
              {pendingDef && (() => {
                const def = COMPONENT_MAP[pendingDef];
                if (!def) return null;
                const gx = snap(cursorSVG.x);
                const gy = snap(cursorSVG.y);
                return (
                  <g transform={`translate(${gx},${gy})`} opacity={0.6} pointerEvents="none">
                    <ComponentSymbol defId={pendingDef} width={def.width} height={def.height}
                      properties={COMPONENT_MAP[pendingDef]?.defaultProperties} />
                  </g>
                );
              })()}
            </g>
          </svg>

          {/* Zoom controls */}
          <div className="absolute bottom-4 right-4 flex flex-col gap-1">
            <button onClick={() => setZoom(z => Math.min(3, z * 1.2))} className="w-8 h-8 bg-gray-800 hover:bg-gray-700 rounded text-sm flex items-center justify-center">+</button>
            <button onClick={() => setZoom(1)} className="w-8 h-8 bg-gray-800 hover:bg-gray-700 rounded text-xs flex items-center justify-center">{Math.round(zoom * 100)}%</button>
            <button onClick={() => setZoom(z => Math.max(0.3, z / 1.2))} className="w-8 h-8 bg-gray-800 hover:bg-gray-700 rounded text-sm flex items-center justify-center">−</button>
          </div>

          {/* Keyboard hint */}
          <div className="absolute bottom-4 left-4 text-xs text-gray-600 space-y-0.5">
            <p>Del — delete selected &nbsp;|&nbsp; R — rotate &nbsp;|&nbsp; Alt+drag — pan</p>
            <p>Click pin → click pin to draw wire &nbsp;|&nbsp; Click wire to delete</p>
          </div>
        </div>

        {/* Right Panel — Info / Properties */}
        <div className="w-64 flex-shrink-0 bg-gray-900 border-l border-gray-800 flex flex-col overflow-hidden">
          {infoComponent ? (
            <>
              {/* Component header */}
              <div className="px-3 pt-3 pb-2 border-b border-gray-800">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{infoComponent.icon}</span>
                  <div>
                    <p className="text-sm font-bold text-white">{infoComponent.name}</p>
                    <span className="text-xs text-gray-500">{infoComponent.category}</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setInfoPanel('learn')}
                    className={`flex-1 text-xs py-1 rounded transition-colors ${infoPanel === 'learn' ? 'bg-primary text-gray-900 font-semibold' : 'bg-gray-800 text-gray-400'}`}
                  >
                    Learn
                  </button>
                  {selectedComp && (
                    <button
                      onClick={() => setInfoPanel('properties')}
                      className={`flex-1 text-xs py-1 rounded transition-colors ${infoPanel === 'properties' ? 'bg-primary text-gray-900 font-semibold' : 'bg-gray-800 text-gray-400'}`}
                    >
                      Properties
                    </button>
                  )}
                </div>
              </div>

              {/* Panel content */}
              <div className="flex-1 overflow-y-auto p-3">
                {infoPanel === 'learn' ? (
                  <div className="space-y-3 text-xs text-gray-300">
                    <p className="text-gray-200 leading-relaxed">{infoComponent.description}</p>
                    <div>
                      <p className="text-primary font-semibold mb-1 text-xs uppercase tracking-wide">How it works</p>
                      <p className="leading-relaxed text-gray-400">{infoComponent.howItWorks}</p>
                    </div>
                    <div>
                      <p className="text-primary font-semibold mb-1 text-xs uppercase tracking-wide">Applications</p>
                      <ul className="space-y-0.5 text-gray-400">
                        {infoComponent.applications.map((a, i) => (
                          <li key={i} className="flex gap-1"><span className="text-primary">•</span>{a}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-yellow-900/30 border border-yellow-700/40 rounded-lg p-2">
                      <p className="text-yellow-400 font-semibold text-xs mb-0.5">💡 Pro Tip</p>
                      <p className="text-yellow-200/80 text-xs leading-relaxed">{infoComponent.tip}</p>
                    </div>
                    <div>
                      <p className="text-primary font-semibold mb-1 text-xs uppercase tracking-wide">Pins</p>
                      <div className="space-y-1">
                        {infoComponent.pins.map(pin => (
                          <div key={pin.id} className="flex items-center gap-2 bg-gray-800 rounded px-2 py-1">
                            <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                            <span className="font-mono text-xs text-gray-200">{pin.label}</span>
                            <span className="text-gray-500 text-xs ml-auto">{pin.type}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : selectedComp && selectedDef ? (
                  <div className="space-y-3 text-xs">
                    {/* Component ID */}
                    <div>
                      <p className="text-gray-500 mb-1">Instance ID</p>
                      <code className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded block truncate">{selectedComp.instanceId}</code>
                    </div>

                    {/* Rotation */}
                    <div>
                      <p className="text-gray-500 mb-1">Rotation</p>
                      <div className="flex gap-1">
                        {[0, 90, 180, 270].map(deg => (
                          <button
                            key={deg}
                            onClick={() => setComponents(prev =>
                              prev.map(c => c.instanceId === selectedComp.instanceId ? { ...c, rotation: deg } : c)
                            )}
                            className={`flex-1 py-1 text-xs rounded transition-colors ${
                              selectedComp.rotation === deg ? 'bg-primary text-gray-900 font-semibold' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                            }`}
                          >
                            {deg}°
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Component-specific properties */}
                    {selectedComp.definitionId === 'battery' && (
                      <div>
                        <label className="text-gray-500 block mb-1">Voltage (V)</label>
                        <input
                          type="number" min={1} max={24} step={1}
                          value={Number(selectedComp.properties.voltage ?? 9)}
                          onChange={e => updateProperty(selectedComp.instanceId, 'voltage', Number(e.target.value))}
                          className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs text-gray-200 focus:border-primary outline-none"
                        />
                      </div>
                    )}
                    {selectedComp.definitionId === 'resistor' && (
                      <div>
                        <label className="text-gray-500 block mb-1">Resistance (Ω)</label>
                        <select
                          value={Number(selectedComp.properties.resistance ?? 220)}
                          onChange={e => updateProperty(selectedComp.instanceId, 'resistance', Number(e.target.value))}
                          className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs text-gray-200 focus:border-primary outline-none"
                        >
                          {[10, 22, 47, 100, 220, 330, 470, 1000, 2200, 4700, 10000, 47000, 100000].map(v => (
                            <option key={v} value={v}>{v < 1000 ? `${v}Ω` : `${v < 1000000 ? (v / 1000) + 'kΩ' : (v / 1000000) + 'MΩ'}`}</option>
                          ))}
                        </select>
                      </div>
                    )}
                    {selectedComp.definitionId === 'led' && (
                      <div>
                        <label className="text-gray-500 block mb-1">Color</label>
                        <select
                          value={String(selectedComp.properties.color ?? 'red')}
                          onChange={e => updateProperty(selectedComp.instanceId, 'color', e.target.value)}
                          className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs text-gray-200 focus:border-primary outline-none"
                        >
                          {['red', 'green', 'blue', 'yellow', 'white', 'orange'].map(c => (
                            <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                          ))}
                        </select>
                      </div>
                    )}
                    {selectedComp.definitionId === 'potentiometer' && (
                      <div>
                        <label className="text-gray-500 block mb-1">Knob position ({Math.round(Number(selectedComp.properties.value ?? 0.5) * 100)}%)</label>
                        <input
                          type="range" min={0} max={1} step={0.01}
                          value={Number(selectedComp.properties.value ?? 0.5)}
                          onChange={e => updateProperty(selectedComp.instanceId, 'value', Number(e.target.value))}
                          className="w-full accent-primary"
                        />
                      </div>
                    )}

                    {/* Simulation state */}
                    {simRunning && simState[selectedComp.instanceId] && (
                      <div className="border-t border-gray-800 pt-2">
                        <p className="text-gray-500 mb-1 uppercase text-xs tracking-wide">Sim State</p>
                        {Object.entries(simState[selectedComp.instanceId]).map(([k, v]) => (
                          <div key={k} className="flex justify-between py-0.5">
                            <span className="text-gray-500">{k}</span>
                            <span className="text-gray-300 font-mono">
                              {typeof v === 'number' ? v.toFixed(2) : String(v)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-1 pt-2 border-t border-gray-800">
                      <button
                        onClick={() => rotateComponent(selectedComp.instanceId)}
                        className="flex-1 py-1.5 bg-gray-800 hover:bg-gray-700 rounded text-xs text-gray-300 transition-colors"
                      >
                        ↻ Rotate
                      </button>
                      <button
                        onClick={() => deleteComponent(selectedComp.instanceId)}
                        className="flex-1 py-1.5 bg-red-900/50 hover:bg-red-800/60 rounded text-xs text-red-400 transition-colors"
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
              <span className="text-4xl mb-3 opacity-40">🔬</span>
              <p className="text-xs text-gray-500 leading-relaxed">
                Select a component from the library to learn about it, or click a placed component to edit its properties.
              </p>
            </div>
          )}

          {/* Mission panel */}
          {mission && (
            <div className="border-t border-gray-800 p-3">
              <p className="text-xs font-semibold text-primary mb-2 uppercase tracking-wide">Mission Steps</p>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {mission.steps.map((step, i) => (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStep(i)}
                    className={`w-full flex items-start gap-2 text-left text-xs p-1.5 rounded transition-colors ${
                      i === currentStep ? 'bg-primary/20 text-primary' :
                      i < currentStep ? 'text-gray-600' : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold mt-0.5 ${
                      i < currentStep ? 'bg-green-600 text-white' :
                      i === currentStep ? 'bg-primary text-gray-900' :
                      'bg-gray-800 text-gray-500'
                    }`}>
                      {i < currentStep ? '✓' : i + 1}
                    </span>
                    <div>
                      <p className="leading-tight">{step.text}</p>
                      {i === currentStep && step.hint && (
                        <p className="text-yellow-400 mt-0.5">💡 {step.hint}</p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex gap-1 mt-2">
                <button
                  disabled={currentStep === 0}
                  onClick={() => setCurrentStep(s => Math.max(0, s - 1))}
                  className="flex-1 py-1 bg-gray-800 rounded text-xs text-gray-400 disabled:opacity-40"
                >← Back</button>
                <button
                  disabled={currentStep === mission.steps.length - 1}
                  onClick={() => setCurrentStep(s => Math.min(mission.steps.length - 1, s + 1))}
                  className="flex-1 py-1 bg-gray-800 rounded text-xs text-gray-400 disabled:opacity-40"
                >Next →</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Code Editor (bottom drawer) ──────────────────────────────────── */}
      {showCode && (
        <div className="flex-shrink-0 h-64 flex flex-col bg-gray-950 border-t border-gray-800">
          <div className="flex items-center justify-between px-3 py-1.5 bg-gray-900 border-b border-gray-800">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Arduino Code Editor</span>
            <div className="flex gap-2">
              <span className="text-xs text-gray-600">Click ▶ Run Simulation above to execute code</span>
              <button onClick={() => setSerialLog([])} className="text-xs text-gray-500 hover:text-gray-300">Clear log</button>
            </div>
          </div>
          <div className="flex flex-1 overflow-hidden">
            {/* Code */}
            <textarea
              value={code}
              onChange={e => setCode(e.target.value)}
              spellCheck={false}
              className="flex-1 bg-gray-950 text-green-300 font-mono text-xs p-3 resize-none outline-none border-r border-gray-800 leading-relaxed"
              placeholder={`// Arduino code\nvoid setup() {\n  pinMode(13, OUTPUT);\n}\nvoid loop() {\n  digitalWrite(13, HIGH);\n  delay(500);\n  digitalWrite(13, LOW);\n  delay(500);\n}`}
            />
            {/* Serial monitor */}
            <div className="w-64 flex flex-col">
              <p className="text-xs text-gray-500 px-2 pt-1.5 font-semibold">Serial Monitor</p>
              <div className="flex-1 overflow-y-auto p-2 font-mono text-xs text-green-400 space-y-0.5">
                {serialLog.length === 0
                  ? <p className="text-gray-600">No output yet. Run simulation with Arduino code.</p>
                  : serialLog.map((line, i) => <p key={i}>{line}</p>)
                }
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const DEFAULT_CODE = `// ElectroLab Arduino Simulator
// Place an Arduino Uno from the Microcontrollers panel
// and connect LEDs, motors, or sensors to control them here.

const int LED_PIN = 13;

void setup() {
  pinMode(LED_PIN, OUTPUT);
  Serial.begin(9600);
  Serial.println("ElectroLab started!");
}

void loop() {
  digitalWrite(LED_PIN, HIGH);
  Serial.println("LED ON");
  delay(500);
  
  digitalWrite(LED_PIN, LOW);
  Serial.println("LED OFF");
  delay(500);
}
`;
