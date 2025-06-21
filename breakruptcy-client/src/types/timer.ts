export interface TimerBank {
  remaining: number; // milliseconds
  label: string;
  isActive: boolean;
}

export interface TimerConfig {
  bank1Duration: number; // milliseconds
  bank2Duration: number; // milliseconds
  bank1Label: string;
  bank2Label: string;
}

export interface TimerState {
  bank1: TimerBank;
  bank2: TimerBank;
  isPaused: boolean;
  lastTick: number; // timestamp
  config: TimerConfig;
  isConfigurable: boolean; // true only when both timers are at initial values
}

export interface TimeInput {
  hours: number;
  minutes: number;
  seconds: number;
}
