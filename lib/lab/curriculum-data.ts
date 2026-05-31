// ElectroLab Curriculum — structured, slide-based teaching material.
// Each "module" is a self-contained deck (a day of class, or the KiCad track).
// Slides are a small discriminated set of layouts rendered by <SlideDeck/>.
// Content here is written to be presentation-ready: clean enough to screen-record
// straight into a video, and detailed enough for a student to self-study.

import {
  senseThinkAct, currentFlow, acdcWave, seriesParallel, npnSwitch, pullUpDown,
  voltageDivider, pwmDuty, hBridge, servoSweep, ultrasonicPing, pidConverge,
  i2cBus, uartFrame, pcbStack,
  irModule, irReflectance, lineFollower, spiBus, relayClick, oledDisplay,
  resistorBands, ohmsTriangle, capacitorCharge,
  notGateTransistor, norGateTransistor, nandGateTransistor,
} from './diagrams';

// Real component photos live in /public/img/lab (sourced from Wikimedia Commons).
const IMG = (name: string) => `/img/lab/${name}.jpg`;
const PHOTO_CREDIT = 'Photos: Wikimedia Commons · CC / CC0';

export type SlideLayout =
  | 'cover'      // module title slide
  | 'section'    // big divider between topics
  | 'statement'  // one large idea, centered
  | 'bullets'    // title + lead + list
  | 'cards'      // title + grid of mini-cards
  | 'split'      // title + two columns
  | 'formula'    // title + formula + variable key + worked example
  | 'code'       // title + code block + notes
  | 'table'      // title + comparison table
  | 'steps'      // title + numbered steps
  | 'diagram'    // title + centered animated SVG + caption
  | 'visual'     // title + big animated SVG beside explanatory points
  | 'photo'      // title + real photo beside explanatory points
  | 'gallery'    // title + grid of labelled real photos
  | 'takeaway';  // recap

export interface SlideColumn {
  heading?: string;
  body?: string;
  bullets?: string[];
}

export interface Slide {
  layout: SlideLayout;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  lead?: string;
  note?: string;                 // speaker note (shown in notes panel / script for video)
  bullets?: { text: string; sub?: string }[];
  cards?: { icon?: string; title: string; text: string }[];
  left?: SlideColumn;
  right?: SlideColumn;
  formula?: string;
  where?: { sym: string; def: string }[];
  example?: string;
  code?: string;
  lang?: string;
  columns?: string[];
  rows?: string[][];
  steps?: { title: string; text: string }[];
  svg?: string;                  // raw inline SVG markup for diagram slides
  caption?: string;
  image?: string;                // real photo path (public/img/lab/...) for 'photo'
  imageAlt?: string;
  gallery?: { src: string; label: string; sub?: string }[];  // for 'gallery'
  credit?: string;               // short image attribution
  link?: { href: string; label: string };  // CTA to an interactive tool on the site
}

export interface Module {
  id: string;                    // url slug, e.g. "day-1" or "kicad"
  track: 'bootcamp' | 'pcb';
  order: number;
  day?: number;
  title: string;
  tagline: string;
  summary: string;
  duration: string;              // e.g. "≈ 2 hrs"
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  topics: string[];              // shown on the card
  accent: string;                // tailwind gradient classes for the cover
  slides: Slide[];
}

// ──────────────────────────────────────────────────────────────────────────
// DAY 1 — Introductions & Fundamentals
// ──────────────────────────────────────────────────────────────────────────

const day1: Module = {
  id: 'day-1',
  track: 'bootcamp',
  order: 1,
  day: 1,
  title: 'Introductions & Fundamentals',
  tagline: 'What robotics is, and the electricity that powers it.',
  summary: 'Start from zero: the sense–think–act loop, where the field is heading, how a computer is built, and the three quantities every circuit lives by — voltage, current, resistance.',
  duration: '≈ 2 hrs',
  level: 'Beginner',
  topics: ['Robotics intro', 'Trends & future', 'Computer architecture', 'Electricity basics', 'Multimeter', 'Breadboard'],
  accent: 'from-teal-500 to-cyan-500',
  slides: [
    { layout: 'cover', eyebrow: 'Day 1', title: 'Introductions & Fundamentals', subtitle: 'Robotics, electricity, and your first circuit',
      bullets: [{ text: 'Introduction to robotics' }, { text: 'Trends & the future' }, { text: 'Computer architecture' }, { text: 'Electricity & circuit fundamentals' }, { text: 'Measuring with a multimeter' }, { text: 'The breadboard' }] },
    { layout: 'gallery', title: 'Your prototyping bench', credit: PHOTO_CREDIT,
      lead: 'The three tools you will reach for in every single session.',
      gallery: [
        { src: IMG('breadboard'), label: 'Breadboard', sub: 'build without soldering' },
        { src: IMG('jumper-wires'), label: 'Jumper wires', sub: 'make the connections' },
        { src: IMG('multimeter'), label: 'Multimeter', sub: 'measure & debug' },
      ] },

    { layout: 'section', eyebrow: 'Topic 1', title: 'Introduction to Robotics' },
    { layout: 'statement', title: 'A robot is a machine that senses, thinks, and acts.',
      lead: 'Sensors gather data → a controller decides → actuators move the world. Every robot — from a line follower to a Mars rover — is this same loop running fast.',
      note: 'Anchor the whole bootcamp on this loop. Everything we build later plugs into one of these three boxes.' },
    { layout: 'cards', title: 'The Sense–Think–Act loop', lead: 'Three building blocks you will return to all week.',
      cards: [
        { icon: '👁', title: 'Sense', text: 'Sensors turn the physical world (light, distance, temperature, motion) into electrical signals.' },
        { icon: '🧠', title: 'Think', text: 'A microcontroller reads those signals, runs your logic, and decides what to do.' },
        { icon: '⚙️', title: 'Act', text: 'Actuators — motors, LEDs, buzzers — turn decisions back into physical action.' },
      ] },
    { layout: 'diagram', title: 'The loop never stops', svg: senseThinkAct,
      caption: 'Sense → Think → Act, repeating thousands of times a second. Watch the signal travel the loop.',
      note: 'Point at the moving dot — every robot is just this loop running fast.' },

    { layout: 'section', eyebrow: 'Topic 2', title: 'Trends & the Future' },
    { layout: 'cards', title: 'Where the field is heading',
      cards: [
        { icon: '🤖', title: 'Humanoids & legged robots', text: 'Boston Dynamics, Tesla Optimus, Unitree — general-purpose robots leaving the lab.' },
        { icon: '🛸', title: 'Drones & autonomy', text: 'Delivery, mapping, agriculture, inspection — self-navigating aerial systems.' },
        { icon: '🧩', title: 'Edge AI', text: 'ML models running on tiny microcontrollers (TinyML) — vision and speech on-device.' },
        { icon: '🏭', title: 'Automation & IoT', text: 'Smart factories and connected devices — the field you can start contributing to today.' },
      ],
      note: 'Tie this to careers: embedded engineer, robotics, hardware design, IoT. The skills in this bootcamp are the entry point.' },

    { layout: 'section', eyebrow: 'Topic 3', title: 'Computer Architecture' },
    { layout: 'split', title: 'How a computer is built',
      lead: 'A microcontroller is a whole computer on one chip. Same parts, smaller scale.',
      left: { heading: 'The core parts', bullets: ['CPU — executes instructions', 'Memory — RAM (temporary) + Flash/ROM (program)', 'I/O — pins, USB, communication', 'Clock — sets the execution speed', 'Bus — wires that move data between parts'] },
      right: { heading: 'Von Neumann model', body: 'The CPU fetches an instruction from memory, decodes it, executes it, then repeats — billions of times a second. Your code is just a list of these instructions stored in Flash.' } },

    { layout: 'section', eyebrow: 'Topic 4', title: 'Electricity & Circuit Fundamentals' },
    { layout: 'cards', title: 'The three quantities that run everything', lead: 'Think of a water pipe: pressure, flow, and a narrow section that resists flow.',
      cards: [
        { icon: '🔋', title: 'Voltage (V)', text: 'Electrical "pressure" that pushes charge. Measured in volts. Like water pressure in a pipe.' },
        { icon: '💧', title: 'Current (I)', text: 'The rate of charge flow. Measured in amperes (A). Like the amount of water flowing.' },
        { icon: '🧱', title: 'Resistance (R)', text: 'Opposition to flow. Measured in ohms (Ω). Like a narrow section of pipe.' },
      ] },
    { layout: 'formula', title: "Ohm's Law ties them together", formula: 'V = I × R',
      where: [{ sym: 'V', def: 'voltage in volts (V)' }, { sym: 'I', def: 'current in amperes (A)' }, { sym: 'R', def: 'resistance in ohms (Ω)' }],
      example: 'A 9V battery across a 470Ω resistor → I = V/R = 9 / 470 ≈ 0.019 A = 19 mA.',
      note: 'This single equation reappears every single day. Make students rearrange it three ways: V=IR, I=V/R, R=V/I.' },
    { layout: 'visual', title: 'The Ohm’s Law triangle', svg: ohmsTriangle,
      lead: 'Cover the quantity you want and the triangle shows the formula: cover V → I×R, cover I → V÷R, cover R → V÷I.',
      bullets: [{ text: 'V on top, I and R on the bottom' }, { text: 'Cover what you’re solving for' }, { text: 'Try real numbers in the calculator →' }],
      link: { href: '/lab/tools/ohms-law', label: "Open the Ohm's Law calculator" } },

    { layout: 'section', eyebrow: 'Topic 5', title: 'Measuring Voltage & Current' },
    { layout: 'steps', title: 'Using a multimeter safely',
      steps: [
        { title: 'Voltage — measure in parallel', text: 'Set dial to V. Touch probes ACROSS the component (red to +, black to −). The meter has high resistance so it does not disturb the circuit.' },
        { title: 'Current — measure in series', text: 'Set dial to A and move the red lead to the A jack. Break the circuit and put the meter IN the path so all current flows through it.' },
        { title: 'Resistance — power OFF', text: 'Set dial to Ω. Measure a component out of circuit, with no power applied.' },
        { title: 'Continuity', text: 'The beep mode confirms two points are electrically connected — your #1 debugging tool.' },
      ],
      note: 'Safety: never put the meter in current mode across a battery — that is a short through the meter and blows its fuse.' },
    { layout: 'photo', title: 'This is a digital multimeter', image: IMG('multimeter'), imageAlt: 'Digital multimeter with probes', credit: PHOTO_CREDIT,
      lead: 'The single most useful tool on your bench — it measures voltage, current, resistance, and continuity.',
      bullets: [{ text: 'Red probe → V/Ω jack, black → COM' }, { text: 'Turn the dial to the quantity you want' }, { text: 'Start on a high range, then narrow down' }] },

    { layout: 'section', eyebrow: 'Topic 6', title: 'The Breadboard' },
    { layout: 'photo', title: 'This is a breadboard', image: IMG('breadboard'), imageAlt: 'Solderless breadboard', credit: PHOTO_CREDIT,
      lead: 'A solderless board for prototyping — push component legs into the holes, no soldering required.',
      bullets: [{ text: 'Long ± rails run along the edges' }, { text: 'Middle rows connect in groups of 5' }, { text: 'The center gap isolates left from right' }] },
    { layout: 'split', title: 'How a breadboard connects',
      lead: 'A solderless board for prototyping — push components in, no soldering.',
      left: { heading: 'Power rails (the long ± lines)', bullets: ['Run horizontally along the top & bottom', 'The whole red line is connected together (+)', 'The whole blue line is connected together (−/GND)'] },
      right: { heading: 'Terminal strips (the middle)', bullets: ['Each row of 5 holes is connected', 'The center gap splits left from right', 'ICs straddle the gap so each pin is isolated'] },
      note: 'Most beginner bugs are "I thought these holes were connected but they were not." Draw the internal copper clips.' },

    { layout: 'takeaway', title: 'Day 1 — Key Takeaways',
      bullets: [
        { text: 'Robots run a Sense → Think → Act loop' },
        { text: 'A microcontroller is a tiny computer: CPU, memory, I/O' },
        { text: 'Voltage pushes, current flows, resistance opposes — V = I × R' },
        { text: 'Voltage is measured in parallel; current in series' },
        { text: 'Breadboard: rails run long, terminal rows connect in fives' },
      ] },
  ],
};

