import type {
  PlacedComponent,
  Wire,
  SimulationState,
  SimComponentState,
} from './types';
import { COMPONENT_MAP } from './components-data';

// ─── Node Voltage Analysis ──────────────────────────────────────────────────

/**
 * Represents a "node" in the circuit — a set of pin endpoints all connected
 * to each other by wires. Every pin belongs to exactly one node.
 */
interface Node {
  id: number;
  pins: Array<{ instanceId: string; pinId: string }>;
  voltage: number;
  isGround: boolean;
  isPower: boolean;
}

function buildNodes(
  components: PlacedComponent[],
  wires: Wire[],
): Node[] {
  // Union-find to group connected pins
  const parent: Record<string, string> = {};

  const key = (instanceId: string, pinId: string) => `${instanceId}::${pinId}`;

  // Initialize each pin as its own group
  for (const comp of components) {
    const def = COMPONENT_MAP[comp.definitionId];
    if (!def) continue;
    for (const pin of def.pins) {
      const k = key(comp.instanceId, pin.id);
      parent[k] = k;
    }
  }

  function find(x: string): string {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  }
  function union(a: string, b: string) {
    parent[find(a)] = find(b);
  }

  // Union pins connected by wires
  for (const wire of wires) {
    const a = key(wire.fromInstanceId, wire.fromPinId);
    const b = key(wire.toInstanceId, wire.toPinId);
    if (parent[a] !== undefined && parent[b] !== undefined) {
      union(a, b);
    }
  }

  // Group pins into nodes
  const nodeMap: Record<string, Node> = {};
  let nodeId = 0;

  for (const comp of components) {
    const def = COMPONENT_MAP[comp.definitionId];
    if (!def) continue;
    for (const pin of def.pins) {
      const k = key(comp.instanceId, pin.id);
      const root = find(k);
      if (!nodeMap[root]) {
        nodeMap[root] = {
          id: nodeId++,
          pins: [],
          voltage: 0,
          isGround: false,
          isPower: false,
        };
      }
      nodeMap[root].pins.push({ instanceId: comp.instanceId, pinId: pin.id });
    }
  }

  const nodes = Object.values(nodeMap);

  // ─── Assign voltages ───────────────────────────────────────────────────────
  // Pass 1: identify GND nodes
  for (const node of nodes) {
    for (const { instanceId, pinId } of node.pins) {
      const comp = components.find(c => c.instanceId === instanceId);
      if (!comp) continue;
      const def = COMPONENT_MAP[comp.definitionId];
      const pin = def?.pins.find(p => p.id === pinId);
      if (pin?.type === 'ground' || comp.definitionId === 'ground') {
        node.isGround = true;
        node.voltage = 0;
      }
    }
  }

  // Pass 2: identify power/VCC nodes and assign voltages
  for (const node of nodes) {
    if (node.isGround) continue;
    for (const { instanceId, pinId } of node.pins) {
      const comp = components.find(c => c.instanceId === instanceId);
      if (!comp) continue;
      const def = COMPONENT_MAP[comp.definitionId];
      const pin = def?.pins.find(p => p.id === pinId);

      if (comp.definitionId === 'battery' && pinId === 'pos') {
        node.voltage = Number(comp.properties.voltage ?? 9);
        node.isPower = true;
      } else if (comp.definitionId === 'power_supply' && pinId === 'vcc') {
        node.voltage = Number(comp.properties.voltage ?? 5);
        node.isPower = true;
      } else if (
        comp.definitionId === 'arduino_uno' &&
        (pinId === '5v' || pinId === '3v3')
      ) {
        node.voltage = pinId === '5v' ? 5 : 3.3;
        node.isPower = true;
      } else if (pin?.type === 'power') {
        // If this power pin is on a component driven by another power node,
        // propagate (simplified: mark as 5V placeholder for now)
        if (!node.isPower) {
          node.voltage = 5;
          node.isPower = true;
        }
      }
    }
  }

  return nodes;
}

function findNodeForPin(
  nodes: Node[],
  instanceId: string,
  pinId: string,
): Node | undefined {
  return nodes.find(n =>
    n.pins.some(p => p.instanceId === instanceId && p.pinId === pinId),
  );
}

// ─── Component State Evaluation ────────────────────────────────────────────

