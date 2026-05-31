// Animated, self-playing SVG diagrams for the course slides.
// Everything uses native SMIL (<animate>, <animateMotion>, <animateTransform>) so
// the visuals keep moving on their own — important for screen-recording into videos.
// Each diagram uses a unique id prefix to avoid collisions when injected via innerHTML.

// ── Day 1 · the Sense → Think → Act loop ──────────────────────────────────
export const senseThinkAct = `
<svg viewBox="0 0 520 220" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="20" y="80" width="120" height="60" rx="12" fill="#ecfeff" stroke="#22C0B3" stroke-width="2"/>
  <text x="80" y="108" text-anchor="middle" font-size="14" font-weight="700" fill="#0f172a">SENSE</text>
  <text x="80" y="126" text-anchor="middle" font-size="10" fill="#64748b">read the world</text>
  <rect x="200" y="80" width="120" height="60" rx="12" fill="#fff7ed" stroke="#f59e0b" stroke-width="2"/>
  <text x="260" y="108" text-anchor="middle" font-size="14" font-weight="700" fill="#0f172a">THINK</text>
  <text x="260" y="126" text-anchor="middle" font-size="10" fill="#64748b">decide</text>
  <rect x="380" y="80" width="120" height="60" rx="12" fill="#eff6ff" stroke="#3b82f6" stroke-width="2"/>
  <text x="440" y="108" text-anchor="middle" font-size="14" font-weight="700" fill="#0f172a">ACT</text>
  <text x="440" y="126" text-anchor="middle" font-size="10" fill="#64748b">move / output</text>
  <path id="sta-loop" d="M140 110 H200 M320 110 H380 M440 140 V175 H80 V140" fill="none" stroke="#94a3b8" stroke-width="2" stroke-dasharray="4 4"/>
  <circle r="6" fill="#22C0B3">
    <animateMotion dur="3.2s" repeatCount="indefinite" path="M140 110 H200 M320 110 H380 M440 140 V175 H80 V140 V110"/>
  </circle>
</svg>`;

// ── current flowing around a closed loop (battery → R → LED) ──────────────
export const currentFlow = `
<svg viewBox="0 0 440 240" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="40" y="40" width="360" height="160" rx="8" fill="none" stroke="#475569" stroke-width="2"/>
  <line x1="55" y1="30" x2="55" y2="50" stroke="#10b981" stroke-width="4"/>
  <line x1="40" y1="120" x2="40" y2="100" stroke="#475569" stroke-width="6"/>
  <text x="12" y="115" font-size="12" fill="#10b981" font-weight="700">+</text>
  <text x="12" y="135" font-size="12" fill="#64748b">−</text>
  <text x="60" y="22" font-size="11" fill="#64748b">Battery</text>
  <path d="M150 40 l8 -10 l12 20 l12 -20 l12 20 l8 -10" fill="none" stroke="#f59e0b" stroke-width="3"/>
  <text x="160" y="22" font-size="11" fill="#64748b">Resistor</text>
  <circle cx="320" cy="40" r="12" fill="#ef4444" stroke="#b91c1c" stroke-width="2">
    <animate attributeName="opacity" values="0.35;1;0.35" dur="1.6s" repeatCount="indefinite"/>
  </circle>
  <text x="305" y="22" font-size="11" fill="#64748b">LED</text>
  ${[0, 0.5, 1, 1.5, 2, 2.5].map((d) => `
  <circle r="4" fill="#22C0B3">
    <animateMotion dur="3s" begin="${d}s" repeatCount="indefinite"
      path="M55 50 V40 H400 V200 H40 V50"/>
  </circle>`).join('')}
  <text x="150" y="225" font-size="11" fill="#94a3b8">electrons flow + → − through the load</text>
</svg>`;

// ── AC vs DC, with a dot tracing each ─────────────────────────────────────
export const acdcWave = `
<svg viewBox="0 0 520 210" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <text x="20" y="28" fill="#0f172a" font-size="13" font-weight="700">DC — steady direction</text>
  <line x1="20" y1="55" x2="500" y2="55" stroke="#22C0B3" stroke-width="3"/>
  <circle r="6" fill="#22C0B3" cy="55"><animate attributeName="cx" values="20;500" dur="2.4s" repeatCount="indefinite"/></circle>
  <text x="20" y="120" fill="#0f172a" font-size="13" font-weight="700">AC — alternates +/−</text>
  <path d="M20 160 Q 80 110 140 160 T 260 160 T 380 160 T 500 160" fill="none" stroke="#f59e0b" stroke-width="3"/>
  <circle r="6" fill="#f59e0b">
    <animateMotion dur="2.4s" repeatCount="indefinite" path="M20 160 Q 80 110 140 160 T 260 160 T 380 160 T 500 160"/>
  </circle>
</svg>`;

// ── series vs parallel (with flowing current) ─────────────────────────────
export const seriesParallel = `
<svg viewBox="0 0 520 230" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <text x="10" y="20" fill="#0f172a" font-size="14" font-weight="700">Series — same current</text>
  <path id="sp-s" d="M20 60 H200" fill="none" stroke="#475569" stroke-width="2"/>
  <rect x="60" y="50" width="40" height="20" fill="#fff" stroke="#22C0B3" stroke-width="2"/>
  <rect x="130" y="50" width="40" height="20" fill="#fff" stroke="#22C0B3" stroke-width="2"/>
  <circle r="4" fill="#22C0B3"><animateMotion dur="2s" repeatCount="indefinite" path="M20 60 H200"/></circle>
  <text x="20" y="100" fill="#64748b" font-size="12">R = R1 + R2</text>
  <text x="300" y="20" fill="#0f172a" font-size="14" font-weight="700">Parallel — same voltage</text>
  <path d="M320 60 H480 M320 110 H480 M320 60 V110 M480 60 V110" fill="none" stroke="#475569" stroke-width="2"/>
  <rect x="380" y="50" width="40" height="20" fill="#fff" stroke="#22C0B3" stroke-width="2"/>
  <rect x="380" y="100" width="40" height="20" fill="#fff" stroke="#22C0B3" stroke-width="2"/>
  <circle r="4" fill="#22C0B3"><animateMotion dur="2s" repeatCount="indefinite" path="M320 60 H480"/></circle>
  <circle r="4" fill="#22C0B3"><animateMotion dur="2s" begin="0.4s" repeatCount="indefinite" path="M320 110 H480"/></circle>
  <text x="300" y="150" fill="#64748b" font-size="12">1/R = 1/R1 + 1/R2</text>
</svg>`;

