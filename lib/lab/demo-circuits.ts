// Pre-built demo circuits with step-by-step explanations
// Each circuit is rendered as a schematic SVG — no manual building required

export interface DemoStep {
  title: string;
  body: string;
  highlight: string[];        // component "role" IDs to glow/highlight
  annotate?: { cx: number; cy: number; text: string; color: string }[];
  isOn?: boolean;             // whether current flows in this step
}

export interface DemoCircuit {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  difficulty: 'Beginner' | 'Intermediate';
  tags: string[];
  steps: DemoStep[];
  // Schematic layout (used by DemoViewer renderer)
  schematic: DemoSchematic;
}

export interface SchComponent {
  id: string;     // role ID used in highlight[]
  type: 'battery' | 'resistor' | 'led' | 'button' | 'pot' | 'npn' | 'gnd' | 'vcc' | 'wire_node' | '555';
  cx: number; cy: number;
  label: string;
  value?: string;
  ledColor?: string;
  orient?: 'h' | 'v';   // horizontal (default) or vertical
}

export interface SchWire {
  id: string;
  d: string;            // SVG path data
  role?: 'power' | 'ground' | 'signal';
}

export interface DemoSchematic {
  viewBox: string;
  components: SchComponent[];
  wires: SchWire[];
  currentPathD: string;   // full loop for current-flow animation dot
}

// ─── Demo 1: LED Series Circuit ───────────────────────────────────────────────
const ledSeriesCircuit: DemoCircuit = {
  id: 'led-series',
  title: 'LED Series Circuit',
  subtitle: 'Your first circuit — understand current, voltage, and light',
  icon: '',
  difficulty: 'Beginner',
  tags: ['LED', 'Resistor', 'Battery', 'Ohm\'s Law'],
  steps: [
    {
      title: 'The Power Source',
      body: 'The battery pushes current around the circuit. Its positive terminal (+) is at higher voltage — current flows from + toward −.',
      highlight: ['bat'],
      annotate: [{ cx: 80, cy: 55, text: '+9V', color: '#10B981' }],
      isOn: false,
    },
    {
      title: 'The Resistor',
      body: 'Without a resistor, too much current would destroy the LED instantly. A 330Ω resistor limits current to a safe 20mA.',
      highlight: ['r1'],
      annotate: [{ cx: 240, cy: 55, text: 'V drop = 6.6V', color: '#F59E0B' }],
      isOn: false,
    },
    {
      title: 'The LED',
      body: 'Current enters the LED at the anode (+) and exits at the cathode (−). Electrons crossing the junction release energy as light.',
      highlight: ['led1'],
      annotate: [{ cx: 400, cy: 55, text: 'Vf = 2V', color: '#EF4444' }],
      isOn: false,
    },
    {
      title: 'Circuit Complete',
      body: 'Battery → Resistor → LED → Battery. The resistor drops 6.6V, the LED drops 2V, and current flows at 20mA. The LED glows.',
      highlight: ['bat', 'r1', 'led1'],
      isOn: true,
    },
  ],
  schematic: {
    viewBox: '0 0 560 280',
    components: [
      { id: 'bat',  type: 'battery',  cx: 70,  cy: 140, label: 'BAT1',  value: '9V',   orient: 'v' },
      { id: 'r1',   type: 'resistor', cx: 230, cy: 80,  label: 'R1',    value: '330Ω', orient: 'h' },
      { id: 'led1', type: 'led',      cx: 400, cy: 80,  label: 'LED1',  value: 'Red',  ledColor: '#EF4444', orient: 'h' },
      { id: 'gnd',  type: 'gnd',      cx: 290, cy: 220, label: '',       orient: 'h' },
    ],
    wires: [
      { id: 'w1', d: 'M 70 80 H 170', role: 'power' },
      { id: 'w2', d: 'M 290 80 H 340', role: 'power' },
      { id: 'w3', d: 'M 460 80 H 490 V 220', role: 'power' },
      { id: 'w4', d: 'M 490 220 H 70 V 200', role: 'ground' },
    ],
    currentPathD: 'M 70 80 H 170 H 290 H 340 H 460 H 490 V 220 H 70 V 80',
  },
};