// ──────────────────────────────────────────────────────────────────────────
// DAY 2 — Electric Circuits & Components
// ──────────────────────────────────────────────────────────────────────────

const day2: Module = {
  id: 'day-2',
  track: 'bootcamp',
  order: 2,
  day: 2,
  title: 'Electric Circuits & Components',
  tagline: 'AC vs DC, switches, and the R-L-C trio.',
  summary: 'Meet the passive components that fill every board — resistors, capacitors, inductors — learn how switches work, and the difference between open and closed circuits.',
  duration: '≈ 2 hrs',
  level: 'Beginner',
  topics: ['AC vs DC', 'Switches & types', 'Resistor / Capacitor / Inductor', 'Open vs closed', 'Build with R-L-C'],
  accent: 'from-sky-500 to-blue-600',
  slides: [
    { layout: 'cover', eyebrow: 'Day 2', title: 'Electric Circuits & Components', subtitle: 'The passive parts every board is built from',
      bullets: [{ text: 'AC and DC currents' }, { text: 'Switches and their types' }, { text: 'Resistors, capacitors, inductors' }, { text: 'Open and closed circuits' }, { text: 'Build circuits using R-L-C' }] },

    { layout: 'section', eyebrow: 'Topic 1', title: 'AC and DC Currents' },
    { layout: 'diagram', title: 'AC vs DC', svg: acdcWave,
      caption: 'DC holds one direction (batteries, USB, MCUs). AC reverses periodically (wall outlets, the grid).',
      note: 'Phones charge on DC; the wall is AC; the charger is the converter in between.' },
    { layout: 'split', title: 'When you meet each',
      left: { heading: 'DC — Direct Current', bullets: ['Batteries, solar, USB', 'Steady polarity (+/−)', 'What microcontrollers and logic run on', 'Easy to store'] },
      right: { heading: 'AC — Alternating Current', bullets: ['Wall sockets, the power grid', 'Reverses 50/60 times per second', 'Travels long distances efficiently', 'Easily stepped up/down with transformers'] } },

    { layout: 'section', eyebrow: 'Topic 2', title: 'Switches & Their Types' },
    { layout: 'cards', title: 'A switch makes or breaks a path', lead: 'Named by poles (circuits controlled) and throws (positions).',
      cards: [
        { icon: '⏻', title: 'SPST', text: 'Single Pole Single Throw — simple on/off. A light switch.' },
        { icon: '🔀', title: 'SPDT', text: 'Single Pole Double Throw — routes one input to one of two outputs.' },
        { icon: '⛓', title: 'DPDT', text: 'Double Pole Double Throw — two circuits switched together; can reverse a motor.' },
        { icon: '🔘', title: 'Push button', text: 'Momentary — connected only while pressed.' },
        { icon: '🎚', title: 'Toggle / Slide', text: 'Latching — stays in position until moved.' },
        { icon: '🧲', title: 'Relay', text: 'An electrically-controlled switch — a small signal switches a big load.' },
      ] },

    { layout: 'section', eyebrow: 'Topic 3', title: 'Resistor, Capacitor, Inductor' },
    { layout: 'cards', title: 'The three passive components',
      cards: [
        { icon: '🧱', title: 'Resistor (Ω)', text: 'Limits current and divides voltage. The workhorse — current-limiting, pull-ups, dividers.' },
        { icon: '🔋', title: 'Capacitor (F)', text: 'Stores charge in an electric field. Smooths voltage, filters noise, blocks DC / passes AC.' },
        { icon: '🌀', title: 'Inductor (H)', text: 'Stores energy in a magnetic field. Resists current change — used in filters and converters.' },
      ],
      note: 'Rule of thumb: a capacitor resists a change in voltage; an inductor resists a change in current.' },
    { layout: 'gallery', title: 'What they look like in real life', credit: PHOTO_CREDIT,
      lead: 'You will be holding these constantly — learn to recognise them on sight.',
      gallery: [
        { src: IMG('resistors'), label: 'Resistors', sub: 'colour bands = value' },
        { src: IMG('capacitors'), label: 'Capacitors', sub: 'electrolytic, polarised' },
        { src: IMG('potentiometer'), label: 'Potentiometer', sub: 'a variable resistor' },
      ] },
    { layout: 'visual', title: 'Reading the resistor colour code', svg: resistorBands,
      lead: 'Resistors do not print their value — they wear coloured bands. The first two are digits, the third multiplies, the fourth is tolerance.',
      bullets: [{ text: '1st & 2nd band = the two digits' }, { text: '3rd band = ×10ⁿ multiplier' }, { text: '4th (gold) = ±5% tolerance' }, { text: 'Decode any resistor in the tool →' }],
      link: { href: '/lab/tools/resistor', label: 'Open the Resistor Colour-Code decoder' },
      note: 'Watch the bands change as the value cycles 220Ω → 1kΩ → 10kΩ.' },
    { layout: 'formula', title: 'A capacitor charges over time', formula: 'τ = R × C',
      where: [{ sym: 'τ', def: 'time constant in seconds' }, { sym: 'R', def: 'resistance in ohms' }, { sym: 'C', def: 'capacitance in farads' }],
      example: '10 kΩ × 100 µF = 1 second to reach ~63% of the supply. After ~5τ it is essentially full.' },
    { layout: 'visual', title: 'The charging curve', svg: capacitorCharge,
      lead: 'A capacitor does not fill instantly — it follows an exponential curve, fast at first then easing toward full.',
      bullets: [{ text: 'Reaches ~63% after one time constant (τ)' }, { text: 'Essentially full after ~5τ' }, { text: 'This RC timing is the basis of delays & filters' }] },

    { layout: 'section', eyebrow: 'Topic 4', title: 'Open & Closed Circuits' },
    { layout: 'split', title: 'Current needs a complete loop',
      left: { heading: 'Closed circuit', bullets: ['Unbroken path from + to −', 'Current flows', 'The load works (LED lights, motor spins)'] },
      right: { heading: 'Open circuit', bullets: ['Path is broken (switch off, loose wire)', 'No current flows', 'Nothing happens'] },
      note: 'A short circuit is the opposite danger: a path that bypasses the load, letting huge current flow. That is what fuses guard against.' },
    { layout: 'visual', title: 'See the current flow', svg: currentFlow,
      lead: 'In a closed loop, charge flows from + through the resistor and LED back to −. Break the loop anywhere and it all stops.',
      bullets: [{ text: 'The resistor limits the current' }, { text: 'The LED converts current into light' }, { text: 'No complete loop = no flow' }] },

    { layout: 'section', eyebrow: 'Topic 5', title: 'Build with R-L-C' },
    { layout: 'steps', title: 'Hands-on: an RC low-pass filter',
      steps: [
        { title: 'Wire R then C', text: 'Signal → resistor → node → capacitor → GND. The output is taken at the node.' },
        { title: 'Pick the cutoff', text: 'f = 1 / (2πRC). With 10 kΩ and 100 nF, cutoff ≈ 160 Hz.' },
        { title: 'Observe', text: 'Low frequencies pass through; high-frequency noise is shunted to ground. This is how you clean a noisy signal.' },
      ] },

    { layout: 'takeaway', title: 'Day 2 — Key Takeaways',
      bullets: [
        { text: 'DC is steady; AC alternates direction' },
        { text: 'Switches are classified by poles × throws' },
        { text: 'Resistor limits current, capacitor stores charge, inductor stores magnetic energy' },
        { text: 'Current flows only in a closed loop' },
        { text: 'R and C together set timing and filtering (τ = RC)' },
      ] },
  ],
};

// ──────────────────────────────────────────────────────────────────────────
// DAY 3 — Logic & Circuits
// ──────────────────────────────────────────────────────────────────────────

