export interface TimerBank {
  remaining: number; // milliseconds
  label: string;
  isActive: boolean;
}

export interface TimerState {
  bank1: TimerBank;
  bank2: TimerBank;
  isPaused: boolean;
  lastTick: number; // timestamp
}
