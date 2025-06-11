export const formatTime = (milliseconds: number): string => {
  const totalSeconds = Math.ceil(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};

export const getActiveBank = (timerState: {
  bank1: { isActive: boolean };
  bank2: { isActive: boolean };
}) => {
  return timerState.bank1.isActive ? "bank1" : "bank2";
};

export const getInactiveBank = (timerState: {
  bank1: { isActive: boolean };
  bank2: { isActive: boolean };
}) => {
  return timerState.bank1.isActive ? "bank2" : "bank1";
};