const day3: Module = {
  id: 'day-3',
  track: 'bootcamp',
  order: 3,
  day: 3,
  title: 'Logic & Circuits',
  tagline: 'From series/parallel to binary, logic gates, and transistors.',
  summary: 'How loads combine, how computers count in binary, the six logic gates and their truth tables, two-way switching, and the transistor — the switch behind all of it.',
  duration: '≈ 2.5 hrs',
  level: 'Beginner',
  topics: ['Series & parallel', 'Number systems', 'Boolean algebra', 'Truth tables', 'Two-way switching', 'Transistors', 'Fuse'],
  accent: 'from-indigo-500 to-purple-600',
  slides: [
    { layout: 'cover', eyebrow: 'Day 3', title: 'Logic & Circuits', subtitle: 'Counting, logic gates, and the transistor',
      bullets: [{ text: 'Series & parallel connections' }, { text: 'Number systems: binary, hex, decimal' }, { text: 'Boolean algebra & logic gates' }, { text: 'Truth tables & simplification' }, { text: 'Two-way switching' }, { text: 'Transistors & the transistor switch' }, { text: 'The fuse' }] },

    { layout: 'section', eyebrow: 'Topic 1', title: 'Series & Parallel Loads' },
    { layout: 'diagram', title: 'Two ways to connect loads', svg: seriesParallel,
      caption: 'Series: same current, voltages add, resistances add. Parallel: same voltage, currents add, resistance drops.',
      note: 'Christmas-light analogy: old series strings — one bulb out, all out. Parallel — each independent.' },
    { layout: 'formula', title: 'Combining resistors', formula: 'Series: R = R₁ + R₂   |   Parallel: 1/R = 1/R₁ + 1/R₂',
      where: [{ sym: 'Series', def: 'resistance increases' }, { sym: 'Parallel', def: 'resistance decreases below the smallest' }],
      example: 'Two 100 Ω in parallel = 50 Ω. Two 100 Ω in series = 200 Ω.' },

    { layout: 'section', eyebrow: 'Topic 2', title: 'Number Systems' },
    { layout: 'table', title: 'Binary, decimal, and hexadecimal', lead: 'Computers think in binary; hex is shorthand for humans.',
      columns: ['Decimal', 'Binary', 'Hex'],
      rows: [['0', '0000', '0x0'], ['5', '0101', '0x5'], ['10', '1010', '0xA'], ['15', '1111', '0xF'], ['255', '11111111', '0xFF']],
      note: 'A bit = one 0/1. 8 bits = 1 byte = 0–255. One hex digit = exactly 4 bits (a nibble).' },
    { layout: 'bullets', title: 'The vocabulary', lead: 'Why it matters for embedded work:',
      bullets: [
        { text: 'Bit', sub: 'a single 0 or 1 — the smallest unit' },
        { text: 'Byte', sub: '8 bits, holds 0–255 — one character or one register' },
        { text: 'Hex (0x..)', sub: 'compact way to write bytes — registers and colors use it' },
        { text: 'Binary place values', sub: '128 64 32 16 8 4 2 1 — add the 1s to convert' },
      ] },

    { layout: 'section', eyebrow: 'Topic 3', title: 'Boolean Algebra & Gates' },
    { layout: 'cards', title: 'The six logic gates', lead: 'Logic gates take 0/1 inputs and produce a 0/1 output.',
      cards: [
        { icon: 'AND', title: 'AND', text: 'Output 1 only if ALL inputs are 1. (A·B)' },
        { icon: 'OR', title: 'OR', text: 'Output 1 if ANY input is 1. (A+B)' },
        { icon: 'NOT', title: 'NOT', text: 'Inverts the input. 1→0, 0→1. (Ā)' },
        { icon: 'NAND', title: 'NAND', text: 'AND then inverted. The "universal" gate — builds any logic.' },
        { icon: 'NOR', title: 'NOR', text: 'OR then inverted. Also universal.' },
        { icon: 'XOR', title: 'XOR', text: 'Output 1 if inputs DIFFER. The heart of addition.' },
      ] },
    { layout: 'table', title: 'Truth tables for 2 inputs', lead: 'Every possible input combination and its output.',
      columns: ['A', 'B', 'AND', 'OR', 'XOR', 'NAND'],
      rows: [['0', '0', '0', '0', '0', '1'], ['0', '1', '0', '1', '1', '1'], ['1', '0', '0', '1', '1', '1'], ['1', '1', '1', '1', '0', '0']] },
    { layout: 'bullets', title: 'Simplification saves gates', lead: 'Fewer gates = cheaper, faster, less power.',
      bullets: [
        { text: 'Identity laws', sub: 'A·1 = A,  A+0 = A' },
        { text: 'Null laws', sub: 'A·0 = 0,  A+1 = 1' },
        { text: 'De Morgan’s', sub: 'NOT(A·B) = Ā + B̄ — swap AND/OR and invert' },
        { text: 'Karnaugh maps', sub: 'a visual grid to spot the simplest expression' },
      ] },

    { layout: 'section', eyebrow: 'Topic 4', title: 'Two-Way Switching' },
    { layout: 'statement', title: 'Two switches, one light — controlled from either end.',
      lead: 'The staircase circuit: two SPDT switches wired so flipping EITHER one toggles the lamp. Electrically this is the XOR function in the physical world.',
      note: 'Great real-world hook: this is literally the wiring in every staircase and hallway.' },

    { layout: 'section', eyebrow: 'Topic 5', title: 'Transistors' },
    { layout: 'split', title: 'NPN vs PNP basics',
      lead: 'A transistor is a current-controlled switch/amplifier with three legs: Base, Collector, Emitter.',
      left: { heading: 'NPN', bullets: ['Turns ON when Base is HIGH', 'Emitter goes to GND', 'Most common for low-side switching'] },
      right: { heading: 'PNP', bullets: ['Turns ON when Base is LOW', 'Emitter goes to +V', 'Used for high-side switching'] } },
    { layout: 'diagram', title: 'Transistor as a switch', svg: npnSwitch,
      caption: 'A tiny base current lets a large collector current flow — so a 5 mA MCU pin can switch a 500 mA motor or relay.',
      note: 'Always add a base resistor (~1 kΩ) to limit base current, and a flyback diode across inductive loads.' },
    { layout: 'photo', title: 'A real transistor', image: IMG('transistor'), imageAlt: 'TO-92 NPN transistor', credit: PHOTO_CREDIT,
      lead: 'A common small-signal transistor in a TO-92 plastic package — three legs: Base, Collector, Emitter.',
      bullets: [{ text: 'Flat side helps identify the pin order' }, { text: 'Check the datasheet — pinouts vary' }, { text: 'e.g. 2N2222 (NPN), BC547, S8050' }] },

    { layout: 'section', eyebrow: 'Topic 5b', title: 'Building Logic Gates from Transistors' },
    { layout: 'statement', title: 'A logic gate is just transistors wired as switches.',
      lead: 'Every AND, OR, and NOT inside a chip is built from transistors. A pull-up resistor holds the output HIGH; transistors pull it LOW when their inputs turn them on. Wire them differently → different logic.',
      note: 'This is the bridge from "transistor = switch" to "computers are made of these". Millions to billions on one chip.' },
    { layout: 'visual', title: 'NOT gate — one transistor (inverter)', svg: notGateTransistor,
      lead: 'The simplest gate: input HIGH turns the transistor on, dragging the output LOW. Input LOW leaves the output pulled HIGH. The output is always the opposite of the input.',
      bullets: [{ text: 'Input HIGH → transistor ON → OUT = 0' }, { text: 'Input LOW → transistor OFF → OUT = 1' }, { text: 'Pull-up resistor sets the default HIGH' }],
      note: 'Watch the input toggle and the output flip to the opposite.' },
    { layout: 'visual', title: 'NOR gate — two transistors in parallel', svg: norGateTransistor,
      lead: 'Put two transistors side by side. If EITHER input is HIGH, that transistor pulls the output LOW. The output is only HIGH when both inputs are LOW — that is NOR (NOT-OR).',
      bullets: [{ text: 'Either input HIGH → OUT = 0' }, { text: 'Both inputs LOW → OUT = 1' }, { text: 'Add an inverter on the output → OR gate' }],
      note: 'Cycles through 00, 01, 10, 11 — output only lights green at 00.' },
    { layout: 'visual', title: 'NAND gate — two transistors in series', svg: nandGateTransistor,
      lead: 'Stack two transistors in a chain. Current only reaches ground when BOTH are on, so the output is only pulled LOW when both inputs are HIGH — that is NAND (NOT-AND).',
      bullets: [{ text: 'Both inputs HIGH → OUT = 0' }, { text: 'Any input LOW → OUT = 1' }, { text: 'Add an inverter → AND gate' }],
      note: 'NAND is "universal" — you can build every other gate from NANDs alone.' },
    { layout: 'cards', title: 'The pattern: wiring sets the logic',
      cards: [
        { icon: 'NOT', title: '1 transistor', text: 'Inverter — output is the opposite of the input.' },
        { icon: 'NOR', title: '2 parallel', text: 'Either input ON pulls output LOW. + inverter → OR.' },
        { icon: 'NAND', title: '2 series', text: 'Both inputs ON to pull output LOW. + inverter → AND.' },
      ],
      note: 'AND = NAND + NOT · OR = NOR + NOT. NAND and NOR are universal building blocks.' },

    { layout: 'section', eyebrow: 'Topic 6', title: 'The Fuse' },
    { layout: 'statement', title: 'A fuse is a deliberate weak link.',
      lead: 'It is a thin wire rated for a maximum current. If too much current flows (a short or fault), it melts and breaks the circuit — protecting everything downstream from fire or damage.',
      note: 'Pair this with the short-circuit warning from Day 2. Fuses are the safety net.' },

    { layout: 'takeaway', title: 'Day 3 — Key Takeaways',
      bullets: [
        { text: 'Series adds resistance; parallel reduces it' },
        { text: 'Computers count in binary; hex is 4 bits per digit' },
        { text: 'Six gates — AND/OR/NOT/NAND/NOR/XOR — build all logic' },
        { text: 'Truth tables define a gate; algebra simplifies it' },
        { text: 'A transistor lets a small signal switch a big load' },
        { text: 'A fuse sacrifices itself to protect the circuit' },
      ] },
  ],
};

// ──────────────────────────────────────────────────────────────────────────
// DAY 4 — Introduction to Embedded Programming
// ──────────────────────────────────────────────────────────────────────────

