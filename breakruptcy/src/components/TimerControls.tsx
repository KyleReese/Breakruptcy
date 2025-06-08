import React from "react";

interface TimerControlsProps {
  isPaused: boolean;
  onPlayPause: () => void;
  onSwitch: () => void;
  onReset: () => void;
}

export const TimerControls: React.FC<TimerControlsProps> = ({
  isPaused,
  onPlayPause,
  onSwitch,
  onReset,
}) => {
  const baseButtonClasses =
    "px-8 py-4 mx-2 text-lg font-bold rounded-lg cursor-pointer transition-all duration-200 ease-in-out";

  const playPauseClasses = isPaused
    ? `${baseButtonClasses} bg-green-500 text-white hover:bg-green-600 hover:opacity-90`
    : `${baseButtonClasses} bg-yellow-400 text-black hover:bg-yellow-500 hover:opacity-90`;

  return (
    <div className="text-center my-8">
      <button className={playPauseClasses} onClick={onPlayPause}>
        {isPaused ? "Start" : "Pause"}
      </button>

      <button
        className={`${baseButtonClasses} bg-blue-500 text-white hover:bg-blue-600 hover:opacity-90`}
        onClick={onSwitch}
      >
        Switch
      </button>

      <button
        className={`${baseButtonClasses} bg-red-500 text-white hover:bg-red-600 hover:opacity-90`}
        onClick={onReset}
      >
        Reset
      </button>
    </div>
  );
};
