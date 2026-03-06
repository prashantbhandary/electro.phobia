export type PinType =
  | 'power'
  | 'ground'
  | 'input'
  | 'output'
  | 'analog'
  | 'digital'
  | 'bidirectional'
  | 'base'
  | 'collector'
  | 'emitter'
  | 'gate'
  | 'drain'
  | 'source'
  | 'signal';

export type ComponentCategory =
  | 'Basic'
  | 'Semiconductors'
  | 'ICs'
  | 'Microcontrollers'
  | 'Outputs'
  | 'Sensors';

export interface PinDef {
  id: string;
  label: string;
  x: number; // relative to component center
  y: number;
  type: PinType;
}

export interface ComponentDef {
  id: string;
  name: string;
  shortName: string;
  category: ComponentCategory;
  width: number;
  height: number;
  bodyColor: string;
  headerColor: string;
  icon: string;
  pins: PinDef[];
  description: string;
  howItWorks: string;
  applications: string[];
  tip: string;
  defaultProperties?: Record<string, number | string | boolean>;
}

export interface PlacedComponent {
  instanceId: string;
  definitionId: string;
  x: number;       // canvas coordinates (center)
  y: number;
  rotation: number; // degrees
  properties: Record<string, number | string | boolean>;
  label?: string;
}

export interface Wire {
  id: string;
  fromInstanceId: string;
  fromPinId: string;
  toInstanceId: string;
  toPinId: string;
}

export interface SimComponentState {
  active: boolean;
  brightness: number;   // 0–1 for LEDs, PWM outputs
  spinning: boolean;    // motors
  high: boolean;        // digital HIGH
  voltage: number;      // node voltage
  current: number;      // current in mA
  value?: number;       // sensor reading (0–1023)
}

export type SimulationState = Record<string, SimComponentState>;

export type MissionDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface MissionStep {
  id: string;
  text: string;
  hint?: string;
}

export interface Mission {
  id: string;
  title: string;
  level: number;
  description: string;
  objective: string;
  theory: string;
  steps: MissionStep[];
  requiredComponents: string[];    // ComponentDef ids
  starterCode?: string;
  successCondition: SuccessCondition;
  reward: { xp: number; badge?: string };
  difficulty: MissionDifficulty;
}

export interface SuccessCondition {
  type: 'led_on' | 'motor_on' | 'button_controls_led' | 'pwm_led' | 'oscillating' | 'code_ran';
  targetInstanceId?: string;
}

export interface UserProgress {
  completedMissions: string[];
  xp: number;
  level: number;
  badges: string[];
}
