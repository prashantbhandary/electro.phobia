'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const TOOLS = [
  {
    href: '/lab/tools/resistor',
    title: 'Resistor Color Code',
    subtitle: 'Decode color bands ↔ resistance value',
    tags: ['Beginner must-have', '4-band', '5-band'],
  },
  {
    href: '/lab/tools/ohms-law',
    title: "Ohm's Law Calculator",
    subtitle: 'Solve V = I × R interactively',
    tags: ['V = IR', 'Power P = VI', 'Triangle solver'],
  },
  {
    href: '/lab/tools/led-calc',
    title: 'LED Resistor Calculator',
    subtitle: 'Find the right current-limiting resistor',
    tags: ['Any LED color', 'Supply voltage', 'Forward voltage'],
  },
];

const COMING_SOON = [
  { title: 'Voltage Divider',   desc: 'R1 + R2 → Vout for sensor interfacing' },
  { title: 'Capacitor Charge',  desc: 'Animate RC charge/discharge curve' },
  { title: 'PWM Duty Cycle',    desc: 'Arduino analogWrite → actual voltage' },
  { title: '555 Timer',         desc: 'Astable / monostable frequency calculator' },
  { title: 'Transistor Bias',   desc: 'NPN base resistance for switching loads' },
  { title: 'PCB Trace Width',   desc: 'Safe current vs copper thickness' },
];

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6 md:p-10">
      {/* Back */}
      <Link href="/lab" className="text-primary hover:underline text-sm">&larr; Back to Lab</Link>

      {/* Hero */}
      <div className="mt-6 mb-10">
        <h1 className="text-3xl md:text-4xl font-bold">
          <span className="text-primary">Electronics</span> Tools
        </h1>
        <p className="mt-2 text-gray-600 max-w-2xl">
          Every beginner hits the same walls. These tools tackle them head-on — from decoding resistor bands
          to calculating the right limiting resistor, without leaving the learning environment.
        </p>
      </div>

      {/* Primary tools */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
        {TOOLS.map((tool, i) => (
          <motion.div
            key={tool.href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link href={tool.href}
              className={`block rounded-2xl border border-gray-200 bg-white
                p-6 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md hover:border-primary/30`}>
              <h2 className="text-xl font-bold text-gray-900 mb-1">{tool.title}</h2>
              <p className="text-sm text-gray-500 mb-4">{tool.subtitle}</p>
              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {tool.tags.map(t => (
                  <span key={t} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full border border-gray-200">
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-4 text-right text-sm font-semibold text-primary">
                Open →
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Coming soon */}
      <h2 className="text-lg font-semibold text-gray-400 mb-4">Coming Soon</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {COMING_SOON.map(tool => (
          <div key={tool.title}
            className="rounded-lg border border-gray-200 bg-white p-4 opacity-60">
            <p className="font-medium text-sm text-gray-800">{tool.title}</p>
            <p className="text-xs text-gray-500 mt-1">{tool.desc}</p>
          </div>
        ))}
      </div>

      {/* Tip banner */}
      <div className="mt-12 rounded-xl bg-primary/10 border border-primary/30 p-5">
        <p className="text-sm text-primary font-medium">Tip for beginners</p>
          <p className="mt-1 text-gray-600 text-sm">
          Electronics isn&apos;t about memorizing formulas — it&apos;s about building intuition.
          Use these tools alongside the <Link href="/lab/sandbox" className="text-primary hover:underline">circuit sandbox</Link> to
          see theory in action. When your circuit glows for the first time, you&apos;ll understand <em>why</em>.
        </p>
      </div>
    </div>
  );
}
