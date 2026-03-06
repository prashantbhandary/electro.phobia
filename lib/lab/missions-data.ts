import type { Mission } from './types';

export const MISSIONS: Mission[] = [
  {
    id: 'mission-1',
    title: 'Light Your First LED',
    level: 1,
    difficulty: 'beginner',
    description: 'Complete your very first electronic circuit and make an LED glow!',
    objective: 'Connect a battery, resistor, and LED in series to make the LED light up.',
    theory: `Every LED needs two things to work: voltage in the right direction and a current-limiting resistor.

**The basic LED circuit:**
Battery + → Resistor → LED Anode → LED Cathode → Battery –

**Why the resistor?**
Without it, too much current flows and destroys the LED instantly. For a 9V battery and a standard LED:
R = (9V – 1.8V) / 0.02A = 360Ω → use 470Ω (next standard value)

**Ohm's Law:** V = I × R`,
    steps: [
      { id: 's1', text: 'Place a Battery from the Basic components panel', hint: 'Click "Battery" in the library, then click on the canvas to place it.' },
      { id: 's2', text: 'Place a Resistor (220Ω–470Ω) next to the battery' },
      { id: 's3', text: 'Place an LED to the right of the resistor' },
      { id: 's4', text: 'Place a Ground symbol', hint: 'Connect the GND of the battery to a Ground symbol.' },
      { id: 's5', text: 'Wire: Battery + → Resistor pin A', hint: 'Click the battery + pin, then click the resistor pin.' },
      { id: 's6', text: 'Wire: Resistor pin B → LED Anode (+)' },
      { id: 's7', text: 'Wire: LED Cathode (–) → Ground' },
      { id: 's8', text: 'Wire: Battery – → Ground' },
      { id: 's9', text: 'Click ▶ Run Simulation and watch the LED glow!', hint: 'The LED brightness depends on the resistor value.' },
    ],
    requiredComponents: ['battery', 'resistor', 'led', 'ground'],
    starterCode: `// Mission 1: Light an LED
// No code needed for this mission — it's a direct circuit!
// The LED glows from the battery through the resistor.
// Try changing the resistor value to control brightness.
`,
    successCondition: { type: 'led_on' },
    reward: { xp: 100, badge: '💡 First Light' },
  },

  {
    id: 'mission-2',
    title: 'Button-Controlled LED',
    level: 2,
    difficulty: 'beginner',
    description: 'Add human interaction — control your LED with a push button.',
    objective: 'Build a circuit where pressing a button lights up an LED.',
    theory: `A push button is a simple switch that connects two points when pressed.

**How the circuit works:**
When the button is pressed, it completes the circuit and current flows through the LED.
When released, the circuit is open and the LED turns off.

**Pull-down resistor:**
Without a pull-down resistor on the Arduino input, the pin "floats" and gives random readings.
Connect a 10kΩ resistor from the button output to GND to ensure a clean LOW signal when not pressed.`,
    steps: [
      { id: 's1', text: 'Place a Battery, Resistor, LED, Push Button, and Ground' },
      { id: 's2', text: 'Wire Battery + → Button pin 1' },
      { id: 's3', text: 'Wire Button pin 2 → Resistor pin A' },
      { id: 's4', text: 'Wire Resistor pin B → LED Anode' },
      { id: 's5', text: 'Wire LED Cathode → Ground' },
      { id: 's6', text: 'Wire Battery – → Ground' },
      { id: 's7', text: 'Run simulation and press the button by clicking on it!' },
    ],
    requiredComponents: ['battery', 'resistor', 'led', 'push_button', 'ground'],
    starterCode: `// Mission 2: Button-controlled LED
// Try this with Arduino!
const int buttonPin = 2;
const int ledPin    = 13;

void setup() {
  pinMode(buttonPin, INPUT);
  pinMode(ledPin, OUTPUT);
}

void loop() {
  int buttonState = digitalRead(buttonPin);
  if (buttonState == HIGH) {
    digitalWrite(ledPin, HIGH);  // LED ON
  } else {
    digitalWrite(ledPin, LOW);   // LED OFF
  }
}
`,
    successCondition: { type: 'button_controls_led' },
    reward: { xp: 150, badge: '🔘 Switch Master' },
  },

  {
    id: 'mission-3',
    title: 'Transistor Motor Switch',
    level: 3,
    difficulty: 'beginner',
    description: 'Use a transistor as an electronic switch to control a motor.',
    objective: 'Use an NPN transistor to switch a DC motor on and off with a small control signal.',
    theory: `An Arduino or logic gate can only supply ~40mA from a digital pin — not enough for a motor that might need 500mA+.

**The transistor as a switch:**
A small current (5–10mA) at the Base controls a large current (up to 1A) between Collector and Emitter.
This makes the transistor act as an amplifier or electronic relay.

**NPN switching circuit:**
- Emitter → GND
- Motor between VCC and Collector  
- Base → current-limiting resistor (1kΩ) → control signal
- Flyback diode across motor (prevents voltage spikes when motor turns off)`,
    steps: [
      { id: 's1', text: 'Place Battery, NPN Transistor, DC Motor, Diode, two Resistors, and Ground' },
      { id: 's2', text: 'Wire Motor from Battery + to Transistor Collector' },
      { id: 's3', text: 'Wire Transistor Emitter to Ground' },
      { id: 's4', text: 'Wire 1kΩ resistor from Base to your control signal (Battery + for always-on test)' },
      { id: 's5', text: 'Wire Diode across motor (cathode to VCC side)' },
      { id: 's6', text: 'Wire Battery – to Ground' },
      { id: 's7', text: 'Run simulation and watch the motor spin!' },
    ],
    requiredComponents: ['battery', 'npn_transistor', 'dc_motor', 'diode', 'resistor', 'ground'],
    starterCode: `// Mission 3: Transistor motor control
const int motorPin = 9;  // base drive pin

void setup() {
  pinMode(motorPin, OUTPUT);
}

void loop() {
  digitalWrite(motorPin, HIGH);  // Turn motor ON
  delay(2000);
  digitalWrite(motorPin, LOW);   // Turn motor OFF
  delay(2000);
}
`,
    successCondition: { type: 'motor_on' },
    reward: { xp: 200, badge: '🔀 Transistor Expert' },
  },

  {
    id: 'mission-4',
    title: 'L298N Motor Driver',
    level: 4,
    difficulty: 'intermediate',
    description: 'Control a DC motor in both directions using the L298N H-bridge motor driver.',
    objective: 'Use the L298N IC to spin a motor forward and backward.',
    theory: `The L298N is a dual H-bridge driver IC. It can:
- Control 2 DC motors simultaneously
- Reverse motor direction by swapping which inputs are HIGH/LOW
- Control speed via PWM on the ENA/ENB pins

**Direction control:**
Forward: IN1=HIGH, IN2=LOW
Reverse: IN1=LOW, IN2=HIGH
Brake: IN1=HIGH, IN2=HIGH
Stop: IN1=LOW, IN2=LOW

**ENA pin:**
Set HIGH to enable motor A. Use PWM for speed control: analogWrite(ENA, 0-255)`,
    steps: [
      { id: 's1', text: 'Place Arduino Uno, L298N, DC Motor, Battery, and Ground' },
      { id: 's2', text: 'Wire L298N VCC to Battery +' },
      { id: 's3', text: 'Wire L298N GND to Ground' },
      { id: 's4', text: 'Wire L298N OUT1 and OUT2 to Motor pins' },
      { id: 's5', text: 'Wire Arduino D4 → L298N IN1, D5 → IN2' },
      { id: 's6', text: 'Wire Arduino D9 (PWM) → L298N ENA' },
      { id: 's7', text: 'Paste the starter code, run simulation' },
    ],
    requiredComponents: ['arduino_uno', 'l298n', 'dc_motor', 'battery', 'ground'],
    starterCode: `// Mission 4: L298N motor control
const int in1 = 4;   // Direction pin 1
const int in2 = 5;   // Direction pin 2
const int ena = 9;   // Enable (PWM speed)

void setup() {
  pinMode(in1, OUTPUT);
  pinMode(in2, OUTPUT);
  pinMode(ena, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  // Forward at full speed
  Serial.println("Motor: Forward");
  digitalWrite(in1, HIGH);
  digitalWrite(in2, LOW);
  analogWrite(ena, 255);
  delay(2000);

  // Stop
  Serial.println("Motor: Stopped");
  analogWrite(ena, 0);
  delay(1000);

  // Reverse at half speed
  Serial.println("Motor: Reverse");
  digitalWrite(in1, LOW);
  digitalWrite(in2, HIGH);
  analogWrite(ena, 128);
  delay(2000);

  analogWrite(ena, 0);
  delay(1000);
}
`,
    successCondition: { type: 'motor_on' },
    reward: { xp: 250, badge: '⚙ Motor Driver' },
  },

  {
    id: 'mission-5',
    title: '555 Timer LED Blinker',
    level: 5,
    difficulty: 'intermediate',
    description: 'Build an oscillating circuit using the iconic 555 Timer IC to blink an LED automatically.',
    objective: 'Configure the 555 in astable mode to generate a 2Hz blink rate.',
    theory: `The 555 timer in astable mode continuously oscillates between HIGH and LOW.

**Timing formula:**
- Time HIGH: t1 = 0.693 × (Ra + Rb) × C
- Time LOW:  t2 = 0.693 × Rb × C
- Frequency: f = 1.44 / ((Ra + 2Rb) × C)

**For ~2Hz blink with C1=10μF:**
- Ra = 10kΩ, Rb = 47kΩ
- f = 1.44 / ((10k + 94k) × 10μ) = 1.38 Hz ≈ 1.4 Hz flash

**Connections:**
- Pin 8 (VCC) → +9V
- Pin 1 (GND) → GND
- Pin 4 (RESET) → VCC (must be HIGH to enable)
- Pins 2 and 6 connected together
- Pin 3 (OUTPUT) → LED via resistor`,
    steps: [
      { id: 's1', text: 'Place 555 Timer IC, Battery, 2x Resistors, LED, and Ground' },
      { id: 's2', text: 'Wire Pin 8 (VCC) to Battery +' },
      { id: 's3', text: 'Wire Pin 1 (GND) to Ground' },
      { id: 's4', text: 'Wire Pin 4 (RESET) to Battery +' },
      { id: 's5', text: 'Connect Pins 2 and 6 together (astable mode)' },
      { id: 's6', text: 'Wire Ra between VCC and Pin 7 (DISCH)' },
      { id: 's7', text: 'Wire Rb between Pin 7 and Pin 2/6' },
      { id: 's8', text: 'Wire Pin 3 (OUT) → 470Ω resistor → LED → GND' },
      { id: 's9', text: 'Run simulation and watch the LED blink!' },
    ],
    requiredComponents: ['ic_555', 'battery', 'resistor', 'led', 'ground'],
    starterCode: `// No microcontroller needed!
// The 555 timer handles the blinking automatically.
// This is a purely analog circuit.

// If you want to replicate this with Arduino:
const int ledPin = 13;

void setup() {
  pinMode(ledPin, OUTPUT);
}

void loop() {
  digitalWrite(ledPin, HIGH);
  delay(500);   // ON for 500ms
  digitalWrite(ledPin, LOW);
  delay(500);   // OFF for 500ms
}
`,
    successCondition: { type: 'oscillating' },
    reward: { xp: 300, badge: '⏱ Timer Wizard' },
  },

  {
    id: 'mission-6',
    title: 'Potentiometer LED Dimmer',
    level: 6,
    difficulty: 'intermediate',
    description: 'Use a potentiometer to smoothly control LED brightness through PWM.',
    objective: 'Read a potentiometer with analogRead() and use analogWrite() to dim an LED.',
    theory: `**Analog input:** analogRead(A0) returns 0–1023 based on voltage at the pin (0V = 0, 5V = 1023).

**PWM output:** analogWrite(pin, 0-255) generates a PWM signal.
- duty cycle = value/255
- 0 = fully OFF, 255 = fully ON, 128 = 50% brightness

**Mapping values:**
Arduino's map() function remaps a range:
map(value, 0, 1023, 0, 255) scales 0-1023 to 0-255

This is how real dimmer switches work — using PWM to reduce average power!`,
    steps: [
      { id: 's1', text: 'Place Arduino Uno, Potentiometer, LED, Resistor, Battery, and Ground' },
      { id: 's2', text: 'Wire Potentiometer VCC to 5V, GND to Ground' },
      { id: 's3', text: 'Wire Potentiometer wiper (SIG) to Arduino A0' },
      { id: 's4', text: 'Wire Arduino D9 (PWM~) → 220Ω resistor → LED → Ground' },
      { id: 's5', text: 'Paste the starter code and run simulation' },
      { id: 's6', text: 'Turn the potentiometer knob to control brightness!', hint: 'Click and drag the potentiometer knob in the simulation.' },
    ],
    requiredComponents: ['arduino_uno', 'potentiometer', 'led', 'resistor', 'ground'],
    starterCode: `// Mission 6: Potentiometer LED dimmer
const int potPin = A0;  // Potentiometer on analog pin
const int ledPin = 9;   // PWM LED pin

void setup() {
  pinMode(ledPin, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int potValue = analogRead(potPin);        // 0 to 1023
  int brightness = map(potValue, 0, 1023, 0, 255);  // Scale to 0-255
  
  analogWrite(ledPin, brightness);          // Set LED brightness
  
  Serial.print("Pot: ");
  Serial.print(potValue);
  Serial.print(" → Brightness: ");
  Serial.println(brightness);
  
  delay(50);
}
`,
    successCondition: { type: 'pwm_led' },
    reward: { xp: 300, badge: '🎚 PWM Master' },
  },

  {
    id: 'mission-7',
    title: 'Arduino PWM Motor Speed',
    level: 7,
    difficulty: 'advanced',
    description: 'Control DC motor speed and direction with Arduino and an L298N driver.',
    objective: 'Use PWM to smoothly accelerate and decelerate a motor, and reverse its direction.',
    theory: `**PWM Motor Control:**
analogWrite(ENA, speed) where speed is 0-255 controls the motor's speed.

**Acceleration ramp:**
Suddenly starting a motor at full speed can stress the gearbox. Ramping up gradually is better:
for (int speed = 0; speed <= 255; speed++) { analogWrite(ENA, speed); delay(10); }

**Reading motor current:**
In real circuits, you can read current with a current sensor (ACS712) and use it for load detection.

**PWM frequency:**
Arduino's default PWM frequency is ~490Hz (pins 3,9,10,11) or ~980Hz (pins 5,6). Higher frequency = smoother motor operation.`,
    steps: [
      { id: 's1', text: 'Build on Mission 4 — Arduino + L298N + DC Motor' },
      { id: 's2', text: 'Add a Potentiometer on A0 for speed control' },
      { id: 's3', text: 'Add a Push Button on D2 for direction toggle' },
      { id: 's4', text: 'Paste the advanced starter code' },
      { id: 's5', text: 'Run simulation: turn pot for speed, press button for direction' },
    ],
    requiredComponents: ['arduino_uno', 'l298n', 'dc_motor', 'potentiometer', 'push_button', 'battery', 'ground'],
    starterCode: `// Mission 7: PWM Motor + Direction Control
const int in1 = 4;
const int in2 = 5;
const int ena = 9;
const int potPin = A0;
const int btnPin = 2;

bool forward = true;
int lastBtnState = LOW;

void setup() {
  pinMode(in1, OUTPUT);
  pinMode(in2, OUTPUT);
  pinMode(ena, OUTPUT);
  pinMode(btnPin, INPUT);
  Serial.begin(9600);
}

void loop() {
  // Read direction button
  int btnState = digitalRead(btnPin);
  if (btnState == HIGH && lastBtnState == LOW) {
    forward = !forward;
    Serial.println(forward ? "Direction: FORWARD" : "Direction: REVERSE");
  }
  lastBtnState = btnState;

  // Set direction
  digitalWrite(in1, forward ? HIGH : LOW);
  digitalWrite(in2, forward ? LOW  : HIGH);

  // Read speed from potentiometer
  int potVal = analogRead(potPin);
  int speed  = map(potVal, 0, 1023, 0, 255);
  analogWrite(ena, speed);

  Serial.print("Speed: ");
  Serial.println(speed);

  delay(20);
}
`,
    successCondition: { type: 'motor_on' },
    reward: { xp: 400, badge: '🏎 Motor Engineer' },
  },
];

export const MISSION_MAP: Record<string, Mission> = Object.fromEntries(
  MISSIONS.map(m => [m.id, m])
);