const day4: Module = {
  id: 'day-4',
  track: 'bootcamp',
  order: 4,
  day: 4,
  title: 'Introduction to Embedded Programming',
  tagline: 'Boards, the IDE, and your first working code.',
  summary: 'Pick a board, install the IDE, and learn the anatomy of a sketch: setup(), loop(), pins, the serial monitor, blinking and fading LEDs, reading a potentiometer, plus data types and operators.',
  duration: '≈ 3 hrs',
  level: 'Beginner',
  topics: ['Board types', 'IDE & sketches', 'setup/loop/pinMode', 'Serial monitor', 'LED & PWM', 'Potentiometer', 'Data types', 'Operators'],
  accent: 'from-emerald-500 to-teal-600',
  slides: [
    { layout: 'cover', eyebrow: 'Day 4', title: 'Introduction to Embedded Programming', subtitle: 'From blank board to blinking LED',
      bullets: [{ text: 'Arduino / ESP32 / STM32 boards' }, { text: 'The IDE and sketch structure' }, { text: 'setup(), loop(), pinMode()' }, { text: 'Serial monitor for debugging' }, { text: 'LED control & PWM fading' }, { text: 'Potentiometer & analog input' }, { text: 'Data types, variables, operators' }] },

    { layout: 'section', eyebrow: 'Topic 1', title: 'Choosing a Board' },
    { layout: 'table', title: 'Arduino vs ESP32 vs STM32',
      columns: ['', 'Arduino Uno', 'ESP32', 'STM32'],
      rows: [
        ['Core', 'ATmega328 · 8-bit', 'Dual 32-bit', 'ARM Cortex-M'],
        ['Speed', '16 MHz', '240 MHz', '72–480 MHz'],
        ['Wireless', 'None', 'Wi-Fi + Bluetooth', 'None (varies)'],
        ['Best for', 'Learning basics', 'IoT & connectivity', 'Performance & control'],
      ],
      note: 'For this bootcamp we mostly use ESP32 — it has Wi-Fi/BT and is cheap, but Arduino code runs on all of them.' },
    { layout: 'gallery', title: 'The boards you will program', credit: PHOTO_CREDIT,
      lead: 'Different brains, same idea — pins on the edges, USB to upload code.',
      gallery: [
        { src: IMG('arduino-uno'), label: 'Arduino Uno', sub: 'classic 8-bit, beginner-friendly' },
        { src: IMG('esp32'), label: 'ESP32', sub: 'fast, Wi-Fi + Bluetooth' },
      ] },

    { layout: 'section', eyebrow: 'Topic 2', title: 'The IDE & Sketch Structure' },
    { layout: 'split', title: 'Two functions run every sketch',
      left: { heading: 'setup()', bullets: ['Runs ONCE at power-on/reset', 'Configure pins, start Serial', 'Initialize sensors and libraries'] },
      right: { heading: 'loop()', bullets: ['Runs FOREVER, over and over', 'Your main program logic', 'Read sensors → decide → act'] },
      note: 'Walk through: install IDE, select board, select port, click Upload. The classic flow.' },
    { layout: 'code', title: 'pinMode + the skeleton', lang: 'cpp',
      code: `void setup() {
  pinMode(13, OUTPUT);   // set pin 13 as an output
  Serial.begin(115200);  // start serial at 115200 baud
}

void loop() {
  // your code repeats here, forever
}`,
      bullets: [{ text: 'pinMode() tells a pin to be an INPUT or OUTPUT' }, { text: 'Serial.begin() opens the USB link for debugging' }] },

    { layout: 'section', eyebrow: 'Topic 3', title: 'Serial Monitor — your debugger' },
    { layout: 'code', title: 'Print values to see what is happening', lang: 'cpp',
      code: `void setup() {
  Serial.begin(115200);
}

void loop() {
  int reading = analogRead(34);
  Serial.print("Sensor: ");
  Serial.println(reading);   // println adds a new line
  delay(500);
}`,
      bullets: [{ text: 'Match the baud rate in the monitor to Serial.begin()' }, { text: 'print() stays on the line; println() moves to the next' }],
      note: 'Teach "printf debugging" — when in doubt, print the variable. It is the #1 beginner debugging skill.' },

    { layout: 'section', eyebrow: 'Topic 4', title: 'LED Control & PWM' },
    { layout: 'code', title: 'Blink, then fade', lang: 'cpp',
      code: `// Blink
digitalWrite(13, HIGH);  delay(500);
digitalWrite(13, LOW);   delay(500);

// Fade with PWM (analogWrite: 0–255)
for (int b = 0; b <= 255; b++) {
  analogWrite(ledPin, b);   // brightness
  delay(5);
}`,
      bullets: [{ text: 'digitalWrite = fully ON or OFF' }, { text: 'analogWrite uses PWM — rapid on/off pulses fake an in-between brightness' }] },
    { layout: 'visual', title: 'PWM = Pulse Width Modulation', svg: pwmDuty,
      lead: 'The pin switches on/off thousands of times a second. The fraction of time it stays ON — the "duty cycle" — sets the average power.',
      bullets: [{ text: '25% duty = dim · 75% = bright' }, { text: 'Same trick sets motor speed' }, { text: 'analogWrite(pin, 0–255)' }],
      note: 'The bar shows average power tracking the duty cycle — the LED brightness follows it.' },

    { layout: 'section', eyebrow: 'Topic 5', title: 'Analog Input — the potentiometer' },
    { layout: 'code', title: 'Read a knob, control brightness', lang: 'cpp',
      code: `int raw = analogRead(34);          // 0–4095 on ESP32
int duty = map(raw, 0, 4095, 0, 255);
analogWrite(ledPin, duty);          // knob sets brightness`,
      bullets: [{ text: 'analogRead returns a number across the ADC range' }, { text: 'map() rescales one range to another — incredibly useful' }] },
    { layout: 'split', title: 'Digital vs Analog pins',
      left: { heading: 'Digital', bullets: ['Only HIGH or LOW (1 or 0)', 'digitalRead / digitalWrite', 'Buttons, LEDs, logic signals'] },
      right: { heading: 'Analog', bullets: ['A range of values (a voltage)', 'analogRead in, PWM out', 'Sensors, knobs, dimming'] } },

    { layout: 'section', eyebrow: 'Topic 6', title: 'Data Types & Operators' },
    { layout: 'table', title: 'Common data types',
      columns: ['Type', 'Holds', 'Example'],
      rows: [
        ['int', 'whole numbers', '-5, 0, 42'],
        ['float', 'decimals', '3.14, 0.5'],
        ['bool', 'true / false', 'true'],
        ['char', 'one character', "'A'"],
        ['String', 'text', '"hello"'],
        ['byte', '0–255 (8 bits)', '0xFF'],
      ] },
    { layout: 'split', title: 'Variables, constants & operators',
      left: { heading: 'Storing values', bullets: ['int ledPin = 13;  — a variable', '#define PIN 13  — text replaced before compile', 'const int PIN = 13;  — typed, safer constant'] },
      right: { heading: 'Operator families', bullets: ['Arithmetic: + − * / %', 'Relational: == != < > <= >=', 'Logical: && || !', 'Bitwise: & | ^ ~ << >>'] },
      note: 'Prefer const over #define in modern code — it is type-checked. Bitwise ops matter for registers and flags.' },

    { layout: 'takeaway', title: 'Day 4 — Key Takeaways',
      bullets: [
        { text: 'setup() runs once; loop() runs forever' },
        { text: 'pinMode sets direction; digitalWrite/Read for on-off' },
        { text: 'Serial.println is your debugger' },
        { text: 'PWM (analogWrite) fakes analog output for fading & speed' },
        { text: 'analogRead + map() turns a knob into any range' },
        { text: 'Choose the right data type; know your operator families' },
      ] },
  ],
};

// ──────────────────────────────────────────────────────────────────────────
// DAY 5 — Sensors with Microcontroller
// ──────────────────────────────────────────────────────────────────────────

const day5: Module = {
  id: 'day-5',
  track: 'bootcamp',
  order: 5,
  day: 5,
  title: 'Sensors with Microcontroller',
  tagline: 'Turning light, distance, and the world into data.',
  summary: 'How sensors work, reading an LDR and IR sensor, the all-important pull-up/pull-down resistor, current-limiting math for LEDs, and using a Zener diode to regulate voltage.',
  duration: '≈ 2.5 hrs',
  level: 'Beginner',
  topics: ['How sensors work', 'Sensor protocols', 'LDR', 'IR sensor', 'Pull-up/pull-down', 'LED resistor calc', 'Zener diode'],
  accent: 'from-amber-500 to-orange-600',
  slides: [
    { layout: 'cover', eyebrow: 'Day 5', title: 'Sensors with Microcontroller', subtitle: 'Reading the physical world',
      bullets: [{ text: 'How sensors detect the environment' }, { text: 'Sensor circuit design & protocols' }, { text: 'LDR (light) sensor' }, { text: 'IR (infrared) sensor' }, { text: 'Pull-up / pull-down resistors' }, { text: 'LED current-limiting calculation' }, { text: 'Zener diode voltage regulation' }] },

    { layout: 'section', eyebrow: 'Topic 1', title: 'How Sensors Detect the Environment' },
    { layout: 'statement', title: 'A sensor is a transducer: it converts a physical quantity into an electrical signal.',
      lead: 'Light, temperature, distance, motion → voltage, resistance, or a digital pulse the microcontroller can read.',
      note: 'Map each sensor we use to what it converts: LDR → resistance, IR → reflected pulse, thermistor → resistance.' },
    { layout: 'split', title: 'Two output styles',
      left: { heading: 'Analog out', bullets: ['Gives a continuous voltage', 'Read with analogRead()', 'LDR, potentiometer, many gas sensors'] },
      right: { heading: 'Digital out', bullets: ['Gives HIGH/LOW (or a protocol)', 'Read with digitalRead() or a library', 'IR module, PIR, ultrasonic'] } },
    { layout: 'photo', title: 'Example: the DHT temperature & humidity sensor', image: IMG('dht'), imageAlt: 'DHT11 temperature and humidity sensor', credit: PHOTO_CREDIT,
      lead: 'A common digital sensor — it measures temperature and humidity and sends the reading to one data pin as a digital signal.',
      bullets: [{ text: 'Single-wire digital output' }, { text: 'A library decodes the timing for you' }, { text: 'DHT11 (basic) / DHT22 (more accurate)' }] },

    { layout: 'section', eyebrow: 'Topic 2', title: 'Sensor Circuit Design' },
    { layout: 'visual', title: 'The voltage divider', svg: voltageDivider,
      lead: 'Many sensors change resistance. A divider (sensor + fixed resistor) turns that changing resistance into a changing voltage the ADC can read.',
      bullets: [{ text: 'Vout = Vin × R2 / (R1 + R2)' }, { text: 'Sensor resistance shifts → Vout shifts' }, { text: 'The MCU reads Vout with analogRead()' }],
      link: { href: '/lab/tools/voltage-divider', label: 'Open the Voltage Divider calculator' } },

    { layout: 'section', eyebrow: 'Topic 3', title: 'LDR — Light Dependent Resistor' },
    { layout: 'code', title: 'Read brightness with a voltage divider', lang: 'cpp',
      code: `// LDR + 10k resistor form a divider into pin 34
int light = analogRead(34);   // bright = high, dark = low
Serial.println(light);
if (light < 800) {
  digitalWrite(ledPin, HIGH); // dark → turn light on
}`,
      bullets: [{ text: 'Resistance drops as light increases' }, { text: 'Pair with a 10 kΩ resistor to ground for a clean reading' }] },
    { layout: 'photo', title: 'The LDR (photoresistor)', image: IMG('ldr'), imageAlt: 'Light dependent resistor', credit: PHOTO_CREDIT,
      lead: 'That squiggly face is light-sensitive material — its resistance falls as more light hits it.',
      bullets: [{ text: 'Bright light → low resistance' }, { text: 'Darkness → high resistance' }, { text: 'No polarity — connect either way' }] },

    { layout: 'section', eyebrow: 'Topic 4', title: 'IR — Infrared Sensor' },
    { layout: 'visual', title: 'Inside an IR sensor module', svg: irModule,
      lead: 'Two facing LEDs: one emits invisible infrared, the other (black) receives what bounces back. A trim-pot sets the threshold.',
      bullets: [{ text: 'Emitter + receiver pair' }, { text: 'Trim-pot tunes sensitivity' }, { text: '3 pins: VCC · OUT · GND' }] },
    { layout: 'split', title: 'IR reflective sensing',
      lead: 'An IR LED emits infrared; a photodiode reads what bounces back.',
      left: { heading: 'How it reads surfaces', bullets: ['White/shiny reflects → detected', 'Black/matte absorbs → not detected', 'Most modules output a clean digital HIGH/LOW'] },
      right: { heading: 'Uses', bullets: ['Line-following robots', 'Obstacle detection', 'Encoder wheels & counters'] } },
    { layout: 'visual', title: 'Why black vs white matters', svg: irReflectance,
      lead: 'The same sensor reads different surfaces: a white surface bounces the beam back (detected), a black surface soaks it up (nothing returns).',
      bullets: [{ text: 'White → reflects → OUT goes HIGH/green' }, { text: 'Black → absorbs → OUT goes LOW/red' }, { text: 'This is exactly how line-following works' }],
      note: 'Watch the surface flip white↔black and the OUT indicator follow it.' },
    { layout: 'code', title: 'Read an IR module', lang: 'cpp',
      code: `int ir = digitalRead(IR_PIN);
if (ir == LOW) {           // line detected (module-dependent)
  Serial.println("On the line");
}`,
      note: 'A trim-pot on most IR modules sets the detection threshold — calibrate it before relying on it.' },

    { layout: 'section', eyebrow: 'Topic 5', title: 'Pull-up / Pull-down Resistors' },
    { layout: 'diagram', title: 'Stop the pin from floating', svg: pullUpDown,
      caption: 'An unconnected input "floats" and reads random noise. A pull-up resistor ties it HIGH when idle; a pull-down ties it LOW.',
      note: 'The ESP32/Arduino have built-in pull-ups: pinMode(pin, INPUT_PULLUP). Then the button connects the pin to GND.' },

    { layout: 'section', eyebrow: 'Topic 6', title: 'LED Current-Limiting Resistor' },
    { layout: 'formula', title: 'Always size the resistor', formula: 'R = (V_supply − V_LED) / I_LED',
      where: [{ sym: 'V_supply', def: 'your source voltage' }, { sym: 'V_LED', def: 'LED forward voltage (~2 V red, ~3 V blue)' }, { sym: 'I_LED', def: 'desired current (~10–20 mA)' }],
      example: '(5 V − 2 V) / 0.01 A = 300 Ω → use 330 Ω. Without it the LED burns out.',
      link: { href: '/lab/tools/led-calc', label: 'Open the LED resistor calculator' } },

    { layout: 'section', eyebrow: 'Topic 7', title: 'Zener Diode — Voltage Regulation' },
    { layout: 'statement', title: 'A Zener diode clamps voltage to a fixed value.',
      lead: 'Wired in reverse, it conducts once voltage reaches its rated "Zener voltage", holding the node steady. A simple way to make a stable reference or protect an input from over-voltage.',
      note: 'Contrast with the 7805 linear regulator coming on Day 7 — Zener is cheap/simple but low-current.' },

    { layout: 'takeaway', title: 'Day 5 — Key Takeaways',
      bullets: [
        { text: 'Sensors convert the physical world into electrical signals' },
        { text: 'Resistive sensors need a voltage divider to read' },
        { text: 'LDR = light, IR = reflective distance/line detection' },
        { text: 'Pull-up/pull-down stops inputs from floating' },
        { text: 'Always current-limit an LED: R = (Vs − Vf) / I' },
        { text: 'A Zener clamps voltage to a fixed reference' },
      ] },
  ],
};

