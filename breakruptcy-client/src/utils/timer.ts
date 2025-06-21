import type { TimerState, TimeInput } from "../types/timer";

export const formatTime = (milliseconds: number): string => {
  const totalSeconds = Math.ceil(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};

export const getActiveBank = (timerState: TimerState) => {
  return timerState.bank1.isActive ? "bank1" : "bank2";
};

export const getInactiveBank = (timerState: TimerState) => {
  return timerState.bank1.isActive ? "bank2" : "bank1";
};

export const timeInputToMilliseconds = (time: TimeInput): number => {
  return (time.hours * 3600 + time.minutes * 60 + time.seconds) * 1000;
};

export const millisecondsToTimeInput = (milliseconds: number): TimeInput => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { hours, minutes, seconds };
};

export const validateTimeInput = (time: TimeInput): string | null => {
  if (time.hours < 0 || time.hours > 99) {
    return "Hours must be between 0 and 99";
  }
  if (time.minutes < 0 || time.minutes > 59) {
    return "Minutes must be between 0 and 59";
  }
  if (time.seconds < 0 || time.seconds > 59) {
    return "Seconds must be between 0 and 59";
  }
  if (time.hours === 0 && time.minutes === 0 && time.seconds === 0) {
    return "Timer must be at least 1 second";
  }
  return null;
};

export const isTimerAtInitialValue = (
  bank: { remaining: number },
  configDuration: number
): boolean => {
  return bank.remaining === configDuration;
};