// ─── Demo 2: Voltage Divider ──────────────────────────────────────────────────
const voltageDivider: DemoCircuit = {
  id: 'voltage-divider',
  title: 'Voltage Divider',
  subtitle: 'Two resistors split voltage proportionally — key to sensor interfacing',
  icon: '',
  difficulty: 'Beginner',
  tags: ['Resistor', 'Voltage', 'Ohm\'s Law', 'Sensors'],
  steps: [
    {
      title: 'Two Resistors in Series',
      body: '5V connects across R1 and R2 in series. The same current flows through both: 5V ÷ 3kΩ = 1.67mA.',
      highlight: ['vcc', 'gnd'],
      isOn: true,
    },
    {
      title: 'R1 Takes Its Share',
      body: 'R1 (1kΩ) drops 1.67V. In a series circuit, each resistor drops voltage in proportion to its resistance.',
      highlight: ['r1'],
      annotate: [{ cx: 130, cy: 160, text: '1.67V', color: '#F59E0B' }],
      isOn: true,
    },
    {
      title: 'R2 Takes the Rest',
      body: 'R2 (2kΩ) drops 3.33V. The midpoint sits at 3.33V — not half — because R2 is twice R1.',
      highlight: ['r2'],
      annotate: [{ cx: 130, cy: 220, text: '3.33V', color: '#60A5FA' }],
      isOn: true,
    },
    {
      title: 'The Output Signal',
      body: 'The midpoint is your output. Swap R1 for a thermistor or light sensor and Vout changes with the environment.',
      highlight: ['r1', 'r2', 'vout'],
      annotate: [{ cx: 320, cy: 185, text: 'Vout = Vin × R2/(R1+R2)', color: '#22C0B3' }],
      isOn: true,
    },
  ],
  schematic: {
    viewBox: '0 0 560 320',
    components: [
      { id: 'vcc', type: 'vcc',      cx: 200, cy: 40,  label: '5V',   orient: 'v' },
      { id: 'r1',  type: 'resistor', cx: 200, cy: 130, label: 'R1',   value: '1kΩ', orient: 'v' },
      { id: 'r2',  type: 'resistor', cx: 200, cy: 220, label: 'R2',   value: '2kΩ', orient: 'v' },
      { id: 'gnd', type: 'gnd',      cx: 200, cy: 290, label: 'GND',  orient: 'v' },
      { id: 'vout',type: 'wire_node',cx: 200, cy: 185, label: 'Vout = 3.33V', orient: 'h' },
    ],
    wires: [
      { id: 'wt',  d: 'M 200 55 V 95',  role: 'power'  },
      { id: 'wm',  d: 'M 200 165 V 180 M 200 190 V 205', role: 'signal' },
      { id: 'wb',  d: 'M 200 255 V 280', role: 'ground' },
      { id: 'wout',d: 'M 200 185 H 320', role: 'signal' },
    ],
    currentPathD: 'M 200 55 V 95 V 165 V 185 V 205 V 255 V 280',
  },
};