// ──────────────────────────────────────────────────────────────────────────
// DAY 6 — Motors with Microcontroller
// ──────────────────────────────────────────────────────────────────────────

const day6: Module = {
  id: 'day-6',
  track: 'bootcamp',
  order: 6,
  day: 6,
  title: 'Motors with Microcontroller',
  tagline: 'Drivers, H-bridges, servos, and sensing motion.',
  summary: 'Why motors need drivers, controlling speed with PWM, the H-bridge for direction, servo sweeping, the HC-SR04 ultrasonic sensor, IR line detection, and ESP32 Bluetooth.',
  duration: '≈ 3 hrs',
  level: 'Intermediate',
  topics: ['Motor types & drivers', 'PWM speed', 'H-bridge', 'Servo motors', 'Ultrasonic HC-SR04', 'IR line detection', 'ESP32 Bluetooth'],
  accent: 'from-rose-500 to-pink-600',
  slides: [
    { layout: 'cover', eyebrow: 'Day 6', title: 'Motors with Microcontroller', subtitle: 'Making things move and sensing the world',
      bullets: [{ text: 'Motor types & motor drivers' }, { text: 'PWM speed control' }, { text: 'H-bridge operation' }, { text: 'Servo motor basics & sweeping' }, { text: 'Ultrasonic sensor (HC-SR04)' }, { text: 'IR line detection & calibration' }, { text: 'ESP32 Bluetooth Classic' }] },

    { layout: 'section', eyebrow: 'Topic 1', title: 'Motor Types & Drivers' },
    { layout: 'cards', title: 'Three motors you will use',
      cards: [
        { icon: '🔄', title: 'DC motor', text: 'Spins continuously; speed by voltage/PWM, direction by polarity.' },
        { icon: '📐', title: 'Servo', text: 'Moves to a precise ANGLE (0–180°). Has built-in control electronics.' },
        { icon: '👣', title: 'Stepper', text: 'Rotates in exact steps for precise positioning — printers, CNC.' },
      ] },
    { layout: 'statement', title: 'Never drive a motor straight from an MCU pin.',
      lead: 'A pin supplies a few mA; a motor needs hundreds. A driver IC (L298N, L293D, DRV8833) takes your small logic signal and switches the big motor current — and isolates the MCU from electrical noise.' },
    { layout: 'gallery', title: 'Motors, drivers & sensors', credit: PHOTO_CREDIT,
      lead: 'The moving parts and the chips that drive them.',
      gallery: [
        { src: IMG('dc-motor'), label: 'DC motor', sub: 'spins freely' },
        { src: IMG('servo'), label: 'Servo (SG90)', sub: 'moves to an angle' },
        { src: IMG('stepper'), label: 'Stepper', sub: 'exact steps' },
        { src: IMG('l298n'), label: 'L298 driver', sub: 'switches motor power' },
        { src: IMG('hc-sr04'), label: 'HC-SR04', sub: 'ultrasonic distance' },
      ] },

    { layout: 'section', eyebrow: 'Topic 2', title: 'PWM Speed Control' },
    { layout: 'code', title: 'Set motor speed with PWM', lang: 'cpp',
      code: `// ESP32 LEDC PWM on the driver's enable pin
ledcAttach(enablePin, 1000, 8);  // 1 kHz, 8-bit
ledcWrite(enablePin, 128);        // 50% speed (0–255)

// Direction via two input pins
digitalWrite(in1, HIGH);
digitalWrite(in2, LOW);           // forward`,
      bullets: [{ text: 'Duty cycle sets average power → speed' }, { text: 'The two IN pins set spin direction' }] },

    { layout: 'section', eyebrow: 'Topic 3', title: 'H-Bridge Operation' },
    { layout: 'diagram', title: 'How an H-bridge reverses a motor', svg: hBridge,
      caption: 'Four switches form an "H". Closing the diagonal pairs sends current one way or the other — that flips motor direction.',
      note: 'Warning: never turn on both switches on the same side — that shorts the supply ("shoot-through").' },

    { layout: 'section', eyebrow: 'Topic 4', title: 'Servo Motors' },
    { layout: 'code', title: 'Sweep a servo 0 → 180°', lang: 'cpp',
      code: `#include <ESP32Servo.h>
Servo s;
void setup(){ s.attach(18); }
void loop(){
  for (int a = 0; a <= 180; a++){ s.write(a); delay(15); }
  for (int a = 180; a >= 0; a--){ s.write(a); delay(15); }
}`,
      bullets: [{ text: 'write(angle) commands a position, not a speed' }, { text: 'Servos use a PWM pulse width to encode the angle' }] },
    { layout: 'visual', title: 'A servo moves to an angle', svg: servoSweep,
      lead: 'Unlike a DC motor that spins freely, a servo rotates to a precise commanded angle and holds it.',
      bullets: [{ text: 'write(0) → write(180) sweeps the arm' }, { text: 'Internal electronics hold the position' }, { text: 'Great for steering, arms, grippers' }] },

    { layout: 'section', eyebrow: 'Topic 5', title: 'Ultrasonic Sensor (HC-SR04)' },
    { layout: 'visual', title: 'Distance by echo timing', svg: ultrasonicPing,
      lead: 'The sensor sends an ultrasonic pulse and times how long the echo takes to bounce back off an object.',
      bullets: [{ text: 'distance = time × 0.0343 cm/µs ÷ 2' }, { text: 'Divide by 2 — sound makes a round trip' }, { text: 'pulseIn() measures the echo time' }] },
    { layout: 'code', title: 'Measure distance by echo timing', lang: 'cpp',
      code: `digitalWrite(trig, HIGH); delayMicroseconds(10);
digitalWrite(trig, LOW);
long us = pulseIn(echo, HIGH);     // echo travel time
float cm = us * 0.0343 / 2;        // speed of sound
Serial.println(cm);`,
      bullets: [{ text: 'Send a pulse, time how long the echo takes back' }, { text: 'Distance = (time × speed of sound) / 2' }],
      note: 'For multiple sensors, fire them one at a time so echoes do not cross-talk.' },

    { layout: 'section', eyebrow: 'Topic 6', title: 'IR Line Detection & Calibration' },
    { layout: 'visual', title: 'A line-following robot in action', svg: lineFollower,
      lead: 'The whole point of IR line sensing: a robot that drives itself along a track by constantly checking which sensors see the black line.',
      bullets: [{ text: 'IR sensors point down at the floor' }, { text: 'Line under a side sensor → steer that way' }, { text: 'Loop fast → smooth following' }],
      note: 'This is the classic first-robot project — the bot follows the curve on its own.' },
    { layout: 'bullets', title: 'Building a line follower',
      bullets: [
        { text: 'Mount IR sensors facing the floor', sub: 'usually two or more across the line' },
        { text: 'Calibrate the threshold', sub: 'read values over black AND white, pick the midpoint' },
        { text: 'Steer from the difference', sub: 'left sensor sees line → turn left, and vice versa' },
        { text: 'Tip', sub: 'consistent lighting and sensor height matter more than code' },
      ] },

    { layout: 'section', eyebrow: 'Topic 7', title: 'ESP32 Bluetooth Classic' },
    { layout: 'code', title: 'Control over Bluetooth Serial', lang: 'cpp',
      code: `#include "BluetoothSerial.h"
BluetoothSerial SerialBT;
void setup(){ SerialBT.begin("ElectroBot"); }
void loop(){
  if (SerialBT.available()){
    char c = SerialBT.read();
    if (c == 'F') forward();
    if (c == 'S') stop();
  }
}`,
      bullets: [{ text: 'Pair from a phone app, send characters as commands' }, { text: 'SerialBT works just like the USB Serial you already know' }] },

    { layout: 'takeaway', title: 'Day 6 — Key Takeaways',
      bullets: [
        { text: 'Motors always need a driver, never a bare MCU pin' },
        { text: 'PWM duty cycle = motor speed' },
        { text: 'An H-bridge reverses direction; never short one side' },
        { text: 'Servos take an angle; steppers move in exact steps' },
        { text: 'HC-SR04 measures distance by echo timing' },
        { text: 'ESP32 Bluetooth Serial = wireless control with familiar code' },
      ] },
  ],
};

// ──────────────────────────────────────────────────────────────────────────
// DAY 7 — Power Regulators (theory)
// ──────────────────────────────────────────────────────────────────────────

