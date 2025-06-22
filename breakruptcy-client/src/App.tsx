import { useState, useEffect, useRef } from "react";
import { TimerDisplay } from "./components/TimerDisplay";
import { TimerControls } from "./components/TimerControls";
import { TimerConfigComponent } from "./components/TimerConfig";
import type { TimerState, TimerConfig as TimerConfigType } from "./types/timer";
import { getActiveBank, isTimerAtInitialValue } from "./utils/timer";

const STORAGE_KEY = "breakrupcy-timer-state";
const CONFIG_STORAGE_KEY = "breakrupcy-timer-config";
const SAVE_INTERVAL = 10000; // 10 seconds
const TICK_INTERVAL = 100; // 100ms

const DEFAULT_CONFIG: TimerConfigType = {
  bank1Duration: 25 * 60 * 1000, // 25 minutes in milliseconds
  bank2Duration: 5 * 60 * 1000, // 5 minutes in milliseconds
  bank1Label: "Work",
  bank2Label: "Break",
};

const createInitialTimerState = (config: TimerConfigType): TimerState => ({
  bank1: {
    remaining: config.bank1Duration,
    label: config.bank1Label,
    isActive: true,
  },
  bank2: {
    remaining: config.bank2Duration,
    label: config.bank2Label,
    isActive: false,
  },
  isPaused: true,
  lastTick: Date.now(),
  config,
  isConfigurable: true,
});

function App() {
  const [showConfig, setShowConfig] = useState(false);

  const [timerState, setTimerState] = useState<TimerState>(() => {
    // Load config first
    const savedConfig = localStorage.getItem(CONFIG_STORAGE_KEY);
    const config = savedConfig ? JSON.parse(savedConfig) : DEFAULT_CONFIG;

    // Load timer state or create initial state
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        // Update config and labels from saved config
        return {
          ...parsed,
          lastTick: Date.now(),
          config,
          bank1: { ...parsed.bank1, label: config.bank1Label },
          bank2: { ...parsed.bank2, label: config.bank2Label },
          // Determine if configurable based on timer values
          isConfigurable:
            parsed.isPaused &&
            isTimerAtInitialValue(
              { remaining: parsed.bank1.remaining },
              config.bank1Duration
            ) &&
            isTimerAtInitialValue(
              { remaining: parsed.bank2.remaining },
              config.bank2Duration
            ),
        };
      } catch {
        return createInitialTimerState(config);
      }
    }
    return createInitialTimerState(config);
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Save to localStorage with debouncing
  const saveToStorage = (state: TimerState) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(state.config));
    }, 1000);
  };

  // Timer tick logic
  useEffect(() => {
    if (!timerState.isPaused) {
      intervalRef.current = setInterval(() => {
        setTimerState((prevState) => {
          const now = Date.now();
          const elapsed = now - prevState.lastTick;
          const activeBank = getActiveBank(prevState);

          const newState = {
            ...prevState,
            lastTick: now,
            [activeBank]: {
              ...prevState[activeBank],
              remaining: Math.max(0, prevState[activeBank].remaining - elapsed),
            },
          };

          // Auto-pause if active bank hits zero
          if (newState[activeBank].remaining <= 0) {
            newState.isPaused = true;
          }

          return newState;
        });
      }, TICK_INTERVAL);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [timerState.isPaused]);

  // Auto-save every 10 seconds
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      saveToStorage(timerState);
    }, SAVE_INTERVAL);

    return () => clearInterval(autoSaveInterval);
  }, [timerState]);

  // Save on unmount
  useEffect(() => {
    return () => {
      saveToStorage(timerState);
    };
  }, [timerState]);

  const handlePlayPause = () => {
    setTimerState((prevState) => ({
      ...prevState,
      isPaused: !prevState.isPaused,
      isConfigurable: false, // Lock configuration once timer starts
      lastTick: Date.now(),
    }));
  };

  const handleSwitch = () => {
    setTimerState((prevState) => ({
      ...prevState,
      bank1: { ...prevState.bank1, isActive: !prevState.bank1.isActive },
      bank2: { ...prevState.bank2, isActive: !prevState.bank2.isActive },
      lastTick: Date.now(),
    }));
  };

  const handleReset = () => {
    const newState = createInitialTimerState(timerState.config);
    setTimerState(newState);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleBankClick = (bankKey: "bank1" | "bank2") => {
    if (!timerState[bankKey].isActive && !timerState.isPaused) {
      handleSwitch();
    }
  };

  const handleConfigSave = (newConfig: TimerConfigType) => {
    const newState = createInitialTimerState(newConfig);
    setTimerState(newState);
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(newConfig));
    localStorage.removeItem(STORAGE_KEY); // Clear old timer state
    setShowConfig(false);
  };

  const handleConfigCancel = () => {
    setShowConfig(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto p-8 font-sans">
        <header className="text-center mb-12">
          <h1 className="text-gray-800 text-6xl font-bold pb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Breakrupcy
          </h1>
          <p className="text-gray-600 text-xl font-medium">
            Chess Timer for Productivity
          </p>
        </header>

        <div className="flex justify-center flex-wrap gap-6 mb-8">
          <TimerDisplay
            bank={timerState.bank1}
            onClick={() => handleBankClick("bank1")}
          />
          <TimerDisplay
            bank={timerState.bank2}
            onClick={() => handleBankClick("bank2")}
          />
        </div>

        <TimerControls
          isPaused={timerState.isPaused}
          onPlayPause={handlePlayPause}
          onSwitch={handleSwitch}
          onReset={handleReset}
          isConfigurable={timerState.isConfigurable}
          onConfigure={() => setShowConfig(true)}
        />

        {/* Status indicator */}
        <div className="text-center mt-6">
          <div className="inline-flex items-center px-6 py-3 bg-white/60 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm">
            <div
              className={`w-3 h-3 rounded-full mr-3 ${
                timerState.isPaused
                  ? "bg-gray-400"
                  : timerState.bank1.isActive
                  ? "bg-blue-500 animate-pulse"
                  : "bg-purple-500 animate-pulse"
              }`}
            ></div>
            <span className="text-gray-700 text-lg font-medium">
              {timerState.isPaused
                ? "Paused"
                : `${
                    timerState.bank1.isActive
                      ? timerState.bank1.label
                      : timerState.bank2.label
                  } Active`}
            </span>
          </div>
        </div>

        {/* Configuration Modal */}
        {showConfig && (
          <TimerConfigComponent
            config={timerState.config}
            onSave={handleConfigSave}
            onCancel={handleConfigCancel}
          />
        )}
      </div>
    </div>
  );
}

export default App;
