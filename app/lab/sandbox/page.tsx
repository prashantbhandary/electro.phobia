'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const SIMULATORS = [
  {
    name: 'Wokwi',
    url: 'https://wokwi.com',
    tagline: 'Best for Arduino & ESP32 projects',
    description:
      'Simulate real microcontroller code alongside components. Write code, wire circuits, and see your program run — no hardware needed. Supports Arduino, ESP32, and Raspberry Pi Pico.',
    tags: ['Arduino', 'ESP32', 'Code + Circuit', 'Free'],
    cta: 'Open Wokwi',
    color: 'border-green-200 hover:border-green-400',
    badge: 'bg-green-50 text-green-700 border-green-200',
    ctaColor: 'bg-green-600 hover:bg-green-700 text-white',
  },
  {
    name: 'Tinkercad Circuits',
    url: 'https://www.tinkercad.com/circuits',
    tagline: 'Best for visual drag-and-drop beginners',
    description:
      'Autodesk\'s free in-browser circuit simulator. Drag components, wire them up, hit Simulate — breadboards, sensors, LEDs, motors all included. Great starting point before real hardware.',
    tags: ['Visual', 'Breadboard', 'Beginner', 'Free'],
    cta: 'Open Tinkercad',
    color: 'border-blue-200 hover:border-blue-400',
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
    ctaColor: 'bg-blue-600 hover:bg-blue-700 text-white',
  },
  {
    name: 'Falstad Circuit Simulator',
    url: 'https://www.falstad.com/circuit/',
    tagline: 'Best for understanding analog circuits',
    description:
      'Real-time analog simulation with live voltage and current visualizations. Perfect for understanding how resistors, capacitors, op-amps, and filters actually behave.',
    tags: ['Analog', 'No signup', 'Live waveforms', 'Free'],
    cta: 'Open Falstad',
    color: 'border-amber-200 hover:border-amber-400',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    ctaColor: 'bg-amber-600 hover:bg-amber-700 text-white',
  },
];

export default function SandboxPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6 md:p-10">
      {/* Back */}
      <Link href="/lab" className="text-primary hover:underline text-sm">&larr; Back to Lab</Link>

      {/* Header */}
      <div className="mt-6 mb-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Practice <span className="text-primary">Building</span>
        </h1>
        <p className="mt-3 text-gray-600 max-w-2xl leading-relaxed">
          ElectroLab focuses on <strong>understanding</strong> — how circuits work, what each component does,
          and why current flows the way it does.
        </p>
        <p className="mt-2 text-gray-600 max-w-2xl leading-relaxed">
          For actually building and experimenting with circuits, these dedicated simulators are far better tools.
          They are free, browser-based, and purpose-built for hands-on practice.
        </p>
      </div>

      {/* Tip */}
      <div className="mt-6 mb-10 rounded-xl bg-primary/10 border border-primary/30 p-4 max-w-2xl">
        <p className="text-sm text-primary font-medium">Recommended workflow</p>
        <p className="mt-1 text-sm text-gray-600">
          Learn the concept here in ElectroLab → then build and experiment in Wokwi or Tinkercad.
          Theory + practice together is the fastest way to actually understand electronics.
        </p>
      </div>

      {/* Simulator cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
        {SIMULATORS.map((sim, i) => (
          <motion.div
            key={sim.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`bg-white rounded-2xl border ${sim.color} p-6 shadow-sm flex flex-col transition-all`}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-1">{sim.name}</h2>
            <p className="text-xs font-semibold text-gray-500 mb-3">{sim.tagline}</p>
            <p className="text-sm text-gray-600 leading-relaxed flex-1 mb-4">{sim.description}</p>
            <div className="flex flex-wrap gap-1.5 mb-5">
              {sim.tags.map(t => (
                <span key={t} className={`text-xs px-2 py-0.5 rounded-full border font-medium ${sim.badge}`}>
                  {t}
                </span>
              ))}
            </div>
            <a
              href={sim.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full text-center py-2.5 rounded-xl font-semibold text-sm transition-colors ${sim.ctaColor}`}
            >
              {sim.cta} →
            </a>
          </motion.div>
        ))}
      </div>

      {/* Back to learning */}
      <div className="mt-14 border-t border-gray-200 pt-8 max-w-2xl">
        <p className="text-sm text-gray-500 mb-4">Not sure what to build yet? Go back and learn a concept first.</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/lab/demos"
            className="px-5 py-2.5 bg-primary text-white font-semibold rounded-xl text-sm hover:bg-primary/90 transition-colors">
            Watch a circuit demo
          </Link>
          <Link href="/lab/missions"
            className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">
            Try a mission
          </Link>
          <Link href="/lab/tools"
            className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">
            Use a calculator
          </Link>
        </div>
      </div>
    </div>
  );
}