const day7: Module = {
  id: 'day-7',
  track: 'bootcamp',
  order: 7,
  day: 7,
  title: 'Power Regulators',
  tagline: 'Clean, stable power — the part beginners skip and regret.',
  summary: 'Theory day: linear regulators (7805, LM317), buck/boost converters, relays and flyback diodes, decoupling for EMI, battery chemistries, and the TP4056 charger.',
  duration: '≈ 2 hrs · theory',
  level: 'Intermediate',
  topics: ['7805 / LM317', 'Buck & boost', 'Relays & flyback', 'Decoupling & EMI', 'LiPo / Li-ion / NiMH', 'TP4056 charger'],
  accent: 'from-yellow-500 to-amber-600',
  slides: [
    { layout: 'cover', eyebrow: 'Day 7 · Theory', title: 'Power Regulators', subtitle: 'Giving every chip the clean voltage it needs',
      bullets: [{ text: 'Voltage regulators: 7805, LM317' }, { text: 'Buck & boost converters' }, { text: 'Relays: coil, contacts, flyback diode' }, { text: 'Decoupling capacitors & EMI' }, { text: 'LiPo vs Li-ion vs NiMH' }, { text: 'TP4056 charging IC' }] },

    { layout: 'section', eyebrow: 'Topic 1', title: 'Linear Regulators' },
    { layout: 'split', title: '7805 & LM317',
      left: { heading: '7805 — fixed 5 V', bullets: ['3 pins: IN, GND, OUT', 'Input must exceed ~7 V (dropout)', 'Burns the extra voltage as heat'] },
      right: { heading: 'LM317 — adjustable', bullets: ['Set output with two resistors', 'Vout = 1.25 × (1 + R2/R1)', 'Same simplicity, any voltage'] },
      note: 'Linear = simple & quiet but inefficient. Dropping 12 V→5 V at 1 A wastes 7 W as heat.' },
    { layout: 'gallery', title: 'Power components in the flesh', credit: PHOTO_CREDIT,
      lead: 'The parts that take a raw battery and hand each chip clean, safe power.',
      gallery: [
        { src: IMG('regulator-7805'), label: '7805 regulator', sub: 'fixed 5 V, TO-220' },
        { src: IMG('buck-converter'), label: 'Buck converter', sub: 'efficient step-down' },
        { src: IMG('relay'), label: 'Relay module', sub: 'switches big loads' },
        { src: IMG('lipo'), label: 'LiPo battery', sub: '3.7 V per cell' },
      ] },

    { layout: 'section', eyebrow: 'Topic 2', title: 'Switching Converters' },
    { layout: 'cards', title: 'Buck & boost — efficient power',
      cards: [
        { icon: '⬇️', title: 'Buck (step-down)', text: 'Higher voltage in → lower out, at 85–95% efficiency. 12 V → 5 V with little heat.' },
        { icon: '⬆️', title: 'Boost (step-up)', text: 'Lower voltage in → higher out. Run 5 V electronics from a single 3.7 V cell.' },
        { icon: '⚡', title: 'How', text: 'They rapidly switch an inductor instead of burning excess as heat — that is why they stay cool.' },
      ] },

    { layout: 'section', eyebrow: 'Topic 3', title: 'Relays' },
    { layout: 'bullets', title: 'An electrically-controlled mechanical switch',
      bullets: [
        { text: 'Coil voltage', sub: 'energize the coil (5 V / 12 V) to pull the contacts' },
        { text: 'Contact rating', sub: 'how much current/voltage the switch side can carry (e.g. 10 A 250 VAC)' },
        { text: 'Flyback diode', sub: 'a diode across the coil absorbs the voltage spike when it switches off' },
        { text: 'Isolation', sub: 'separates your low-voltage logic from high-voltage loads' },
      ],
      note: 'The flyback diode is mandatory — without it the collapsing coil field destroys your driver transistor.' },
    { layout: 'visual', title: 'How a relay switches', svg: relayClick,
      lead: 'A small current through the coil makes an electromagnet that snaps the armature across to the NO contact — switching a much bigger load.',
      bullets: [{ text: 'Coil side = tiny control current' }, { text: 'Contact side = big isolated load' }, { text: 'COM moves between NC and NO' }],
      note: 'Watch the armature snap over and the lamp light when the coil energises.' },

    { layout: 'section', eyebrow: 'Topic 4', title: 'Decoupling & EMI' },
    { layout: 'statement', title: 'Put a 100 nF capacitor next to every chip.',
      lead: 'Decoupling (bypass) capacitors sit beside each IC’s power pins, supplying instant bursts of current and absorbing noise. Skipping them causes random resets and glitches that are miserable to debug.',
      note: 'EMI = electromagnetic interference. Short traces, ground planes, and decoupling are your three defenses.' },

    { layout: 'section', eyebrow: 'Topic 5', title: 'Battery Chemistries' },
    { layout: 'table', title: 'LiPo vs Li-ion vs NiMH',
      columns: ['', 'LiPo', 'Li-ion', 'NiMH'],
      rows: [
        ['Cell voltage', '3.7 V', '3.7 V', '1.2 V'],
        ['Form', 'flat pouch', '18650 cylinder', 'AA/AAA-like'],
        ['Energy density', 'high', 'high', 'medium'],
        ['Best for', 'drones, slim builds', 'power banks, EVs', 'cheap, safe, simple'],
      ],
      note: 'Lithium cells need protection circuitry — never over-discharge below ~3.0 V or charge unbalanced.' },

    { layout: 'section', eyebrow: 'Topic 6', title: 'TP4056 Charging IC' },
    { layout: 'bullets', title: 'Safely charge a single Li-ion / LiPo cell',
      bullets: [
        { text: 'CC/CV charging', sub: 'constant current, then constant voltage to 4.2 V' },
        { text: 'USB input', sub: 'micro/USB-C modules charge from any phone charger' },
        { text: 'Protection variant', sub: 'TP4056 + DW01 adds over-discharge/short protection' },
        { text: 'Status LEDs', sub: 'red = charging, blue/green = done' },
      ] },

    { layout: 'takeaway', title: 'Day 7 — Key Takeaways',
      bullets: [
        { text: '7805/LM317 are simple but waste heat (linear)' },
        { text: 'Buck/boost converters are efficient (switching)' },
        { text: 'Relays isolate big loads — always add a flyback diode' },
        { text: 'Decoupling caps (100 nF per chip) prevent glitches' },
        { text: 'Know your battery chemistry & its voltage' },
        { text: 'TP4056 safely charges a single lithium cell' },
      ] },
  ],
};

// ──────────────────────────────────────────────────────────────────────────
// DAY 8 — Multitasking & Control Systems (theory)
// ──────────────────────────────────────────────────────────────────────────

const day8: Module = {
  id: 'day-8',
  track: 'bootcamp',
  order: 8,
  day: 8,
  title: 'Multitasking & Control Systems',
  tagline: 'Do many things at once, and control them precisely.',
  summary: 'Theory + practice: replace delay() with millis() to multitask, understand open-loop vs closed-loop control, and learn how a PID controller keeps a system on target.',
  duration: '≈ 2 hrs',
  level: 'Intermediate',
  topics: ['millis() multitasking', 'Sensor practicals', 'Open vs closed loop', 'PID control'],
  accent: 'from-violet-500 to-fuchsia-600',
  slides: [
    { layout: 'cover', eyebrow: 'Day 8 · Theory', title: 'Multitasking & Control Systems', subtitle: 'Timing without blocking, and control that corrects itself',
      bullets: [{ text: 'millis() for multitasking' }, { text: 'Sensor-based project practicals' }, { text: 'Open-loop vs closed-loop control' }, { text: 'PID: Proportional, Integral, Derivative' }] },

    { layout: 'section', eyebrow: 'Topic 1', title: 'millis() for Multitasking' },
    { layout: 'statement', title: 'delay() freezes the whole program.',
      lead: 'During delay(1000) your board cannot read a button or another sensor. millis() lets you track time WITHOUT stopping — so several things appear to run at once.' },
    { layout: 'code', title: 'Blink without delay', lang: 'cpp',
      code: `unsigned long last = 0;
const long interval = 500;

void loop() {
  unsigned long now = millis();
  if (now - last >= interval) {
    last = now;
    state = !state;
    digitalWrite(led, state);
  }
  // other code keeps running here every loop!
}`,
      bullets: [{ text: 'millis() = ms since boot, always counting' }, { text: 'Compare elapsed time instead of pausing' }] },

    { layout: 'section', eyebrow: 'Topic 2', title: 'Open-loop vs Closed-loop' },
    { layout: 'split', title: 'Does the system check its own result?',
      left: { heading: 'Open-loop', bullets: ['Send a command, hope it worked', 'No feedback / measurement', 'Example: microwave timer, a fan at fixed speed', 'Simple but drifts'] },
      right: { heading: 'Closed-loop', bullets: ['Measure the result, correct continuously', 'Uses sensor feedback', 'Example: cruise control, thermostat', 'Accurate & self-correcting'] } },

    { layout: 'section', eyebrow: 'Topic 3', title: 'PID Control' },
    { layout: 'visual', title: 'PID drives the error to zero', svg: pidConverge,
      lead: 'Error = setpoint − measured. The controller corrects, re-measures, and repeats — until the value rests on target.',
      bullets: [{ text: 'Overshoot then settle is the classic PID response' }, { text: 'Good tuning = fast settle, little overshoot' }, { text: 'The dashed line is the goal (setpoint)' }] },
    { layout: 'cards', title: 'The three terms', lead: 'Each reacts to the error differently.',
      cards: [
        { icon: 'P', title: 'Proportional', text: 'Reacts to the error NOW. Bigger error → bigger push. Too much → overshoot/oscillation.' },
        { icon: 'I', title: 'Integral', text: 'Accumulates PAST error to erase steady offset. Too much → sluggish wobble.' },
        { icon: 'D', title: 'Derivative', text: 'Reacts to the RATE of change — anticipates and damps overshoot. Sensitive to noise.' },
      ] },
    { layout: 'formula', title: 'The PID equation', formula: 'output = Kp·e + Ki·∫e dt + Kd·(de/dt)',
      where: [{ sym: 'e', def: 'error = setpoint − measured' }, { sym: 'Kp/Ki/Kd', def: 'tuning gains you choose' }],
      example: 'Tune by hand: raise Kp until it oscillates, back off, add Kd to damp, add a little Ki to remove offset.',
      note: 'Balance robots, drones, temperature controllers and motor speed loops all live on PID.' },

    { layout: 'takeaway', title: 'Day 8 — Key Takeaways',
      bullets: [
        { text: 'millis() multitasks; delay() blocks' },
        { text: 'Open-loop trusts; closed-loop measures & corrects' },
        { text: 'PID turns error into a smart correction' },
        { text: 'P = now, I = accumulated past, D = predicted future' },
        { text: 'Tune Kp, then Kd, then Ki' },
      ] },
  ],
};

// ──────────────────────────────────────────────────────────────────────────
// DAY 9 — Communication Protocols (theory)
// ──────────────────────────────────────────────────────────────────────────