// ─── Demo 3: Button Controlled LED ───────────────────────────────────────────
const buttonLED: DemoCircuit = {
  id: 'button-led',
  title: 'Button Switch',
  subtitle: 'Open and closed circuits — how switches control current',
  icon: '',
  difficulty: 'Beginner',
  tags: ['Button', 'LED', 'Switch', 'Input'],
  steps: [
    {
      title: 'Open Circuit',
      body: 'The button is open — there is a gap in the path. With no complete circuit, no current flows and the LED stays off.',
      highlight: ['btn'],
      isOn: false,
    },
    {
      title: 'Pressing the Button',
      body: 'Pressing bridges the gap. A metal contact inside connects both terminals, completing the circuit.',
      highlight: ['btn'],
      isOn: true,
      annotate: [{ cx: 250, cy: 55, text: 'Circuit closed', color: '#10B981' }],
    },
    {
      title: 'Current Flows',
      body: 'Current flows through the button, the resistor, and the LED. The resistor limits current to protect the LED.',
      highlight: ['btn', 'r1', 'led1'],
      isOn: true,
    },
    {
      title: 'Pull-down Resistor',
      body: 'With a microcontroller, a 10kΩ pull-down resistor to GND keeps the input pin at a known LOW when the button is not pressed.',
      highlight: ['btn', 'r1'],
      annotate: [{ cx: 420, cy: 160, text: 'Pull-down: 10k to GND', color: '#6B7280' }],
      isOn: false,
    },
  ],
  schematic: {
    viewBox: '0 0 560 280',
    components: [
      { id: 'bat',  type: 'battery',  cx: 70,  cy: 140, label: 'BAT',  value: '3.3V', orient: 'v' },
      { id: 'btn',  type: 'button',   cx: 220, cy: 80,  label: 'BTN1', orient: 'h' },
      { id: 'r1',   type: 'resistor', cx: 340, cy: 80,  label: 'R1',   value: '330Ω', orient: 'h' },
      { id: 'led1', type: 'led',      cx: 450, cy: 80,  label: 'LED1', ledColor: '#22C0B3', orient: 'h' },
      { id: 'gnd',  type: 'gnd',      cx: 290, cy: 220, label: '',      orient: 'h' },
    ],
    wires: [
      { id: 'w1', d: 'M 70 80 H 182', role: 'power' },
      { id: 'w2', d: 'M 258 80 H 292', role: 'power' },
      { id: 'w3', d: 'M 388 80 H 408', role: 'power' },
      { id: 'w4', d: 'M 492 80 H 510 V 220 H 70 V 200', role: 'ground' },
    ],
    currentPathD: 'M 70 80 H 182 H 258 H 292 H 388 H 408 H 492 H 510 V 220 H 70 V 80',
  },
};

// ─── Demo 4: NPN Transistor Switch ────────────────────────────────────────────
const transistorSwitch: DemoCircuit = {
  id: 'transistor-switch',
  title: 'Transistor Switch',
  subtitle: 'Control high power with a tiny signal — the heart of all electronics',
  icon: '',
  difficulty: 'Intermediate',
  tags: ['Transistor', 'NPN', 'Amplifier', 'Switch'],
  steps: [
    {
      title: 'The NPN Transistor',
      body: 'Three pins: Base (B), Collector (C), Emitter (E). A small current at the base controls a much larger current from collector to emitter.',
      highlight: ['npn'],
      isOn: false,
    },
    {
      title: 'Small Control Signal',
      body: "A 5V signal through a 10kΩ resistor sends just 0.43mA into the base — well within an Arduino pin's safe limit.",
      highlight: ['rb', 'npn'],
      annotate: [{ cx: 155, cy: 155, text: 'Ib = 0.43mA', color: '#F59E0B' }],
      isOn: true,
    },
    {
      title: 'Amplified Load Current',
      body: 'That small base current switches on 16.8mA through the LED — about 39× amplification. The transistor acts as a current-controlled switch.',
      highlight: ['rc', 'led1', 'npn'],
      annotate: [{ cx: 390, cy: 100, text: 'Ic = 16.8mA', color: '#60A5FA' }],
      isOn: true,
    },
    {
      title: 'Why Use a Transistor',
      body: 'Arduino pins can only source ~40mA. A transistor lets a weak signal switch motors or high-power LEDs from a separate supply.',
      highlight: ['npn', 'rb', 'rc'],
      isOn: true,
    },
  ],
  schematic: {
    viewBox: '0 0 560 340',
    components: [
      { id: 'vcc',  type: 'vcc',      cx: 400, cy: 30,  label: '12V',  orient: 'v' },
      { id: 'rc',   type: 'resistor', cx: 400, cy: 110, label: 'Rc',   value: '470Ω', orient: 'v' },
      { id: 'led1', type: 'led',      cx: 400, cy: 190, label: 'LED',  ledColor: '#EF4444', orient: 'v' },
      { id: 'npn',  type: 'npn',      cx: 400, cy: 260, label: '2N2222', orient: 'v' },
      { id: 'rb',   type: 'resistor', cx: 230, cy: 260, label: 'Rb',   value: '10kΩ', orient: 'h' },
      { id: 'sig',  type: 'vcc',      cx: 100, cy: 260, label: 'Arduino\nD13', orient: 'h' },
      { id: 'gnd',  type: 'gnd',      cx: 400, cy: 315, label: 'GND',  orient: 'v' },
    ],
    wires: [
      { id: 'wv', d: 'M 400 45 V 80',   role: 'power'  },
      { id: 'wl', d: 'M 400 140 V 160', role: 'power'  },
      { id: 'wc', d: 'M 400 220 V 240', role: 'power'  },
      { id: 'we', d: 'M 400 280 V 305', role: 'ground' },
      { id: 'wb', d: 'M 145 260 H 185', role: 'signal' },
      { id: 'ws', d: 'M 275 260 H 370', role: 'signal' },
    ],
    currentPathD: 'M 400 45 V 80 V 140 V 160 V 220 V 240 V 280 V 305',
  },
};