// ── NPN transistor as a switch (base pulse gates collector current) ───────
export const npnSwitch = `
<svg viewBox="0 0 460 250" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <text x="200" y="28" fill="#10b981" font-size="13" font-weight="700">+V</text>
  <line x1="210" y1="32" x2="210" y2="70" stroke="#475569" stroke-width="2"/>
  <circle cx="210" cy="90" r="18" fill="#fff" stroke="#22C0B3" stroke-width="2">
    <animate attributeName="stroke" values="#cbd5e1;#22C0B3;#cbd5e1" dur="2s" repeatCount="indefinite"/>
  </circle>
  <text x="190" y="95" fill="#64748b" font-size="11">LOAD</text>
  <line x1="210" y1="108" x2="210" y2="135" stroke="#475569" stroke-width="2"/>
  <line x1="180" y1="150" x2="240" y2="150" stroke="#0f172a" stroke-width="3"/>
  <text x="248" y="142" fill="#64748b" font-size="11">Collector</text>
  <line x1="210" y1="150" x2="210" y2="166" stroke="#475569" stroke-width="2"/>
  <line x1="210" y1="166" x2="240" y2="192" stroke="#475569" stroke-width="2"/>
  <line x1="210" y1="166" x2="180" y2="192" stroke="#475569" stroke-width="2"/>
  <text x="248" y="197" fill="#64748b" font-size="11">Emitter → GND</text>
  <line x1="120" y1="158" x2="180" y2="158" stroke="#475569" stroke-width="2"/>
  <rect x="70" y="149" width="40" height="18" fill="#fff" stroke="#f59e0b" stroke-width="2"/>
  <text x="40" y="140" fill="#64748b" font-size="11">Base</text>
  <circle cx="50" cy="158" r="6" fill="#f59e0b"><animate attributeName="opacity" values="0.2;1;0.2" dur="2s" repeatCount="indefinite"/></circle>
  ${[0, 0.5, 1, 1.5].map((d) => `<circle r="4" fill="#22C0B3"><animateMotion dur="2s" begin="${d}s" repeatCount="indefinite" path="M210 70 V200"/></circle>`).join('')}
  <text x="40" y="230" fill="#94a3b8" font-size="11">small base current → large collector current</text>
</svg>`;

// ── pull-up / pull-down with a pulsing pin level ──────────────────────────
export const pullUpDown = `
<svg viewBox="0 0 460 220" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <text x="20" y="20" fill="#0f172a" font-size="13" font-weight="700">Pull-up → idles HIGH</text>
  <text x="40" y="45" fill="#10b981" font-size="12">+V</text>
  <line x1="50" y1="50" x2="50" y2="75" stroke="#475569" stroke-width="2"/>
  <rect x="35" y="75" width="30" height="40" fill="#fff" stroke="#22C0B3" stroke-width="2"/>
  <line x1="50" y1="115" x2="50" y2="150" stroke="#475569" stroke-width="2"/>
  <circle cx="50" cy="150" r="6" fill="#10b981"><animate attributeName="fill" values="#10b981;#10b981;#ef4444;#10b981" dur="3s" repeatCount="indefinite"/></circle>
  <text x="65" y="155" fill="#64748b" font-size="11">MCU pin</text>
  <text x="270" y="20" fill="#0f172a" font-size="13" font-weight="700">Pull-down → idles LOW</text>
  <circle cx="300" cy="60" r="6" fill="#ef4444"><animate attributeName="fill" values="#ef4444;#ef4444;#10b981;#ef4444" dur="3s" repeatCount="indefinite"/></circle>
  <text x="315" y="65" fill="#64748b" font-size="11">MCU pin</text>
  <line x1="300" y1="66" x2="300" y2="95" stroke="#475569" stroke-width="2"/>
  <rect x="285" y="95" width="30" height="40" fill="#fff" stroke="#22C0B3" stroke-width="2"/>
  <line x1="300" y1="135" x2="300" y2="160" stroke="#475569" stroke-width="2"/>
  <line x1="285" y1="160" x2="315" y2="160" stroke="#475569" stroke-width="2"/>
  <text x="285" y="180" fill="#94a3b8" font-size="11">GND</text>
</svg>`;

// ── voltage divider with an animated tap level ────────────────────────────
export const voltageDivider = `
<svg viewBox="0 0 440 230" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <text x="60" y="28" fill="#10b981" font-size="12" font-weight="700">Vin (+5V)</text>
  <line x1="90" y1="32" x2="90" y2="55" stroke="#475569" stroke-width="2"/>
  <rect x="72" y="55" width="36" height="46" fill="#fff" stroke="#22C0B3" stroke-width="2"/><text x="116" y="82" font-size="11" fill="#64748b">R1</text>
  <line x1="90" y1="101" x2="90" y2="120" stroke="#475569" stroke-width="2"/>
  <circle cx="90" cy="120" r="4" fill="#0f172a"/>
  <line x1="90" y1="120" x2="180" y2="120" stroke="#f59e0b" stroke-width="2"/>
  <text x="188" y="124" font-size="12" fill="#f59e0b" font-weight="700">Vout → ADC</text>
  <rect x="72" y="120" width="36" height="46" fill="#fff" stroke="#22C0B3" stroke-width="2"/><text x="116" y="148" font-size="11" fill="#64748b">R2</text>
  <line x1="90" y1="166" x2="90" y2="188" stroke="#475569" stroke-width="2"/>
  <line x1="75" y1="188" x2="105" y2="188" stroke="#475569" stroke-width="2"/>
  <text x="80" y="205" font-size="11" fill="#94a3b8">GND</text>
  <rect x="320" y="60" width="26" height="110" rx="4" fill="#e2e8f0"/>
  <rect x="320" y="60" width="26" height="110" rx="4" fill="#22C0B3">
    <animate attributeName="height" values="20;100;20" dur="3s" repeatCount="indefinite"/>
    <animate attributeName="y" values="150;70;150" dur="3s" repeatCount="indefinite"/>
  </rect>
  <text x="312" y="188" font-size="10" fill="#64748b">Vout</text>
  <text x="300" y="40" font-size="11" fill="#64748b">sensor changes R → Vout moves</text>
</svg>`;