const day9: Module = {
  id: 'day-9',
  track: 'bootcamp',
  order: 9,
  day: 9,
  title: 'Communication Protocols',
  tagline: 'How chips talk: UART, SPI, and I2C.',
  summary: 'The three protocols that connect everything: UART for simple links, SPI for speed, I2C for many devices on two wires. Plus the I2C scanner, an OLED, and the MPU-6050 IMU.',
  duration: '≈ 2.5 hrs',
  level: 'Intermediate',
  topics: ['UART', 'SPI', 'I2C', 'I2C scanner', 'OLED SSD1306', 'MPU-6050 IMU', 'SoftSerial'],
  accent: 'from-cyan-500 to-teal-600',
  slides: [
    { layout: 'cover', eyebrow: 'Day 9 · Theory', title: 'Communication Protocols', subtitle: 'The languages chips use to talk to each other',
      bullets: [{ text: 'UART — TX/RX serial' }, { text: 'SPI — MOSI/MISO/SCK/CS' }, { text: 'I2C — SDA/SCL & addressing' }, { text: 'I2C scanner sketch' }, { text: 'OLED display (SSD1306)' }, { text: 'MPU-6050 IMU' }, { text: 'Software Serial' }] },

    { layout: 'section', eyebrow: 'Topic 1', title: 'UART' },
    { layout: 'split', title: 'The simplest link — two wires',
      lead: 'Asynchronous serial: no shared clock, both sides just agree on a speed (baud).',
      left: { heading: 'Wiring', bullets: ['TX of one → RX of the other (cross over)', 'Common ground', 'Both set the same baud rate'] },
      right: { heading: 'In code', bullets: ['Serial.begin(115200)', 'Serial.write() / Serial.read()', 'One device to one device'] } },
    { layout: 'visual', title: 'Anatomy of a UART byte', svg: uartFrame,
      lead: 'With no shared clock, framing keeps both sides in sync: a start bit, the data bits, then a stop bit.',
      bullets: [{ text: 'S = start bit (line pulled low)' }, { text: 'b0–b7 = the 8 data bits' }, { text: 'P = stop bit — ready for the next byte' }] },

    { layout: 'section', eyebrow: 'Topic 2', title: 'SPI' },
    { layout: 'bullets', title: 'Fast, full-duplex, clocked',
      bullets: [
        { text: 'MOSI', sub: 'Master Out, Slave In — data to the device' },
        { text: 'MISO', sub: 'Master In, Slave Out — data back' },
        { text: 'SCK', sub: 'clock from the master synchronizes every bit' },
        { text: 'CS / SS', sub: 'chip-select — one line per device to pick who listens' },
      ],
      note: 'SPI is the fastest of the three (MHz). Cost: a separate CS wire per device. Used by SD cards, displays, flash.' },
    { layout: 'visual', title: 'SPI moves data both ways at once', svg: spiBus,
      lead: 'On every clock tick the master sends a bit on MOSI and receives one on MISO — full-duplex. CS selects which device is listening.',
      bullets: [{ text: 'MOSI + MISO = simultaneous two-way' }, { text: 'SCK clocks every bit' }, { text: 'Fastest protocol — great for displays & SD' }] },

    { layout: 'section', eyebrow: 'Topic 3', title: 'I2C' },
    { layout: 'diagram', title: 'Two wires, many devices', svg: i2cBus,
      caption: 'SDA (data) and SCL (clock) are shared. Each device has a unique address — the master calls it by name.',
      note: 'I2C needs pull-up resistors on SDA and SCL (often 4.7 kΩ). Many breakout boards include them.' },
    { layout: 'code', title: 'I2C scanner — find every device', lang: 'cpp',
      code: `#include <Wire.h>
void setup(){
  Wire.begin(); Serial.begin(115200);
  for (byte a = 1; a < 127; a++){
    Wire.beginTransmission(a);
    if (Wire.endTransmission() == 0){
      Serial.print("Found 0x"); Serial.println(a, HEX);
    }
  }
}`,
      bullets: [{ text: 'Always run this first when wiring an I2C device' }, { text: 'Confirms address & wiring before you debug code' }] },

    { layout: 'section', eyebrow: 'Topic 4', title: 'OLED & IMU over I2C' },
    { layout: 'split', title: 'Two classic I2C devices',
      left: { heading: 'OLED SSD1306 (0x3C)', bullets: ['128×64 monochrome display', 'Adafruit_SSD1306 + GFX libraries', 'display.print() then display.display()'] },
      right: { heading: 'MPU-6050 IMU (0x68)', bullets: ['3-axis accelerometer + 3-axis gyro', 'Reads tilt, motion, rotation', 'Core of balance bots & drones'] } },
    { layout: 'visual', title: 'The OLED display (SSD1306)', svg: oledDisplay,
      lead: 'A tiny 0.96" screen that needs only the two I2C wires to show text, numbers, and simple graphics.',
      bullets: [{ text: '128×64 pixels, crisp & low-power' }, { text: 'I2C address 0x3C' }, { text: 'print() then display() to update' }] },
    { layout: 'photo', title: 'The MPU-6050 module (GY-521)', image: IMG('mpu6050'), imageAlt: 'MPU-6050 GY-521 breakout board', credit: PHOTO_CREDIT,
      lead: 'A tiny breakout carrying a 6-axis IMU — it talks to the MCU over just SDA and SCL.',
      bullets: [{ text: 'Accelerometer senses tilt & g-force' }, { text: 'Gyroscope senses rotation rate' }, { text: 'Default I2C address 0x68' }] },
    { layout: 'code', title: 'Read the MPU-6050', lang: 'cpp',
      code: `#include <Adafruit_MPU6050.h>
Adafruit_MPU6050 mpu;
void setup(){ Wire.begin(); mpu.begin(); }
void loop(){
  sensors_event_t a, g, t;
  mpu.getEvent(&a, &g, &t);
  Serial.println(a.acceleration.x);  // m/s^2
}`,
      bullets: [{ text: 'One library hides all the register reads' }, { text: 'Fuse accel + gyro for stable angle (complementary/Kalman)' }] },

    { layout: 'section', eyebrow: 'Topic 5', title: 'Software Serial' },
    { layout: 'statement', title: 'Out of hardware UARTs? Make one in software.',
      lead: 'SoftwareSerial (or ESP32 extra hardware UARTs) lets you add more serial ports on ordinary GPIO pins — handy for GPS, GSM, or a second module while USB stays free for debugging.' },

    { layout: 'table', title: 'UART vs SPI vs I2C — pick the right one',
      columns: ['', 'UART', 'SPI', 'I2C'],
      rows: [
        ['Wires', '2 (TX/RX)', '4 + 1/device', '2 (SDA/SCL)'],
        ['Clock', 'none (async)', 'shared SCK', 'shared SCL'],
        ['Speed', 'low–med', 'highest', 'medium'],
        ['Devices', '1 ↔ 1', 'many (CS each)', 'many (by address)'],
        ['Best for', 'GPS, modules, debug', 'displays, SD, flash', 'sensors, OLED, IMU'],
      ] },

    { layout: 'takeaway', title: 'Day 9 — Key Takeaways',
      bullets: [
        { text: 'UART: 2 wires, no clock, one-to-one' },
        { text: 'SPI: fastest, full-duplex, one CS per device' },
        { text: 'I2C: 2 shared wires, addressed, needs pull-ups' },
        { text: 'Run the I2C scanner before debugging code' },
        { text: 'OLED 0x3C and MPU-6050 0x68 are the classic I2C pair' },
        { text: 'Software serial adds extra UART ports when you run out' },
      ] },
  ],
};

// ──────────────────────────────────────────────────────────────────────────
// PCB DESIGN TRACK — KiCad
// ──────────────────────────────────────────────────────────────────────────

const kicad: Module = {
  id: 'kicad',
  track: 'pcb',
  order: 10,
  title: 'PCB Design in KiCad',
  tagline: 'Turn a breadboard idea into a real manufactured board.',
  summary: 'A complete walkthrough of designing a PCB in free, open-source KiCad: schematic capture, footprints, layout & routing, design rules, ground planes, DRC, and exporting Gerbers to order from a fab.',
  duration: '≈ 3 hrs',
  level: 'Intermediate',
  topics: ['What a PCB is', 'KiCad tools', 'Schematic capture', 'Footprints & ERC', 'Layout & routing', 'Design rules', 'Ground planes', 'Gerbers & ordering'],
  accent: 'from-green-500 to-emerald-600',
  slides: [
    { layout: 'cover', eyebrow: 'PCB Track', title: 'PCB Design in KiCad', subtitle: 'From schematic to a board you can hold',
      bullets: [{ text: 'What a PCB actually is' }, { text: 'The KiCad toolset' }, { text: 'Schematic capture & ERC' }, { text: 'Footprints & netlist' }, { text: 'Placement, routing & design rules' }, { text: 'Ground planes & best practices' }, { text: 'DRC, 3D view & Gerber export' }, { text: 'Ordering from a fab' }] },

    { layout: 'section', eyebrow: 'Part 1', title: 'What Is a PCB?' },
    { layout: 'diagram', title: 'A PCB is a stack of layers', svg: pcbStack,
      caption: 'Copper carries signals, FR-4 fiberglass insulates, soldermask protects copper, silkscreen prints labels. Vias connect layers.',
      note: 'Most hobby boards are 2-layer: copper on top and bottom of one FR-4 core.' },
    { layout: 'photo', title: 'This is what we are building toward', image: IMG('pcb'), imageAlt: 'Green printed circuit board with components', credit: PHOTO_CREDIT,
      lead: 'A finished PCB — green soldermask, copper traces, and components soldered to pads. By the end of this track you can design one yourself.',
      bullets: [{ text: 'Copper traces replace jumper wires' }, { text: 'Compact, durable, repeatable' }, { text: 'Order 5 from a fab for a few dollars' }] },
    { layout: 'bullets', title: 'The vocabulary',
      bullets: [
        { text: 'Trace', sub: 'a copper "wire" etched onto the board' },
        { text: 'Pad', sub: 'where a component leg solders down' },
        { text: 'Via', sub: 'a plated hole connecting top & bottom copper' },
        { text: 'Footprint', sub: 'the physical pad pattern a part lands on' },
        { text: 'Net', sub: 'a named electrical connection (e.g. GND, +5V)' },
      ] },

    { layout: 'section', eyebrow: 'Part 2', title: 'The KiCad Toolset' },
    { layout: 'cards', title: 'KiCad is free & open-source', lead: 'No license cost, no node limits, industry-capable.',
      cards: [
        { icon: '📐', title: 'Schematic Editor', text: 'Draw the logical circuit — symbols and wires.' },
        { icon: '🧩', title: 'Symbol/Footprint libs', text: 'Thousands built in; create custom parts too.' },
        { icon: '🛠', title: 'PCB Editor', text: 'Place footprints and route copper traces.' },
        { icon: '👁', title: '3D Viewer', text: 'See a realistic render of the finished board.' },
        { icon: '📤', title: 'Gerber export', text: 'Generate the manufacturing files for any fab.' },
      ] },

    { layout: 'section', eyebrow: 'Part 3', title: 'Schematic Capture' },
    { layout: 'steps', title: 'Draw the circuit logically first',
      steps: [
        { title: 'New project', text: 'File → New Project. KiCad keeps schematic (.kicad_sch) and board (.kicad_pcb) together.' },
        { title: 'Place symbols', text: 'Press A to add symbols — resistors, the MCU, connectors. Symbols are logical, not physical yet.' },
        { title: 'Wire them up', text: 'Press W to draw wires. Use labels for nets like GND and +3V3 instead of long wires.' },
        { title: 'Annotate & values', text: 'Give every part a reference (R1, U1) and value (10k, ESP32).' },
      ],
      note: 'Good habit: power symbols and net labels keep big schematics readable. Avoid crossing wires everywhere.' },
    { layout: 'statement', title: 'Run ERC before you go further.',
      lead: 'The Electrical Rules Check catches unconnected pins, conflicting outputs, and missing power. Fixing it now is free; fixing it after fabrication costs a re-order.' },

    { layout: 'section', eyebrow: 'Part 4', title: 'Footprints' },
    { layout: 'bullets', title: 'Link each symbol to a physical part',
      bullets: [
        { text: 'Assign footprints', sub: 'a resistor symbol → 0805 SMD or through-hole footprint' },
        { text: 'Match the real part', sub: 'check the datasheet package — wrong footprint = unsolderable board' },
        { text: 'Update PCB from schematic', sub: 'pushes the netlist into the PCB editor as a "ratsnest"' },
      ],
      note: 'The ratsnest is the thin lines showing what must connect — your routing to-do list.' },

    { layout: 'section', eyebrow: 'Part 5', title: 'Layout & Routing' },
    { layout: 'steps', title: 'Place, then route',
      steps: [
        { title: 'Define the board outline', text: 'Draw the edge cut on the Edge.Cuts layer — this is the physical shape & size.' },
        { title: 'Place components', text: 'Group related parts; put connectors at edges; keep the MCU central. Short critical paths.' },
        { title: 'Route traces', text: 'Press X to route. Follow the ratsnest, turn thin lines into real copper traces.' },
        { title: 'Width matters', text: 'Signal traces ~0.25 mm; power traces wider to carry more current.' },
      ] },
    { layout: 'formula', title: 'Trace width carries current', formula: 'wider + thicker copper = more current, less heat',
      where: [{ sym: 'Signals', def: '0.2–0.3 mm is plenty' }, { sym: 'Power/GND', def: '0.5–1 mm+, or use a pour' }],
      example: 'Rule of thumb (1 oz copper, 10 °C rise): ~0.25 mm ≈ 0.5 A, ~0.5 mm ≈ 1 A. Use a calculator for real designs.' },

    { layout: 'section', eyebrow: 'Part 6', title: 'Design Rules & Ground Planes' },
    { layout: 'split', title: 'Constraints that keep it manufacturable',
      left: { heading: 'Design Rules (DRC)', bullets: ['Clearance — min gap between copper', 'Track width — min trace the fab can make', 'Via & drill sizes', 'Set these to your fab’s spec sheet'] },
      right: { heading: 'Ground plane (copper pour)', bullets: ['Fill empty space with a GND fill', 'Shorter return paths, less noise/EMI', 'Easier routing, better heat spread'] },
      note: 'A solid ground pour is the single biggest "pro" upgrade a beginner board can get.' },

    { layout: 'section', eyebrow: 'Part 7', title: 'Verify' },
    { layout: 'bullets', title: 'Check before you spend money',
      bullets: [
        { text: 'Run DRC', sub: 'zero clearance/width violations before export' },
        { text: '3D view (Alt+3)', sub: 'spot overlaps, wrong footprints, mechanical fit' },
        { text: 'Re-check connectors & mounting holes', sub: 'the things that are painful to fix later' },
      ] },

    { layout: 'section', eyebrow: 'Part 8', title: 'Manufacturing' },
    { layout: 'steps', title: 'Export & order',
      steps: [
        { title: 'Plot Gerbers', text: 'File → Plot. Generate the copper, mask, silkscreen & edge-cut layers.' },
        { title: 'Drill files', text: 'Generate Excellon drill files for the holes & vias.' },
        { title: 'Zip & upload', text: 'Zip the Gerbers and upload to a fab — JLCPCB, PCBWay, or NextPCB.' },
        { title: 'Order & assemble', text: 'Pick size/color/quantity, order, then solder (or use the fab’s assembly service).' },
      ],
      note: 'KiCad 7+ also has a one-click Fabrication Toolkit/plugin for JLCPCB that bundles Gerbers + BOM + placement.' },

    { layout: 'takeaway', title: 'KiCad — Design Checklist',
      bullets: [
        { text: 'Schematic first; pass ERC' },
        { text: 'Assign correct footprints; update PCB' },
        { text: 'Draw board outline, place, then route' },
        { text: 'Power traces wide; add a ground pour' },
        { text: 'Set design rules to your fab; pass DRC' },
        { text: 'Plot Gerbers + drills → zip → order' },
      ] },
  ],
};