// ─── Demo 5: POT Brightness Control ──────────────────────────────────────────
const potDimmer: DemoCircuit = {
  id: 'pot-dimmer',
  title: 'Variable Brightness (POT)',
  subtitle: 'Potentiometer as variable resistor — analog control',
  icon: '',
  difficulty: 'Beginner',
  tags: ['Potentiometer', 'LED', 'Analog', 'Variable'],
  steps: [
    {
      title: 'Variable Resistor',
      body: 'A potentiometer is a resistor with a sliding wiper. Turning the knob varies resistance from 0 to 10kΩ, which controls the current.',
      highlight: ['pot'],
      isOn: false,
    },
    {
      title: 'High Resistance — Dim',
      body: 'At maximum (10kΩ), only ~0.7mA flows. The high resistance limits current and the LED barely glows.',
      highlight: ['pot', 'led1'],
      annotate: [{ cx: 440, cy: 55, text: '~0.7mA — dim', color: '#9CA3AF' }],
      isOn: true,
    },
    {
      title: 'Half Resistance — Brighter',
      body: 'At 5kΩ, current roughly doubles to ~1.4mA. Less resistance means more current means more light.',
      highlight: ['pot', 'led1'],
      annotate: [{ cx: 440, cy: 55, text: '~1.4mA — medium', color: '#FBBF24' }],
      isOn: true,
    },
    {
      title: 'Safety Resistor',
      body: 'The 100Ω fixed resistor limits maximum current even when the POT is turned all the way down. Never omit it — the LED would burn out.',
      highlight: ['r_min', 'led1'],
      annotate: [{ cx: 360, cy: 55, text: 'Safety resistor', color: '#EF4444' }],
      isOn: true,
    },
  ],
  schematic: {
    viewBox: '0 0 560 280',
    components: [
      { id: 'bat',   type: 'battery',  cx: 70,  cy: 140, label: 'BAT', value: '9V',   orient: 'v' },
      { id: 'pot',   type: 'pot',      cx: 220, cy: 80,  label: 'POT', value: '10kΩ', orient: 'h' },
      { id: 'r_min', type: 'resistor', cx: 355, cy: 80,  label: 'R1',  value: '100Ω', orient: 'h' },
      { id: 'led1',  type: 'led',      cx: 455, cy: 80,  label: 'LED', ledColor: '#10B981', orient: 'h' },
      { id: 'gnd',   type: 'gnd',      cx: 290, cy: 220, label: '',    orient: 'h' },
    ],
    wires: [
      { id: 'w1', d: 'M 70 80 H 170', role: 'power' },
      { id: 'w2', d: 'M 270 80 H 305', role: 'power' },
      { id: 'w3', d: 'M 405 80 H 415', role: 'power' },
      { id: 'w4', d: 'M 495 80 H 510 V 220 H 70 V 200', role: 'ground' },
    ],
    currentPathD: 'M 70 80 H 170 H 270 H 305 H 405 H 415 H 495 H 510 V 220 H 70 V 80',
  },
};

export const DEMO_CIRCUITS: DemoCircuit[] = [
  ledSeriesCircuit,
  voltageDivider,
  buttonLED,
  transistorSwitch,
  potDimmer,
];

export const DEMO_MAP: Record<string, DemoCircuit> = Object.fromEntries(
  DEMO_CIRCUITS.map(d => [d.id, d])
);
