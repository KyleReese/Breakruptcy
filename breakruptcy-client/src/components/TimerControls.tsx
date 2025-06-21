import React from "react";

interface TimerControlsProps {
  isPaused: boolean;
  isConfigurable: boolean;
  onPlayPause: () => void;
  onSwitch: () => void;
  onReset: () => void;
  onConfigure: () => void;
}

export const TimerControls: React.FC<TimerControlsProps> = ({
  isPaused,
  isConfigurable,
  onPlayPause,
  onSwitch,
  onReset,
  onConfigure,
}) => {
  const baseButtonClasses =
    "px-8 py-4 mx-2 text-lg font-bold rounded-lg cursor-pointer transition-all duration-200 ease-in-out";

  const playPauseClasses = isPaused
    ? `${baseButtonClasses} bg-green-500 text-white hover:bg-green-600 hover:opacity-90`
    : `${baseButtonClasses} bg-yellow-400 text-black hover:bg-yellow-500 hover:opacity-90`;

  const configButtonClasses = isConfigurable
    ? `${baseButtonClasses} bg-purple-500 text-white hover:bg-purple-600 hover:opacity-90`
    : `${baseButtonClasses} bg-gray-300 text-gray-500 cursor-not-allowed`;

  return (
    <div className="text-center my-8">
      <div className="flex flex-wrap justify-center gap-2">
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

        <button
          className={configButtonClasses}
          onClick={isConfigurable ? onConfigure : undefined}
          disabled={!isConfigurable}
          title={
            isConfigurable
              ? "Configure timer settings"
              : "Reset timer to configure settings"
          }
        >
          ⚙️ Configure
        </button>
      </div>

      {!isConfigurable && (
        <p className="text-sm text-gray-500 mt-2">
          Press Reset to configure timer settings
        </p>
      )}
    </div>
  );
};