// ── PWM duty cycle driving brightness ─────────────────────────────────────
export const pwmDuty = `
<svg viewBox="0 0 520 220" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <text x="20" y="26" fill="#0f172a" font-size="13" font-weight="700">PWM signal</text>
  <line x1="20" y1="110" x2="360" y2="110" stroke="#e2e8f0" stroke-width="1"/>
  <line x1="20" y1="60" x2="360" y2="60" stroke="#e2e8f0" stroke-width="1"/>
  <path d="M20 110 V60 H70 V110 H120 V60 H170 V110 H220 V60 H270 V110 H320 V60 H360" fill="none" stroke="#22C0B3" stroke-width="3"/>
  <text x="20" y="135" fill="#64748b" font-size="11">duty cycle = % time HIGH = average power</text>
  <circle cx="440" cy="90" r="34" fill="#fde047" stroke="#ca8a04" stroke-width="2">
    <animate attributeName="opacity" values="0.25;1;0.25" dur="1.4s" repeatCount="indefinite"/>
  </circle>
  <text x="412" y="150" fill="#64748b" font-size="12">LED brightness</text>
  <rect x="400" y="165" width="80" height="14" rx="7" fill="#e2e8f0"/>
  <rect x="400" y="165" width="80" height="14" rx="7" fill="#22C0B3"><animate attributeName="width" values="20;80;20" dur="2.8s" repeatCount="indefinite"/></rect>
</svg>`;

// ── H-bridge: current direction flips between two states ──────────────────
export const hBridge = `
<svg viewBox="0 0 460 250" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <text x="205" y="24" fill="#10b981" font-size="13" font-weight="700">+V</text>
  <path d="M110 40 H350 M110 40 V100 M350 40 V100 M110 150 V210 M350 150 V210 M110 210 H350" fill="none" stroke="#475569" stroke-width="2"/>
  <rect x="92" y="100" width="36" height="22" fill="#fff" stroke="#22C0B3" stroke-width="2"/><text x="100" y="116" font-size="10" fill="#64748b">Q1</text>
  <rect x="332" y="100" width="36" height="22" fill="#fff" stroke="#22C0B3" stroke-width="2"/><text x="340" y="116" font-size="10" fill="#64748b">Q2</text>
  <rect x="92" y="150" width="36" height="22" fill="#fff" stroke="#22C0B3" stroke-width="2"/><text x="100" y="166" font-size="10" fill="#64748b">Q3</text>
  <rect x="332" y="150" width="36" height="22" fill="#fff" stroke="#22C0B3" stroke-width="2"/><text x="340" y="166" font-size="10" fill="#64748b">Q4</text>
  <line x1="110" y1="122" x2="110" y2="135" stroke="#475569" stroke-width="2"/>
  <line x1="350" y1="122" x2="350" y2="135" stroke="#475569" stroke-width="2"/>
  <line x1="110" y1="135" x2="208" y2="135" stroke="#475569" stroke-width="2"/>
  <line x1="252" y1="135" x2="350" y2="135" stroke="#475569" stroke-width="2"/>
  <circle cx="230" cy="135" r="22" fill="#fff" stroke="#f59e0b" stroke-width="2"/>
  <text x="222" y="140" font-size="13" fill="#64748b">M</text>
  <path d="M150 135 H230" stroke="#22C0B3" stroke-width="4" fill="none" opacity="0">
    <animate attributeName="opacity" values="0;1;1;0;0" dur="3.2s" repeatCount="indefinite"/>
  </path>
  <path d="M310 135 H230" stroke="#3b82f6" stroke-width="4" fill="none" opacity="0">
    <animate attributeName="opacity" values="0;0;0;1;0" dur="3.2s" repeatCount="indefinite"/>
  </path>
  <text x="60" y="238" fill="#94a3b8" font-size="11">Q1+Q4 → spin forward · Q2+Q3 → spin reverse</text>
</svg>`;

// ── servo sweeping 0–180° ─────────────────────────────────────────────────
export const servoSweep = `
<svg viewBox="0 0 360 240" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <path d="M40 200 A 140 140 0 0 1 320 200" fill="none" stroke="#e2e8f0" stroke-width="2"/>
  <text x="22" y="215" font-size="11" fill="#94a3b8">0°</text>
  <text x="170" y="55" font-size="11" fill="#94a3b8">90°</text>
  <text x="318" y="215" font-size="11" fill="#94a3b8">180°</text>
  <circle cx="180" cy="200" r="14" fill="#22C0B3"/>
  <g>
    <line x1="180" y1="200" x2="180" y2="80" stroke="#0f172a" stroke-width="6" stroke-linecap="round"/>
    <circle cx="180" cy="80" r="7" fill="#f59e0b"/>
    <animateTransform attributeName="transform" type="rotate" values="-90 180 200; 90 180 200; -90 180 200" dur="3.5s" repeatCount="indefinite"/>
  </g>
  <text x="120" y="232" font-size="11" fill="#64748b">write(angle) → arm position</text>
</svg>`;

// ── ultrasonic ping + echo ────────────────────────────────────────────────
export const ultrasonicPing = `
<svg viewBox="0 0 480 200" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="20" y="70" width="70" height="60" rx="8" fill="#fff" stroke="#22C0B3" stroke-width="2"/>
  <text x="30" y="105" font-size="11" fill="#64748b">HC-SR04</text>
  <rect x="380" y="40" width="24" height="120" fill="#e2e8f0" stroke="#94a3b8"/>
  <text x="372" y="180" font-size="11" fill="#94a3b8">wall</text>
  ${[0, 1, 2].map((d) => `
  <path d="M95 100 q 30 -28 0 -56 M95 100 q 30 28 0 56" fill="none" stroke="#3b82f6" stroke-width="2" opacity="0">
    <animateTransform attributeName="transform" type="translate" values="0 0; 270 0" dur="1.6s" begin="${d * 0.5}s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0;0.9;0" dur="1.6s" begin="${d * 0.5}s" repeatCount="indefinite"/>
  </path>`).join('')}
  <text x="150" y="190" font-size="11" fill="#64748b">distance = echo time × speed of sound ÷ 2</text>
</svg>`;

// ── PID: oscillation settling onto the setpoint ───────────────────────────
export const pidConverge = `
<svg viewBox="0 0 520 200" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <line x1="20" y1="90" x2="500" y2="90" stroke="#22C0B3" stroke-width="2" stroke-dasharray="5 5"/>
  <text x="430" y="82" font-size="12" fill="#22C0B3" font-weight="700">setpoint</text>
  <path d="M20 170 C 90 -10 150 170 200 60 S 300 110 340 90 S 440 92 500 90" fill="none" stroke="#f59e0b" stroke-width="3"/>
  <circle r="6" fill="#f59e0b"><animateMotion dur="3.5s" repeatCount="indefinite" path="M20 170 C 90 -10 150 170 200 60 S 300 110 340 90 S 440 92 500 90"/></circle>
  <text x="20" y="195" font-size="11" fill="#64748b">controller corrects the error until the value rests on target</text>
</svg>`;