function defaultState(): SimComponentState {
  return {
    active: false,
    brightness: 0,
    spinning: false,
    high: false,
    voltage: 0,
    current: 0,
    value: 512,
  };
}

export function runSimulation(
  components: PlacedComponent[],
  wires: Wire[],
  _simulationTime: number,
  arduinoOutputs?: Record<string, number>, // pin id → voltage from Arduino code
): SimulationState {
  const nodes = buildNodes(components, wires);
  const state: SimulationState = {};

  for (const comp of components) {
    const def = COMPONENT_MAP[comp.definitionId];
    if (!def) continue;

    const s = defaultState();

    const pinVoltage = (pinId: string): number => {
      const node = findNodeForPin(nodes, comp.instanceId, pinId);
      return node?.voltage ?? 0;
    };

    // ── Arduino outputs override node voltages for driven pins ──────────────
    if (arduinoOutputs) {
      for (const [pinId, voltage] of Object.entries(arduinoOutputs)) {
        const node = findNodeForPin(nodes, comp.instanceId, pinId);
        if (node) node.voltage = voltage;
      }
    }

    switch (comp.definitionId) {
      // ── Battery / Power supply ───────────────────────────────────────────
      case 'battery':
      case 'power_supply': {
        s.active = true;
        s.voltage = Number(comp.properties.voltage ?? (comp.definitionId === 'battery' ? 9 : 5));
        break;
      }

      // ── Ground ──────────────────────────────────────────────────────────
      case 'ground': {
        s.active = true;
        s.voltage = 0;
        break;
      }

      // ── Resistor ──────────────────────────────────────────────────────
      case 'resistor': {
        const va = pinVoltage('a');
        const vb = pinVoltage('b');
        const resistance = Number(comp.properties.resistance ?? 220);
        const vDrop = Math.abs(va - vb);
        s.current = (resistance > 0 ? (vDrop / resistance) * 1000 : 0); // mA
        s.active = vDrop > 0;
        s.voltage = vDrop;
        break;
      }

      // ── LED ───────────────────────────────────────────────────────────
      case 'led': {
        const vAnode = pinVoltage('anode');
        const vCathode = pinVoltage('cathode');
        const vForward = Number(comp.properties.forwardVoltage ?? 1.8);
        const vDrop = vAnode - vCathode;
        if (vDrop >= vForward) {
          // Estimate series resistance from the circuit (simplified: assume 220Ω context)
          const iApprox = Math.min(1, (vDrop - vForward) / 220); // normalised
          s.active = true;
          s.brightness = Math.min(1, iApprox * 50);   // scale nicely
          s.current = iApprox * 1000;
        }
        break;
      }

      // ── Push Button ───────────────────────────────────────────────────
      case 'push_button': {
        const pressed = Boolean(comp.properties.pressed ?? false);
        s.active = pressed;
        // When pressed, both pins are at same voltage (short circuit)
        if (pressed) {
          const v1 = pinVoltage('p1');
          const v2 = pinVoltage('p2');
          s.voltage = Math.max(v1, v2);
          // Propagate: find min-voltage node and raise it
          const nodeP1 = findNodeForPin(nodes, comp.instanceId, 'p1');
          const nodeP2 = findNodeForPin(nodes, comp.instanceId, 'p2');
          if (nodeP1 && nodeP2) {
            const v = Math.max(nodeP1.voltage, nodeP2.voltage);
            nodeP1.voltage = v;
            nodeP2.voltage = v;
          }
        }
        break;
      }

      // ── Switch ────────────────────────────────────────────────────────
      case 'switch': {
        const closed = Boolean(comp.properties.closed ?? false);
        s.active = closed;
        if (closed) {
          const nodeCom = findNodeForPin(nodes, comp.instanceId, 'com');
          const nodeNo  = findNodeForPin(nodes, comp.instanceId, 'no');
          if (nodeCom && nodeNo) {
            const v = Math.max(nodeCom.voltage, nodeNo.voltage);
            nodeCom.voltage = v;
            nodeNo.voltage  = v;
          }
        }
        break;
      }

      // ── Potentiometer ─────────────────────────────────────────────────
      case 'potentiometer': {
        const vccV = pinVoltage('vcc');
        const gndV = pinVoltage('gnd');
        const wipPos = Number(comp.properties.value ?? 0.5); // 0–1
        s.voltage = gndV + (vccV - gndV) * wipPos;
        s.value = Math.round(wipPos * 1023);
        s.active = true;
        // Propagate wiper voltage
        const nodeWiper = findNodeForPin(nodes, comp.instanceId, 'wiper');
        if (nodeWiper) nodeWiper.voltage = s.voltage;
        break;
      }

      // ── Diode ─────────────────────────────────────────────────────────
      case 'diode': {
        const vA = pinVoltage('anode');
        const vK = pinVoltage('cathode');
        s.active = vA - vK > 0.7;
        s.current = s.active ? ((vA - vK - 0.7) / 10) * 1000 : 0;
        break;
      }

      // ── NPN Transistor ────────────────────────────────────────────────
      case 'npn_transistor': {
        const vBase    = pinVoltage('base');
        const vEmitter = pinVoltage('emitter');
        const vCollector = pinVoltage('collector');
        const conducting = vBase - vEmitter >= 0.7;
        s.active = conducting;
        if (conducting) {
          const nodeC = findNodeForPin(nodes, comp.instanceId, 'collector');
          const nodeE = findNodeForPin(nodes, comp.instanceId, 'emitter');
          if (nodeC && nodeE) {
            // CE saturates: Vce ≈ 0.2V
            const vCE = Math.max(vEmitter + 0.2, vCollector);
            nodeC.voltage = Math.min(nodeC.voltage, vCE);
          }
          s.current = ((vBase - vEmitter - 0.7) / 1000) * 200 * 1000; // Ic in mA (β=200)
        }
        break;
      }

      // ── PNP Transistor ────────────────────────────────────────────────
      case 'pnp_transistor': {
        const vBase    = pinVoltage('base');
        const vEmitter = pinVoltage('emitter');
        const conducting = vEmitter - vBase >= 0.7;
        s.active = conducting;
        break;
      }

      // ── N-Channel MOSFET ─────────────────────────────────────────────
      case 'nmos_transistor': {
        const vGate   = pinVoltage('gate');
        const vSource = pinVoltage('source');
        const vThresh = Number(comp.properties.vth ?? 2.5);
        const conducting = vGate - vSource >= vThresh;
        s.active = conducting;
        if (conducting) {
          const nodeDrain  = findNodeForPin(nodes, comp.instanceId, 'drain');
          const nodeSource = findNodeForPin(nodes, comp.instanceId, 'source');
          if (nodeDrain && nodeSource) {
            nodeDrain.voltage = nodeSource.voltage + 0.1; // Vds(sat) ≈ 0
          }
        }
        break;
      }

      // ── 555 Timer ─────────────────────────────────────────────────────
      case 'ic_555': {
        const vcc    = pinVoltage('vcc');
        const gnd    = pinVoltage('gnd');
        const reset  = pinVoltage('reset');
        if (vcc > 0 && reset > 1) {
          s.active = true;
          // Astable oscillation — toggle based on simulation time
          s.high = Math.sin(_simulationTime * 2 * Math.PI * 2) > 0; // 2Hz
          s.voltage = s.high ? vcc : gnd;
          // Drive output node
          const nodeOut = findNodeForPin(nodes, comp.instanceId, 'out');
          if (nodeOut) nodeOut.voltage = s.voltage;
        }
        break;
      }

      // ── Logic Gates ───────────────────────────────────────────────────
      case 'and_gate': {
        const a = pinVoltage('a') > 2.5 ? 1 : 0;
        const b = pinVoltage('b') > 2.5 ? 1 : 0;
        s.high = (a & b) === 1;
        s.active = true;
        const nodeY = findNodeForPin(nodes, comp.instanceId, 'y');
        if (nodeY) nodeY.voltage = s.high ? 5 : 0;
        break;
      }
      case 'or_gate': {
        const a = pinVoltage('a') > 2.5 ? 1 : 0;
        const b = pinVoltage('b') > 2.5 ? 1 : 0;
        s.high = (a | b) === 1;
        s.active = true;
        const nodeY = findNodeForPin(nodes, comp.instanceId, 'y');
        if (nodeY) nodeY.voltage = s.high ? 5 : 0;
        break;
      }
      case 'not_gate': {
        const a = pinVoltage('a') > 2.5 ? 0 : 1;
        s.high = a === 1;
        s.active = true;
        const nodeY = findNodeForPin(nodes, comp.instanceId, 'y');
        if (nodeY) nodeY.voltage = s.high ? 5 : 0;
        break;
      }

      // ── L298N Motor Driver ────────────────────────────────────────────
      case 'l298n': {
        const vcc  = pinVoltage('vcc');
        const in1  = pinVoltage('in1') > 2.5;
        const in2  = pinVoltage('in2') > 2.5;
        const ena  = pinVoltage('ena') > 2.5;
        if (vcc > 0 && ena) {
          s.active = true;
          const out1V = in1 ? vcc : 0;
          const out2V = in2 ? vcc : 0;
          const nodeOut1 = findNodeForPin(nodes, comp.instanceId, 'out1');
          const nodeOut2 = findNodeForPin(nodes, comp.instanceId, 'out2');
          if (nodeOut1) nodeOut1.voltage = out1V;
          if (nodeOut2) nodeOut2.voltage = out2V;
          s.spinning = in1 !== in2; // spinning only when direction set
        }
        break;
      }

      // ── Arduino Uno ───────────────────────────────────────────────────
      case 'arduino_uno': {
        s.active = true;
        s.voltage = 5;
        break;
      }

      // ── DC Motor ──────────────────────────────────────────────────────
      case 'dc_motor': {
        const vA = pinVoltage('a');
        const vB = pinVoltage('b');
        const vDiff = Math.abs(vA - vB);
        s.spinning = vDiff > 1.5;
        s.active = s.spinning;
        s.voltage = vDiff;
        s.brightness = Math.min(1, vDiff / 12);
        break;
      }

      // ── Servo Motor ───────────────────────────────────────────────────
      case 'servo_motor': {
        const vcc  = pinVoltage('vcc');
        const gnd  = pinVoltage('gnd');
        const sig  = pinVoltage('sig');
        if (vcc > 0) {
          const angle = Number(comp.properties.angle ?? 90);
          s.active = true;
          s.value = angle;
          s.spinning = sig > 0;
        }
        break;
      }

      // ── Buzzer ────────────────────────────────────────────────────────
      case 'buzzer': {
        const vPos = pinVoltage('pos');
        const vNeg = pinVoltage('neg');
        s.active = vPos - vNeg > 0.5;
        s.high = s.active;
        break;
      }

      // ── Sensors ───────────────────────────────────────────────────────
      case 'ldr': {
        const lightLevel = Number(comp.properties.lightLevel ?? 0.5); // 0–1
        const resistance = Math.round((1 - lightLevel) * 90000 + 1000); // 1kΩ–91kΩ
        s.value = Math.round(lightLevel * 1023);
        s.active = true;
        s.voltage = lightLevel * 5;
        break;
      }
      case 'temp_sensor': {
        const tempC = Number(comp.properties.temperature ?? 25);
        s.value = Math.round(((tempC + 273.15) / 450) * 1023); // rough mapping
        s.active = true;
        s.voltage = (tempC / 100) * 5;
        break;
      }

      default:
        s.active = false;
    }

    state[comp.instanceId] = s;
  }

  // ── Second pass: re-evaluate LEDs after switches/transistors propagated ──
  for (const comp of components.filter(c => c.definitionId === 'led')) {
    const vAnode = (() => {
      const node = findNodeForPin(nodes, comp.instanceId, 'anode');
      return node?.voltage ?? 0;
    })();
    const vCathode = (() => {
      const node = findNodeForPin(nodes, comp.instanceId, 'cathode');
      return node?.voltage ?? 0;
    })();
    const vForward = Number(comp.properties.forwardVoltage ?? 1.8);
    const vDrop = vAnode - vCathode;
    if (vDrop >= vForward) {
      const iApprox = Math.min(1, (vDrop - vForward) / 220);
      state[comp.instanceId] = {
        ...state[comp.instanceId],
        active: true,
        brightness: Math.min(1, iApprox * 50 + 0.3),
        current: iApprox * 1000,
      };
    } else {
      state[comp.instanceId] = {
        ...state[comp.instanceId],
        active: false,
        brightness: 0,
      };
    }
  }

  // ── Re-evaluate motors ───────────────────────────────────────────────────
  for (const comp of components.filter(c => c.definitionId === 'dc_motor')) {
    const vA = findNodeForPin(nodes, comp.instanceId, 'a')?.voltage ?? 0;
    const vB = findNodeForPin(nodes, comp.instanceId, 'b')?.voltage ?? 0;
    const vDiff = Math.abs(vA - vB);
    state[comp.instanceId] = {
      ...state[comp.instanceId],
      spinning: vDiff > 1.5,
      active: vDiff > 1.5,
      brightness: Math.min(1, vDiff / 12),
    };
  }

  return state;
}

