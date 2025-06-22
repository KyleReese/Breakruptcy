import React, { useState } from "react";
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
  const [showWarning, setShowWarning] = useState(false);

  const handleConfigureClick = () => {
    if (isConfigurable) {
      onConfigure();
    } else {
      setShowWarning(true);
    }
  };

  const handleOtherButtonClick = (callback: () => void) => {
    setShowWarning(false);
    callback();
  };

  const baseButtonClasses =
    "px-8 py-4 mx-2 text-lg font-semibold rounded-2xl cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-105 backdrop-blur-sm border-2 shadow-lg min-w-[120px]";
  const playPauseClasses = isPaused
    ? `${baseButtonClasses} bg-green-500/90 border-green-400 text-white hover:bg-green-600/90 hover:border-green-500 shadow-green-200/50`
    : `${baseButtonClasses} bg-amber-400/90 border-amber-300 text-gray-800 hover:bg-amber-500/90 hover:border-amber-400 shadow-amber-200/50`;
  const switchClasses = `${baseButtonClasses} bg-blue-500/90 border-blue-400 text-white hover:bg-blue-600/90 hover:border-blue-500 shadow-blue-200/50`;
  const resetClasses = `${baseButtonClasses} bg-red-500/90 border-red-400 text-white hover:bg-red-600/90 hover:border-red-500 shadow-red-200/50`;
  const configClasses = isConfigurable
    ? `${baseButtonClasses} bg-purple-500/90 border-purple-400 text-white hover:bg-purple-600/90 hover:border-purple-500 shadow-purple-200/50`
    : `${baseButtonClasses} bg-gray-300/60 border-gray-200 text-gray-400 cursor-not-allowed shadow-gray-100/50`;
  return (
    <div className="text-center my-8">
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        <button
          className={playPauseClasses}
          onClick={() => handleOtherButtonClick(onPlayPause)}
        >
          {isPaused ? "▶ Start" : "⏸ Pause"}
        </button>
        <button
          className={switchClasses}
          onClick={() => handleOtherButtonClick(onSwitch)}
        >
          ⇄ Switch
        </button>
        <button
          className={resetClasses}
          onClick={() => handleOtherButtonClick(onReset)}
        >
          ↻ Reset
        </button>
        <button
          className={configClasses}
          onClick={handleConfigureClick}
          title={
            isConfigurable
              ? "Configure timer settings"
              : "Reset timer to configure settings"
          }
        >
          ⚙ Configure
        </button>
      </div>
      {showWarning && (
        <div className="inline-flex items-center px-4 py-2 bg-amber-50/80 backdrop-blur-sm border border-amber-200 rounded-full">
          <span className="text-sm text-amber-700 font-medium">
            Press Reset to configure timer settings
          </span>
        </div>
      )}
    </div>
  );
};