// ── I2C bus: addressed bytes travel on shared SDA/SCL ─────────────────────
export const i2cBus = `
<svg viewBox="0 0 520 200" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="20" y="30" width="90" height="44" rx="6" fill="#fff" stroke="#475569" stroke-width="2"/><text x="40" y="57" font-size="12" fill="#0f172a">Master</text>
  <line x1="40" y1="95" x2="500" y2="95" stroke="#22C0B3" stroke-width="3"/><text x="505" y="99" font-size="11" fill="#22C0B3">SDA</text>
  <line x1="40" y1="125" x2="500" y2="125" stroke="#f59e0b" stroke-width="3"/><text x="505" y="129" font-size="11" fill="#f59e0b">SCL</text>
  <line x1="60" y1="74" x2="60" y2="95" stroke="#475569" stroke-width="2"/>
  <rect x="240" y="140" width="80" height="36" rx="6" fill="#fff" stroke="#475569" stroke-width="2"/><text x="250" y="162" font-size="10" fill="#0f172a">0x3C OLED</text>
  <rect x="350" y="140" width="80" height="36" rx="6" fill="#fff" stroke="#475569" stroke-width="2"/><text x="360" y="162" font-size="10" fill="#0f172a">0x68 IMU</text>
  <line x1="280" y1="125" x2="280" y2="140" stroke="#475569" stroke-width="2"/>
  <line x1="390" y1="125" x2="390" y2="140" stroke="#475569" stroke-width="2"/>
  ${[0, 1, 2, 3].map((i) => `<rect y="89" width="14" height="12" rx="2" fill="#0ea5a4"><animate attributeName="x" values="50;480" dur="2.4s" begin="${i * 0.4}s" repeatCount="indefinite"/></rect>`).join('')}
  <text x="40" y="195" font-size="11" fill="#64748b">2 shared wires — each device answers to its address</text>
</svg>`;

// ── UART frame: start, data bits, stop highlight in sequence ──────────────
export const uartFrame = `
<svg viewBox="0 0 520 170" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <text x="20" y="30" font-size="13" font-weight="700" fill="#0f172a">UART frame (8N1)</text>
  ${['S', 'b0', 'b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'P'].map((lbl, i) => {
    const x = 20 + i * 48;
    const isEdge = lbl === 'S' || lbl === 'P';
    return `<g>
      <rect x="${x}" y="60" width="44" height="44" rx="6" fill="${isEdge ? '#fee2e2' : '#fff'}" stroke="${isEdge ? '#ef4444' : '#22C0B3'}" stroke-width="2">
        <animate attributeName="fill" values="${isEdge ? '#fee2e2' : '#fff'};#22C0B3;${isEdge ? '#fee2e2' : '#fff'}" dur="0.4s" begin="${i * 0.35}s" repeatCount="indefinite"/>
      </rect>
      <text x="${x + 22}" y="87" text-anchor="middle" font-size="12" fill="#0f172a">${lbl}</text>
    </g>`;
  }).join('')}
  <text x="20" y="135" font-size="11" fill="#64748b">start bit · 8 data bits · stop bit — both sides agree on baud</text>
</svg>`;

// ── PCB layer stack with a pulsing via ────────────────────────────────────
export const pcbStack = `
<svg viewBox="0 0 480 200" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="60" y="40" width="360" height="12" fill="#fde68a" stroke="#b45309"/><text x="428" y="50" font-size="11" fill="#64748b">Silkscreen</text>
  <rect x="60" y="52" width="360" height="9" fill="#16a34a"/><text x="428" y="61" font-size="11" fill="#64748b">Soldermask</text>
  <rect x="60" y="61" width="360" height="13" fill="#d97706"/><text x="428" y="73" font-size="11" fill="#64748b">Copper (top)</text>
  <rect x="60" y="74" width="360" height="44" fill="#a16207"/><text x="428" y="100" font-size="11" fill="#64748b">FR-4 core</text>
  <rect x="60" y="118" width="360" height="13" fill="#d97706"/><text x="428" y="130" font-size="11" fill="#64748b">Copper (bottom)</text>
  <rect x="60" y="131" width="360" height="9" fill="#16a34a"/>
  <rect x="210" y="61" width="10" height="70" fill="#fbbf24" stroke="#92400e">
    <animate attributeName="fill" values="#fbbf24;#22C0B3;#fbbf24" dur="2s" repeatCount="indefinite"/>
  </rect>
  <text x="150" y="170" font-size="11" fill="#64748b">a plated via connects top &amp; bottom copper</text>
</svg>`;

// ── IR sensor module — realistic labelled illustration (no clean photo on Commons) ──
export const irModule = `
<svg viewBox="0 0 300 210" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="40" y="18" width="220" height="150" rx="10" fill="#0b6b63" stroke="#073f3a" stroke-width="2"/>
  <circle cx="58" cy="36" r="6" fill="#0b3d36" stroke="#cbd5e1" stroke-width="1.5"/>
  <circle cx="242" cy="36" r="6" fill="#0b3d36" stroke="#cbd5e1" stroke-width="1.5"/>
  <circle cx="118" cy="74" r="17" fill="#bfdbfe" stroke="#1e3a8a" stroke-width="2"/>
  <text x="92" y="108" font-size="10" fill="#e2f5f2">emitter</text>
  <circle cx="182" cy="74" r="17" fill="#1f2937" stroke="#000" stroke-width="2"/>
  <text x="160" y="108" font-size="10" fill="#e2f5f2">receiver</text>
  <rect x="135" y="120" width="30" height="30" rx="3" fill="#1d4ed8" stroke="#1e3a8a"/>
  <path d="M150 126 V144 M141 135 H159" stroke="#fff" stroke-width="2"/>
  <text x="172" y="140" font-size="9" fill="#e2f5f2">trim pot</text>
  <circle cx="78" cy="135" r="5" fill="#22c55e"><animate attributeName="opacity" values="0.3;1;0.3" dur="1.4s" repeatCount="indefinite"/></circle>
  <text x="62" y="158" font-size="8" fill="#e2f5f2">PWR</text>
  ${['VCC', 'OUT', 'GND'].map((l, i) => `
  <rect x="${118 + i * 24}" y="168" width="10" height="22" fill="#f5c542" stroke="#a16207"/>
  <text x="${123 + i * 24}" y="204" text-anchor="middle" font-size="9" fill="#0f172a" font-weight="700">${l}</text>`).join('')}
</svg>`;