// ──────────────────────────────────────────────────────────────────────────
// The original nine days above are the CONTENT source. We compress them into a
// tighter 5-day bootcamp by merging related days — every content slide is kept
// verbatim; only the cover and the recap of each merged day are rewritten.
// ──────────────────────────────────────────────────────────────────────────

// middle content of a source day (drops its own cover + takeaway)
const mid = (m: Module) => m.slides.slice(1, -1);

const mergedDay1: Module = {
  id: 'day-1', track: 'bootcamp', order: 1, day: 1,
  title: 'Foundations & Components',
  tagline: 'Robotics, electricity, and the parts every board is built from.',
  summary: 'The big picture and the basics in one go: what robotics is, how electricity behaves, the multimeter and breadboard, AC vs DC, switches, and the resistor–capacitor–inductor trio.',
  duration: '≈ 3.5 hrs',
  level: 'Beginner',
  topics: ['Robotics', 'Electricity & Ohm’s Law', 'Multimeter', 'Breadboard', 'AC vs DC', 'Switches', 'R · C · L'],
  accent: 'from-teal-500 to-cyan-500',
  slides: [
    { layout: 'cover', eyebrow: 'Day 1', title: 'Foundations & Components', subtitle: 'From what a robot is to the components in your hand',
      bullets: [{ text: 'Robotics & the sense–think–act loop' }, { text: 'Electricity & Ohm’s Law' }, { text: 'Multimeter & breadboard' }, { text: 'AC vs DC' }, { text: 'Switches' }, { text: 'Resistor · Capacitor · Inductor' }] },
    ...mid(day1),
    ...mid(day2),
    { layout: 'takeaway', title: 'Day 1 — Key Takeaways',
      bullets: [
        { text: 'Robots run a Sense → Think → Act loop' },
        { text: 'Voltage pushes, current flows, resistance opposes — V = I × R' },
        { text: 'Voltage is measured in parallel; current in series' },
        { text: 'Breadboard rails run long; rows connect in fives' },
        { text: 'DC is steady; AC alternates direction' },
        { text: 'Resistor limits current, capacitor stores charge, inductor stores magnetic energy' },
        { text: 'Current flows only in a closed loop' },
      ] },
  ],
};

const mergedDay2: Module = {
  id: 'day-2', track: 'bootcamp', order: 2, day: 2,
  title: 'Logic & Circuits',
  tagline: 'Series/parallel, binary, logic gates, and the transistor.',
  summary: day3.summary,
  duration: day3.duration,
  level: day3.level,
  topics: day3.topics,
  accent: day3.accent,
  slides: [
    { layout: 'cover', eyebrow: 'Day 2', title: 'Logic & Circuits', subtitle: 'Counting, logic gates, and the transistor',
      bullets: (day3.slides[0].bullets ?? []) },
    ...mid(day3),
    day3.slides[day3.slides.length - 1],
  ],
};

const mergedDay3: Module = {
  id: 'day-3', track: 'bootcamp', order: 3, day: 3,
  title: 'Embedded Programming',
  tagline: 'Boards, the IDE, and your first working code.',
  summary: day4.summary,
  duration: day4.duration,
  level: day4.level,
  topics: day4.topics,
  accent: day4.accent,
  slides: [
    { layout: 'cover', eyebrow: 'Day 3', title: 'Introduction to Embedded Programming', subtitle: 'From blank board to blinking LED',
      bullets: (day4.slides[0].bullets ?? []) },
    ...mid(day4),
    day4.slides[day4.slides.length - 1],
  ],
};

const mergedDay4: Module = {
  id: 'day-4', track: 'bootcamp', order: 4, day: 4,
  title: 'Sensors & Motors',
  tagline: 'Read the world with sensors, then make it move.',
  summary: 'The big practical day: how sensors turn the world into data (LDR, IR, pull-ups, the line follower), then driving motors — PWM speed, H-bridges, servos, ultrasonic distance, and ESP32 Bluetooth.',
  duration: '≈ 4.5 hrs',
  level: 'Intermediate',
  topics: ['Sensors & dividers', 'LDR · IR · line-follower', 'Pull-up/down', 'Motors & drivers', 'PWM · H-bridge', 'Servo · ultrasonic', 'ESP32 Bluetooth'],
  accent: 'from-amber-500 to-rose-600',
  slides: [
    { layout: 'cover', eyebrow: 'Day 4', title: 'Sensors & Motors', subtitle: 'Sense the world, then move it',
      bullets: [{ text: 'How sensors work · LDR · IR' }, { text: 'Pull-up / pull-down' }, { text: 'Line-following robot' }, { text: 'Motors & drivers' }, { text: 'PWM speed · H-bridge' }, { text: 'Servo · ultrasonic' }, { text: 'ESP32 Bluetooth' }] },
    ...mid(day5),
    ...mid(day6),
    { layout: 'takeaway', title: 'Day 4 — Key Takeaways',
      bullets: [
        { text: 'Sensors convert the world into electrical signals' },
        { text: 'Resistive sensors need a voltage divider; pull-ups stop floating inputs' },
        { text: 'IR reflects off white, absorbs on black — the basis of line following' },
        { text: 'Motors always need a driver, never a bare MCU pin' },
        { text: 'PWM duty cycle = speed; an H-bridge sets direction' },
        { text: 'Servos take an angle; HC-SR04 measures distance by echo' },
        { text: 'ESP32 Bluetooth Serial = wireless control with familiar code' },
      ] },
  ],
};

const mergedDay5: Module = {
  id: 'day-5', track: 'bootcamp', order: 5, day: 5,
  title: 'Power, Control & Communication',
  tagline: 'Clean power, smart control loops, and how chips talk.',
  summary: 'The finishing day, pulling the theory together: power regulators and batteries, multitasking with millis() and PID control, and the three communication protocols — UART, SPI, and I2C — with the OLED and IMU.',
  duration: '≈ 5 hrs · theory',
  level: 'Intermediate',
  topics: ['Regulators & batteries', 'Relays', 'millis() multitasking', 'Open/closed loop · PID', 'UART · SPI · I2C', 'OLED · IMU'],
  accent: 'from-violet-500 to-cyan-600',
  slides: [
    { layout: 'cover', eyebrow: 'Day 5', title: 'Power, Control & Communication', subtitle: 'Clean power, control loops, and chip-to-chip protocols',
      bullets: [{ text: 'Voltage regulators & batteries' }, { text: 'Relays & flyback' }, { text: 'millis() multitasking' }, { text: 'Open vs closed loop · PID' }, { text: 'UART · SPI · I2C' }, { text: 'OLED · MPU-6050' }] },
    ...mid(day7),
    ...mid(day8),
    ...mid(day9),
    { layout: 'takeaway', title: 'Day 5 — Key Takeaways',
      bullets: [
        { text: 'Linear regulators waste heat; buck/boost are efficient' },
        { text: 'Relays isolate big loads — always add a flyback diode' },
        { text: 'millis() multitasks; delay() blocks' },
        { text: 'Closed-loop control measures & corrects — that’s PID' },
        { text: 'UART: 2 wires, async · SPI: fast, full-duplex · I2C: addressed, 2 shared wires' },
        { text: 'Run the I2C scanner first; OLED 0x3C, MPU-6050 0x68' },
      ] },
  ],
};

const kicadModule: Module = { ...kicad, order: 6 };

export const MODULES: Module[] = [mergedDay1, mergedDay2, mergedDay3, mergedDay4, mergedDay5, kicadModule];

export const MODULE_MAP: Record<string, Module> = Object.fromEntries(
  MODULES.map(m => [m.id, m]),
);

export const BOOTCAMP_MODULES = MODULES.filter(m => m.track === 'bootcamp');
export const PCB_MODULES = MODULES.filter(m => m.track === 'pcb');