// ─── Arduino Code Runner (simple interpreter) ──────────────────────────────

export interface ArduinoRunResult {
  outputs: Record<string, number>; // digital pin id → voltage (0 or 5)
  pwmOutputs: Record<string, number>; // pin id → 0‒5V
  serialLog: string[];
}

export function interpretArduinoCode(
  code: string,
  digitalInputs: Record<string, number>,
  analogInputs: Record<string, number>,
  timeMs: number,
): ArduinoRunResult {
  const serialLog: string[] = [];
  const digitalOutputs: Record<string, number> = {};
  const pwmOutputs: Record<string, number> = {};

  try {
    // Build a minimal JS equivalent that shadows Arduino API calls
    const pinModes: Record<string, string> = {};
    const digitalValues: Record<string, number> = { ...digitalInputs };
    const analogValues: Record<string, number> = { ...analogInputs };

    // Mock Arduino functions
    const env = {
      pinMode: (pin: number | string, mode: string) => {
        pinModes[String(pin)] = mode;
      },
      digitalWrite: (pin: number | string, value: number | string) => {
        const v = value === 'HIGH' || value === 1 || (value as unknown) === true ? 5 : 0;
        digitalOutputs[String(pin)] = v;
      },
      analogWrite: (pin: number | string, value: number) => {
        pwmOutputs[String(pin)] = (Math.min(255, Math.max(0, value)) / 255) * 5;
      },
      digitalRead: (pin: number | string) => {
        return (digitalValues[String(pin)] ?? 0) > 2.5 ? 1 : 0;
      },
      analogRead: (pin: number | string) => {
        return analogValues[String(pin)] ?? 512;
      },
      delay: (_ms: number) => { /* no-op in simulation */ },
      millis: () => timeMs,
      map: (value: number, iMin: number, iMax: number, oMin: number, oMax: number) => {
        return oMin + ((oMax - oMin) * (value - iMin)) / (iMax - iMin);
      },
      constrain: (val: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, val)),
      abs: Math.abs,
      min: Math.min,
      max: Math.max,
      sin: (angle: number) => Math.sin((angle * Math.PI) / 180),
      cos: (angle: number) => Math.cos((angle * Math.PI) / 180),
      HIGH: 1,
      LOW: 0,
      INPUT: 'INPUT',
      OUTPUT: 'OUTPUT',
      INPUT_PULLUP: 'INPUT_PULLUP',
      true: true,
      false: false,
      Serial: {
        begin: (_baud: number) => {},
        println: (v: unknown) => serialLog.push(String(v)),
        print: (v: unknown) => serialLog.push(String(v)),
      },
    };

    // Strip Arduino types (int, void, bool, float, const, etc.) and simplify
    let js = code
      .replace(/\/\/[^\n]*/g, '')           // remove line comments
      .replace(/\/\*[\s\S]*?\*\//g, '')      // remove block comments
      .replace(/\b(void|int|bool|float|double|long|unsigned|byte|char|String|const)\s+/g, 'let ')
      .replace(/\bboolean\s+/g, 'let ')
      .replace(/\b(true|false)\b/gi, m => m.toLowerCase())
      .replace(/&&/g, '&&')
      .replace(/\|\|/g, '||')
      // Convert setup() and loop() to named functions
      .replace(/let setup\s*\(\s*\)/g, 'function setup()')
      .replace(/let loop\s*\(\s*\)/g, 'function loop()')
      .replace(/void setup\s*\(\s*\)/g, 'function setup()')
      .replace(/void loop\s*\(\s*\)/g, 'function loop()');

    // Build execution context
    const fnBody = `
      with (__env) {
        ${js}
        if (typeof setup === 'function') setup();
        if (typeof loop === 'function') loop();
      }
    `;

    const execFn = new Function('__env', fnBody);
    execFn(env);
  } catch (e) {
    serialLog.push(`[Simulation error] ${(e as Error).message}`);
  }

  return {
    outputs: digitalOutputs,
    pwmOutputs,
    serialLog,
  };
}