// ── IR reflectance: white reflects (detected), black absorbs (not detected) ──
export const irReflectance = `
<svg viewBox="0 0 380 230" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="110" y="20" width="40" height="26" rx="4" fill="#bfdbfe" stroke="#1e3a8a" stroke-width="2"/>
  <text x="104" y="62" font-size="10" fill="#64748b">emitter</text>
  <rect x="200" y="20" width="40" height="26" rx="4" fill="#1f2937" stroke="#000" stroke-width="2"/>
  <text x="196" y="62" font-size="10" fill="#64748b">receiver</text>
  <rect x="40" y="170" width="300" height="30" rx="4" stroke="#94a3b8" stroke-width="2">
    <animate attributeName="fill" values="#ffffff;#ffffff;#111111;#111111" dur="4s" repeatCount="indefinite"/>
  </rect>
  <text x="46" y="222" font-size="11" fill="#64748b">surface: </text>
  <text x="96" y="222" font-size="11" font-weight="700">
    <animate attributeName="fill" values="#16a34a;#16a34a;#dc2626;#dc2626" dur="4s" repeatCount="indefinite"/>
    <tspan>WHITE → reflects</tspan>
    <animate attributeName="opacity" values="1;1;0;0" dur="4s" repeatCount="indefinite"/>
  </text>
  <text x="96" y="222" font-size="11" font-weight="700" fill="#dc2626">
    <tspan>BLACK → absorbs</tspan>
    <animate attributeName="opacity" values="0;0;1;1" dur="4s" repeatCount="indefinite"/>
  </text>
  <line x1="130" y1="48" x2="160" y2="168" stroke="#f59e0b" stroke-width="3"/>
  <line x1="170" y1="168" x2="218" y2="48" stroke="#22c55e" stroke-width="3">
    <animate attributeName="opacity" values="1;1;0.05;0.05" dur="4s" repeatCount="indefinite"/>
  </line>
  <circle cx="290" cy="33" r="10">
    <animate attributeName="fill" values="#22c55e;#22c55e;#dc2626;#dc2626" dur="4s" repeatCount="indefinite"/>
  </circle>
  <text x="305" y="37" font-size="10" fill="#64748b">OUT</text>
</svg>`;

// ── line-following robot tracking a black line with IR ──
export const lineFollower = `
<svg viewBox="0 0 440 250" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="0" y="0" width="440" height="250" fill="#f8fafc"/>
  <path d="M30 210 C 130 210 110 70 210 70 S 300 200 410 130" fill="none" stroke="#0f172a" stroke-width="12" stroke-linecap="round"/>
  <g>
    <rect x="-24" y="-18" width="48" height="36" rx="7" fill="#22C0B3" stroke="#0b6b63" stroke-width="2"/>
    <rect x="-26" y="-22" width="12" height="8" rx="2" fill="#0f172a"/>
    <rect x="-26" y="14" width="12" height="8" rx="2" fill="#0f172a"/>
    <rect x="14" y="-22" width="12" height="8" rx="2" fill="#0f172a"/>
    <rect x="14" y="14" width="12" height="8" rx="2" fill="#0f172a"/>
    <circle cx="20" cy="-7" r="3.2" fill="#ef4444"/>
    <circle cx="20" cy="0" r="3.2" fill="#ef4444"/>
    <circle cx="20" cy="7" r="3.2" fill="#ef4444"/>
    <animateMotion dur="7s" repeatCount="indefinite" rotate="auto"
      path="M30 210 C 130 210 110 70 210 70 S 300 200 410 130"/>
  </g>
  <text x="120" y="240" font-size="11" fill="#64748b">IR sensors read the line; the bot steers to stay centred</text>
</svg>`;

// ── SPI: full-duplex, clocked, one CS per device ──
export const spiBus = `
<svg viewBox="0 0 520 210" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="20" y="60" width="90" height="90" rx="8" fill="#fff" stroke="#475569" stroke-width="2"/><text x="38" y="110" font-size="12" fill="#0f172a">Master</text>
  <rect x="410" y="60" width="90" height="90" rx="8" fill="#fff" stroke="#475569" stroke-width="2"/><text x="432" y="110" font-size="12" fill="#0f172a">Slave</text>
  <line x1="110" y1="75" x2="410" y2="75" stroke="#22C0B3" stroke-width="2"/><text x="220" y="70" font-size="10" fill="#22C0B3">MOSI →</text>
  <line x1="110" y1="105" x2="410" y2="105" stroke="#3b82f6" stroke-width="2"/><text x="220" y="100" font-size="10" fill="#3b82f6">← MISO</text>
  <line x1="110" y1="135" x2="410" y2="135" stroke="#f59e0b" stroke-width="2"/><text x="220" y="130" font-size="10" fill="#f59e0b">SCK</text>
  ${[0, 1, 2].map((i) => `<rect y="70" width="12" height="10" rx="2" fill="#0ea5a4"><animate attributeName="x" values="110;398" dur="1.8s" begin="${i * 0.6}s" repeatCount="indefinite"/></rect>`).join('')}
  ${[0, 1, 2].map((i) => `<rect y="100" width="12" height="10" rx="2" fill="#3b82f6"><animate attributeName="x" values="398;110" dur="1.8s" begin="${i * 0.6 + 0.3}s" repeatCount="indefinite"/></rect>`).join('')}
  ${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="${130 + i * 45}" y="130" width="8" height="10" fill="#f59e0b"><animate attributeName="opacity" values="0.2;1;0.2" dur="0.5s" begin="${i * 0.25}s" repeatCount="indefinite"/></rect>`).join('')}
  <text x="150" y="180" font-size="11" fill="#64748b">data flows BOTH ways on every clock tick</text>
</svg>`;

// ── relay: small coil current switches a big load ──
export const relayClick = `
<svg viewBox="0 0 420 220" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="40" y="80" width="60" height="70" rx="4" fill="#eef2ff" stroke="#6366f1" stroke-width="2"/>
  ${[0, 1, 2, 3].map((i) => `<line x1="44" y1="${92 + i * 14}" x2="96" y2="${92 + i * 14}" stroke="#6366f1" stroke-width="2"/>`).join('')}
  <text x="50" y="170" font-size="10" fill="#64748b">coil</text>
  <circle cx="70" cy="60" r="7" fill="#f59e0b"><animate attributeName="opacity" values="0.2;1;1;0.2" dur="3s" repeatCount="indefinite"/></circle>
  <text x="20" y="50" font-size="10" fill="#64748b">signal</text>
  <circle cx="180" cy="150" r="5" fill="#0f172a"/><text x="150" y="170" font-size="10" fill="#64748b">COM</text>
  <line x1="280" y1="95" x2="300" y2="95" stroke="#94a3b8" stroke-width="3"/><text x="305" y="99" font-size="10" fill="#94a3b8">NC</text>
  <line x1="280" y1="150" x2="300" y2="150" stroke="#0f172a" stroke-width="3"/><text x="305" y="154" font-size="10" fill="#64748b">NO</text>
  <g>
    <line x1="180" y1="150" x2="285" y2="95" stroke="#0f172a" stroke-width="4" stroke-linecap="round"/>
    <animateTransform attributeName="transform" type="rotate" values="0 180 150;0 180 150;28 180 150;28 180 150;0 180 150" dur="3s" repeatCount="indefinite"/>
  </g>
  <circle cx="360" cy="150" r="16" fill="#fde047" stroke="#ca8a04" stroke-width="2">
    <animate attributeName="opacity" values="0.25;0.25;1;1;0.25" dur="3s" repeatCount="indefinite"/>
  </circle>
  <line x1="316" y1="150" x2="344" y2="150" stroke="#0f172a" stroke-width="2"/>
  <text x="120" y="205" font-size="11" fill="#64748b">energise the coil → armature snaps to NO → the lamp (big load) turns on</text>
