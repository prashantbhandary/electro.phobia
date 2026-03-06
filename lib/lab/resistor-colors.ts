// Resistor color band utilities — used both in the simulator and in the tools pages

export interface BandEntry {
  name: string;
  hex: string;
  digit: number | null;
  mult: number | null;
  tol: string | null;
}

export const BAND_DATA: BandEntry[] = [
  { name: 'Black',  hex: '#1C1C1C', digit: 0, mult: 1,          tol: null      },
  { name: 'Brown',  hex: '#7B3F00', digit: 1, mult: 10,         tol: '±1%'     },
  { name: 'Red',    hex: '#CC1111', digit: 2, mult: 100,        tol: '±2%'     },
  { name: 'Orange', hex: '#E05C00', digit: 3, mult: 1000,       tol: null      },
  { name: 'Yellow', hex: '#D4AA00', digit: 4, mult: 10000,      tol: null      },
  { name: 'Green',  hex: '#1E7A1E', digit: 5, mult: 100000,     tol: '±0.5%'   },
  { name: 'Blue',   hex: '#1A44CC', digit: 6, mult: 1000000,    tol: '±0.25%'  },
  { name: 'Violet', hex: '#8B00BB', digit: 7, mult: 10000000,   tol: '±0.1%'   },
  { name: 'Grey',   hex: '#888888', digit: 8, mult: null,       tol: '±0.05%'  },
  { name: 'White',  hex: '#F0EEE4', digit: 9, mult: null,       tol: null      },
  { name: 'Gold',   hex: '#CFB53B', digit: null, mult: 0.1,     tol: '±5%'     },
  { name: 'Silver', hex: '#A8A9AD', digit: null, mult: 0.01,    tol: '±10%'    },
];

export function bandHex(name: string): string {
  return BAND_DATA.find(b => b.name === name)?.hex ?? '#888888';
}

/** Given a resistance value (Ω), return the 4 standard color-band names */
export function resistanceToColorBands(ohms: number): [string, string, string, string] {
  if (!isFinite(ohms) || ohms <= 0) return ['Black', 'Black', 'Black', 'Gold'];

  const exp  = Math.floor(Math.log10(ohms));
  const mult = Math.pow(10, exp - 1);
  const sig  = Math.round(ohms / mult);
  const d1   = Math.min(9, Math.max(0, Math.floor(sig / 10)));
  const d2   = Math.min(9, Math.max(0, sig % 10));
  const mExp = exp - 1;

  const digits = ['Black','Brown','Red','Orange','Yellow','Green','Blue','Violet','Grey','White'];
  const multMap: Record<number, string> = {
    [-2]: 'Silver', [-1]: 'Gold',
    0: 'Black', 1: 'Brown', 2: 'Red', 3: 'Orange', 4: 'Yellow',
    5: 'Green', 6: 'Blue', 7: 'Violet',
  };
  return [digits[d1], digits[d2], multMap[mExp] ?? 'Brown', 'Gold'];
}

/** Decode 3 band selections back to a resistance value */
export function colorBandsToResistance(b1: string, b2: string, mult: string): number {
  const d1 = BAND_DATA.find(b => b.name === b1)?.digit ?? 0;
  const d2 = BAND_DATA.find(b => b.name === b2)?.digit ?? 0;
  const m  = BAND_DATA.find(b => b.name === mult)?.mult ?? 1;
  if (d1 === null || d2 === null || m === null) return 0;
  return ((d1 ?? 0) * 10 + (d2 ?? 0)) * (m ?? 1);
}

export function formatResistance(ohms: number): string {
  if (ohms >= 1_000_000) return `${parseFloat((ohms / 1_000_000).toFixed(2))}MΩ`;
  if (ohms >= 1_000)     return `${parseFloat((ohms / 1_000).toFixed(1))}kΩ`;
  return `${ohms}Ω`;
}

/** Standard E24 resistor series values (1Ω – 10MΩ) */
export const E24_VALUES: number[] = [
  10, 11, 12, 13, 15, 16, 18, 20, 22, 24, 27, 30,
  33, 36, 39, 43, 47, 51, 56, 62, 68, 75, 82, 91,
].flatMap(v =>
  [1, 10, 100, 1000, 10000, 100000, 1000000].map(m => v * m)
);

/** Find the closest E24 standard value to a given resistance */
export function nearestE24(ohms: number): number {
  return E24_VALUES.reduce((prev, curr) =>
    Math.abs(curr - ohms) < Math.abs(prev - ohms) ? curr : prev
  );
}