</svg>`;

// ── OLED SSD1306 module — illustration with animated screen content ──
export const oledDisplay = `
<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="60" y="20" width="200" height="150" rx="8" fill="#0b6b63" stroke="#073f3a" stroke-width="2"/>
  <rect x="80" y="50" width="160" height="84" rx="4" fill="#0b1120" stroke="#1f2937" stroke-width="2"/>
  <text x="96" y="84" font-size="16" fill="#38bdf8" font-family="monospace" font-weight="700">
    Hello!
    <animate attributeName="opacity" values="1;1;0;0" dur="3s" repeatCount="indefinite"/>
  </text>
  <text x="96" y="84" font-size="14" fill="#22C0B3" font-family="monospace" font-weight="700">
    25.4 C
    <animate attributeName="opacity" values="0;0;1;1" dur="3s" repeatCount="indefinite"/>
  </text>
  <rect x="96" y="100" width="120" height="8" rx="4" fill="#1f2937"/>
  <rect x="96" y="100" height="8" rx="4" fill="#22C0B3"><animate attributeName="width" values="10;120;10" dur="3s" repeatCount="indefinite"/></rect>
  ${['VCC', 'GND', 'SCL', 'SDA'].map((l, i) => `
  <rect x="${96 + i * 36}" y="170" width="10" height="20" fill="#f5c542" stroke="#a16207"/>
  <text x="${101 + i * 36}" y="166" text-anchor="middle" font-size="8" fill="#e2f5f2">${l}</text>`).join('')}
  <text x="118" y="40" font-size="9" fill="#e2f5f2">0.96" I2C OLED · addr 0x3C</text>
</svg>`;

// ── resistor colour-code: cycles through 220Ω / 1kΩ / 10kΩ ──
export const resistorBands = `
<svg viewBox="0 0 440 200" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <line x1="20" y1="100" x2="120" y2="100" stroke="#9ca3af" stroke-width="4"/>
  <line x1="320" y1="100" x2="420" y2="100" stroke="#9ca3af" stroke-width="4"/>
  <rect x="120" y="70" width="200" height="60" rx="26" fill="#e7d3a1" stroke="#b8a06a" stroke-width="2"/>
  <rect x="150" y="70" width="16" height="60" fill="#CC1111"><animate attributeName="fill" values="#CC1111;#7B3F00;#7B3F00" dur="6s" calcMode="discrete" repeatCount="indefinite"/></rect>
  <rect x="178" y="70" width="16" height="60" fill="#CC1111"><animate attributeName="fill" values="#CC1111;#1C1C1C;#1C1C1C" dur="6s" calcMode="discrete" repeatCount="indefinite"/></rect>
  <rect x="218" y="70" width="16" height="60" fill="#7B3F00"><animate attributeName="fill" values="#7B3F00;#CC1111;#E05C00" dur="6s" calcMode="discrete" repeatCount="indefinite"/></rect>
  <rect x="280" y="70" width="16" height="60" fill="#CFB53B"/>
  <text x="146" y="58" font-size="9" fill="#64748b">1st</text>
  <text x="174" y="58" font-size="9" fill="#64748b">2nd</text>
  <text x="210" y="58" font-size="9" fill="#64748b">×mult</text>
  <text x="272" y="58" font-size="9" fill="#64748b">tol</text>
  <text x="220" y="165" text-anchor="middle" font-size="22" font-weight="800" fill="#0f172a">
    <animate attributeName="opacity" values="1;1;0;0;0;0" dur="6s" repeatCount="indefinite"/>220 Ω</text>
  <text x="220" y="165" text-anchor="middle" font-size="22" font-weight="800" fill="#0f172a">
    <animate attributeName="opacity" values="0;0;1;1;0;0" dur="6s" repeatCount="indefinite"/>1 kΩ</text>
  <text x="220" y="165" text-anchor="middle" font-size="22" font-weight="800" fill="#0f172a">
    <animate attributeName="opacity" values="0;0;0;0;1;1" dur="6s" repeatCount="indefinite"/>10 kΩ</text>
</svg>`;

// ── Ohm's law triangle: highlights the variable you solve for ──
export const ohmsTriangle = `
<svg viewBox="0 0 360 230" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <polygon points="180,30 320,200 40,200" fill="#f8fafc" stroke="#22C0B3" stroke-width="3"/>
  <line x1="110" y1="120" x2="250" y2="120" stroke="#22C0B3" stroke-width="3"/>
  <line x1="180" y1="120" x2="180" y2="200" stroke="#22C0B3" stroke-width="3"/>
  <rect x="120" y="40" width="120" height="74" rx="6" opacity="0">
    <animate attributeName="opacity" values="0.18;0.18;0;0;0;0" dur="6s" repeatCount="indefinite"/>
    <animate attributeName="fill" values="#22C0B3" dur="6s" repeatCount="indefinite"/></rect>
  <rect x="60" y="124" width="116" height="72" rx="6" fill="#f59e0b" opacity="0"><animate attributeName="opacity" values="0;0;0.18;0.18;0;0" dur="6s" repeatCount="indefinite"/></rect>
  <rect x="184" y="124" width="116" height="72" rx="6" fill="#3b82f6" opacity="0"><animate attributeName="opacity" values="0;0;0;0;0.18;0.18" dur="6s" repeatCount="indefinite"/></rect>
  <text x="180" y="90" text-anchor="middle" font-size="34" font-weight="800" fill="#0f172a">V</text>
  <text x="118" y="175" text-anchor="middle" font-size="30" font-weight="800" fill="#0f172a">I</text>
  <text x="244" y="175" text-anchor="middle" font-size="30" font-weight="800" fill="#0f172a">R</text>
  <text x="180" y="222" text-anchor="middle" font-size="15" font-weight="700" fill="#0f172a">
    <animate attributeName="opacity" values="1;1;0;0;0;0" dur="6s" repeatCount="indefinite"/>V = I × R</text>
  <text x="180" y="222" text-anchor="middle" font-size="15" font-weight="700" fill="#b45309">
    <animate attributeName="opacity" values="0;0;1;1;0;0" dur="6s" repeatCount="indefinite"/>I = V ÷ R</text>
  <text x="180" y="222" text-anchor="middle" font-size="15" font-weight="700" fill="#1d4ed8">
    <animate attributeName="opacity" values="0;0;0;0;1;1" dur="6s" repeatCount="indefinite"/>R = V ÷ I</text>
</svg>`;

// ── capacitor charging curve (RC), with the cap filling up ──
export const capacitorCharge = `
<svg viewBox="0 0 440 220" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <line x1="50" y1="30" x2="50" y2="180" stroke="#cbd5e1" stroke-width="1.5"/>
  <line x1="50" y1="180" x2="320" y2="180" stroke="#cbd5e1" stroke-width="1.5"/>
  <text x="14" y="44" font-size="10" fill="#64748b">V</text>
  <text x="300" y="196" font-size="10" fill="#64748b">time</text>
  <line x1="50" y1="50" x2="320" y2="50" stroke="#94a3b8" stroke-width="1" stroke-dasharray="4 4"/>
  <text x="324" y="54" font-size="9" fill="#94a3b8">Vmax</text>
  <line x1="50" y1="98" x2="130" y2="98" stroke="#22C0B3" stroke-width="1" stroke-dasharray="3 3"/>
  <text x="324" y="118" font-size="9" fill="#22C0B3">63% at 1τ</text>
  <path d="M50 180 C 110 70 180 54 320 50" fill="none" stroke="#22C0B3" stroke-width="3"/>
  <circle r="6" fill="#22C0B3"><animateMotion dur="3s" repeatCount="indefinite" path="M50 180 C 110 70 180 54 320 50"/></circle>
  <rect x="370" y="40" width="34" height="140" rx="4" fill="#e2e8f0"/>
  <rect x="370" y="40" width="34" height="140" rx="4" fill="#22C0B3"><animate attributeName="height" values="6;140;6" dur="3s" repeatCount="indefinite"/><animate attributeName="y" values="174;40;174" dur="3s" repeatCount="indefinite"/></rect>
  <text x="360" y="198" font-size="10" fill="#64748b">cap charge</text>
</svg>`;

// ── NOT gate from one transistor (inverter): IN high → OUT low ──
export const notGateTransistor = `
<svg viewBox="0 0 460 250" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <text x="288" y="20" font-size="11" fill="#10b981" font-weight="700">+5V</text>
  <line x1="300" y1="24" x2="300" y2="42" stroke="#475569" stroke-width="2"/>
  <rect x="288" y="42" width="24" height="34" rx="3" fill="#fff" stroke="#f59e0b" stroke-width="2"/>
  <text x="316" y="64" font-size="9" fill="#64748b">R</text>
  <line x1="300" y1="76" x2="300" y2="118" stroke="#475569" stroke-width="2"/>
  <circle cx="300" cy="104" r="3" fill="#0f172a"/>
  <line x1="300" y1="104" x2="360" y2="104" stroke="#475569" stroke-width="2"/>
  <path d="M300 104 V125 M300 165 V186" stroke="#22c55e" stroke-width="4" opacity="0">
    <animate attributeName="opacity" values="0;0.9" dur="4s" calcMode="discrete" repeatCount="indefinite"/>
  </path>
  <circle cx="300" cy="145" r="22" fill="none" stroke="#cbd5e1" stroke-width="2.5">
    <animate attributeName="stroke" values="#cbd5e1;#22c55e" dur="4s" calcMode="discrete" repeatCount="indefinite"/>
  </circle>
  <line x1="300" y1="123" x2="300" y2="133" stroke="#475569" stroke-width="2"/>
  <line x1="288" y1="145" x2="300" y2="133" stroke="#475569" stroke-width="2"/>
  <line x1="288" y1="145" x2="300" y2="157" stroke="#475569" stroke-width="2"/>
  <polygon points="296,150 300,158 304,150" fill="#475569"/>
  <line x1="300" y1="157" x2="300" y2="186" stroke="#475569" stroke-width="2"/>
  <line x1="288" y1="186" x2="312" y2="186" stroke="#475569" stroke-width="2.5"/>
  <text x="296" y="200" font-size="9" fill="#94a3b8">GND</text>
  <line x1="160" y1="145" x2="288" y2="145" stroke="#475569" stroke-width="2"/>
  <rect x="200" y="137" width="24" height="16" rx="2" fill="#fff" stroke="#f59e0b" stroke-width="1.5"/>
  <circle cx="150" cy="145" r="14" fill="#cbd5e1"><animate attributeName="fill" values="#cbd5e1;#22c55e" dur="4s" calcMode="discrete" repeatCount="indefinite"/></circle>
  <text x="143" y="150" font-size="13" font-weight="700" fill="#fff">A</text>
  <text x="135" y="178" font-size="10" fill="#64748b">input</text>
  <circle cx="385" cy="104" r="15" fill="#22c55e"><animate attributeName="fill" values="#22c55e;#cbd5e1" dur="4s" calcMode="discrete" repeatCount="indefinite"/></circle>
  <text x="412" y="108" font-size="11" fill="#64748b">OUT</text>
  <text x="40" y="40" font-size="13" font-weight="800" fill="#0f172a">NOT (inverter)</text>
  <text x="40" y="60" font-size="11" fill="#64748b">1 transistor · OUT = NOT A</text>
  <text x="40" y="225" font-size="11" fill="#94a3b8">A=0 → OUT=1   ·   A=1 → OUT=0   (green = HIGH/1)</text>
</svg>`;

// ── NOR gate: two transistors in PARALLEL — OUT high only when both inputs low ──
export const norGateTransistor = `
<svg viewBox="0 0 460 250" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <text x="288" y="18" font-size="11" fill="#10b981" font-weight="700">+5V</text>
  <line x1="300" y1="22" x2="300" y2="38" stroke="#475569" stroke-width="2"/>
  <rect x="288" y="38" width="24" height="30" rx="3" fill="#fff" stroke="#f59e0b" stroke-width="2"/>
  <line x1="300" y1="68" x2="300" y2="92" stroke="#475569" stroke-width="2"/>
  <circle cx="300" cy="92" r="3" fill="#0f172a"/>
  <line x1="300" y1="92" x2="365" y2="92" stroke="#475569" stroke-width="2"/>
  <circle cx="390" cy="92" r="15" fill="#22c55e"><animate attributeName="fill" values="#22c55e;#cbd5e1;#cbd5e1;#cbd5e1" dur="8s" calcMode="discrete" repeatCount="indefinite"/></circle>
  <text x="378" y="124" font-size="10" fill="#64748b">OUT</text>
  <line x1="250" y1="92" x2="350" y2="92" stroke="#475569" stroke-width="2"/>
  <circle cx="250" cy="150" r="20" fill="none" stroke="#cbd5e1" stroke-width="2.5"><animate attributeName="stroke" values="#cbd5e1;#cbd5e1;#22c55e;#22c55e" dur="8s" calcMode="discrete" repeatCount="indefinite"/></circle>
  <line x1="250" y1="92" x2="250" y2="132" stroke="#475569" stroke-width="2"/>
  <line x1="250" y1="168" x2="250" y2="205" stroke="#475569" stroke-width="2"/>
  <line x1="220" y1="150" x2="232" y2="150" stroke="#475569" stroke-width="2"/>
  <circle cx="350" cy="150" r="20" fill="none" stroke="#cbd5e1" stroke-width="2.5"><animate attributeName="stroke" values="#cbd5e1;#22c55e;#cbd5e1;#22c55e" dur="8s" calcMode="discrete" repeatCount="indefinite"/></circle>
  <line x1="350" y1="92" x2="350" y2="132" stroke="#475569" stroke-width="2"/>
  <line x1="350" y1="168" x2="350" y2="205" stroke="#475569" stroke-width="2"/>
  <line x1="320" y1="150" x2="332" y2="150" stroke="#475569" stroke-width="2"/>
  <line x1="180" y1="205" x2="420" y2="205" stroke="#475569" stroke-width="2"/>
  <text x="250" y="225" font-size="9" fill="#94a3b8">GND</text>
  <circle cx="150" cy="150" r="14" fill="#cbd5e1"><animate attributeName="fill" values="#cbd5e1;#cbd5e1;#22c55e;#22c55e" dur="8s" calcMode="discrete" repeatCount="indefinite"/></circle>
  <text x="145" y="155" font-size="12" font-weight="700" fill="#fff">A</text>
  <line x1="164" y1="150" x2="220" y2="150" stroke="#475569" stroke-width="2"/>
  <circle cx="150" cy="185" r="14" fill="#cbd5e1"><animate attributeName="fill" values="#cbd5e1;#22c55e;#cbd5e1;#22c55e" dur="8s" calcMode="discrete" repeatCount="indefinite"/></circle>
  <text x="145" y="190" font-size="12" font-weight="700" fill="#fff">B</text>
  <path d="M164 185 H300 V168" stroke="#475569" stroke-width="2" fill="none"/>
  <text x="40" y="40" font-size="13" font-weight="800" fill="#0f172a">NOR</text>
  <text x="40" y="60" font-size="11" fill="#64748b">2 in parallel</text>
  <text x="40" y="78" font-size="11" fill="#64748b">OUT = 1 only</text>
  <text x="40" y="94" font-size="11" fill="#64748b">if A=0 AND B=0</text>
</svg>`;

// ── NAND gate: two transistors in SERIES — OUT low only when both inputs high ──
export const nandGateTransistor = `
<svg viewBox="0 0 460 250" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <text x="288" y="16" font-size="11" fill="#10b981" font-weight="700">+5V</text>
  <line x1="300" y1="20" x2="300" y2="34" stroke="#475569" stroke-width="2"/>
  <rect x="288" y="34" width="24" height="26" rx="3" fill="#fff" stroke="#f59e0b" stroke-width="2"/>
  <line x1="300" y1="60" x2="300" y2="80" stroke="#475569" stroke-width="2"/>
  <circle cx="300" cy="80" r="3" fill="#0f172a"/>
  <line x1="300" y1="80" x2="365" y2="80" stroke="#475569" stroke-width="2"/>
  <circle cx="390" cy="80" r="15" fill="#cbd5e1"><animate attributeName="fill" values="#22c55e;#22c55e;#22c55e;#cbd5e1" dur="8s" calcMode="discrete" repeatCount="indefinite"/></circle>
  <text x="378" y="112" font-size="10" fill="#64748b">OUT</text>
  <circle cx="300" cy="112" r="20" fill="none" stroke="#cbd5e1" stroke-width="2.5"><animate attributeName="stroke" values="#cbd5e1;#cbd5e1;#22c55e;#22c55e" dur="8s" calcMode="discrete" repeatCount="indefinite"/></circle>
  <line x1="300" y1="80" x2="300" y2="94" stroke="#475569" stroke-width="2"/>
  <line x1="300" y1="130" x2="300" y2="150" stroke="#475569" stroke-width="2"/>
  <line x1="270" y1="112" x2="282" y2="112" stroke="#475569" stroke-width="2"/>
  <circle cx="300" cy="172" r="20" fill="none" stroke="#cbd5e1" stroke-width="2.5"><animate attributeName="stroke" values="#cbd5e1;#22c55e;#cbd5e1;#22c55e" dur="8s" calcMode="discrete" repeatCount="indefinite"/></circle>
  <line x1="300" y1="150" x2="300" y2="154" stroke="#475569" stroke-width="2"/>
  <line x1="300" y1="190" x2="300" y2="210" stroke="#475569" stroke-width="2"/>
  <line x1="270" y1="172" x2="282" y2="172" stroke="#475569" stroke-width="2"/>
  <line x1="288" y1="210" x2="312" y2="210" stroke="#475569" stroke-width="2.5"/>
  <text x="296" y="225" font-size="9" fill="#94a3b8">GND</text>
  <circle cx="200" cy="112" r="14" fill="#cbd5e1"><animate attributeName="fill" values="#cbd5e1;#cbd5e1;#22c55e;#22c55e" dur="8s" calcMode="discrete" repeatCount="indefinite"/></circle>
  <text x="195" y="117" font-size="12" font-weight="700" fill="#fff">A</text>
  <line x1="214" y1="112" x2="270" y2="112" stroke="#475569" stroke-width="2"/>
  <circle cx="200" cy="172" r="14" fill="#cbd5e1"><animate attributeName="fill" values="#cbd5e1;#22c55e;#cbd5e1;#22c55e" dur="8s" calcMode="discrete" repeatCount="indefinite"/></circle>
  <text x="195" y="177" font-size="12" font-weight="700" fill="#fff">B</text>
  <line x1="214" y1="172" x2="270" y2="172" stroke="#475569" stroke-width="2"/>
  <text x="40" y="40" font-size="13" font-weight="800" fill="#0f172a">NAND</text>
  <text x="40" y="60" font-size="11" fill="#64748b">2 in series</text>
  <text x="40" y="78" font-size="11" fill="#64748b">OUT = 0 only</text>
  <text x="40" y="94" font-size="11" fill="#64748b">if A=1 AND B=1</text>
</svg>`;
